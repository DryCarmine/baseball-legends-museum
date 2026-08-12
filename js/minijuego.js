// ────────────────────────────────────────────────
// HOME RUN DERBY - Baseball Legends Museum
// Mecánica: Timing click. Pulsa cuando el anillo 
// verde toca el núcleo central.
// ────────────────────────────────────────────────

const TROPHIES = [
    { id: 'first_blood',  name: 'Primer Contacto', icon: '⚾', desc: 'Tu primer hit', check: (s) => s.totalHits >= 1 },
    { id: 'hr_bronze',    name: 'Bate de Bronce',  icon: '🥉', desc: '1 Home Run',   check: (s) => s.totalHRs >= 1 },
    { id: 'hr_silver',    name: 'Bate de Plata',   icon: '🥈', desc: '3 HRs totales', check: (s) => s.totalHRs >= 3 },
    { id: 'hr_gold',      name: 'Bate de Oro',     icon: '🥇', desc: '5 HRs totales', check: (s) => s.totalHRs >= 5 },
    { id: 'hr_diamond',   name: 'Bola Diamante',   icon: '💎', desc: '10 HRs totales',check: (s) => s.totalHRs >= 10 },
    { id: 'homerun_hero', name: 'Rey del Derby',   icon: '👑', desc: '3 HRs en 1 juego', check: (s) => s.sessionMaxHRs >= 3 },
    { id: 'score_king',   name: 'Rey de Bases',    icon: '👑', desc: '500 pts totales', check: (s) => s.totalScore >= 500 },
    { id: 'legendary',    name: 'Legendario',      icon: '🏆', desc: '25 HRs totales', check: (s) => s.totalHRs >= 25 },
];

const STATE = {
    strikes: 0,
    score: 0,
    sessionHRs: 0,
    sessionMaxHRs: 0,
    totalHits: 0,
    // Cargar desde localStorage
    totalHRs: 0,
    totalScore: 0,
    unlocked: []
};

// ── Inicialización ──
function init() {
    loadProgress();
    renderTrophies();
    updateUI();
    startPitch();
}

// ── Carga / Guardado ──
function loadProgress() {
    try {
        const saved = localStorage.getItem('blm_derby_save');
        if (saved) {
            const data = JSON.parse(saved);
            STATE.totalHRs = data.totalHRs || 0;
            STATE.totalScore = data.totalScore || 0;
            STATE.totalHits = data.totalHits || 0;
            STATE.unlocked = data.unlocked || [];
        }
    } catch (e) { console.error('Error cargando progreso:', e); }
}

function saveProgress() {
    const payload = {
        totalHRs: STATE.totalHRs,
        totalScore: STATE.totalScore,
        totalHits: STATE.totalHits,
        unlocked: STATE.unlocked
    };
    localStorage.setItem('blm_derby_save', JSON.stringify(payload));
}

// ── Lógica del Pitch ──
let pulseStart = 0;
const PULSE_DURATION = 1800; // ms

function startPitch() {
    const pulse = document.getElementById('timingPulse');
    pulse.style.animation = 'none';
    pulse.offsetHeight; // force reflow
    pulse.style.animation = `pulseShrink ${PULSE_DURATION}ms ease-in-out infinite`;
    pulseStart = performance.now();
}

// ── Swing! ──
function handleSwing(e) {
    e.preventDefault();
    e.stopPropagation();

    const btn = document.getElementById('btnSwing');
    if (btn.disabled) return;

    const elapsed = performance.now() - pulseStart;
    // Normalizar al ciclo actual (la animación es infinita, pero medimos desde el último startPitch)
    // El punto óptimo es al 50% del ciclo (cuando el anillo es más pequeño y verde)
    const cycle = elapsed % PULSE_DURATION;
    const accuracy = 1 - Math.abs((cycle / PULSE_DURATION) - 0.5) * 2; 
    // accuracy: 1 = perfecto, 0 = peor

    evaluateSwing(accuracy);
}

// ── Evaluación ──
function evaluateSwing(accuracy) {
    const btn = document.getElementById('btnSwing');
    btn.disabled = true;

    let result = {};
    // accuracy > 0.85 = perfecto
    if (accuracy > 0.90) {
        result = { type: 'HOME RUN!', bases: 4, points: 100, color: 'result-home-run', icon: '🔥' };
        STATE.sessionHRs++;
        STATE.totalHRs++;
        spawnConfetti();
    } else if (accuracy > 0.75) {
        result = { type: 'TRIPLE!', bases: 3, points: 60, color: 'result-triple', icon: '⚡' };
    } else if (accuracy > 0.60) {
        result = { type: 'DOUBLE!', bases: 2, points: 40, color: 'result-double', icon: '🏃' };
    } else if (accuracy > 0.40) {
        result = { type: 'SINGLE!', bases: 1, points: 20, color: 'result-single', icon: '👆' };
    } else if (accuracy > 0.20) {
        result = { type: 'FOUL!', bases: 0, points: 0, color: 'result-foul', icon: '🌀' };
    } else {
        result = { type: 'STRIKE!', bases: 0, points: 0, color: 'result-strike', icon: '❌' };
        STATE.strikes++;
    }

    STATE.score += result.points;
    if (result.bases > 0) {
        STATE.totalHits++;
        STATE.totalScore += result.points;
    }
    if (STATE.sessionHRs > STATE.sessionMaxHRs) {
        STATE.sessionMaxHRs = STATE.sessionHRs;
    }

    animateResult(result);
    updateUI();
    checkTrophies();

    // Si es strike, pausa; si es hit, mostrar animación de vuelo y reiniciar
    if (result.type === 'STRIKE!') {
        setTimeout(() => {
            if (STATE.strikes >= 3) {
                gameOver();
            } else {
                btn.disabled = false;
                startPitch();
            }
        }, 1200);
    } else {
        animateFlyingBall(result.bases);
        setTimeout(() => {
            btn.disabled = false;
            startPitch();
        }, 1500);
    }
}

