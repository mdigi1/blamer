const dom = {
  nameInput: document.getElementById('nameInput'),
  addBtn: document.getElementById('addBtn'),
  spinBtn: document.getElementById('spinBtn'),
  resultEl: document.getElementById('result'),
  namesListEl: document.getElementById('namesList'),
  currentDateEl: document.getElementById('currentDate'),
  wheelWrap: document.getElementById('wheelWrap'),
  fxLayer: document.getElementById('fxLayer'),
  spinPhraseEl: document.getElementById('spinPhrase'),
  winnerBlastEl: document.getElementById('winnerBlast'),
  winnerBlastNameEl: document.getElementById('winnerBlastName'),
  canvas: document.getElementById('wheel')
};

const wheelCtx = dom.canvas?.getContext('2d');

const CONFIG = {
  geometry: {
    fullCircle: Math.PI * 2,
    pointerAngle: -Math.PI / 2,
    centerRadius: 32
  },
  timing: {
    winnerBlastMs: 4200,
    spinPhraseIntervalMs: 2200,
    spinPhraseSwapPointMs: 360,
    spinPhraseHideDelayMs: 700,
    spinDurationMs: 7000,
    celebrateDurationMs: 800,
    screenShakeMs: 2200,
    dateRefreshMs: 60000,
    bugRainIntervalMs: 1800,
    bugPopDurationMs: 320,
    bugPopBurstMs: 560,
    bugDropMinDurationMs: 8200,
    bugDropMaxDurationMs: 12000
  },
  spin: {
    minSpins: 6,
    extraSpinVariants: 3
  },
  bugRain: {
    dropsPerTick: 1,
    warmupCount: 2,
    iconChance: 0.3,
    colors: ['#ff6b35', '#ffd166', '#06d6a0', '#5ac8ff', '#ef476f', '#ff9f1c'],
    icons: [
      'bug-icon.svg?v=20260227a',
      'bug-icon-2.svg?v=20260227a',
      'bug-icon-3.svg?v=20260227a',
      'bug-icon-4.svg?v=20260227a'
    ],
    texts: [
      'NaN',
      "can't read property of undefined",
      'Cannot read properties of undefined',
      'undefined is not a function',
      'TypeError: x is not a function',
      'ReferenceError: x is not defined',
      'SyntaxError: Unexpected token',
      'Maximum call stack size exceeded',
      'RangeError: Invalid array length',
      'Cannot set headers after they are sent',
      'ECONNREFUSED',
      'ETIMEDOUT',
      '429 Too Many Requests',
      '500 Internal Server Error',
      'CORS policy blocked the request',
      'NetworkError when attempting to fetch resource',
      'Module not found',
      '404 Not Found',
      'EADDRINUSE: address already in use',
      'ENOMEM: out of memory',
      'EACCES: permission denied',
      '401 Unauthorized',
      '403 Forbidden',
      '502 Bad Gateway',
      '503 Service Unavailable',
      '504 Gateway Timeout',
      'Uncaught (in promise)',
      'Promise rejected with no catch',
      'AbortError: The operation was aborted',
      'Failed to fetch',
      'ERR_CONNECTION_RESET',
      'ERR_NAME_NOT_RESOLVED',
      'ERR_SSL_PROTOCOL_ERROR',
      'TypeError: Cannot convert undefined or null to object',
      'TypeError: Assignment to constant variable',
      'ReferenceError: process is not defined',
      'Unexpected end of JSON input',
      'JSON.parse: bad parsing',
      'Invalid hook call',
      'Hydration failed',
      'ChunkLoadError',
      'Cannot find module',
      'npm ERR! peer dep missing',
      'npm ERR! ERESOLVE unable to resolve dependency tree',
      'pnpm ERR_PNPM_FETCH_404',
      'yarn install v1.22 failed',
      'Killed: JavaScript heap out of memory',
      'PrismaClientInitializationError',
      'SequelizeConnectionRefusedError',
      'Duplicate key value violates unique constraint',
      'SQLITE_BUSY: database is locked',
      'Deadlock found when trying to get lock',
      'connection pool exhausted',
      'Build failed with 1 error',
      'Process exited with code 1',
      'Segmentation fault (core dumped)',
      'fatal: not a git repository',
      'fatal: refusing to merge unrelated histories'
    ]
  }
};

