<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>MindObserver Pro - Ruthless Edition</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;900&family=Share+Tech+Mono&family=Inter:wght@400;700;900&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Inter', 'Orbitron', sans-serif;
            background-color: #030303;
            height: 100vh;
            overflow: hidden;
        }
        .tech-mono { font-family: 'Share Tech Mono', 'Orbitron', monospace; }
        .neon-glow-cyan { box-shadow: 0 0 20px rgba(0, 255, 204, 0.2); border: 1px solid rgba(0, 255, 204, 0.4); }
        .neon-glow-red { box-shadow: 0 0 20px rgba(255, 51, 102, 0.2); border: 1px solid rgba(255, 51, 102, 0.4); }
        .neon-text-green { color: #deff9a; text-shadow: 0 0 10px rgba(222, 255, 154, 0.6); }
        .neon-text-red { color: #ff3366; text-shadow: 0 0 10px rgba(255, 51, 102, 0.6); }
        .page { display: none; height: 100%; flex-direction: column; }
        .page.active { display: flex; }
        
        input, textarea, select {
            background: rgba(15, 15, 15, 0.9) !important;
            border: 1px solid #333 !important;
            color: #deff9a !important;
        }
        input:focus, textarea:focus, select:focus {
            border-color: #00ffcc !important; outline: none;
            box-shadow: 0 0 10px rgba(0, 255, 204, 0.5) !important;
        }
        canvas { position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
        option { background-color: #111; color: #00ffcc; }
        
        .progress-bar-container { width: 100%; background-color: #1a1a1a; border-radius: 10px; overflow: hidden; height: 8px; margin-top: 8px; }
        .progress-bar { height: 100%; width: 0%; background: linear-gradient(90deg, #00ffcc, #ff3366); transition: width 1.5s ease-out; }
    </style>
</head>
<body class="relative flex items-center justify-center p-0 md:p-4 selection:bg-[#00ffcc] selection:text-black">

    <canvas id="latticeCanvas"></canvas>

    <div class="z-10 w-full max-w-md h-full md:h-[95vh] md:rounded-[40px] bg-black/90 backdrop-blur-md border-0 md:border-4 border-zinc-900 p-6 flex flex-col justify-between relative overflow-hidden shadow-2xl">
        
        <div id="page-login" class="page active justify-center transition-all duration-300">
            <div class="text-center mb-8">
                <div class="text-[10px] uppercase tracking-[0.4em] text-cyan-400 tech-mono mb-2 font-bold">FORENSICS ENGINE</div>
                <h1 class="neon-text-green text-4xl font-black tracking-tight font-['Orbitron']">MIND<br>OBSERVER</h1>
                <p class="text-zinc-500 text-xs mt-3 font-bold uppercase tracking-widest">Behavioral & Digital Analysis</p>
            </div>
            <div class="space-y-4">
                <div class="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800/80 shadow-inner">
                    <label class="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block mb-1">Agent Token (Email)</label>
                    <input type="email" id="login-email" class="w-full p-3 rounded-xl text-sm transition-all font-mono" placeholder="agent@matrix.com">
                    
                    <label class="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mt-4 block mb-1">Encryption Key</label>
                    <input type="password" id="login-pass" class="w-full p-3 rounded-xl text-sm transition-all font-mono" placeholder="••••••••">
                </div>
                <p id="login-error" class="text-red-400 text-xs text-center hidden font-bold animate-pulse">❌ Authentication Failed: Data mismatch.</p>
                <button onclick="handleLogin()" class="w-full bg-[#00ffcc] text-black font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-white active:scale-95 transition-all shadow-[0_0_20px_rgba(0,255,204,0.3)]">
                    Enter The Matrix
                </button>
            </div>
            <div class="mt-8 text-center text-xs text-zinc-500 uppercase tracking-wider">
                No Clearance? <span onclick="showPage('page-register')" class="text-[#deff9a] cursor-pointer font-bold underline">Create Profile</span>
            </div>
        </div>

        <div id="page-register" class="page justify-center transition-all duration-300">
            <div class="text-center mb-6">
                <h1 class="neon-text-green text-3xl font-black font-['Orbitron']">NEW AGENT</h1>
            </div>
            <div class="space-y-4">
                <div class="bg-zinc-950/80 p-5 rounded-2xl border border-zinc-800">
                    <label class="text-[10px] uppercase tracking-widest text-zinc-400 font-bold block mb-1">Codename</label>
                    <input type="text" id="reg-name" class="w-full p-3 rounded-xl text-sm" placeholder="e.g. Profiler-X">
                    
                    <label class="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mt-4 block mb-1">Authorized Email</label>
                    <input type="email" id="reg-email" class="w-full p-3 rounded-xl text-sm font-mono" placeholder="name@mail.com">
                    
                    <label class="text-[10px] uppercase tracking-widest text-zinc-400 font-bold mt-4 block mb-1">Security Key (Min 6 chars)</label>
                    <input type="password" id="reg-pass" class="w-full p-3 rounded-xl text-sm font-mono" placeholder="••••••••">
                </div>
                <p id="reg-error" class="text-red-400 text-xs text-center hidden font-bold">❌ Incomplete fields.</p>
                <button onclick="handleRegistration()" class="w-full bg-white text-black font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-[#deff9a] active:scale-95 transition-all">
                    Generate Profile
                </button>
            </div>
            <div class="mt-6 text-center text-xs text-zinc-500 uppercase tracking-wider">
                <span onclick="showPage('page-login')" class="text-[#00ffcc] cursor-pointer font-bold underline">← Return to Login</span>
            </div>
        </div>

        <div id="page-dashboard" class="page transition-all duration-300">
            <div class="flex justify-between items-center mt-2 border-b border-zinc-900 pb-4">
                <div>
                    <h2 class="neon-text-green text-sm font-black font-['Orbitron'] tracking-wider">AGENT DB</h2>
                    <p class="text-zinc-500 text-[10px] tech-mono font-bold">STATUS: CORE_ONLINE</p>
                </div>
                <div class="bg-[#deff9a]/10 px-4 py-2 rounded-xl border border-[#deff9a]/30">
                    <span class="text-[#deff9a] text-xs font-bold tech-mono" id="score-val">SCORE: 0</span>
                </div>
            </div>
            
            <div class="mt-4 bg-gradient-to-r from-zinc-900/80 to-black p-4 rounded-2xl border border-zinc-800">
                <p class="text-zinc-500 text-[10px] uppercase font-bold tracking-widest">Active Profiler</p>
                <p class="text-lg font-bold mt-1 text-white"><span id="agent-name" class="text-[#00ffcc] font-['Orbitron'] uppercase">AGENT</span></p>
            </div>

            <div class="mt-4 space-y-3 flex-grow overflow-y-auto pr-1">
                
                <button onclick="showPage('page-forensics')" class="w-full bg-[#00ffcc]/10 border border-[#00ffcc]/50 text-white font-bold py-4 rounded-2xl shadow-[0_0_15px_rgba(0,255,204,0.1)] flex items-center justify-between px-4 hover:bg-[#00ffcc]/20 transition-all">
                    <span class="text-left">
                        <span class="block text-sm text-[#00ffcc] uppercase tracking-widest">Digital Forensics</span>
                        <span class="block text-[10px] text-cyan-400/70 font-normal">Analyze texts, emails & faces</span>
                    </span>
                    <span class="text-2xl">💻</span>
                </button>

                <button onclick="showPage('page-mentor')" class="w-full bg-red-900/10 border border-red-900/50 text-white font-bold py-4 rounded-2xl shadow-[0_0_15px_rgba(255,51,102,0.1)] flex items-center justify-between px-4 hover:bg-red-900/30 transition-all mt-4">
                    <span class="text-left">
                        <span class="block text-sm text-[#ff3366] uppercase tracking-widest">Ruthless Mentor</span>
                        <span class="block text-[10px] text-red-400/70 font-normal">Brutal evaluation of your skills. No mercy.</span>
                    </span>
                    <span class="text-2xl">⚠️</span>
                </button>
            </div>
            <button onclick="logoutAgent()" class="mb-2 text-zinc-600 text-[10px] uppercase tracking-widest font-bold hover:text-red-400 text-center transition-colors">Terminate Session</button>
        </div>

        <div id="page-forensics" class="page transition-all duration-300">
            <div class="flex justify-between items-center mt-2 mb-4">
                <button onclick="showPage('page-dashboard')" class="text-[#00ffcc] text-xs font-bold hover:underline uppercase tracking-widest">← Dashboard</button>
                <span class="text-zinc-500 text-xs tech-mono">DIGITAL_FORENSICS</span>
            </div>

            <div class="overflow-y-auto pr-1 pb-4 flex-grow">
                <div class="mb-4">
                    <label class="text-[10px] uppercase text-zinc-400 font-bold block mb-1">Select Evidence Type:</label>
                    <select id="data-type" onchange="toggleInputFields()" class="w-full p-3 rounded-xl text-sm text-[#00ffcc] font-bold cursor-pointer">
                        <option value="chat">💬 WhatsApp / Text Message</option>
                        <option value="email">📧 Email Analysis</option>
                        <option value="image">📸 Image / Facial Analysis</option>
                    </select>
                </div>

                <div id="text-input-area" class="mb-4">
                    <label class="text-[10px] text-[#deff9a] font-bold block mb-1 uppercase tracking-widest">Paste Text Evidence:</label>
                    <textarea id="forensic-text" class="w-full p-3 rounded-xl text-sm resize-none h-32" placeholder="Paste data here..."></textarea>
                </div>

                <div id="image-input-area" class="mb-4 hidden">
                    <label class="text-[10px] text-[#deff9a] font-bold block mb-1 uppercase tracking-widest">Upload Screenshot:</label>
                    <div class="border-2 border-dashed border-zinc-700 rounded-xl p-6 text-center cursor-pointer hover:border-[#00ffcc] transition-colors" onclick="document.getElementById('file-upload').click()">
                        <span class="text-3xl block mb-2">📁</span>
                        <span class="text-xs text-zinc-400">Tap to upload</span>
                        <input type="file" id="file-upload" class="hidden" accept="image/*">
                    </div>
                </div>

                <button id="analyze-data-btn" onclick="analyzeDigitalData()" class="w-full bg-[#00ffcc] text-black font-black py-4 rounded-xl uppercase tracking-widest text-sm transition-all">
                    Initiate Scan
                </button>

                <div id="forensic-result-box" class="hidden bg-zinc-950 border-2 border-[#00ffcc] p-4 rounded-2xl mt-4 shadow-lg">
                    <div class="flex justify-between items-end mb-2 border-b border-zinc-800 pb-2">
                        <p class="text-[#00ffcc] text-[10px] font-bold uppercase tracking-widest">📊 Deception Rate</p>
                        <p id="percentage-text" class="text-3xl font-black font-['Orbitron'] text-white">0%</p>
                    </div>
                    <div class="progress-bar-container mb-4">
                        <div id="progress-bar-fill" class="progress-bar"></div>
                    </div>
                    <p id="forensic-report" class="text-zinc-300 text-xs leading-relaxed italic"></p>
                    <div class="flex justify-between items-center mt-4 border-t border-zinc-800 pt-3">
                        <span class="text-[#00ff64] text-xs font-bold tech-mono" id="forensic-points">+0 PTS</span>
                        <button onclick="resetForensics()" class="bg-zinc-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg uppercase">Clear</button>
                    </div>
                </div>
            </div>
        </div>

        <div id="page-mentor" class="page transition-all duration-300">
             <div class="flex justify-between items-center mt-2 mb-4">
                <button onclick="showPage('page-dashboard')" class="text-[#ff3366] text-xs font-bold hover:underline uppercase tracking-widest">← Dashboard</button>
                <span class="text-zinc-500 text-xs tech-mono">STRICT_EVALUATION</span>
            </div>
            <div class="bg-zinc-950/90 p-5 rounded-2xl border border-zinc-800 mb-4 neon-glow-red">
                <label class="text-[10px] text-[#ff3366] font-bold block mb-2 uppercase tracking-widest">Submit your analysis for critique:</label>
                <p class="text-zinc-400 text-[10px] mb-3 leading-relaxed">Do not expect praise. Provide your psychological reading of a situation here. The system will brutally evaluate your logic.</p>
                
                <textarea id="mentor-input" class="w-full p-3 rounded-xl text-sm resize-none h-32 mb-4 focus:border-[#ff3366]!important" placeholder="Write your analysis here. Don't waste my time..."></textarea>
                
                <button id="mentor-btn" onclick="submitToMentor()" class="w-full bg-[#ff3366] text-white font-black py-4 rounded-xl text-sm uppercase tracking-widest hover:bg-red-600 transition-all">
                    Submit for Judgment
                </button>
            </div>

            <div id="mentor-result-box" class="hidden bg-black border-2 border-[#ff3366] p-4 rounded-2xl shadow-lg">
                <p class="text-[#ff3366] text-[10px] font-bold uppercase mb-1">⚠️ Mentor Verdict</p>
                <p id="mentor-verdict-text" class="text-zinc-300 text-xs leading-relaxed"></p>
                <div class="flex justify-between items-center mt-4 border-t border-zinc-800 pt-3">
                    <span class="text-red-500 text-xs font-bold tech-mono" id="mentor-points">+0 PTS</span>
                    <button onclick="resetMentor()" class="bg-zinc-900 text-white text-[10px] font-bold px-3 py-2 rounded-lg uppercase">Try Again</button>
                </div>
            </div>
        </div>

    </div>

    <script>
        let currentAgentEmail = null;

        // 1. Background
        const canvas = document.getElementById('latticeCanvas');
        const ctx = canvas.getContext('2d');
        let dots = [];
        function initCanvas() {
            canvas.width = window.innerWidth; canvas.height = window.innerHeight;
            dots = [];
            for(let i=0; i<40; i++) dots.push({x:Math.random()*canvas.width, y:Math.random()*canvas.height, vx:(Math.random()-0.5)*0.5, vy:(Math.random()-0.5)*0.5});
        }
        function drawLattice() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "rgba(0, 255, 204, 0.25)"; ctx.strokeStyle = "rgba(0, 255, 204, 0.04)";
            dots.forEach(dot => {
                dot.x+=dot.vx; dot.y+=dot.vy;
                if(dot.x<0 || dot.x>canvas.width) dot.vx*=-1;
                if(dot.y<0 || dot.y>canvas.height) dot.vy*=-1;
                ctx.beginPath(); ctx.arc(dot.x, dot.y, 1.5, 0, Math.PI*2); ctx.fill();
            });
            for(let i=0; i<dots.length; i++){
                for(let j=i+1; j<dots.length; j++){
                    if(Math.hypot(dots[i].x-dots[j].x, dots[i].y-dots[j].y)<130){
                        ctx.beginPath(); ctx.moveTo(dots[i].x, dots[i].y); ctx.lineTo(dots[j].x, dots[j].y); ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(drawLattice);
        }
        window.addEventListener('resize', initCanvas); initCanvas(); drawLattice();

        // 2. Navigation & Auth
        function showPage(id) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(id).classList.add('active');
        }

        function handleRegistration() {
            const name = document.getElementById('reg-name').value;
            const email = document.getElementById('reg-email').value.toLowerCase().trim();
            const pass = document.getElementById('reg-pass').value;
            if (name && email.includes('@') && pass.length >= 6) {
                document.getElementById('reg-error').classList.add('hidden');
                let db = JSON.parse(localStorage.getItem('mind_observer_v4')) || {};
                if (db[email]) return alert("Agent exists.");
                db[email] = { name: name, pass: pass, score: 0 };
                localStorage.setItem('mind_observer_v4', JSON.stringify(db));
                document.getElementById('login-email').value = email;
                showPage('page-login');
            } else { document.getElementById('reg-error').classList.remove('hidden'); }
        }

        function handleLogin() {
            const email = document.getElementById('login-email').value.toLowerCase().trim();
            const pass = document.getElementById('login-pass').value;
            let db = JSON.parse(localStorage.getItem('mind_observer_v4')) || {};
            if (db[email] && db[email].pass === pass) {
                document.getElementById('login-error').classList.add('hidden');
                currentAgentEmail = email;
                updateDashboardData();
                showPage('page-dashboard');
            } else { document.getElementById('login-error').classList.remove('hidden'); }
        }

        function updateDashboardData() {
            let db = JSON.parse(localStorage.getItem('mind_observer_v4'));
            document.getElementById('agent-name').innerText = db[currentAgentEmail].name.toUpperCase();
            document.getElementById('score-val').innerText = "SCORE: " + db[currentAgentEmail].score;
        }

        function logoutAgent() { currentAgentEmail = null; showPage('page-login'); }

        // 3. Digital Forensics
        function toggleInputFields() {
            if(document.getElementById('data-type').value === 'image') {
                document.getElementById('text-input-area').classList.add('hidden');
                document.getElementById('image-input-area').classList.remove('hidden');
            } else {
                document.getElementById('text-input-area').classList.remove('hidden');
                document.getElementById('image-input-area').classList.add('hidden');
            }
        }

        function resetForensics() {
            document.getElementById('forensic-text').value = "";
            document.getElementById('forensic-result-box').classList.add('hidden');
            document.getElementById('analyze-data-btn').classList.remove('hidden');
            document.getElementById('progress-bar-fill').style.width = "0%";
            document.getElementById('percentage-text').innerText = "0%";
        }

        function analyzeDigitalData() {
            const btn = document.getElementById('analyze-data-btn');
            btn.disabled = true; btn.innerText = "Scanning...";
            setTimeout(() => {
                btn.classList.add('hidden');
                let percent = Math.floor(Math.random() * 34) + 65; 
                document.getElementById('percentage-text'