// ── Animaciones ──
function animateResult(result) {
    const flash = document.getElementById('resultFlash');
    flash.textContent = result.icon + ' ' + result.type;
    flash.className = `result-flash ${result.color} show`;
    
    setTimeout(() => {
        flash.classList.remove('show');
    }, 800);
}

function animateFlyingBall(bases) {
    if (bases === 0) return;
    const ball = document.getElementById('flyingBall');
    const stage = document.getElementById('gameStage');
    const rect = stage.getBoundingClientRect();
    
    ball.style.display = 'block';
    ball.style.left = '50%';
    ball.style.top = '60%';
    ball.style.transform = 'translate(-50%, -50%)';
    ball.style.opacity = '1';
    ball.style.transition = 'none';

    // Forzar reflow
    ball.offsetHeight;

    const distance = bases * 25; // px de vuelo
    const angle = -45 - (Math.random() * 30); // -45 a -75 grados
    const radians = angle * Math.PI / 180;
    const dx = Math.cos(radians) * distance * 3;
    const dy = Math.sin(radians) * distance * 3;

    ball.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    ball.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.5)`;
    ball.style.opacity = '0';

    setTimeout(() => {
        ball.style.display = 'none';
        ball.style.transition = 'none';
    }, 800);
}

function spawnConfetti() {
    const stage = document.getElementById('gameStage');
    const colors = ['#d4af37', '#fff', '#0f0', '#4da6ff', '#ff4444'];
    for (let i = 0; i < 30; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.background = colors[Math.floor(Math.random() * colors.length)];
        piece.style.left = '50%';
        piece.style.top = '50%';
        piece.style.position = 'absolute';
        
        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 150;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist;
        
        piece.style.transition = 'all 0.8s ease-out';
        piece.style.transform = 'translate(-50%, -50%)';
        
        stage.appendChild(piece);
        
        requestAnimationFrame(() => {
            piece.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${Math.random()*360}deg)`;
            piece.style.opacity = '0';
        });
        
        setTimeout(() => piece.remove(), 800);
    }
}

// ── UI ──
function updateUI() {
    document.getElementById('strikes').textContent = `${STATE.strikes} / 3`;
    document.getElementById('score').textContent = STATE.score;
    document.getElementById('homeRuns').textContent = STATE.sessionHRs;
    document.getElementById('innings').textContent = `Strikes: ${STATE.strikes}`;
}

// ── Trofeos ──
function checkTrophies() {
    let newUnlock = false;
    TROPHIES.forEach(trophy => {
        if (STATE.unlocked.includes(trophy.id)) return;
        if (trophy.check(STATE)) {
            STATE.unlocked.push(trophy.id);
            newUnlock = true;
        }
    });
    if (newUnlock) {
        saveProgress();
        renderTrophies();
    }
}

function renderTrophies() {
    const grid = document.getElementById('trophyGrid');
    grid.innerHTML = '';
    
    TROPHIES.forEach(trophy => {
        const isUnlocked = STATE.unlocked.includes(trophy.id);
        const div = document.createElement('div');
        div.className = `trophy-item ${isUnlocked ? 'unlocked' : ''}`;
        div.innerHTML = `
            <div class="trophy-icon">${isUnlocked ? trophy.icon : '🔒'}</div>
            <div class="trophy-name">${trophy.name}</div>
        `;
        div.title = trophy.desc;
        grid.appendChild(div);
    });
}

// ── Game Over ──
function gameOver() {
    document.getElementById('finalScore').textContent = STATE.score;
    document.getElementById('finalHRs').textContent = STATE.sessionHRs;
    document.getElementById('gameOver').classList.add('show');
    saveProgress();
}

function restartGame() {
    STATE.strikes = 0;
    STATE.score = 0;
    STATE.sessionHRs = 0;
    STATE.sessionMaxHRs = 0;
    document.getElementById('gameOver').classList.remove('show');
    document.getElementById('btnSwing').disabled = false;
    updateUI();
    startPitch();
}

// ── Arrancar ──
init();