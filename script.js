// Initialize CodeMirror Editor
const codeEditor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
    mode: "javascript", 
    theme: "dracula",
    lineNumbers: true, // Enabled line numbers
    matchBrackets: true,
    placeholder: " Welcome! Paste your source code below, and our AI assistant will\n perform a deep architectural and behavioral analysis....\n CodeSensei is an Enterprise AI tool designed to analyze your code:\n-> Detect hidden bugs\n-> Provide optimization refactored solutions instantly. \n-> Also gives you a Git Commit"
});

const BACKEND_URL = "http://localhost:3000";

// DOM Elements
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingMsg = document.getElementById('loadingMsg');
const analysisOutput = document.getElementById('analysisOutput');
const resultsSection = document.getElementById('resultsSection');
const detectedLangBadge = document.getElementById('detectedLangBadge'); 
const langOverrideSelect = document.getElementById('langOverride');
const exportReportBtn = document.getElementById('exportReportBtn');
const historyList = document.getElementById('historyList');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');

// Chatbot Elements
const chatWidget = document.getElementById('senseiChatWidget');
const chatBody = document.getElementById('chatBody');
const closeChatBtn = document.getElementById('closeChatBtn');
const chatInput = document.getElementById('chatInput');
const sendChatBtn = document.getElementById('sendChatBtn');

// Toast Elements
const toastContainer = document.getElementById('toastContainer');
const toastMsg = document.getElementById('toastMsg');

let globalAIResponse = null; 
let chatHistory = [];
let currentCode = "";

// Configure Marked.js for safe rendering
marked.setOptions({
    breaks: true,
    gfm: true
});

function showToast(message) {
    if(!toastContainer) {
        alert(message);
        return;
    }
    toastContainer.classList.remove('hidden');
    toastMsg.innerText = message;
    toastContainer.style.animation = 'none';
    toastContainer.offsetHeight; 
    toastContainer.style.animation = null; 
    setTimeout(() => {
        toastContainer.classList.add('hidden');
    }, 4000);
}

// --- LOCAL STORAGE & HISTORY LOGIC ---
function saveToHistory(code, response) {
    let history = JSON.parse(localStorage.getItem('codesensei_history') || '[]');
    const newItem = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        code: code,
        response: response,
        language: response.detected_language || 'Unknown'
    };
    history.unshift(newItem);
    if(history.length > 20) history.pop(); // Keep last 20
    localStorage.setItem('codesensei_history', JSON.stringify(history));
    renderHistory();
}

function renderHistory() {
    let history = JSON.parse(localStorage.getItem('codesensei_history') || '[]');
    historyList.innerHTML = '';
    
    if(history.length === 0) {
        historyList.innerHTML = '<div style="color:var(--text-sub); font-size:0.8rem; font-style:italic;">No recent analyses.</div>';
        return;
    }

    history.forEach(item => {
        const div = document.createElement('div');
        div.className = 'history-item';
        div.innerHTML = `
            <div class="history-item-lang">${item.language}</div>
            <div class="history-item-date">${item.date}</div>
        `;
        div.addEventListener('click', () => loadHistoryItem(item));
        historyList.appendChild(div);
    });
}

function loadHistoryItem(item) {
    currentCode = item.code;
    codeEditor.setValue(item.code);
    globalAIResponse = item.response;
    
    if(detectedLangBadge) {
        detectedLangBadge.innerText = `Language: ${globalAIResponse.detected_language}`;
        detectedLangBadge.classList.remove('hidden');
    }
    langOverrideSelect.value = "auto";
    
    renderDiagnosticReport(item.code, globalAIResponse.issues_found || []);
    renderSolutionFlow();
    exportReportBtn.classList.remove('hidden');
    showToast("Loaded analysis from history.");
}

newAnalysisBtn.addEventListener('click', () => {
    codeEditor.setValue("");
    analysisOutput.innerHTML = `<div class="empty-state">Awaiting code input to generate diagnostics.</div>`;
    resultsSection.classList.add('hidden');
    exportReportBtn.classList.add('hidden');
    detectedLangBadge.classList.add('hidden');
    globalAIResponse = null;
    currentCode = "";
});