const SLICE_COLORS = [
  '#f95d6a',
  '#ff9f1c',
  '#ffd166',
  '#06d6a0',
  '#00a8e8',
  '#4361ee',
  '#9d4edd',
  '#ef476f'
];

const UI_TEXT = {
  winnerPrefix: 'Winner for today: ',
  winnerEmpty: 'Winner for today: —',
  listEmpty: 'List is empty',
  spinning: 'Spinning...',
  noNames: 'No names'
};

const SPIN_PHRASES = [
  'Who broke prod this time?',
  'Works on my machine, ship it.',
  'No plan, full deploy, zero fear.',
  'CI failed because it is weak.',
  'Who pushed to main on Friday night?',
  'Not a bug, just your onboarding.',
  'Did not read logs, still 200% confident.',
  'Rollback is for cowards, hit deploy.',
  'No tests, no problems.',
  'Prod is burning, but KPIs look great.',
  'One more force-push and we are legends.',
  'Docker is crying quietly in the corner.',
  'PR approved in 12 seconds, respect.',
  'No monitoring, just pure intuition.',
  'We debug in production like adults.',
  'Ship fast, explain later.',
  'If it compiles, it is architecture.',
  'Another migration on Friday? Easy.',
  'Canary deploy? Nah, full send.',
  'Who needs docs when we have vibes?',
  'The root cause is someone else.',
  'We skipped staging to save time.',
  'Alert fatigue is just background music.',
  'The incident is now a feature request.',
  'We renamed tech debt to roadmap.',
  'No blame, only aggressive ownership.',
  'The fix is one line and 400 comments.',
  'Postmortem says: confidence was high.',
  'SLA is a mindset, not a number.',
  'npm install solved nothing, as expected.',
  'Cache invalidation won again.',
  'We shipped a TODO to production.',
  'The API changed, nobody told frontend.',
  'The schema migrated itself, probably.',
  'We scaled horizontally into chaos.',
  'This regex is now a critical dependency.',
  'Another webhook, another mystery.',
  'Auth broke because clocks disagree.',
  'The queue is fine, just very emotional.',
  'Hot reload worked, reality did not.',
  'Yesterday stable, today distributed.',
  'The patch is tiny, the blast radius is not.',
  'Kubernetes said no, with confidence.',
  'One missing semicolon, full business outage.',
  'The dashboard is green, users are not.',
  'DNS propagated directly into panic mode.',
  'Feature flag off means on in one region.',
  'It passed QA and failed physics.',
  'Same bug, different microservice.'
];

const state = {
  names: [
    'Evgeniy P',
    'Hlib',
    'Ihor',
    'Iryn',
    'Ivan (singer)',
    'Ivan',
    'Max',
    'Niv',
    'Oleg',
    'Roma',
    'Ross',
    'Ruslan',
    'Serhii (greatest)',
    'Serhii',
    'Vitalii',
    'Yaroslav',
    'Yevhenii H',
    'Jonathan'
  ],
  rotation: 0,
  isSpinning: false,
  lastWinnerIndex: null,
  timers: {
    winnerBlast: null,
    spinPhraseInterval: null,
    spinPhraseSwap: null,
    spinPhraseHide: null,
    bugRainInterval: null,
    screenShake: null,
    dateRefresh: null
  }
};

