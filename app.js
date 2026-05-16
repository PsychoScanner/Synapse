/**
 * MindObserver Pro - Application Logic
 * ===================================
 * Secure version with input validation, password hashing, and error handling
 */

let currentAgentEmail = null;

// ===== 1. SECURITY FUNCTIONS =====

/**
 * تنظيف المدخلات من XSS attacks
 * @param {string} input - المدخل المراد تنظيفه
 * @returns {string} - المدخل المنظف
 */
function sanitizeInput(input) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return input.replace(/[&<>"']/g, m => map[m]);
}

/**
 * التحقق من صحة البريد الإلكتروني
 * @param {string} email - البريد المراد التحقق منه
 * @returns {boolean} - صحيح أو خاطئ
 */
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) && email.length <= 254;
}

/**
 * التحقق من قوة كلمة المرور
 * @param {string} password - كلمة المرور
 * @returns {boolean} - قوية أم لا
 */
function validatePassword(password) {
    return password.length >= 6;
}

/**
 * تجزئة بسيطة للكلمات المرورية (للتعليم فقط)
 * للإنتاج: استخدم bcrypt
 * @param {string} password - كلمة المرور
 * @returns {string} - الكلمة المجزأة
 */
function simpleHash(password) {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
        const char = password.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
}

/**
 * عرض رسالة خطأ
 * @param {string} elementId - معرف العنصر
 * @param {string} message - الرسالة
 */
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.classList.remove('hidden');
    }
}

/**
 * إخفاء رسالة الخطأ
 * @param {string} elementId - معرف العنصر
 */
function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.classList.add('hidden');
    }
}

// ===== 2. CANVAS BACKGROUND =====

const canvas = document.getElementById('latticeCanvas');
const ctx = canvas.getContext('2d');
let dots = [];

/**
 * تهيئة Canvas بحجم النافذة
 */
function initCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    dots = [];
    for (let i = 0; i < 40; i++) {
        dots.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }
}

/**
 * رسم شبكة الخلفية المتحركة
 */
function drawLattice() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 255, 204, 0.25)";
    ctx.strokeStyle = "rgba(0, 255, 204, 0.04)";
    
    dots.forEach(dot => {
        dot.x += dot.vx;
        dot.y += dot.vy;
        
        if (dot.x < 0 || dot.x > canvas.width) dot.vx *= -1;
        if (dot.y < 0 || dot.y > canvas.height) dot.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
    });
    
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            if (Math.hypot(dots[i].x - dots[j].x, dots[i].y - dots[j].y) < 130) {
                ctx.beginPath();
                ctx.moveTo(dots[i].x, dots[i].y);
                ctx.lineTo(dots[j].x, dots[j].y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(drawLattice);
}

window.addEventListener('resize', initCanvas);
initCanvas();
drawLattice();

// ===== 3. NAVIGATION FUNCTIONS =====

/**
 * عرض صفحة معينة
 * @param {string} id - معرف الصفحة
 */
function showPage(id) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(id).classList.add('active');
}

// ===== 4. AUTHENTICATION FUNCTIONS =====

/**
 * معالجة التسجيل الجديد
 */