// Load history on startup
renderHistory();

const clearHistoryBtn = document.getElementById('clearHistoryBtn');
if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener('click', () => {
        if(confirm("Are you sure you want to clear all history?")) {
            localStorage.removeItem('codesensei_history');
            renderHistory();
            showToast("History cleared!");
        }
    });
}

// --- EDITOR LANGUAGE OVERRIDE ---
langOverrideSelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if(val !== 'auto') {
        codeEditor.setOption("mode", val);
    }
});

// --- EXPORT TO MARKDOWN ---
exportReportBtn.addEventListener('click', () => {
    if(!globalAIResponse) return;
    
    let md = `# CodeSensei Analysis Report\n\n`;
    md += `**Date:** ${new Date().toLocaleString()}\n`;
    md += `**Language:** ${globalAIResponse.detected_language}\n\n`;
    
    md += `## Original Code\n\`\`\`${globalAIResponse.detected_language.toLowerCase()}\n${currentCode}\n\`\`\`\n\n`;
    
    md += `## Issues Found\n`;
    if(globalAIResponse.issues_found && globalAIResponse.issues_found.length > 0) {
        globalAIResponse.issues_found.forEach(issue => {
            md += `- **Line ${issue.line_number}** (${issue.type}): ${issue.explanation}\n`;
            md += `  - *Fix Logic:* ${issue.logic}\n`;
        });
    } else {
        md += `No issues found! Code is perfect.\n`;
    }
    
    md += `\n## Optimized Code\n\`\`\`${globalAIResponse.detected_language.toLowerCase()}\n${globalAIResponse.fixed_code}\n\`\`\`\n\n`;
    md += `**Complexity:** ${globalAIResponse.complexity}\n`;
    md += `**Git Commit Message:** \`${globalAIResponse.git_commit_message}\`\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `codesensei-report-${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("Report Exported!");
});

// 🔥 Chatbot Widget Close Event 🔥
closeChatBtn.addEventListener('click', () => {
    chatWidget.classList.add('hidden');
});

// 🔥 Double Click Chat Trigger 🔥
window.openSenseiChat = function(explanation, logic) {
    chatWidget.classList.remove('hidden');
    
    chatBody.innerHTML += `<div class="msg user-msg">Tell me about this: "${explanation}"</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
    
    setTimeout(() => {
        chatBody.innerHTML += `<div class="msg sensei-msg"><strong>Problem:</strong> ${explanation}<br><br><strong>Fix:</strong> ${logic}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
    }, 400);
}

function renderDiagnosticReport(rawCode, issues) {
    const lines = rawCode.split('\n');
    let htmlContent = '';

    lines.forEach((line, index) => {
        const currentLineNum = index + 1;
        const issue = issues.find(i => parseInt(i.line_number) === currentLineNum);
        const safeLine = line.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        if (issue) {
            const safeExplanation = issue.explanation.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const safeLogic = issue.logic.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            
            htmlContent += `<span class="code-line error-line" ondblclick="openSenseiChat('${safeExplanation}', '${safeLogic}')" title="Double click to ask Sensei!">${safeLine || ' '}</span>\n`;
        } else {
            htmlContent += `<span class="code-line">${safeLine || ' '}</span>\n`;
        }
    });

    if (lines.length === 1 && lines[0] === '') {
        htmlContent = `<div class="empty-state">Awaiting code input to generate diagnostics.</div>`;
    }

    analysisOutput.innerHTML = htmlContent;
}

