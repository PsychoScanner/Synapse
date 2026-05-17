// ==================== CONFIGURATION ====================
const CONFIG = {
    STORAGE_KEY: 'mind_observer_v4',
    CANVAS_DOT_COUNT: 40,
    CANVAS_DOT_SIZE: 1.5,
    CANVAS_CONNECTION_DISTANCE: 130,
    FORENSICS_DECEPTION_MIN: 65,
    FORENSICS_DECEPTION_MAX: 98,
    FORENSICS_POINTS_BASE: 50,
    MENTOR_POINTS_BASE: 75,
    MIN_PASSWORD_LENGTH: 6,
};

// ==================== STATE ====================
let currentAgentEmail = null;
let canvasAnimationId = null;
let dots = [];

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
    initializeCanvas();
    setupEventListeners();
    drawLattice();
});

// ==================== CANVAS ANIMATION ====================
function initializeCanvas() {
    const canvas = document.getElementById('latticeCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    dots = [];
    for (let i = 0; i < CONFIG.CANVAS_DOT_COUNT; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
        });
    }
    
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

function drawLattice() {
    const canvas = document.getElementById('latticeCanvas');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 255, 204, 0.25)";
    ctx.strokeStyle = "rgba(0, 255, 204, 0.04)";
    
    // Draw dots
    dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, CONFIG.CANVAS_DOT_SIZE, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw connections
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const distance = Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y);
            if (distance < CONFIG.CANVAS_CONNECTION_DISTANCE) {
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }
    
    requestAnimationFrame(drawLattice);
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('[data-nav-register]').forEach(el => {
        el.addEventListener('click', () => showPage('page-register'));
    });
    document.querySelectorAll('[data-nav-login]').forEach(el => {
        el.addEventListener('click', () => showPage('page-login'));
    });
    document.querySelectorAll('[data-nav-dashboard]').forEach(el => {
        el.addEventListener('click', () => showPage('page-dashboard'));
    });
    
    // Authentication
    const loginBtn = document.querySelector('[data-action="login"]');
    const registerBtn = document.querySelector('[data-action="register"]');
    const logoutBtn = document.querySelector('[data-action="logout"]');
    
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    if (registerBtn) registerBtn.addEventListener('click', handleRegistration);
    if (logoutBtn) logoutBtn.addEventListener('click', logoutAgent);
    
    // Dashboard
    const forensicsBtn = document.querySelector('[data-action="show-forensics"]');
    const mentorBtn = document.querySelector('[data-action="show-mentor"]');
    
    if (forensicsBtn) forensicsBtn.addEventListener('click', () => showPage('page-forensics'));
    if (mentorBtn) mentorBtn.addEventListener('click', () => showPage('page-mentor'));
    
    // Forensics
    const dataTypeSelect = document.getElementById('data-type');
    const analyzeBtn = document.querySelector('[data-action="analyze"]');
    const clearForensicsBtn = document.querySelector('[data-action="clear-forensics"]');
    
    if (dataTypeSelect) dataTypeSelect.addEventListener('change', toggleInputFields);
    if (analyzeBtn) analyzeBtn.addEventListener('click', analyzeDigitalData);
    if (clearForensicsBtn) clearForensicsBtn.addEventListener('click', resetForensics);
    
    // Mentor
    const submitMentorBtn = document.querySelector('[data-action="submit-mentor"]');
    const retryMentorBtn = document.querySelector('[data-action="retry-mentor"]');
    
    if (submitMentorBtn) submitMentorBtn.addEventListener('click', submitToMentor);
    if (retryMentorBtn) retryMentorBtn.addEventListener('click', resetMentor);
    
    // Keyboard shortcuts
    document.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.id === 'login-pass') handleLogin();
    });
}

// ==================== PAGE NAVIGATION ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');
}

// ==================== AUTHENTICATION ====================
function handleRegistration() {
    const name = document.getElementById('reg-name')?.value.trim();
    const email = document.getElementById('reg-email')?.value.toLowerCase().trim();
    const pass = document.getElementById('reg-pass')?.value;
    const errorElement = document.getElementById('reg-error');
    
    if (!name || !email || !email.includes('@') || !pass || pass.length < CONFIG.MIN_PASSWORD_LENGTH) {
        if (errorElement) errorElement.classList.remove('hidden');
        return;
    }
    
    if (errorElement) errorElement.classList.add('hidden');
    
    let db = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || {};
    
    if (db[email]) {
        alert("⚠️ Agent already exists. Choose a different email.");
        return;
    }
    
    db[email] = { name: sanitizeInput(name), pass: pass, score: 0 };
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(db));
    
    // Clear form
    document.getElementById('login-email').value = email;
    document.getElementById('reg-name').value = '';
    document.getElementById('reg-email').value = '';
    document.getElementById('reg-pass').value = '';
    
    showPage('page-login');
}

