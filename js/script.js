/*
  ==========================================================================
  ЛОГИКА РУЛЕТКИ
  ==========================================================================
  Как это устроено:
   - у каждой "катушки" (.reel) есть data-category = primary/secondary/grenade/stratagem
   - при спине для каждой не заблокированной катушки собираем случайную
     "ленту" карточек и анимируем сдвиг transform, чтобы последняя карточка
     оказалась в центре окна
   - для 4 стратагем следим, чтобы в итоге они не повторялись
   - клик по катушке (не во время кручения) — лок/анлок, залоченные катушки
     не крутятся при следующем спине
*/

const ITEM_HEIGHT = 180;   // должно совпадать с высотой .reel-item в CSS
const FILLER_COUNT = 70;   // больше карточек - плавное и долгое кручение на ~11 сек

const reelEls = Array.from(document.querySelectorAll('.reel'));
const spinBtn = document.getElementById('spin-btn');

// тип стратагемы теперь выбирается игроком через <select class="stype-select">
// внутри катушки. Если селекта нет (например, на других страницах) - фоллбэк на data-stype.
function getStype(reel){
  const select = reel.querySelector('.stype-select');
  if (select) return select.value; // '' означает "любая стратагема"
  return reel.dataset.stype || '';
}

/* ---------- фильтр по варбондам ---------- */
// какие source сейчас включены (по умолчанию — все)
const activeSources = new Set(WARBONDS.map(w => w.id));

function isSourceActive(item){
  const src = item.source || 'unknown';
  if (Array.isArray(src)){
    return src.some(s => activeSources.has(s));
  }
  return activeSources.has(src);
}

function buildFilterPanel(){
  const panel = document.getElementById('warbond-filter');
  if (!panel) return;

  WARBONDS.forEach(w => {
    const label = document.createElement('label');
    label.className = 'filter-chip';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.dataset.source = w.id;
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) activeSources.add(w.id);
      else activeSources.delete(w.id);
      updateFilterWarning();
    });

    const text = document.createElement('span');
    text.textContent = w.name;

    label.appendChild(checkbox);
    label.appendChild(text);
    panel.appendChild(label);
  });

  const allBtn = document.getElementById('filter-all');
  const noneBtn = document.getElementById('filter-none');
  if (allBtn) allBtn.addEventListener('click', () => setAllFilters(true));
  if (noneBtn) noneBtn.addEventListener('click', () => setAllFilters(false));

  updateFilterWarning();
}

function setAllFilters(state){
  activeSources.clear();
  if (state) WARBONDS.forEach(w => activeSources.add(w.id));
  document.querySelectorAll('#warbond-filter input[type="checkbox"]').forEach(cb => {
    cb.checked = state;
  });
  updateFilterWarning();
}

// предупреждаем, если для какой-то катушки фильтр обнулил весь пул —
// тогда pickOne() всё равно подставит предмет из полного списка (см. ниже)
function updateFilterWarning(){
  const warningEl = document.getElementById('filter-warning');
  if (!warningEl) return;

  const emptyReels = reelEls
    .filter(r => rawFilteredPool(r.dataset.category, getStype(r)).length === 0)
    .map(r => r.dataset.label || r.dataset.category);

  if (emptyReels.length){
    warningEl.textContent = 'Heads up: none of your selected warbonds have items for (' + emptyReels.join(', ') + ') — the roulette will ignore the filter there for now.';
    warningEl.style.display = 'block';
  } else {
    warningEl.style.display = 'none';
  }
}

/* ---------- звуки ---------- */
const spinSound = new Audio('audio/spin.mp3');
const fanfareSound = new Audio('audio/fanfare.mp3');
const landSoundBase = new Audio('audio/land.mp3');

const SPIN_VOLUME = 0.5;      // громкость спина в обычный момент
const LAND_VOLUME = 0.35;     // звук приземления - теперь один на весь спин, потише

spinSound.volume = SPIN_VOLUME;
spinSound.loop = true; // спин теперь длинный (~11 сек), трек может быть короче - зацикливаем
fanfareSound.volume = 0.8;
landSoundBase.volume = LAND_VOLUME;