function renderSolutionFlow() {
    if (!globalAIResponse) return;

    resultsSection.classList.remove('hidden');

    if (!globalAIResponse.issues_found || globalAIResponse.issues_found.length === 0) {
        resultsSection.innerHTML = `
            <div class="success-banner" style="background-color: #d1fae5; color: #065f46; padding: 15px; border-radius: 8px; margin-bottom: 15px; text-align: center;">
                <span>✨ No worries child, your code is correct!</span>
                <button id="generateBtn" class="success-btn" style="margin-left: 15px;">Optimize it anyway</button>
            </div>
            <div id="solutionPanel" class="hidden"></div>`;
    } else {
        resultsSection.innerHTML = `
            <div class="generate-section" style="padding: 15px; text-align:center;">
                <button id="generateBtn" class="success-btn">Improve your code</button>
            </div>
            <div id="solutionPanel" class="hidden"></div>`;
    }

    document.getElementById('generateBtn').addEventListener('click', function() {
        const solutionPanel = document.getElementById('solutionPanel');
        solutionPanel.classList.remove('hidden');
        
        solutionPanel.innerHTML = `
            <div class="glowing-card group">
                <div class="glowing-card-mesh-border"></div>
                <div class="glowing-card-mesh-bg"></div>
                <div class="glowing-card-glow"></div>
                <div class="glowing-card-content" style="padding: 30px;">
                    <div class="panel-header">
                        Optimized Source Code
                        <button id="copyBtn" class="secondary-btn">Copy to Clipboard</button>
                    </div>
                    <div id="outputEditorContainer" style="width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.3);"></div>

                    <div class="metrics-grid">
                        <div class="metric-card">
                            <div class="metric-title">Algorithm Complexity</div>
                            <div class="metric-value">${globalAIResponse.complexity || "N/A"}</div>
                        </div>
                        <div class="metric-card">
                            <div class="metric-title">Suggested Git Commit</div>
                            <code class="metric-value code-text">${globalAIResponse.git_commit_message || "N/A"}</code>
                        </div>
                    </div>
                </div>
            </div>`;
        
        const outputEditor = CodeMirror(document.getElementById('outputEditorContainer'), {
            value: globalAIResponse.fixed_code || "",
            mode: globalAIResponse.detected_language ? globalAIResponse.detected_language.toLowerCase() : "javascript",
            theme: "dracula",
            lineNumbers: true,
            readOnly: true
        });

        document.getElementById('copyBtn').addEventListener('click', function() {
            navigator.clipboard.writeText(globalAIResponse.fixed_code);
            showToast("Copied to Clipboard!");
        });

        // Initialize Glowing Card effect for the dynamically added solution panel
        const newCard = solutionPanel.querySelector('.glowing-card');
        if (newCard && typeof initGlowingCard === 'function') {
            initGlowingCard(newCard);
        }

        solutionPanel.scrollIntoView({ behavior: 'smooth' });
    });
}

// --- DYNAMIC BUTTON LOGIC ---
const textSwapContainers = document.querySelectorAll('.btn-text-swap');
textSwapContainers.forEach(container => {
    const defaultText = container.getAttribute('data-default');
    const activeText = container.getAttribute('data-active');
    
    const maxLength = Math.max(defaultText.length, activeText.length);
    const paddedDefault = defaultText.padEnd(maxLength, ' ');
    const paddedActive = activeText.padEnd(maxLength, ' ');

    container.innerHTML = '';
    
    for (let i = 0; i < maxLength; i++) {
        const charWrapper = document.createElement('span');
        charWrapper.className = 'char-wrapper';
        charWrapper.style.transitionDelay = `${i * 0.02}s`;
        
        charWrapper.innerHTML = `
            <span class="char-default">${paddedDefault[i] === ' ' ? '&nbsp;' : paddedDefault[i]}</span>
            <span class="char-active">${paddedActive[i] === ' ' ? '&nbsp;' : paddedActive[i]}</span>
        `;
        container.appendChild(charWrapper);
    }
});

function setButtonTextActive(isActive) {
    textSwapContainers.forEach(container => {
        const wrappers = container.querySelectorAll('.char-wrapper');
        wrappers.forEach(w => {
            if (isActive) w.setAttribute('data-active', 'true');
            else w.removeAttribute('data-active');
        });
    });
}

if (analyzeBtn) {
    analyzeBtn.addEventListener('mousemove', (e) => {
        const rect = analyzeBtn.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        analyzeBtn.style.setProperty('--mouse-x', `${x}px`);
        analyzeBtn.style.setProperty('--mouse-y', `${y}px`);
    });
}