function randomInt(maxExclusive) {
  return Math.floor(Math.random() * maxExclusive);
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function normalizeRotation(value) {
  let normalized = value % CONFIG.geometry.fullCircle;
  if (normalized < 0) {
    normalized += CONFIG.geometry.fullCircle;
  }
  return normalized;
}

function clearTimer(timerKey, clearFn) {
  if (!state.timers[timerKey]) {
    return;
  }

  clearFn(state.timers[timerKey]);
  state.timers[timerKey] = null;
}

function scheduleTimeout(timerKey, callback, delay) {
  clearTimer(timerKey, clearTimeout);
  state.timers[timerKey] = setTimeout(() => {
    state.timers[timerKey] = null;
    callback();
  }, delay);
}

function scheduleInterval(timerKey, callback, interval) {
  clearTimer(timerKey, clearInterval);
  state.timers[timerKey] = setInterval(callback, interval);
}

function removeLater(node, delay) {
  if (!node) {
    return;
  }

  setTimeout(() => node.remove(), delay);
}

function setSpinningState(spinning) {
  state.isSpinning = spinning;
  if (dom.spinBtn) {
    dom.spinBtn.disabled = spinning;
  }
  dom.wheelWrap?.classList.toggle('is-spinning', spinning);
}

function normalizeName(raw) {
  return raw.trim().replace(/\s+/g, ' ');
}

function renderCurrentDate() {
  if (!dom.currentDateEl) {
    return;
  }

  const dateText = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  dom.currentDateEl.textContent = `Today: ${dateText}`;
}

function resetResult() {
  if (!dom.resultEl) {
    return;
  }

  dom.resultEl.textContent = UI_TEXT.winnerEmpty;
  dom.resultEl.classList.remove('win');
}

function showWinnerResult(name) {
  if (!dom.resultEl) {
    return;
  }

  dom.resultEl.textContent = '';
  dom.resultEl.append(document.createTextNode(UI_TEXT.winnerPrefix));

  const winnerName = document.createElement('span');
  winnerName.className = 'winner-name';
  winnerName.textContent = name;
  dom.resultEl.append(winnerName);
}

function showWinnerFullscreen(name) {
  if (!dom.winnerBlastEl || !dom.winnerBlastNameEl) {
    return;
  }

  dom.winnerBlastNameEl.textContent = name;
  dom.winnerBlastEl.classList.remove('show');
  void dom.winnerBlastEl.offsetWidth;
  dom.winnerBlastEl.classList.add('show');

  scheduleTimeout('winnerBlast', () => {
    dom.winnerBlastEl?.classList.remove('show');
  }, CONFIG.timing.winnerBlastMs);
}

function triggerScreenShake() {
  const page = document.body;
  const root = document.documentElement;
  if (!page || !root) {
    return;
  }

  clearTimer('screenShake', clearTimeout);
  root.classList.remove('screen-shake');
  page.classList.remove('screen-shake');
  void page.offsetWidth;
  root.classList.add('screen-shake');
  page.classList.add('screen-shake');

  scheduleTimeout('screenShake', () => {
    root.classList.remove('screen-shake');
    page.classList.remove('screen-shake');
  }, CONFIG.timing.screenShakeMs);
}

function getSpinPhraseElement(createIfMissing = false) {
  if (dom.spinPhraseEl || !createIfMissing) {
    return dom.spinPhraseEl;
  }

  if (!dom.wheelWrap) {
    return null;
  }

  const created = document.createElement('p');
  created.id = 'spinPhrase';
  created.className = 'spin-phrase';
  created.setAttribute('aria-live', 'polite');
  dom.wheelWrap.appendChild(created);
  dom.spinPhraseEl = created;
  return dom.spinPhraseEl;
}

function pickSpinPhrase(previous = '') {
  if (SPIN_PHRASES.length <= 1) {
    return SPIN_PHRASES[0] || '';
  }

  let next = previous;
  for (let i = 0; i < 5 && next === previous; i += 1) {
    next = SPIN_PHRASES[randomInt(SPIN_PHRASES.length)];
  }
  return next;
}

function renderSpinPhrase() {
  const phraseEl = getSpinPhraseElement(true);
  if (!phraseEl) {
    return;
  }

  clearTimer('spinPhraseHide', clearTimeout);
  phraseEl.textContent = pickSpinPhrase(phraseEl.textContent);
  phraseEl.classList.remove('swap');
  phraseEl.classList.add('show');
}

function animateSpinPhraseSwap() {
  const phraseEl = getSpinPhraseElement(true);
  if (!phraseEl) {
    return;
  }

  const nextPhrase = pickSpinPhrase(phraseEl.textContent);
  phraseEl.classList.remove('swap');
  void phraseEl.offsetWidth;
  phraseEl.classList.add('swap');

  scheduleTimeout('spinPhraseSwap', () => {
    if (!state.isSpinning) {
      return;
    }
    phraseEl.textContent = nextPhrase;
  }, CONFIG.timing.spinPhraseSwapPointMs);
}

function startSpinPhrases() {
  clearTimer('spinPhraseSwap', clearTimeout);
  clearTimer('spinPhraseHide', clearTimeout);
  renderSpinPhrase();

  scheduleInterval('spinPhraseInterval', animateSpinPhraseSwap, CONFIG.timing.spinPhraseIntervalMs);
}

function stopSpinPhrases() {
  clearTimer('spinPhraseInterval', clearInterval);
  clearTimer('spinPhraseSwap', clearTimeout);

  const phraseEl = getSpinPhraseElement();
  if (!phraseEl) {
    return;
  }

  phraseEl.classList.remove('swap');
  scheduleTimeout('spinPhraseHide', () => {
    phraseEl.classList.remove('show');
    phraseEl.textContent = '';
  }, CONFIG.timing.spinPhraseHideDelayMs);
}

function emitBugDrop() {
  if (!dom.fxLayer) {
    return;
  }

  const useIcon = Math.random() < CONFIG.bugRain.iconChance;
  const drop = useIcon ? document.createElement('img') : document.createElement('span');
  drop.className = useIcon ? 'bug-drop bug-drop--icon' : 'bug-drop';

  if (useIcon) {
    drop.src = CONFIG.bugRain.icons[randomInt(CONFIG.bugRain.icons.length)];
    drop.alt = 'Bug';
    drop.style.width = `${randomRange(48, 76)}px`;
    drop.style.height = 'auto';
    drop.style.setProperty('--bug-hit-x', '14px');
    drop.style.setProperty('--bug-hit-y', '14px');
    drop.style.setProperty('--bug-hit-x-neg', '-14px');
    drop.style.setProperty('--bug-hit-y-neg', '-14px');
  } else {
    drop.textContent = CONFIG.bugRain.texts[randomInt(CONFIG.bugRain.texts.length)];
    drop.style.color = CONFIG.bugRain.colors[randomInt(CONFIG.bugRain.colors.length)];
    drop.style.fontSize = `${randomRange(1, 1.7)}rem`;
    drop.style.setProperty('--bug-hit-x', '12px');
    drop.style.setProperty('--bug-hit-y', '9px');
    drop.style.setProperty('--bug-hit-x-neg', '-12px');
    drop.style.setProperty('--bug-hit-y-neg', '-9px');
  }

  drop.style.left = `${randomRange(0, window.innerWidth)}px`;
  drop.style.top = '-48px';
  drop.style.setProperty('--bug-drift-x', `${randomRange(-90, 90)}px`);
  drop.style.setProperty('--bug-rot-end', `${randomRange(-36, 36)}deg`);

  const duration = randomRange(CONFIG.timing.bugDropMinDurationMs, CONFIG.timing.bugDropMaxDurationMs);
  const delay = randomRange(0, 220);
  drop.style.setProperty('--bug-fall-duration', `${duration}ms`);
  drop.style.animationDelay = `${delay}ms`;
  drop.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    popBugDrop(drop);
  });

  dom.fxLayer.appendChild(drop);
  removeLater(drop, duration + delay + 180);
}