function handleLogin() {
    const email = document.getElementById('login-email')?.value.toLowerCase().trim();
    const pass = document.getElementById('login-pass')?.value;
    const errorElement = document.getElementById('login-error');
    
    if (!email || !pass) {
        if (errorElement) errorElement.classList.remove('hidden');
        return;
    }
    
    let db = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)) || {};
    
    if (db[email] && db[email].pass === pass) {
        if (errorElement) errorElement.classList.add('hidden');
        currentAgentEmail = email;
        updateDashboardData();
        showPage('page-dashboard');
    } else {
        if (errorElement) errorElement.classList.remove('hidden');
    }
}

function logoutAgent() {
    currentAgentEmail = null;
    document.getElementById('login-email').value = '';
    document.getElementById('login-pass').value = '';
    showPage('page-login');
}

function updateDashboardData() {
    const db = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
    if (!db || !db[currentAgentEmail]) return;
    
    const agent = db[currentAgentEmail];
    const agentNameEl = document.getElementById('agent-name');
    const scoreValEl = document.getElementById('score-val');
    
    if (agentNameEl) agentNameEl.innerText = sanitizeInput(agent.name).toUpperCase();
    if (scoreValEl) scoreValEl.innerText = "SCORE: " + agent.score;
}

// ==================== DIGITAL FORENSICS ====================
function toggleInputFields() {
    const dataType = document.getElementById('data-type')?.value;
    const textArea = document.getElementById('text-input-area');
    const imageArea = document.getElementById('image-input-area');
    
    if (dataType === 'image') {
        if (textArea) textArea.classList.add('hidden');
        if (imageArea) imageArea.classList.remove('hidden');
    } else {
        if (textArea) textArea.classList.remove('hidden');
        if (imageArea) imageArea.classList.add('hidden');
    }
}

function analyzeDigitalData() {
    const textInput = document.getElementById('forensic-text')?.value.trim();
    
    if (!textInput) {
        alert("❌ Please provide evidence to analyze.");
        return;
    }
    
    const btn = document.querySelector('[data-action="analyze"]');
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Scanning...";
    }
    
    // Simulate scanning delay
    setTimeout(() => {
        const deceptionRate = Math.floor(Math.random() * (CONFIG.FORENSICS_DECEPTION_MAX - CONFIG.FORENSICS_DECEPTION_MIN + 1)) + CONFIG.FORENSICS_DECEPTION_MIN;
        const points = CONFIG.FORENSICS_POINTS_BASE + Math.floor(deceptionRate / 10);
        
        displayForensicsResult(deceptionRate, points, textInput);
        updateAgentScore(points);
        
        if (btn) btn.classList.add('hidden');
    }, 1500);
}

function displayForensicsResult(deceptionRate, points, evidence) {
    const resultBox = document.getElementById('forensic-result-box');
    const percentageText = document.getElementById('percentage-text');
    const progressBar = document.getElementById('progress-bar-fill');
    const reportText = document.getElementById('forensic-report');
    const pointsText = document.getElementById('forensic-points');
    
    if (percentageText) percentageText.innerText = deceptionRate + '%';
    if (progressBar) progressBar.style.width = deceptionRate + '%';
    if (pointsText) pointsText.innerText = '+' + points + ' PTS';
    
    const report = generateForensicsReport(deceptionRate, evidence);
    if (reportText) reportText.innerText = report;
    
    if (resultBox) resultBox.classList.remove('hidden');
}

function generateForensicsReport(deceptionRate, evidence) {
    const deceptionLevel = deceptionRate > 85 ? 'CRITICAL' : deceptionRate > 70 ? 'HIGH' : deceptionRate > 55 ? 'MODERATE' : 'LOW';
    const wordCount = evidence.split(/\s+/).length;
    const emotionIndicators = evidence.match(/\b(love|hate|angry|happy|sad|scared)\b/gi) || [];
    
    return `FORENSICS ANALYSIS REPORT\n\nText Length: ${wordCount} words\nDeception Level: ${deceptionLevel}\nEmotional Markers: ${emotionIndicators.length} detected\n\nThe subject demonstrates ${deceptionLevel} probability of deception based on linguistic patterns, emotional indicators, and semantic analysis. Recommend further investigation.`;
}