analyzeBtn.addEventListener('click', async () => {
    const rawCode = codeEditor.getValue().trim();
    if (!rawCode) return showToast("Please enter code for analysis.");

    currentCode = rawCode;
    analyzeBtn.disabled = true;
    setButtonTextActive(true);
    loadingMsg.classList.remove('hidden');
    analysisOutput.innerHTML = `<div class="empty-state" style="color:#2563eb;">Running diagnostics...</div>`;
    resultsSection.classList.add('hidden');
    chatWidget.classList.add('hidden');
    exportReportBtn.classList.add('hidden');
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: rawCode })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || response.statusText);
        }

        globalAIResponse = await response.json();

        if(detectedLangBadge) {
            detectedLangBadge.innerText = `Language: ${globalAIResponse.detected_language}`;
            detectedLangBadge.classList.remove('hidden');
        }

        renderDiagnosticReport(rawCode, globalAIResponse.issues_found || []);
        renderSolutionFlow();
        saveToHistory(rawCode, globalAIResponse);
        exportReportBtn.classList.remove('hidden');

    } catch (error) {
        console.error(error);
        analysisOutput.innerHTML = `<div class="empty-state" style="color: #ef4444;">API Error: ${error.message}</div>`;
    } finally {
        analyzeBtn.disabled = false;
        setButtonTextActive(false);
        loadingMsg.classList.add('hidden');
    }
});