function popBugDrop(drop) {
  if (!drop || drop.dataset.popping === '1') {
    return;
  }

  drop.dataset.popping = '1';
  const computed = getComputedStyle(drop);
  const rect = drop.getBoundingClientRect();
  const burstX = rect.left + rect.width / 2;
  const burstY = rect.top + rect.height / 2;
  const burstColor = computed.color && computed.color !== 'rgba(0, 0, 0, 0)' ? computed.color : '#ffd166';
  const baseTransform = computed.transform === 'none' ? 'translate(0, 0)' : computed.transform;
  const baseOpacity = Math.max(Number.parseFloat(computed.opacity) || 1, 0.85);

  drop.style.animation = 'none';
  drop.style.transform = baseTransform;
  drop.style.opacity = String(baseOpacity);
  drop.style.pointerEvents = 'none';

  spawnBugPopBurst(burstX, burstY, burstColor);

  const popAnimation = drop.animate(
    [
      { transform: `${baseTransform} scale(1) rotate(0deg)`, opacity: baseOpacity, filter: 'none' },
      { transform: `${baseTransform} scale(1.95) rotate(10deg)`, opacity: 0, filter: 'blur(1.8px)' }
    ],
    {
      duration: CONFIG.timing.bugPopDurationMs,
      easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      fill: 'forwards'
    }
  );

  popAnimation.onfinish = () => drop.remove();
}

