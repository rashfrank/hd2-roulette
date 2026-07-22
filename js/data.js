/*
  ==========================================================================
  ДАННЫЕ ДЛЯ РУЛЕТКИ HELLDIVERS 2
  ==========================================================================
  Как добавить/убрать/переименовать предмет:
    1. Каждый предмет — это { id, name, image, source }
    2. id       — короткое имя на латинице, используется только в коде
    3. name     — то, что увидит игрок
    4. image    — путь к картинке. Если файла нет — покажется заглушка
    5. source   — ключ варбонда из списка WARBONDS ниже. Определяет, в каком
                  фильтре появится предмет.

  ==========================================================================
  ВАЖНО ПРО ПОЛЕ "source" — ПРОЧИТАЙ ПЕРЕД ИСПОЛЬЗОВАНИЕМ ФИЛЬТРОВ
  ==========================================================================
  Игра Helldivers 2 к середине 2026 разрослась примерно до 20+ варбондов
  и 50+ основного оружия — намного больше, чем есть в этом ростере (он
  выглядит как снимок примерно 2024 года: база + Steeled Veterans + Cutting
  Edge + Democratic Detonation + Polar Patriots + немного позже).

  Я проставил source по каждому предмету на основе своих знаний и частичной
  проверки по вики (helldivers.wiki.gg). Часть значений подтверждена точно
  (см. пометки [confirmed] ниже в коде). Но часть предметов — это более
  новые/пограничные случаи, где я не уверен на 100%, и там стоит
  source: 'unknown' с комментарием "УТОЧНИТЬ".

  Список того, что стоит перепроверить в игре (Центр Комплектации → навести
  на предмет — там прямо написано, из какого он варбонда):
    ПЕРВИЧНОЕ:   jetscream (MP-97 Jetscream)
    ВТОРИЧНОЕ:   verdict, bushwhacker, talon, crisper, loyalist, reformer
    СТРАТАГЕМЫ:  rocket_sentry, hmg_emplacement, hover_pack
    БУСТЕРЫ:     uav, increased_reinforcement

  Поменять source проще всего прямо здесь — просто впиши правильный ключ
  варбонда (см. список WARBONDS) вместо 'unknown'.
*/

// Список всех варбондов, которые фигурируют в ростере ниже.
// id — используется в поле source у предметов и в фильтрах.
// name — то, что увидит игрок в панели фильтров.
const WARBONDS = [
  { id: 'base',                 name: 'Base' },
  { id: 'Helldivers_Mobilize!',     name: 'Helldivers Mobilize!' },
  { id: 'steeled_veterans',     name: 'Steeled Veterans' },
  { id: 'cutting_edge',         name: 'Cutting Edge' },
  { id: 'democratic_detonation',name: 'Democratic Detonation' },
  { id: 'polar_patriots',       name: 'Polar Patriots' },
  { id: 'Viper_Commandos',      name: 'Viper Commandos' },
  { id: 'Freedom\'s_Flame',     name: 'Freedom\'s Flame' },
  { id: 'chemical_agents',      name: 'Chemical Agents' },
  { id: 'truth_enforcers',      name: 'Truth Enforcers' },
  { id: 'Urban_Legends',         name: 'Urban Legends' },
  { id: 'Servants_of_Freedom',        name: 'Servants of Freedom' },
  {id: 'Borderline_Justice',        name: 'Borderline Justice' },
  {id: 'Masters_of_Ceremony',        name: 'Masters of Ceremony' },
  {id: 'Force_of_Law',        name: 'Force of Law' },
  {id: 'Control_Group',        name: 'Control Group' },
  {id: 'Dust_Devils',        name: 'Dust Devils' },
  {id: 'Python_Commandos',        name: 'Python Commandos' },
  {id: 'Redacted_Regiment',        name: 'Redacted Regiment' },
  {id: 'Siege_Breakers',        name: 'Siege Breakers' },
  {id: 'Entrenched_Division',        name: 'Entrenched Division' },
  {id: 'Exo_Experts',        name: 'Exo Experts' },
  {id: 'Obedient_Democracy_Support_Troopers',        name: 'Obedient Democracy Support Troopers' },
  {id: 'Righteous_Revenants',        name: 'Righteous Revenants' },
  { id: 'super_citizen',        name: 'Super Citizen' }
];