// land.mp3 теперь играет ОДИН РАЗ на весь спин (когда все катушки уже
// остановились), а не при приземлении каждой отдельной катушки - раньше
// это било по ушам, особенно при 7-8 катушках подряд
function playLandSound(){
  try {
    landSoundBase.currentTime = 0;
    landSoundBase.play().catch(() => {});
  } catch (e) { /* игнорируем */ }
}

function playSpinSound(){
  try {
    spinSound.volume = SPIN_VOLUME;
    spinSound.currentTime = 0;
    spinSound.play().catch(() => {}); // браузер может заблокировать автоплей до первого клика — это ок
  } catch (e) { /* игнорируем */ }
}

function stopSpinSound(){
  // плавно гасим звук спина за ~250мс, чтобы не было резкого обрыва
  const fadeStep = SPIN_VOLUME / 12;
  const fadeInterval = setInterval(() => {
    if (spinSound.volume - fadeStep <= 0){
      spinSound.pause();
      spinSound.currentTime = 0;
      spinSound.volume = SPIN_VOLUME;
      clearInterval(fadeInterval);
    } else {
      spinSound.volume -= fadeStep;
    }
  }, 25);
}

function playFanfare(){
  try {
    fanfareSound.currentTime = 0;
    fanfareSound.play().catch(() => {});
  } catch (e) { /* игнорируем */ }
}

/* ---------- вспомогательные функции ---------- */

function pickOne(pool, excludeIds){
  const filtered = excludeIds && excludeIds.length
    ? pool.filter(item => !excludeIds.includes(item.id))
    : pool;
  const source = filtered.length ? filtered : pool;
  return source[Math.floor(Math.random() * source.length)];
}

function poolFor(category){
  return WEAPON_DATA[category] || [];
}

// отфильтрованный пул с защитой от пустоты: если фильтр обнулил категорию
// целиком, крутим по полному списку, чтобы рулетка не сломалась
// stype (необязательно) - подтип стратагемы: 'orbital' | 'eagle' | 'sentry' | 'support_weapon' | 'backpack' | 'vehicle'
function rawFilteredPool(category, stype){
  let full = poolFor(category);
  if (stype){
    full = full.filter(item => item.type === stype);
  }
  return full.filter(isSourceActive);
}

function filteredPoolFor(category, stype){
  const full = stype ? poolFor(category).filter(item => item.type === stype) : poolFor(category);
  const filtered = full.filter(isSourceActive);
  return filtered.length ? filtered : full;
}

function makeItemEl(item){
  const el = document.createElement('div');
  el.className = 'reel-item';

  const iconBox = document.createElement('div');
  iconBox.className = 'icon-box';

  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.name;
  img.onerror = function(){
    // картинки ещё нет — красивая заглушка с первой буквой названия
    iconBox.classList.add('placeholder');
    iconBox.textContent = item.name.trim().charAt(0).toUpperCase();
    img.remove();
  };
  iconBox.appendChild(img);

  const nameEl = document.createElement('div');
  nameEl.className = 'item-name';
  nameEl.textContent = item.name;

  el.appendChild(iconBox);
  el.appendChild(nameEl);
  return el;
}

/* ---------- инициализация: рамка-прицел + замок + стартовый предмет ---------- */

function initReels(){
  reelEls.forEach(reel => {
    const category = reel.dataset.category;
    const windowEl = reel.querySelector('.reel-window');

    const frame = document.createElement('div');
    frame.className = 'center-frame';
    windowEl.appendChild(frame);

    const lock = document.createElement('div');
    lock.className = 'lock-icon';
    lock.textContent = 'LOCKED';
    windowEl.appendChild(lock);

    const strip = windowEl.querySelector('.reel-strip');
    const startItem = pickOne(filteredPoolFor(category, getStype(reel)));
    strip.appendChild(makeItemEl(startItem));
    strip.style.transform = 'translateY(0px)';
    reel.dataset.currentId = startItem.id;

    windowEl.addEventListener('click', () => toggleLock(reel));
  });
}

function toggleLock(reel){
  if (reel.classList.contains('is-spinning')) return;
  reel.classList.toggle('is-locked');
}

/* ---------- спин одной катушки ---------- */