function spawnBugPopBurst(x, y, color) {
  if (!dom.fxLayer) {
    return;
  }

  const burst = document.createElement('span');
  burst.className = 'bug-pop-burst';
  burst.style.left = `${x}px`;
  burst.style.top = `${y}px`;
  burst.style.setProperty('--burst-color', color);
  dom.fxLayer.appendChild(burst);
  removeLater(burst, CONFIG.timing.bugPopBurstMs);

  for (let i = 0; i < 7; i += 1) {
    const shard = document.createElement('span');
    shard.className = 'bug-pop-shard';
    shard.style.left = `${x}px`;
    shard.style.top = `${y}px`;
    shard.style.setProperty('--burst-color', color);
    shard.style.setProperty('--sx', `${randomRange(-48, 48)}px`);
    shard.style.setProperty('--sy', `${randomRange(-48, 48)}px`);
    shard.style.setProperty('--srot', `${randomRange(-130, 130)}deg`);
    shard.style.animationDelay = `${randomRange(0, 80)}ms`;
    dom.fxLayer.appendChild(shard);
    removeLater(shard, CONFIG.timing.bugPopBurstMs + 120);
  }
}

function startBugRain() {
  if (!dom.fxLayer) {
    return;
  }

  clearTimer('bugRainInterval', clearInterval);

  for (let i = 0; i < CONFIG.bugRain.warmupCount; i += 1) {
    setTimeout(emitBugDrop, randomRange(0, 260));
  }

  scheduleInterval('bugRainInterval', () => {
    for (let i = 0; i < CONFIG.bugRain.dropsPerTick; i += 1) {
      emitBugDrop();
    }
  }, CONFIG.timing.bugRainIntervalMs);
}

function renderNameChips() {
  if (!dom.namesListEl) {
    return;
  }

  dom.namesListEl.innerHTML = '';

  if (!state.names.length) {
    const empty = document.createElement('span');
    empty.className = 'name-chip';
    empty.textContent = UI_TEXT.listEmpty;
    dom.namesListEl.appendChild(empty);
    return;
  }

  state.names.forEach((name, index) => {
    const chip = document.createElement('span');
    chip.className = 'name-chip';
    if (index === state.lastWinnerIndex) {
      chip.classList.add('winner-chip');
    }
    chip.textContent = name;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'chip-remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Remove ${name}`);
    removeBtn.addEventListener('click', () => removeName(index));

    chip.appendChild(removeBtn);
    dom.namesListEl.appendChild(chip);
  });
}