const WEAPON_DATA = {

  primary: [
    { id: 'liberator', name: 'AR-23 Liberator', image: 'images/primary/liberator.png', source: 'base' },
    { id: 'liberator_penetrator', name: 'AR-23P Liberator Penetrator', image: 'images/primary/liberator_penetrator.png', source: 'Helldivers_Mobilize!' },
    { id: 'liberator_concussive', name: 'AR-23C Liberator Concussive', image: 'images/primary/liberator_concussive.png', source: 'steeled_veterans' }, 
    {  id: 'Liberator_Carbine', name: 'AR-23A Liberator Carbine', image: 'images/primary/Liberator_Carbine.png', source: 'Viper_Commandos' },
    { id: 'One-Two', name: 'AR/GL-21 One-Two', image: 'images/primary/one-two.png', source: 'Python_Commandos' },
    { id: 'Pacifier', name: 'AR-32 Pacifier', image: 'images/primary/pacifier.png', source: 'Force_of_Law' },
    { id: 'Tenderizer', name: 'AR-61 Tenderizer', image: 'images/primary/tenderizer.png', source: 'polar_patriots' },
    { id: 'Suppressor', name: 'AR-59 Suppressor', image: 'images/primary/suppressor.png', source: 'Redacted_Regiment' },
    { id: 'Coyote', name: 'AR-2 Coyote', image: 'images/primary/coyote.png', source: 'Dust_Devils' },
    { id: 'Adjudicator', name: 'BR-14 Adjudicator', image: 'images/primary/adjudicator.png', source: 'democratic_detonation' },
    { id: 'Assault_Rifle', name: 'StA-52 Assault Rifle', image: 'images/primary/assault_rifle.png', source: 'Righteous_Revenants' },
    { id: 'MA5C', name: 'MA5C Assault Rifle', image: 'images/primary/MA5C.png', source: 'Obedient_Democracy_Support_Troopers' },
    { id: 'Constitution', name: 'R-2124 Constitution', image: 'images/primary/constitution.png', source: 'base' },
    { id: 'Diligence', name: 'R-63 Diligence', image: 'images/primary/diligence.png', source: 'Helldivers_Mobilize!' },
    { id: 'Diligence_Counter_Sniper', name: 'R-63CS Diligence Counter Sniper', image: 'images/primary/diligence_counter_sniper.png', source: 'Helldivers_Mobilize!' },
    { id: 'Censor', name: 'R-72 Censor', image: 'images/primary/censor.png', source: 'Redacted_Regiment' },
    {id: 'Amendment', name: 'R-2 Amendment', image: 'images/primary/amendment.png', source: 'Masters_of_Ceremony' },
    {id: 'Deadeye', name: 'R-6 Deadeye', image: 'images/primary/deadeye.png', source: 'Borderline_Justice' },
    {id: 'Hyena', name: 'R-4 Hyena', image: 'images/primary/hyena.png', source: 'base' },
    { id: 'Knight' , name: 'MP-98 Knight', image: 'images/primary/knight.png', source: 'super_citizen' },
    { id: 'Defender', name: 'SMG-37 Defender' , image: 'images/primary/defender.png', source: 'Helldivers_Mobilize!' },
    { id: 'Pummeler', name:'SMG-72 Pummeler', image: 'images/primary/pummeler.png', source: 'polar_patriots' },
    { id: 'SMG', name:'M7S SMG', image: 'images/primary/SMG.png', source: 'Obedient_Democracy_Support_Troopers' },
    { id: 'Reprimand', name:'SMG-32 Reprimand', image: 'images/primary/reprimand.png', source: 'truth_enforcers' },
    { id: 'StA-11', name:'StA-11 SMG', image: 'images/primary/StA-11.png', source: 'Righteous_Revenants' },
    { id: 'Stoker', name:'SMG/FLAM-34 Stoker', image: 'images/primary/stoker.webp', source: 'Entrenched_Division' },
    { id: 'Gallant', name:'SMG-203 Gallant', image: 'images/primary/gallant.png', source: 'Exo_Experts' },
    { id: 'Punisher', name:'SG-8 Punisher', image: 'images/primary/punisher.png', source: 'Helldivers_Mobilize!' },
    { id: 'Slugger', name:'SG-85 Slugger', image: 'images/primary/slugger.png', source: 'Helldivers_Mobilize!' },
    { id: 'Cookout', name:'SG-451 Cookout', image: 'images/primary/cookout.png', source: 'Freedom\'s_Flame' },
    { id: 'Breaker', name:'SG-225 Breaker', image: 'images/primary/breaker.png', source: 'Helldivers_Mobilize!' },
    { id: 'Breaker_Spray&Pray', name:'SG-225SP Breaker Spray&Pray', image: 'images/primary/breaker_spray_and_pray.png', source: 'Helldivers_Mobilize!' },
    { id: 'Halt', name:'SG-20 Halt', image: 'images/primary/halt.png', source: 'truth_enforcers' },
    { id: 'M90A', name:'M90A Shotgun', image: 'images/primary/M90A.png', source: 'Obedient_Democracy_Support_Troopers' },
    { id: 'Breaker_Incendiary', name:'SG-225IE Breaker Incendiary', image: 'images/primary/breaker_incendiary.png', source: 'steeled_veterans' },
    { id: 'Double_Freedom', name:'DBS-2 Double Freedom', image: 'images/primary/Double_Freedom.png', source: 'Python_Commandos' },
    { id: 'Sweeper', name:'SG-97 Sweeper', image: 'images/primary/sweeper.png', source: 'Entrenched_Division' },
    { id: 'Exploding_Crossbow', name:'СВ-9 Exploding Crossbow', image: 'images/primary/exploding_crossbow.png', source: 'democratic_detonation' },
    { id: 'Eruptor', name:'R-36 Eruptor', image: 'images/primary/eruptor.png', source: 'democratic_detonation' },
    { id: 'Punisher_Plasma', name:'SG-8P Punisher Plasma', image: 'images/primary/punisher_plasma.png', source: 'cutting_edge' },
    { id: 'Blitzer', name:'ARC-12 Blitzer', image: 'images/primary/blitzer.png', source: 'cutting_edge' },
    { id: 'Scythe', name:'LAS-5 Scythe', image: 'images/primary/scythe.png', source: 'Helldivers_Mobilize!' },
    { id: 'Scorcher', name:'PLAS-1 Scorcher', image: 'images/primary/scorcher.png', source: 'Helldivers_Mobilize!' },
    { id: 'Purifier', name:'PLAS-101 Purifier', image: 'images/primary/purifier.png', source: 'polar_patriots' },
    { id: 'Trident', name:'LAS-13 Trident', image: 'images/primary/trident.png', source: 'Siege_Breakers' },
    { id: 'Double-Edge_Sickle', name:'LAS-17 Double-Edge Sickle', image: 'images/primary/duble-edge_sickle.png', source: 'Servants_of_Freedom' },
    { id: 'Sickle', name:'LAS-16 Sickle', image: 'images/primary/sickle.png', source: 'cutting_edge' },
    { id: 'Accelerator_Rifle', name:'PLAS-39 Accelerator Rifle', image: 'images/primary/accelerator_rifle.png', source: 'Righteous_Revenants' },
    { id: 'VG-70', name:'VG-70 Variable', image: 'images/primary/vg-70.webp', source: 'Control_Group' },
    { id: 'FLAM-66', name:'FLAM-66 Torcher', image: 'images/primary/flam-66.webp', source: 'Freedom\'s_Flame' },
    { id: 'JAR-5', name:'JAR-5 Dominator', image: 'images/primary/jar-5.webp', source: 'steeled_veterans' }
  ],

  secondary: [
    { id: 'P-92_Warrant', name: 'P-92 Warrant', image: 'images/secondary/p-92_warrant.png', source: 'Force_of_Law' },
    { id: 'P-2_Peacemaker', name: 'P-2 Peacemaker', image: 'images/secondary/p-2_peacemaker.webp', source: 'base' },
    { id: 'P-113_Verdict', name: 'P-113 Verdict', image: 'images/secondary/p-113_verdict.png', source: 'polar_patriots' },
    { id: 'M6C/SOCOM_Pistol', name: 'M6C/SOCOM Pistol', image: 'images/secondary/socom_pistol.webp', source: 'Obedient_Democracy_Support_Troopers' },
    { id: 'P-4_Senator', name: 'P-4 Senator', image: 'images/secondary/p-4_senator.webp', source: 'steeled_veterans' },
    { id: 'P-69_Veto', name: 'P-69 Veto', image: 'images/secondary/p-69_veto.webp', source: 'Entrenched_Division' },
    { id: 'CQC-19_Stun_Lance', name: 'CQC-19 Stun Lance', image: 'images/secondary/cqc-19_stun_lance.png', source: 'Urban_Legends' },
    { id: 'CQC-2_Saber', name: 'CQC-2 Saber', image: 'images/secondary/cqc-2_saber.png', source: 'Masters_of_Ceremony' },
    { id: 'CQC-30_Stun_Baton', name: 'CQC-30 Stun Baton', image: 'images/secondary/cqc-30_stun_baton.png', source: 'Urban_Legends' },
    { id: 'CQC-5_Combat_Hatchet', name: 'CQC-5 Combat Hatchet', image: 'images/secondary/cqc-5_combat_hatchet.webp', source: 'Servants_of_Freedom' },
    { id: 'Entrenchment_Tool', name: 'Entrenchment Tool', image: 'images/secondary/entrenchment_tool.webp', source: 'Entrenched_Division' },
    { id: 'CQC-42_Machete', name: 'CQC-42 Machete', image: 'images/secondary/cqc-42_machete.webp', source: 'Dust_Devils' },
    { id: 'P-11_Stim_Pistol', name: 'P-11 Stim Pistol', image: 'images/secondary/p-11_stim_pistol.webp', source: 'chemical_agents' },
    { id: 'SG-22_Bushwhacker', name: 'SG-22 Bushwhacker', image: 'images/secondary/sg-22_bushwhacker.webp', source: 'Viper_Commandos' },
    { id: 'LAS-58_Talon', name: 'LAS-58 Talon', image: 'images/secondary/las-58_talon.webp', source: 'Borderline_Justice' },
    { id: 'P-72_Crisper', name: 'P-72 Crisper', image: 'images/secondary/p-72_crisper.webp', source: 'Freedom\'s_Flame' },
    { id: 'GP-31_Grenade_Pistol', name: 'GP-31 Grenade Pistol', image: 'images/secondary/gp-31_grenade_pistol.webp', source: 'democratic_detonation' },
    { id: 'LAS-7_Dagger', name: 'LAS-7 Dagger', image: 'images/secondary/las-7_dagger.webp', source: 'cutting_edge' },
    { id: 'GP-20_Ultimatum', name: 'GP-20 Ultimatum', image: 'images/secondary/gp-20_ultimatum.webp', source: 'Servants_of_Freedom' },
    { id: 'PLAS-15_Loyalist', name: 'PLAS-15 Loyalist', image: 'images/secondary/plas-15_loyalist.png', source: 'truth_enforcers' },
    { id: 'P-35_Re-Educator', name: 'P-35 Re-Educator', image: 'images/secondary/p-35_re-educator.png', source: 'Redacted_Regiment' },
    { id: 'P-33_Missile_Pistol', name: 'P-33 Missile Pistol', image: 'images/secondary/p-33_missile_pistol.webp', source: 'Exo_Experts' },
    { id: 'P-19_Redemption', name: 'P-19 Redeemer', image: 'images/secondary/p-19_redeemer.png', source: 'Helldivers_Mobilize!' },

  ],

  grenade: [
    { id:'Dynamite', name:'TED-63 Dynamite', image:'images/grenade/Dynamite.webp', source:'Borderline_Justice' },
    { id:'Frag', name:'G-6 Frag', image:'images/grenade/frag.webp', source:'Helldivers_Mobilize!' },
    { id:'HE', name:'G-12 High Explosive', image:'images/grenade/he.webp', source:'base' },
    { id:'Incendiary', name:'G-10 Incendiary', image:'images/grenade/incendiary.webp', source:'steeled_veterans' },
    { id:'Pineapple', name:'G-7 Pineapple', image:'images/grenade/pineapple.webp', source:'Dust_Devils' },
    { id:'Impact', name:'G-16 Impact', image:'images/grenade/impact.png', source:'Helldivers_Mobilize!' },
    { id:'Incendiary_Impact', name:'G-13 Incendiary Impact', image:'images/grenade/incendiary_impact.webp', source:'polar_patriots' },
    { id:'Stun', name:'G-23 Stun', image:'images/grenade/stun.webp', source:'cutting_edge' },
    { id:'Gas', name:'G-4 Gas', image:'images/grenade/gas.webp', source:'chemical_agents' },
    { id:'Seeker', name:'G-50 Seeker', image:'images/grenade/seeker.webp', source:'Servants_of_Freedom' },
    { id:'Smoke', name:'G-3 Smoke', image:'images/grenade/smoke.webp', source:'Helldivers_Mobilize!' },
    { id:'Thermite', name:'G-123 Thermite', image:'images/grenade/thermite.webp', source:'democratic_detonation' },
    { id:'Throwing_Knife', name:'K-2 Throwing Knife', image:'images/grenade/Throwing_knife.webp', source:'Viper_Commandos' },
    { id:'Pyrotech', name:'G-142 Pyrotech', image:'images/grenade/pyrotech.webp', source:'Masters_of_Ceremony' },
    { id:'Urchin', name:'G-109 Urchin', image:'images/grenade/urchin.webp', source:'Force_of_Law' },
    { id:'Arc', name:'G-31 Arc', image:'images/grenade/arc.webp', source:'Control_Group' },
    { id:'Lure_Mine', name:'TM-1 Lure Mine', image:'images/grenade/lure_mine.webp', source:'Redacted_Regiment' },
    { id:'Smokescreen', name:'G-89 Smokescreen', image:'images/grenade/smokescreen.webp', source:'Redacted_Regiment' },
    { id:'Shield', name:'G/SH-39 Shield', image:'images/grenade/shield.webp', source:'Siege_Breakers' },
    { id:'Giga_Grenade', name:'G-48 Giga Grenade', image:'images/grenade/giga_grenade.webp', source:'Entrenched_Division' }
  ], 

  stratagem: [
    // Оружие поддержки
    {id:'mg_43', name:'MG-43 Machine Gun', image:'images/stratagem/mg_43.svg', source:'base', type: 'support_weapon'} ,
    {id:'eat_17', name:'EAT-17 Expendable Anti-Tank', image:'images/stratagem/eat_17.svg', source:'base', type: 'support_weapon'} ,
    {id:'m-105', name:'M-105 Stalwart', image:'images/stratagem/m-105.svg', source:'base', type: 'support_weapon'} ,
    {id:'las-98', name:'LAS-98 Laser Cannon', image:'images/stratagem/las-98.svg', source:'base', type: 'support_weapon'} ,
    {id:'apw-1', name:'APW-1 Anti-Materiel Rifle', image:'images/stratagem/apw-1.svg', source:'base', type: 'support_weapon'} ,
    {id:'gl-21', name:'GL-21 Grenade Launcher', image:'images/stratagem/gl-21.svg', source:'base', type: 'support_weapon'} ,
    {id:'gr-8', name:'GR-8 Recoilless Rifle', image:'images/stratagem/gr-8.svg', source:'base', type: 'support_weapon'} ,
    {id:'flam-40', name:'FLAM-40 Flamethrower', image:'images/stratagem/flam-40.svg', source:'base', type: 'support_weapon'} ,
    {id:'mg-206', name:'MG-206 Heavy Machine Gun', image:'images/stratagem/mg-206.svg', source:'base', type: 'support_weapon'} ,
    {id:'ac-8', name:'AC-8 Autocannon', image:'images/stratagem/ac-8.svg', source:'base', type: 'support_weapon'} ,
    {id:'arc-3', name:'ARC-3 Arc Thrower', image:'images/stratagem/arc-3.svg', source:'base', type: 'support_weapon'} ,
    {id:'las-99', name:'LAS-99 Quasar Cannon', image:'images/stratagem/las-99.svg', source:'base', type: 'support_weapon'} ,
    {id:'rl-77', name:'RL-77 Airburst Rocket Launcher', image:'images/stratagem/rl-77.svg', source:'base', type: 'support_weapon'} ,
    {id:'mls-4x', name:'MLS-4X Commando', image:'images/stratagem/mls-4x.svg', source:'base', type: 'support_weapon'} ,
    {id:'faf-14', name:'FAF-14 Spear', image:'images/stratagem/faf-14.svg', source:'base', type: 'support_weapon'} ,
    {id:'rs-422', name:'RS-422 Railgun', image:'images/stratagem/rs-422.svg', source:'base', type: 'support_weapon'} ,
    {id:'sta-x3', name:'StA-X3 W.A.S.P. Launcher', image:'images/stratagem/sta-x3.svg', source:'base', type: 'support_weapon'} ,
    {id:'cqc-20', name:'CQC-20 Breaching Hammer', image:'images/stratagem/cqc-20.svg', source:'Siege_Breakers', type: 'support_weapon'} ,
    {id:'plas-45', name:'PLAS-45 Epoch', image:'images/stratagem/plas-45.svg', source:'Control_Group', type: 'support_weapon'} ,
    {id:'mgx-42', name:'MGX-42 Bullet Storm', image:'images/stratagem/mgx-42.svg', source:'Exo_Experts', type: 'support_weapon'} ,
    {id:'s-11', name:'S-11 Speargun', image:'images/stratagem/s-11.svg', source:'Dust_Devils', type: 'support_weapon'} ,
    {id:'cqc-9', name:'CQC-9 Defoliation Tool', image:'images/stratagem/cqc-9.svg', source:'Python_Commandos', type: 'support_weapon'} ,
    {id:'tx-41', name:'TX-41 Sterilizer', image:'images/stratagem/tx-41.svg', source:'chemical_agents', type: 'support_weapon'} ,
    {id:'eat-700', name:'EAT-700 Expendable Napalm', image:'images/stratagem/eat-700.svg', source:'Dust_Devils', type: 'support_weapon'} ,
    {id:'eat-411', name:'EAT-411 Leveller', image:'images/stratagem/eat-411.svg', source:'Siege_Breakers', type: 'support_weapon'} ,
    {id:'gl-52', name:'GL-52 De-Escalator', image:'images/stratagem/gl-52.svg', source:'Force_of_Law', type: 'support_weapon'} ,
    {id:'gl-28', name:'GL-28 Belt-Fed Grenade Launcher', image:'images/stratagem/gl-28.svg', source:'Siege_Breakers', type: 'support_weapon'} ,
    {id:'b-md-1', name:'B/MD C4 Pack', image:'images/stratagem/b-md-1.svg', source:'Redacted_Regiment', type: 'support_weapon'} ,
    {id:'ms-11', name:'MS-11 Solo Silo', image:'images/stratagem/ms-11.svg', source:'Dust_Devils', type: 'support_weapon'} ,
    {id:'b-flam-80', name:'B/FLAM-80 Cremator', image:'images/stratagem/b-flam-80.svg', source:'Entrenched_Division', type: 'support_weapon'} ,
    {id:'m-1000', name:'M-1000 Maxigun', image:'images/stratagem/m-1000.svg', source:'Python_Commandos', type: 'support_weapon'} ,
    {id:'cqc-1', name:'CQC-1 One True Flag', image:'images/stratagem/cqc-1.svg', source:'Masters_of_Ceremony', type: 'support_weapon'} ,

    // Турели / оборонительные
    {id:'A/MG-43 Machine Gun Sentry', name:'A/MG-43 Machine Gun Sentry', image:'images/stratagem/a_mg43_machine_gun_sentry.svg', source:'base', type: 'sentry'} ,
    {id:'A/G-16 Gatling Sentry', name:'A/G-16 Gatling Sentry', image:'images/stratagem/a_g16_gatling_sentry.svg', source:'base', type: 'sentry'} ,
    {id:'A/AC-8 Autocannon Sentry', name:'A/AC-8 Autocannon Sentry', image:'images/stratagem/a_ac8_autocannon_sentry.svg', source:'base', type: 'sentry'} ,
    {id:'A/M-12 Mortar Sentry', name:'A/M-12 Mortar Sentry', image:'images/stratagem/a_m12_mortar_sentry.svg', source:'base', type: 'sentry'} ,
    {id:'A/MLS-4X Rocket Sentry', name:'A/MLS-4X Rocket Sentry', image:'images/stratagem/a_mls4x_rocket_sentry.svg', source:'base', type: 'sentry'} ,
    {id:'A/ARC-3 Tesla Tower', name:'A/ARC-3 Tesla Tower', image:'images/stratagem/a_arc3_tesla_tower.svg', source:'base', type: 'sentry'} ,
    {id:'A/M-23 EMS Mortar Sentry', name:'A/M-23 EMS Mortar Sentry', image:'images/stratagem/a_m23_ems_mortar_sentry.svg', source:'base', type: 'sentry'} ,
    {id:'A/LAS-98 Laser Sentry', name:'A/LAS-98 Laser Sentry', image:'images/stratagem/a_las98_laser_sentry.svg', source:'Control_Group', type: 'sentry'} ,
    {id:'A/FLAM-40 Flame Sentry', name:'A/FLAM-40 Flame Sentry', image:'images/stratagem/a_flam40_flame_sentry.svg', source:'Urban_Legends', type: 'sentry'} ,
    {id:'A/GM-17 Gas Mortar Sentry', name:'A/GM-17 Gas Mortar Sentry', image:'images/stratagem/a_gm17_gas_mortar_sentry.svg', source:'Entrenched_Division', type: 'sentry'} ,
    {id:'A/MD-6 Anti-Personnel Minefield', name:'A/MD-6 Anti-Personnel Minefield', image:'images/stratagem/a_md6_anti_personnel_minefield.svg', source:'base', type: 'sentry'} ,
    {id:'A/MD-I4 Incendiary Mines', name:'A/MD-I4 Incendiary Mines', image:'images/stratagem/a_md_i4_incendiary_mines.svg', source:'base', type: 'sentry'} ,
    {id:'A/MD-17 Anti-Tank Mines', name:'A/MD-17 Anti-Tank Mines', image:'images/stratagem/a_md17_anti_tank_mines.svg', source:'base', type: 'sentry'} ,
    {id:'A/FX-12 Shield Generator Relay', name:'A/FX-12 Shield Generator Relay', image:'images/stratagem/a_fx12_shield_generator_relay.svg', source:'base', type: 'sentry'} ,
    {id:'A/MG-101 HMG Emplacement', name:'A/MG-101 HMG Emplacement', image:'images/stratagem/a_mg101_hmg_emplacement.svg', source:'base', type: 'sentry'} ,
    {id:'E/GL-21 Grenadier Battlement', name:'E/GL-21 Grenadier Battlement', image:'images/stratagem/e_gl21_grenadier_battlement.svg', source:'base', type: 'sentry'} ,
    {id:'A/MD-8 Gas Mines', name:'A/MD-8 Gas Mines', image:'images/stratagem/a_md8_gas_mines.svg', source:'base', type: 'sentry'} ,
    {id:'E/AT-12 Anti-Tank Emplacement', name:'E/AT-12 Anti-Tank Emplacement', image:'images/stratagem/e_at12_anti_tank_emplacement.svg', source:'Urban_Legends', type: 'sentry'} ,

    // Ранцы
    {id:'supply_pack', name:'B-1 Supply Pack', image:'images/stratagem/supply_pack.svg', source:'base', type: 'backpack'} ,
    {id:'jump_pack', name:'LIFT-850 Jump Pack', image:'images/stratagem/jump_pack.svg', source:'base', type: 'backpack'} ,
    {id:'shield_pack', name:'SH-20 Ballistic Shield Backpack', image:'images/stratagem/shield_pack.svg', source:'base', type: 'backpack'} ,
    {id:'guard_dog', name:'AX/AR-23 Guard Dog', image:'images/stratagem/guard_dog.svg', source:'base', type: 'backpack'} ,
    {id:'rover', name:'AX/LAS-5 Rover', image:'images/stratagem/rover.svg', source:'base', type: 'backpack'} ,
    {id:'shield_generator_pack', name:'SH-32 Shield Generator Pack', image:'images/stratagem/shield_generator_pack.svg', source:'base', type: 'backpack'} ,
    {id:'directional_shield', name:'SH-51 Directional Shield', image:'images/stratagem/directional_shield.svg', source:'Urban_Legends', type: 'backpack'} ,
    {id:'hot_dog', name:'AX/FLAM-75 Hot Dog', image:'images/stratagem/hot_dog.svg', source:'Python_Commandos', type: 'backpack'} ,
    {id:'portable_hellbomb', name:'B-100 Portable Hellbomb', image:'images/stratagem/portable_hellbomb.svg', source:'Servants_of_Freedom', type: 'backpack'} ,
    {id:'k9', name:'AX/ARC-3 K-9', image:'images/stratagem/k9.svg', source:'Force_of_Law', type: 'backpack'} ,
    {id:'hover_pack', name:'LIFT-860 Hover Pack', image:'images/stratagem/hover_pack.svg', source:'Borderline_Justice', type: 'backpack'} ,
    {id:'dog_breath', name:'AX/TX-13 Dog Breath', image:'images/stratagem/dog_breath.svg', source:'chemical_agents', type: 'backpack'} ,
    {id:'warp_pack', name:'LIFT-182 Warp Pack', image:'images/stratagem/warp_pack.svg', source:'Control_Group', type: 'backpack'} ,

    //Техника
    {id:'m103_supply_frv', name:'M-103 Supply FRV', image:'images/stratagem/m103_supply_frv.svg', source:'base', type: 'vehicle'} ,
    {id:'EXO-49 Emancipator Exosuit', name:'EXO-49 Emancipator Exosuit', image:'images/stratagem/exo-49_emancipator_exosuit.svg', source:'base', type: 'vehicle'} ,
    {id:'EXO-45 Patriot Exosuit', name:'EXO-45 Patriot Exosuit', image:'images/stratagem/exo-45_patriot_exosuit.svg', source:'base', type: 'vehicle'} ,
    {id:'m102_fast_recon_vehicle', name:'M-102 Fast Recon Vehicle', image:'images/stratagem/m102_fast_recon_vehicle.svg', source:'base', type: 'vehicle'} ,
    {id:'TD-220 Bastion MK XVI', name:'TD-220 Bastion MK XVI', image:'images/stratagem/td-220_bastion_mk_xvi.svg', source:'base', type: 'vehicle'} ,
    {id:'EXO-55 Breakthrough Exosuit', name:'EXO-55 Breakthrough Exosuit', image:'images/stratagem/exo-55_breakthrough_exosuit.svg', source:'Exo_Experts', type: 'vehicle'} ,
    {id:'EXO-51 Lumberer Exosuit', name:'EXO-51 Lumberer Exosuit', image:'images/stratagem/exo-51_lumberer_exosuit.svg', source:'Exo_Experts', type: 'vehicle'} ,


    // Орбитальные / Eagle удары
    {id:'Orbital Precision Strike', name:'Orbital Precision Strike', image:'images/stratagem/orbital_precision.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital Gatling Barrage', name:'Orbital Gatling Barrage', image:'images/stratagem/orbital_gatling.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital Gas Strike', name:'Orbital Gas Strike', image:'images/stratagem/orbital_gas.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital 120mm HE Barrage', name:'Orbital 120mm HE Barrage', image:'images/stratagem/orbital_120mm_he_barrage.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital Airburst Strike', name:'Orbital Airburst Strike', image:'images/stratagem/orbital_airburst.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital Smoke Strike', name:'Orbital Smoke Strike', image:'images/stratagem/orbital_smoke.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital EMS Strike', name:'Orbital EMS Strike', image:'images/stratagem/orbital_ems.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital 380mm HE Barrage', name:'Orbital 380mm HE Barrage', image:'images/stratagem/orbital_380mm_he_barrage.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital Walking Barrage', name:'Orbital Walking Barrage', image:'images/stratagem/orbital_walking_barrage.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital Laser', name:'Orbital Laser', image:'images/stratagem/orbital_laser.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital Napalm Barrage', name:'Orbital Napalm Barrage', image:'images/stratagem/orbital_napalm_barrage.svg', source:'base', type: 'orbital'} ,
    {id:'Orbital Railcannon Strike', name:'Orbital Railcannon Strike', image:'images/stratagem/orbital_railcannon.svg', source:'base', type: 'orbital'} ,
    {id:'Eagle Strafing Run', name:'Eagle Strafing Run', image:'images/stratagem/eagle_strafing_run.svg', source:'base', type: 'eagle'} ,
    {id:'Eagle Airstrike', name:'Eagle Airstrike', image:'images/stratagem/eagle_airstrike.svg', source:'base', type: 'eagle'} ,
    {id:'Eagle Cluster Bomb', name:'Eagle Cluster Bomb', image:'images/stratagem/eagle_cluster_bomb.svg', source:'base', type: 'eagle'} ,
    {id:'Eagle Smoke Strike', name:'Eagle Smoke Strike', image:'images/stratagem/eagle_smoke_strike.svg', source:'base', type: 'eagle'} ,
    {id:'Eagle Napalm Airstrike', name:'Eagle Napalm Airstrike', image:'images/stratagem/eagle_napalm_airstrike.svg', source:'base', type: 'eagle'} ,
    {id:'Eagle 110mm Rocket Pods', name:'Eagle 110mm Rocket Pods', image:'images/stratagem/eagle_110mm_rocket_pods.svg', source:'base', type: 'eagle'} ,
    {id:'Eagle 500kg Bomb', name:'Eagle 500kg Bomb', image:'images/stratagem/eagle_500kg_bomb.svg', source:'base', type: 'eagle'} 
  ],
};