function spinReel(reel, finalItem, order){
  return new Promise(resolve => {
    const category = reel.dataset.category;
    const windowEl = reel.querySelector('.reel-window');
    const strip = windowEl.querySelector('.reel-strip');

    reel.classList.add('is-spinning');
    reel.classList.remove('is-locked', 'just-landed');

    // ---- РЕЖИМ "SKIP ANIMATION": сразу показываем финальный предмет ----
    if (isSkipEnabled()){
      strip.innerHTML = '';
      strip.style.transition = 'none';
      strip.appendChild(makeItemEl(finalItem));
      strip.style.transform = 'translateY(0px)';

      // небольшая лесенка по времени (не 0мс для всех разом), чтобы звук
      // приземления каждой катушки был слышен отдельно, а не одной кучей
      setTimeout(() => {
        reel.classList.remove('is-spinning');
        reel.classList.add('just-landed');
        reel.dataset.currentId = finalItem.id;
        setTimeout(() => reel.classList.remove('just-landed'), 400);
        resolve();
      }, 80 + order * 90);
      return;
    }

    strip.innerHTML = '';
    strip.style.transition = 'none';
    strip.style.transform = 'translateY(0px)';

    const pool = filteredPoolFor(category, getStype(reel));
    for (let i = 0; i < FILLER_COUNT; i++){
      strip.appendChild(makeItemEl(pickOne(pool)));
    }
    strip.appendChild(makeItemEl(finalItem));

    // форсируем reflow, чтобы браузер применил transform:0 перед стартом анимации
    // eslint-disable-next-line no-unused-expressions
    strip.offsetHeight;

    // катушки останавливаются одна за другой (слева направо / сверху вниз) —
    // общее время кручения растягивается примерно до 8-11 секунд для азарта
    const duration = 8000 + order * 450 + Math.random() * 500;
    const finalOffset = -(FILLER_COUNT * ITEM_HEIGHT);

    strip.style.transition = `transform ${duration}ms cubic-bezier(0.1, 0.7, 0.15, 1)`;
    strip.style.transform = `translateY(${finalOffset}px)`;

    const onEnd = () => {
      strip.removeEventListener('transitionend', onEnd);
      reel.classList.remove('is-spinning');
      reel.classList.add('just-landed');
      reel.dataset.currentId = finalItem.id;
      setTimeout(() => reel.classList.remove('just-landed'), 550);
      resolve();
    };
    strip.addEventListener('transitionend', onEnd);
  });
}

/* ---------- спин всех катушек ---------- */

const stypeSelects = Array.from(document.querySelectorAll('.stype-select'));
const skipAnimCheckbox = document.getElementById('skip-animation');

function isSkipEnabled(){
  return !!(skipAnimCheckbox && skipAnimCheckbox.checked);
}

function initStypeSelects(){
  stypeSelects.forEach(select => {
    select.addEventListener('change', updateFilterWarning);
  });
}

async function spinAll(){
  spinBtn.disabled = true;
  stypeSelects.forEach(s => s.disabled = true); // не даём менять тип слота посреди спина
  if (!isSkipEnabled()) playSpinSound();

  const stratagemReels = reelEls.filter(r => r.dataset.category === 'stratagem');
  const usedStratagemIds = stratagemReels
    .filter(r => r.classList.contains('is-locked'))
    .map(r => r.dataset.currentId);

  const spins = [];

  reelEls.forEach((reel, order) => {
    if (reel.classList.contains('is-locked')) return;

    const category = reel.dataset.category;
    const pool = filteredPoolFor(category, getStype(reel));
    let finalItem;

    if (category === 'stratagem'){
      finalItem = pickOne(pool, usedStratagemIds);
      usedStratagemIds.push(finalItem.id);
    } else {
      finalItem = pickOne(pool);
    }

    spins.push(spinReel(reel, finalItem, order));
  });

  await Promise.all(spins);
  stopSpinSound();
  playLandSound();
  playFanfare();
  spinBtn.disabled = false;
  stypeSelects.forEach(s => s.disabled = false);
}

buildFilterPanel();
initStypeSelects();
initReels();
spinBtn.addEventListener('click', spinAll);
