const nameInput = document.getElementById('nameInput');
const addBtn = document.getElementById('addBtn');
const spinBtn = document.getElementById('spinBtn');
const resultEl = document.getElementById('result');
const namesListEl = document.getElementById('namesList');
const currentDateEl = document.getElementById('currentDate');
const wheelWrap = document.getElementById('wheelWrap');
const fxLayer = document.getElementById('fxLayer');
const winnerBlastEl = document.getElementById('winnerBlast');
const winnerBlastNameEl = document.getElementById('winnerBlastName');

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const center = canvas.width / 2;
const radius = center - 12;

const sliceColors = [
  '#f95d6a', '#ff9f1c', '#ffd166', '#06d6a0',
  '#00a8e8', '#4361ee', '#9d4edd', '#ef476f'
];

let names = ['Evgeniy P', 'Hlib', 'Ihor', 'Iryn', 'Ivan (singer)', 'Ivan', 'Max', 'Niv', 'Oleg', 'Roma', 'Ross', 'Ruslan', 'Serhii (greatest)', 'Serhii', 'Vitalii', 'Yaroslav', 'Yevhenii H', 'Jonathan'];
let rotation = 0;
let isSpinning = false;
let lastWinnerIndex = null;
let winnerBlastTimer = null;

function renderCurrentDate() {
  if (!currentDateEl) {
    return;
  }

  const now = new Date();
  const dateText = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(now);
  currentDateEl.textContent = `Today: ${dateText}`;
}

function normalizeName(raw) {
  return raw.trim().replace(/\s+/g, ' ');
}

function resetResult() {
  resultEl.textContent = 'Winner for today: —';
  resultEl.classList.remove('win');
}

function showWinnerResult(name) {
  resultEl.textContent = '';
  resultEl.append(document.createTextNode('Winner for today: '));

  const winnerName = document.createElement('span');
  winnerName.className = 'winner-name';
  winnerName.textContent = name;
  resultEl.append(winnerName);
}

function showWinnerFullscreen(name) {
  if (!winnerBlastEl || !winnerBlastNameEl) {
    return;
  }

  winnerBlastNameEl.textContent = name;
  winnerBlastEl.classList.remove('show');
  void winnerBlastEl.offsetWidth;
  winnerBlastEl.classList.add('show');

  if (winnerBlastTimer) {
    clearTimeout(winnerBlastTimer);
  }

  winnerBlastTimer = setTimeout(() => {
    winnerBlastEl.classList.remove('show');
  }, 2200);
}

function renderNameChips() {
  namesListEl.innerHTML = '';

  if (!names.length) {
    const empty = document.createElement('span');
    empty.className = 'name-chip';
    empty.textContent = 'List is empty';
    namesListEl.appendChild(empty);
    return;
  }

  names.forEach((name, index) => {
    const chip = document.createElement('span');
    chip.className = 'name-chip';
    if (index === lastWinnerIndex) {
      chip.classList.add('winner-chip');
    }
    chip.textContent = name;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'chip-remove';
    removeBtn.textContent = '×';
    removeBtn.setAttribute('aria-label', `Remove ${name}`);
    removeBtn.addEventListener('click', () => {
      removeName(index);
    });

    chip.appendChild(removeBtn);
    namesListEl.appendChild(chip);
  });
}

function drawWheel() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (!names.length) {
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#f4f4f4';
    ctx.fill();

    ctx.fillStyle = '#666';
    ctx.font = '700 24px "Trebuchet MS", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('No names', center, center);
    return;
  }

  const n = names.length;
  const segment = (Math.PI * 2) / n;

  for (let i = 0; i < n; i += 1) {
    const start = rotation + i * segment;
    const end = start + segment;

    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.closePath();
    ctx.fillStyle = sliceColors[i % sliceColors.length];
    ctx.fill();

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(start + segment / 2);
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.font = '700 24px "Trebuchet MS", sans-serif';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.25)';
    ctx.shadowBlur = 2;
    ctx.fillText(names[i], radius - 24, 0);
    ctx.restore();
  }

  ctx.beginPath();
  ctx.arc(center, center, 32, 0, Math.PI * 2);
  ctx.fillStyle = '#fff';
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#222';
  ctx.stroke();
}