// Бустеры — теперь тоже крутятся в рулетке (8-й слот)
const BOOSTER_DATA = [
   {id: 'hellpod_space_optimization', name: 'Hellpod Space Optimization', image: 'images/booster/hellpod_space_optimization.svg', source: 'Helldivers_Mobilize!' },
   {id: 'vitality_enhancement', name: 'Vitality Enhancement', image: 'images/booster/vitality_enhancement.svg', source: 'Helldivers_Mobilize!' }, 
   {id: 'uav_recon_booster', name: 'UAV Recon Booster', image: 'images/booster/uav_recon_booster.svg', source: 'Helldivers_Mobilize!' }, 
   {id: 'stamina_enhancement', name: 'Stamina Enhancement', image: 'images/booster/stamina_enhancement.svg', source: 'Helldivers_Mobilize!' }, 
   {id: 'muscle_enhancement', name: 'Muscle Enhancement', image: 'images/booster/muscle_enhancement.svg', source: 'Helldivers_Mobilize!' }, 
   {id: 'increased_reinforcement_budget', name: 'Increased Reinforcement Budget', image: 'images/booster/increased_reinforcement_budget.svg', source: 'Helldivers_Mobilize!' }, 
   {id: 'flexible_reinforcement_budget', name: 'Flexible Reinforcement Budget', image: 'images/booster/flexible_reinforcement_budget.svg', source: 'steeled_veterans' }, 
   {id: 'localization_confusion', name: 'Localization Confusion', image: 'images/booster/localization_confusion.svg', source: 'cutting_edge' }, 
   {id: 'expert_extraction_pilot', name: 'Expert Extraction Pilot', image: 'images/booster/expert_extraction_pilot.svg', source: 'democratic_detonation' }, 
   {id: 'motivational_shocks', name: 'Motivational Shocks', image: 'images/booster/motivational_shocks.svg', source: 'polar_patriots' }, 
   {id: 'experimental_infusion', name: 'Experimental Infusion', image: 'images/booster/experimental_infusion.svg', source: 'Viper_Commandos' }, 
   {id: 'firebomb_hellpods', name: 'Firebomb Hellpods', image: 'images/booster/firebomb_hellpods.svg', source: 'Freedom\'s_Flame' }, 
   {id: 'dead_sprint', name: 'Dead Sprint', image: 'images/booster/dead_sprint.svg', source: 'truth_enforcers' }, 
   {id: 'armed_resupply_pods', name: 'Armed Resupply Pods', image: 'images/booster/armed_resupply_pods.svg', source: 'Urban_Legends' }, 
   {id: 'sample_extricator', name: 'Sample Extricator', image: 'images/booster/sample_extricator.svg', source: 'Borderline_Justice' }, 
   {id: 'sample_scanner', name: 'Sample Scanner', image: 'images/booster/sample_scanner.svg', source: 'Masters_of_Ceremony' },
   {id: 'stun_pods', name: 'Stun Pods', image: 'images/booster/stun_pods.svg', source: 'Force_of_Law' }, 
   {id: 'concealed_insertion', name: 'Concealed Insertion', image: 'images/booster/concealed_insertion.svg', source: 'Redacted_Regiment' }   
];

// подключаем бустеры к общему объекту данных, чтобы script.js мог их найти по ключу 'booster'
WEAPON_DATA.booster = BOOSTER_DATA;