function drawWheel() {
  if (!dom.canvas || !wheelCtx) {
    return;
  }

  const center = dom.canvas.width / 2;
  const radius = center - 12;

  wheelCtx.clearRect(0, 0, dom.canvas.width, dom.canvas.height);

  if (!state.names.length) {
    wheelCtx.beginPath();
    wheelCtx.arc(center, center, radius, 0, CONFIG.geometry.fullCircle);
    wheelCtx.fillStyle = '#f4f4f4';
    wheelCtx.fill();

    wheelCtx.fillStyle = '#666';
    wheelCtx.font = '700 24px "Trebuchet MS", sans-serif';
    wheelCtx.textAlign = 'center';
    wheelCtx.textBaseline = 'middle';
    wheelCtx.fillText(UI_TEXT.noNames, center, center);
    return;
  }

  const segment = CONFIG.geometry.fullCircle / state.names.length;

  for (let i = 0; i < state.names.length; i += 1) {
    const start = state.rotation + i * segment;
    const end = start + segment;

    wheelCtx.beginPath();
    wheelCtx.moveTo(center, center);
    wheelCtx.arc(center, center, radius, start, end);
    wheelCtx.closePath();
    wheelCtx.fillStyle = SLICE_COLORS[i % SLICE_COLORS.length];
    wheelCtx.fill();

    wheelCtx.save();
    wheelCtx.translate(center, center);
    wheelCtx.rotate(start + segment / 2);
    wheelCtx.textAlign = 'right';
    wheelCtx.textBaseline = 'middle';
    wheelCtx.fillStyle = '#fff';
    wheelCtx.font = '700 24px "Trebuchet MS", sans-serif';
    wheelCtx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    wheelCtx.shadowBlur = 2;
    wheelCtx.fillText(state.names[i], radius - 24, 0);
    wheelCtx.restore();
  }

  wheelCtx.beginPath();
  wheelCtx.arc(center, center, CONFIG.geometry.centerRadius, 0, CONFIG.geometry.fullCircle);
  wheelCtx.fillStyle = '#fff';
  wheelCtx.fill();
  wheelCtx.lineWidth = 4;
  wheelCtx.strokeStyle = '#222';
  wheelCtx.stroke();
}

function syncAfterNamesChange() {
  state.lastWinnerIndex = null;
  resetResult();
  renderNameChips();
  drawWheel();
}

function addName() {
  if (state.isSpinning || !dom.nameInput) {
    return;
  }

  const value = normalizeName(dom.nameInput.value);
  if (!value) {
    return;
  }

  state.names.push(value);
  dom.nameInput.value = '';
  syncAfterNamesChange();
}

function removeName(index) {
  if (state.isSpinning) {
    return;
  }

  if (index < 0 || index >= state.names.length) {
    return;
  }

  state.names.splice(index, 1);
  syncAfterNamesChange();
}

function spinWheel() {
  if (state.isSpinning || state.names.length === 0) {
    return;
  }

  setSpinningState(true);
  if (dom.resultEl) {
    dom.resultEl.classList.remove('win');
    dom.resultEl.textContent = UI_TEXT.spinning;
  }
  startSpinPhrases();

  const segment = CONFIG.geometry.fullCircle / state.names.length;
  const winnerIndex = randomInt(state.names.length);

  const winnerCenterAtZero = winnerIndex * segment + segment / 2;
  const baseTarget = CONFIG.geometry.pointerAngle - winnerCenterAtZero;
  const spins = CONFIG.spin.minSpins + randomInt(CONFIG.spin.extraSpinVariants);
  const targetRotation = baseTarget + spins * CONFIG.geometry.fullCircle;

  const start = performance.now();
  const startRotation = state.rotation;

  function animate(now) {
    const progress = Math.min((now - start) / CONFIG.timing.spinDurationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    state.rotation = startRotation + (targetRotation - startRotation) * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    state.rotation = normalizeRotation(state.rotation);
    setSpinningState(false);
    stopSpinPhrases();

    dom.wheelWrap?.classList.add('celebrate');
    state.lastWinnerIndex = winnerIndex;
    renderNameChips();
    showWinnerResult(state.names[winnerIndex]);
    dom.resultEl?.classList.add('win');
    showWinnerFullscreen(state.names[winnerIndex]);
    triggerScreenShake();

    setTimeout(() => {
      dom.wheelWrap?.classList.remove('celebrate');
    }, CONFIG.timing.celebrateDurationMs);
  }

  requestAnimationFrame(animate);
}

function bindEvents() {
  dom.addBtn?.addEventListener('click', addName);
  dom.spinBtn?.addEventListener('click', spinWheel);
  dom.canvas?.addEventListener('click', spinWheel);

  dom.nameInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      addName();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space' && document.activeElement !== dom.nameInput) {
      event.preventDefault();
      spinWheel();
    }
  });
}

function init() {
  bindEvents();
  renderNameChips();
  drawWheel();
  renderCurrentDate();
  startBugRain();
  scheduleInterval('dateRefresh', renderCurrentDate, CONFIG.timing.dateRefreshMs);
}

init();