function addName() {
  if (isSpinning) {
    return;
  }

  const value = normalizeName(nameInput.value);
  if (!value) {
    return;
  }

  names.push(value);
  nameInput.value = '';
  lastWinnerIndex = null;
  resetResult();
  renderNameChips();
  drawWheel();
}

function removeName(index) {
  if (isSpinning) {
    return;
  }

  if (index < 0 || index >= names.length) {
    return;
  }

  names.splice(index, 1);
  lastWinnerIndex = null;
  resetResult();
  renderNameChips();
  drawWheel();
}

function spinWheel() {
  if (isSpinning || names.length === 0) {
    return;
  }

  isSpinning = true;
  spinBtn.disabled = true;
  wheelWrap.classList.add('is-spinning');
  resultEl.classList.remove('win');
  resultEl.textContent = 'Spinning...';

  const n = names.length;
  const segment = (Math.PI * 2) / n;
  const winnerIndex = Math.floor(Math.random() * n);

  const pointerAngle = -Math.PI / 2;
  const winnerCenterAtZero = winnerIndex * segment + segment / 2;
  const baseTarget = pointerAngle - winnerCenterAtZero;
  const spins = 6 + Math.floor(Math.random() * 3);
  const targetRotation = baseTarget + spins * Math.PI * 2;

  const start = performance.now();
  const startRotation = rotation;
  const duration = 7000;

  function animate(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);

    rotation = startRotation + (targetRotation - startRotation) * eased;
    drawWheel();

    if (progress < 1) {
      requestAnimationFrame(animate);
      return;
    }

    const full = Math.PI * 2;
    rotation %= full;
    if (rotation < 0) {
      rotation += full;
    }

    isSpinning = false;
    spinBtn.disabled = false;
    wheelWrap.classList.remove('is-spinning');
    wheelWrap.classList.add('celebrate');
    lastWinnerIndex = winnerIndex;
    renderNameChips();
    showWinnerResult(names[winnerIndex]);
    resultEl.classList.add('win');
    showWinnerBurst();
    showWinnerFullscreen(names[winnerIndex]);
    setTimeout(() => wheelWrap.classList.remove('celebrate'), 800);
  }

  requestAnimationFrame(animate);
}

function showWinnerBurst() {
  if (!fxLayer) {
    return;
  }

  const colors = ['#ff6b35', '#06d6a0', '#ffd166', '#00a8e8', '#ef476f', '#4361ee'];
  const originX = window.innerWidth * 0.5;
  const originY = window.innerHeight * 0.16;

  for (let i = 0; i < 36; i += 1) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.style.left = `${originX}px`;
    piece.style.top = `${originY}px`;
    piece.style.background = colors[i % colors.length];
    piece.style.setProperty('--dx', `${-220 + Math.random() * 440}px`);
    piece.style.setProperty('--dy', `${120 + Math.random() * 220}px`);
    piece.style.setProperty('--rot', `${-300 + Math.random() * 600}deg`);
    piece.style.animationDelay = `${Math.random() * 120}ms`;

    fxLayer.appendChild(piece);
    setTimeout(() => piece.remove(), 1300);
  }
}

addBtn.addEventListener('click', addName);
nameInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addName();
  }
});
spinBtn.addEventListener('click', spinWheel);
canvas.addEventListener('click', spinWheel);
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space' && document.activeElement !== nameInput) {
    event.preventDefault();
    spinWheel();
  }
});

renderNameChips();
drawWheel();
renderCurrentDate();
setInterval(renderCurrentDate, 60000);
