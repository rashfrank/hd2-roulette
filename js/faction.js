/*
  ==========================================================================
  FACTION ROULETTE — ЛОГИКА
  ==========================================================================
  Как это теперь устроено (важно!):
  Раньше каждая из 4 катушек выбирала фракцию НЕЗАВИСИМО — из-за этого
  шанс на победу был мизерным (3 фракции ^ 4 катушки = 1 совпадение из 27,
  то есть ~3.7%). Реально можно было крутить очень долго и не выиграть ни разу.

  Теперь сначала ОДНИМ броском решаем "выиграл / не выиграл" по известной
  вероятности (см. WIN_CHANCE ниже), и только потом расставляем катушки под
  этот результат - как в настоящих слот-машинах, где итог предрешён, а
  барабаны просто его показывают.

  Плюс добавлена pity-система (защита от неудач): с каждым проигрышем шанс
  на победу растёт, пока не дойдёт до почти гарантированного выигрыша -
  так что "долго кручу и ничего не выпадает" больше не должно происходить.
*/

const FACTIONS = [
  { id: 'automaton', name: 'Automatons', image: 'images/factions/automaton.svg' },
  { id: 'illuminate', name: 'Illuminate', image: 'images/factions/illuminate.svg' },
  { id: 'terminid',  name: 'Terminids',  image: 'images/factions/terminid.svg' },
];

// ---------- НАСТРОЙКИ ШАНСА НА ПОБЕДУ ----------
const BASE_WIN_CHANCE = 0.22;   // шанс на первом спине (22%)
const PITY_STEP = 0.10;         // на сколько растёт шанс за каждый проигрыш подряд
const MAX_WIN_CHANCE = 0.95;    // потолок - оставляем чуть-чуть интриги даже под конец
let lossStreak = 0;             // сколько проигрышей подряд прямо сейчас

function currentWinChance(){
  return Math.min(MAX_WIN_CHANCE, BASE_WIN_CHANCE + lossStreak * PITY_STEP);
}

function updateOddsDisplay(){
  const el = document.getElementById('odds-display');
  if (!el) return;
  const pct = Math.round(currentWinChance() * 100);
  el.textContent = `Current win chance: ${pct}%` + (lossStreak > 0 ? ` (pity streak: ${lossStreak})` : '');
}

const ITEM_HEIGHT = 200;
const FILLER_COUNT = 40;

const reelEls = Array.from(document.querySelectorAll('.faction-reel'));
const spinBtn = document.getElementById('faction-spin-btn');
const banner = document.getElementById('result-banner');
const flashOverlay = document.getElementById('flash-overlay');

/* ---------- звук (переиспользуем ассеты с главной страницы) ---------- */
const spinSound = new Audio('audio/spin.mp3');
const fanfareSound = new Audio('audio/fanfare.mp3');
const landSoundBase = new Audio('audio/land.mp3');
spinSound.volume = 0.5;
spinSound.loop = true;
fanfareSound.volume = 0.85;
landSoundBase.volume = 0.9;

function playSpinSound(){
  try { spinSound.currentTime = 0; spinSound.play().catch(() => {}); } catch (e) {}
}
function stopSpinSound(){
  try { spinSound.pause(); spinSound.currentTime = 0; } catch (e) {}
}
function playLandSound(){
  try {
    const node = landSoundBase.cloneNode();
    node.volume = landSoundBase.volume;
    node.play().catch(() => {});
  } catch (e) {}
}
function playFanfare(){
  try { fanfareSound.currentTime = 0; fanfareSound.play().catch(() => {}); } catch (e) {}
}

/* ---------- вспомогательные функции ---------- */

function pickFaction(){
  return FACTIONS[Math.floor(Math.random() * FACTIONS.length)];
}

// решаем ЗАРАНЕЕ, выиграет ли этот спин, и возвращаем готовый набор
// фракций для всех 4 катушек под этот исход
function decideOutcome(){
  const willWin = Math.random() < currentWinChance();

  if (willWin){
    const f = pickFaction();
    return { win: true, finals: [f, f, f, f] };
  }

  // проигрыш: 4 случайные фракции, но гарантированно НЕ все 4 одинаковые
  const finals = [pickFaction(), pickFaction(), pickFaction(), pickFaction()];
  if (finals.every(f => f.id === finals[0].id)){
    const others = FACTIONS.filter(f => f.id !== finals[0].id);
    finals[3] = others[Math.floor(Math.random() * others.length)];
  }
  return { win: false, finals };
}