function resetForensics() {
    const textInput = document.getElementById('forensic-text');
    const resultBox = document.getElementById('forensic-result-box');
    const analyzeBtn = document.querySelector('[data-action="analyze"]');
    const progressBar = document.getElementById('progress-bar-fill');
    const percentageText = document.getElementById('percentage-text');
    
    if (textInput) textInput.value = '';
    if (resultBox) resultBox.classList.add('hidden');
    if (analyzeBtn) {
        analyzeBtn.classList.remove('hidden');
        analyzeBtn.disabled = false;
        analyzeBtn.innerText = 'Initiate Scan';
    }
    if (progressBar) progressBar.style.width = '0%';
    if (percentageText) percentageText.innerText = '0%';
}

// ==================== RUTHLESS MENTOR ====================
function submitToMentor() {
    const input = document.getElementById('mentor-input')?.value.trim();
    
    if (!input) {
        alert("❌ You must provide an analysis before submitting.");
        return;
    }
    
    const btn = document.querySelector('[data-action="submit-mentor"]');
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Evaluating...";
    }
    
    setTimeout(() => {
        const verdict = generateMentorVerdict(input);
        const points = CONFIG.MENTOR_POINTS_BASE + Math.floor(Math.random() * 50);
        
        displayMentorResult(verdict, points);
        updateAgentScore(points);
        
        if (btn) btn.classList.add('hidden');
    }, 2000);
}

function generateMentorVerdict(analysis) {
    const verdicts = [
        "Your analysis is PEDESTRIAN. You've barely scratched the surface of psychological dynamics. The subject exhibits clear patterns of displacement and rationalization, yet you failed to identify the core defense mechanism at play. INADEQUATE.",
        "MARGINALLY ACCEPTABLE. You identified some valid patterns, but your reasoning lacks depth. Psychology isn't surface-level observation—it requires understanding unconscious motivations. Your conclusion is 30% correct, 70% guesswork.",
        "COMPETENT WORK. You grasped the primary psychological framework and demonstrated solid analytical thinking. However, you missed the secondary trauma responses and cultural conditioning factors. Room for improvement.",
        "IMPRESSIVE. Your analysis demonstrates nuanced understanding of behavioral psychology. You identified both conscious and unconscious patterns with precision. The only weakness is your failure to consider neurobiological factors.",
        "EXEMPLARY. This is the kind of analysis I expect. You demonstrated mastery of psychological theory while maintaining critical skepticism. Your reasoning was airtight and your conclusions were supported by evidence. Outstanding."
    ];
    
    const qualityScore = Math.random();
    let verdictIndex = Math.floor(qualityScore * verdicts.length);
    if (verdictIndex >= verdicts.length) verdictIndex = verdicts.length - 1;
    
    return verdicts[verdictIndex];
}

function displayMentorResult(verdict, points) {
    const resultBox = document.getElementById('mentor-result-box');
    const verdictText = document.getElementById('mentor-verdict-text');
    const pointsText = document.getElementById('mentor-points');
    
    if (verdictText) verdictText.innerText = verdict;
    if (pointsText) pointsText.innerText = '+' + points + ' PTS';
    
    if (resultBox) resultBox.classList.remove('hidden');
}

function resetMentor() {
    const input = document.getElementById('mentor-input');
    const resultBox = document.getElementById('mentor-result-box');
    const submitBtn = document.querySelector('[data-action="submit-mentor"]');
    
    if (input) input.value = '';
    if (resultBox) resultBox.classList.add('hidden');
    if (submitBtn) {
        submitBtn.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerText = 'Submit for Judgment';
    }
}

// ==================== SCORING ====================
function updateAgentScore(points) {
    if (!currentAgentEmail) return;
    
    const db = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY));
    if (!db || !db[currentAgentEmail]) return;
    
    db[currentAgentEmail].score += points;
    localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(db));
    
    updateDashboardData();
}

// ==================== UTILITY FUNCTIONS ====================
function sanitizeInput(input) {
    if (!input) return '';
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
}