// --- Interactive Chat Logic ---
async function handleChatInput() {
    const userMessage = chatInput.value.trim();
    if (!userMessage) return;

    chatInput.value = '';
    chatBody.innerHTML += `<div class="msg user-msg">${userMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
    
    sendChatBtn.disabled = true;
    
    const loadingId = "load-" + Date.now();
    chatBody.innerHTML += `<div id="${loadingId}" class="msg sensei-msg" style="opacity: 0.7;">Sensei is thinking...</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    const rawCode = codeEditor.getValue().trim();
    try {
        const response = await fetch(`${BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                message: userMessage,
                code: rawCode,
                context: chatHistory
            })
        });

        if (!response.ok) {
            throw new Error("Chat API failed");
        }

        const data = await response.json();
        const aiReply = data.reply;
        
        chatHistory.push("User: " + userMessage);
        chatHistory.push("AI: " + aiReply);
        if (chatHistory.length > 6) chatHistory.splice(0, 2);

        document.getElementById(loadingId).remove();
        
        // Use Marked.js for rendering AI markdown response
        const formattedReply = marked.parse(aiReply);

        chatBody.innerHTML += `<div class="msg sensei-msg">${formattedReply}</div>`;
        chatBody.scrollTop = chatBody.scrollHeight;
        
    } catch (error) {
        document.getElementById(loadingId).innerText = "Sorry, I encountered an error answering that.";
        console.error(error);
    } finally {
        sendChatBtn.disabled = false;
        chatInput.focus();
    }
}

if (sendChatBtn) {
    sendChatBtn.addEventListener('click', handleChatInput);
}
if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChatInput();
    });
}

// --- THEME (DAY/NIGHT) TOGGLE ---
const themeToggleBtn = document.getElementById('themeToggleBtn');
if (themeToggleBtn) {
    const iconSun = themeToggleBtn.querySelector('.icon-sun');
    const iconMoon = themeToggleBtn.querySelector('.icon-moon');

    function applyTheme(isLight) {
        if(isLight) {
            document.body.classList.add('light-mode');
            iconSun.classList.add('hidden');
            iconMoon.classList.remove('hidden');
        } else {
            document.body.classList.remove('light-mode');
            iconSun.classList.remove('hidden');
            iconMoon.classList.add('hidden');
        }
    }

    const savedTheme = localStorage.getItem('codesensei_theme');
    if(savedTheme === 'light') applyTheme(true);

    themeToggleBtn.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-mode');
        localStorage.setItem('codesensei_theme', isLight ? 'light' : 'dark');
        applyTheme(isLight);
    });
}

// --- GLOWING EDGE CARD VANILLA PORT ---
const clamp = (value, min = 0, max = 100) => Math.min(Math.max(value, min), max);
const round = (value, precision = 3) => parseFloat(value.toFixed(precision));

const centerOfElement = (rect) => [rect.width / 2, rect.height / 2];

const getPointerPosition = (rect, e) => {
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = clamp((100 / rect.width) * x);
    const py = clamp((100 / rect.height) * y);
    return { pixels: [x, y], percent: [px, py] };
};

const angleFromPointer = (dx, dy) => {
    let angleRadians = 0;
    let angleDegrees = 0;
    if (dx !== 0 || dy !== 0) {
        angleRadians = Math.atan2(dy, dx);
        angleDegrees = angleRadians * (180 / Math.PI) + 90;
        if (angleDegrees < 0) {
            angleDegrees += 360;
        }
    }
    return angleDegrees;
};

const closenessToEdge = (rect, x, y) => {
    const [cx, cy] = centerOfElement(rect);
    const dx = x - cx;
    const dy = y - cy;
    let k_x = Infinity;
    let k_y = Infinity;
    if (dx !== 0) {
        k_x = cx / Math.abs(dx);
    }
    if (dy !== 0) {
        k_y = cy / Math.abs(dy);
    }
    return clamp((1 / Math.min(k_x, k_y)), 0, 1);
};

window.initGlowingCard = function(card) {
    if (card.dataset.glowingInit) return;
    card.dataset.glowingInit = 'true';
    
    let isAnimating = true;
    card.classList.add('animating');
    
    // Intro animation (Ported from React requestAnimationFrame logic)
    const angleStart = 110;
    const angleEnd = 465;
    card.style.setProperty('--pointer-deg', `${angleStart}deg`);
    
    const startTime = performance.now() + 500; // adding 500ms initial delay
    
    const animate = (now) => {
        if (!card.classList.contains('animating')) return;
        const elapsed = now - startTime;
        
        if (elapsed > 0) {
            // Phase 1: Distance increase (fade in glow)
            if (elapsed < 500) {
                const t = elapsed / 500;
                const ease = 1 - Math.pow(1 - t, 3);
                card.style.setProperty('--pointer-d', `${ease * 100}`);
            }
            // Phase 2: Rotation part 1
            if (elapsed < 1500) {
                const t = elapsed / 1500;
                const ease = t * t * t;
                const d = (angleEnd - angleStart) * (ease * 0.5) + angleStart;
                card.style.setProperty('--pointer-deg', `${d}deg`);
            }
            // Phase 3: Rotation part 2
            if (elapsed >= 1500 && elapsed < 3750) {
                const t = (elapsed - 1500) / 2250;
                const ease = 1 - Math.pow(1 - t, 3);
                const d = (angleEnd - angleStart) * (0.5 + ease * 0.5) + angleStart;
                card.style.setProperty('--pointer-deg', `${d}deg`);
            }
            // Phase 4: Distance decrease (fade out glow)
            if (elapsed > 2500 && elapsed < 4000) {
                const t = (elapsed - 2500) / 1500;
                const ease = t * t * t;
                card.style.setProperty('--pointer-d', `${(1 - ease) * 100}`);
            }
        }
        
        if (elapsed < 4000) {
            requestAnimationFrame(animate);
        } else {
            isAnimating = false;
            card.classList.remove('animating');
        }
    };
    
    requestAnimationFrame(animate);

    // Mouse Tracking Logic
    card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const position = getPointerPosition(rect, e);
        const [px, py] = position.pixels;
        const [perx, pery] = position.percent;
        
        const [cx, cy] = centerOfElement(rect);
        const dx = px - cx;
        const dy = py - cy;
        
        const edge = closenessToEdge(rect, px, py);
        const angle = angleFromPointer(dx, dy);

        card.style.setProperty('--pointer-x', `${round(perx)}%`);
        card.style.setProperty('--pointer-y', `${round(pery)}%`);
        card.style.setProperty('--pointer-deg', `${round(angle)}deg`);
        card.style.setProperty('--pointer-d', `${round(edge * 100)}`);
        
        if (isAnimating) {
            isAnimating = false;
            card.classList.remove('animating');
        }
    });
};

document.querySelectorAll('.glowing-card').forEach(initGlowingCard);

// WebGL LightRays logic has been moved to lightrays.js as an ES Module