function makeItemEl(faction){
  const el = document.createElement('div');
  el.className = 'reel-item';

  const iconBox = document.createElement('div');
  iconBox.className = 'icon-box';

  const img = document.createElement('img');
  img.src = faction.image;
  img.alt = faction.name;
  iconBox.appendChild(img);

  const nameEl = document.createElement('div');
  nameEl.className = 'item-name';
  nameEl.textContent = faction.name;

  el.appendChild(iconBox);
  el.appendChild(nameEl);
  return el;
}

function initReels(){
  reelEls.forEach(reel => {
    const windowEl = reel.querySelector('.reel-window');

    const frame = document.createElement('div');
    frame.className = 'center-frame';
    windowEl.appendChild(frame);

    const strip = windowEl.querySelector('.reel-strip');
    const startFaction = pickFaction();
    strip.appendChild(makeItemEl(startFaction));
    strip.style.transform = 'translateY(0px)';
    reel.dataset.currentId = startFaction.id;
  });
}

function spinReel(reel, finalFaction, order){
  return new Promise(resolve => {
    const windowEl = reel.querySelector('.reel-window');
    const strip = windowEl.querySelector('.reel-strip');

    strip.innerHTML = '';
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0px)';

    for (let i = 0; i < FILLER_COUNT; i++){
      strip.appendChild(makeItemEl(pickFaction()));
    }
    strip.appendChild(makeItemEl(finalFaction));

    reel.classList.add('is-spinning');
    reel.classList.remove('just-landed', 'win-glow');

    // eslint-disable-next-line no-unused-expressions
    strip.offsetHeight; // форсируем reflow

    // между катушками теперь гарантированный минимум ~500мс разрыва
    // (раньше большой случайный джиттер иногда "съедал" паузу между ними,
    // и звуки приземления сливались в один)
    const duration = 3000 + order * 700 + Math.random() * 200;
    const finalOffset = -(FILLER_COUNT * ITEM_HEIGHT);

    strip.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.7, 0.15, 1)`;
    strip.style.transform = `translateY(${finalOffset}px)`;

    const onEnd = () => {
      strip.removeEventListener('transitionend', onEnd);
      reel.classList.remove('is-spinning');
      reel.classList.add('just-landed');
      reel.dataset.currentId = finalFaction.id;
      playLandSound();
      setTimeout(() => reel.classList.remove('just-landed'), 550);
      resolve();
    };
    strip.addEventListener('transitionend', onEnd);
  });
}

function showResult(didWin){
  banner.classList.remove('show', 'win', 'lose');
  // форсируем reflow, чтобы анимация появления сработала повторно
  // eslint-disable-next-line no-unused-expressions
  banner.offsetHeight;

  if (didWin){
    banner.textContent = 'VICTORY — 4 IN A ROW!';
    banner.classList.add('show', 'win');
    reelEls.forEach(r => r.classList.add('win-glow'));
    playFanfare();
  } else {
    banner.textContent = 'MISSION FAILED — REDEPLOY';
    banner.classList.add('show', 'lose');
    flashOverlay.classList.remove('flash');
    // eslint-disable-next-line no-unused-expressions
    flashOverlay.offsetHeight;
    flashOverlay.classList.add('flash');
  }
}

async function spinAll(){
  spinBtn.disabled = true;
  banner.classList.remove('show', 'win', 'lose');
  reelEls.forEach(r => r.classList.remove('win-glow'));
  playSpinSound();

  const outcome = decideOutcome();
  const spins = reelEls.map((reel, order) => spinReel(reel, outcome.finals[order], order));
  await Promise.all(spins);
  stopSpinSound();

  if (outcome.win){
    lossStreak = 0;
  } else {
    lossStreak += 1;
  }
  updateOddsDisplay();

  showResult(outcome.win);

  spinBtn.disabled = false;
}

initReels();
updateOddsDisplay();
spinBtn.addEventListener('click', spinAll);