function handleRegistration() {
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.toLowerCase().trim();
    const pass = document.getElementById('reg-pass').value;
    
    // التحقق من البيانات
    if (!name) {
        showError('reg-error', '❌ الاسم مطلوب');
        return;
    }
    
    if (!isValidEmail(email)) {
        showError('reg-error', '❌ البريد غير صحيح');
        return;
    }
    
    if (!validatePassword(pass)) {
        showError('reg-error', '❌ كلمة المرور: 6 أحرف على الأقل');
        return;
    }
    
    // التحقق من وجود الحساب
    let db = JSON.parse(localStorage.getItem('mind_observer_v4')) || {};
    if (db[email]) {
        showError('reg-error', '❌ الحساب موجود بالفعل');
        return;
    }
    
    // حفظ الحساب
    const hashedPassword = simpleHash(pass);
    db[email] = {
        name: sanitizeInput(name),
        pass: hashedPassword,
        score: 0,
        createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('mind_observer_v4', JSON.stringify(db));
    hideError('reg-error');
    
    // إعادة توجيه للدخول
    document.getElementById('login-email').value = email;
    document.getElementById('login-pass').value = '';
    showPage('page-login');
}

/**
 * معالجة الدخول
 */
function handleLogin() {
    const email = document.getElementById('login-email').value.toLowerCase().trim();
    const pass = document.getElementById('login-pass').value;
    
    if (!email || !pass) {
        showError('login-error', '❌ أدخل البريد وكلمة المرور');
        return;
    }
    
    let db = JSON.parse(localStorage.getItem('mind_observer_v4')) || {};
    
    if (!db[email]) {
        showError('login-error', '❌ الحساب غير موجود');
        return;
    }
    
    const hashedPassword = simpleHash(pass);
    if (db[email].pass !== hashedPassword) {
        showError('login-error', '❌ كلمة المرور خاطئة');
        return;
    }
    
    hideError('login-error');
    currentAgentEmail = email;
    updateDashboardData();
    showPage('page-dashboard');
}

/**
 * تحديث بيانات لوحة التحكم
 */
function updateDashboardData() {
    let db = JSON.parse(localStorage.getItem('mind_observer_v4'));
    const agent = db[currentAgentEmail];
    
    document.getElementById('agent-name').innerText = agent.name.toUpperCase();
    document.getElementById('score-val').innerText = "النقاط: " + agent.score;
}

/**
 * تسجيل الخروج
 */
function logoutAgent() {
    currentAgentEmail = null;
    document.getElementById('login-email').value = '';
    document.getElementById('login-pass').value = '';
    showPage('page-login');
}

// ===== 5. DIGITAL FORENSICS FUNCTIONS =====

/**
 * إظهار/إخفاء حقول الإدخال بناءً على نوع البيانات
 */
function toggleInputFields() {
    const dataType = document.getElementById('data-type').value;
    
    if (dataType === 'image') {
        document.getElementById('text-input-area').classList.add('hidden');
        document.getElementById('image-input-area').classList.remove('hidden');
    } else {
        document.getElementById('text-input-area').classList.remove('hidden');
        document.getElementById('image-input-area').classList.add('hidden');
    }
}

/**
 * إعادة تعيين نموذج الطب الشرعي
 */
function resetForensics() {
    document.getElementById('forensic-text').value = '';
    document.getElementById('forensic-result-box').classList.add('hidden');
    document.getElementById('analyze-data-btn').classList.remove('hidden');
    document.getElementById('progress-bar-fill').style.width = '0%';
    document.getElementById('percentage-text').innerText = '0%';
}

/**
 * تحليل البيانات الرقمية
 */
function analyzeDigitalData() {
    const dataType = document.getElementById('data-type').value;
    const data = document.getElementById('forensic-text').value.trim();
    
    if (!data) {
        showError('login-error', '❌ أدرج البيانات للتحليل');
        return;
    }
    
    const btn = document.getElementById('analyze-data-btn');
    btn.disabled = true;
    btn.innerText = 'جاري الفحص...';
    
    setTimeout(() => {
        btn.classList.add('hidden');
        
        // محاكاة النتيجة (عشوائية)
        let percent = Math.floor(Math.random() * 34) + 65;
        let points = Math.floor(percent / 10);
        
        document.getElementById('percentage-text').innerText = percent + '%';
        document.getElementById('progress-bar-fill').style.width = percent + '%';
        
        // رسالة التحليل
        const reports = {
            chat: `تم تحليل الرسالة: ${data.length} حرف. مستوى الثقة: ${percent}%`,
            email: `تم فحص البريد الإلكتروني. درجة المصداقية: ${percent}%`,
            image: `تم تحليل الصورة. معدل التطابق: ${percent}%`
        };
        
        document.getElementById('forensic-report').innerText = reports[dataType] || 'تم التحليل بنجاح';
        document.getElementById('forensic-points').innerText = '+' + points + ' نقاط';
        
        // تحديث النقاط
        updateScore(points);
        
        document.getElementById('forensic-result-box').classList.remove('hidden');
    }, 2000);
}

// ===== 6. MENTOR FUNCTIONS =====

/**
 * إعادة تعيين نموذج المستشار
 */
function resetMentor() {
    document.getElementById('mentor-input').value = '';
    document.getElementById('mentor-result-box').classList.add('hidden');
    document.getElementById('mentor-btn').classList.remove('hidden');
}

/**
 * إرسال التحليل للمستشار
 */
function submitToMentor() {
    const input = document.getElementById('mentor-input').value.trim();
    
    if (!input) {
        showError('login-error', '❌ أدرج التحليل');
        return;
    }
    
    const btn = document.getElementById('mentor-btn');
    btn.disabled = true;
    btn.innerText = 'جاري التقييم...';
    
    setTimeout(() => {
        btn.classList.add('hidden');
        
        let points = Math.floor(Math.random() * 20) + 5;
        
        const verdicts = [
            'تحليل ضعيف. تحتاج لممارسة أكثر.',
            'مقبول، لكن هناك نقاط للتحسين.',
            'جيد، لديك فهم أساسي.',
            'ممتاز! تحليل عميق وحسن التنظيم.',
            'متوسط. ركز على التفاصيل الأساسية.'
        ];
        
        const verdict = verdicts[Math.floor(Math.random() * verdicts.length)];
        
        document.getElementById('mentor-verdict-text').innerText = verdict;
        document.getElementById('mentor-points').innerText = '+' + points + ' نقاط';
        
        updateScore(points);
        
        document.getElementById('mentor-result-box').classList.remove('hidden');
    }, 1500);
}

// ===== 7. SCORING SYSTEM =====

/**
 * تحديث النقاط للعميل الحالي
 * @param {number} points - النقاط المراد إضافتها
 */
function updateScore(points) {
    if (!currentAgentEmail) return;
    
    let db = JSON.parse(localStorage.getItem('mind_observer_v4')) || {};
    db[currentAgentEmail].score += points;
    localStorage.setItem('mind_observer_v4', JSON.stringify(db));
    
    document.getElementById('score-val').innerText = "النقاط: " + db[currentAgentEmail].score;
}

// ===== 8. EVENT LISTENERS =====

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ MindObserver Pro - تم تحميل التطبيق بنجاح');
});
