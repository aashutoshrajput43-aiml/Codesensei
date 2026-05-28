// Initialize CodeMirror Editor
const codeEditor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
    mode: "javascript", 
    theme: "dracula",
    lineNumbers: false,
    matchBrackets: true,
    placeholder: " Welcome! Paste your source code below, and our AI assistant will\n perform a deep architectural and behavioral analysis....\n CodeSensei is an Enterprise AI tool designed to analyze your code:\n-> Detect hidden bugs\n-> Provide optimization refactored solutions instantly. \n-> Also gives you a Git Comment"
});

const API_KEY = "AIzaSyBrxUfaEOFpArhUpcv0m465dbl8zlcbV-s";

// DOM Elements
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingMsg = document.getElementById('loadingMsg');
const analysisOutput = document.getElementById('analysisOutput');
const resultsSection = document.getElementById('resultsSection');
const detectedLangBadge = document.getElementById('detectedLangBadge'); 

// Chatbot Elements
const chatWidget = document.getElementById('senseiChatWidget');
const chatBody = document.getElementById('chatBody');
const closeChatBtn = document.getElementById('closeChatBtn');

let globalAIResponse = null; 

// Animation helpers
function createAnimationStyle(delay) {
    return `animation-delay: ${delay}s;`;
}

function staggerAnimation(elements, duration = 0.1) {
    elements.forEach((el, idx) => {
        el.style.animationDelay = `${idx * duration}s`;
    });
}

function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Invalid AI formatting. Please try again.");
}

// 🔥 Chatbot Widget Close Event 🔥
closeChatBtn.addEventListener('click', () => {
    chatWidget.classList.add('hidden');
    chatWidget.style.animation = 'chatSlideUp 0.5s ease-out reverse';
    setTimeout(() => {
        chatWidget.style.animation = '';
    }, 500);
});

// 🔥 Double Click Chat Trigger 🔥
window.openSenseiChat = function(explanation, logic) {
    chatWidget.classList.remove('hidden');
    chatWidget.style.animation = 'chatSlideUp 0.5s ease-out';
    
    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'msg user-msg';
    userMsg.textContent = `Tell me about this: "${explanation}"`;
    chatBody.appendChild(userMsg);
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Sensei reply with animation
    setTimeout(() => {
        const senseiMsg = document.createElement('div');
        senseiMsg.className = 'msg sensei-msg';
        senseiMsg.innerHTML = `<strong>Problem:</strong> ${explanation}<br><br><strong>Fix:</strong> ${logic}`;
        chatBody.appendChild(senseiMsg);
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
    
    // Stagger error line animations
    const errorLines = analysisOutput.querySelectorAll('.error-line');
    staggerAnimation(errorLines, 0.05);
}

function renderSolutionFlow() {
    if (!globalAIResponse) return;

    resultsSection.classList.remove('hidden');

    if (!globalAIResponse.issues_found || globalAIResponse.issues_found.length === 0) {
        resultsSection.innerHTML = `
            <div class="success-banner" style="background: linear-gradient(135deg, rgba(45, 212, 191, 0.15), rgba(0, 191, 255, 0.1)); color: #2dd4bf; padding: 20px; border-radius: 12px; margin-bottom: 15px; text-align: center; border: 1px solid rgba(45, 212, 191, 0.3); animation: successPulse 1s ease-out;">
                <span>✨ No worries! Your code is clean and flawless!</span>
                <button id="generateBtn" class="success-btn" style="margin-left: 15px;">Optimize it anyway</button>
            </div>
            <div id="solutionPanel" class="hidden"></div>`;
    } else {
        resultsSection.innerHTML = `
            <div class="generate-section" style="padding: 15px; text-align: center;">
                <button id="generateBtn" class="success-btn">🚀 Improve your code</button>
            </div>
            <div id="solutionPanel" class="hidden"></div>`;
    }

    document.getElementById('generateBtn').addEventListener('click', function() {
        const solutionPanel = document.getElementById('solutionPanel');
        solutionPanel.classList.remove('hidden');
        
        solutionPanel.innerHTML = `
            <div class="panel-header" style="animation: headerFadeIn 0.6s ease-out;">
                Optimized Source Code
                <button id="copyBtn" class="secondary-btn">📋 Copy to Clipboard</button>
            </div>
            <textarea id="codeOutput" readonly style="animation: contentFadeIn 0.6s ease-out 0.2s both;">${globalAIResponse.fixed_code}</textarea>

            <div class="metrics-grid" style="animation: contentFadeIn 0.6s ease-out 0.4s both;">
                <div class="metric-card">
                    <div class="metric-title">Algorithm Complexity</div>
                    <div class="metric-value">${globalAIResponse.complexity || "N/A"}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Suggested Git Commit</div>
                    <code class="metric-value code-text">${globalAIResponse.git_commit_message || "N/A"}</code>
                </div>
            </div>`;
        
        // Stagger metric cards
        setTimeout(() => {
            const metricCards = document.querySelectorAll('.metric-card');
            staggerAnimation(metricCards, 0.15);
        }, 400);

        document.getElementById('copyBtn').addEventListener('click', function() {
            navigator.clipboard.writeText(globalAIResponse.fixed_code);
            const originalText = this.innerText;
            this.innerText = "✓ Copied!";
            this.style.animation = 'pulse 0.6s ease-out';
            setTimeout(() => {
                this.innerText = originalText;
                this.style.animation = '';
            }, 2000);
        });

        solutionPanel.scrollIntoView({ behavior: 'smooth' });
    });
}

analyzeBtn.addEventListener('click', async () => {
    const rawCode = codeEditor.getValue().trim();
    if (!rawCode) return alert("Please paste code for analysis.");

    analyzeBtn.disabled = true;
    loadingMsg.classList.remove('hidden');
    analysisOutput.innerHTML = `<div class="empty-state" style="color:#00bfff; animation: pulse 1.5s infinite;">🔄 Running diagnostics...</div>`;
    resultsSection.classList.add('hidden');
    chatWidget.classList.add('hidden');
    
    // Animate button
    analyzeBtn.style.animation = 'none';
    void analyzeBtn.offsetWidth; // Trigger reflow
    analyzeBtn.style.animation = 'buttonPress 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
    
    const systemPrompt = `You are an Enterprise Code Analysis AI. Analyze the code provided.
    Auto-detect the language.
    
    CRITICAL INSTRUCTION: If the code is fully correct, flawless, and has no errors or bugs, the "issues_found" array MUST be completely empty: []. Do not invent or hallucinate errors if none exist.
    
    Even if the code is correct, you MUST still provide an optimized, refactored, modern, and elegant version in "fixed_code", along with its complexity details.

    Return ONLY a strict JSON object with this exact structure (do not use markdown wrapping):
    {
      "detected_language": "LanguageName",
      "issues_found": [
        {
          "line_number": 1,
          "type": "Error/Warning",
          "explanation": "Short description of the error.",
          "logic": "1-2 sentences explaining the professional logic/reasoning behind fixing this."
        }
      ],
      "fixed_code": "Refactor the code to be extremely short, modern, elegant, and efficient. Remove boilerplate or redundant logic if applicable.",
      "complexity": "Time: O(n) | Space: O(1)",
      "git_commit_message": "refactor: concise commit message"
    }

    Code to analyze: \n\n${rawCode}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: systemPrompt }] }] })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || response.statusText);
        }

        const data = await response.json();
        globalAIResponse = extractJSON(data.candidates[0].content.parts[0].text);

        if(detectedLangBadge) {
            detectedLangBadge.innerText = `Language: ${globalAIResponse.detected_language}`;
            detectedLangBadge.classList.remove('hidden');
        }

        renderDiagnosticReport(rawCode, globalAIResponse.issues_found || []);
        renderSolutionFlow();

    } catch (error) {
        console.error(error);
        analysisOutput.innerHTML = `<div class="empty-state" style="color: #fb7185; animation: shake 0.3s linear;">❌ API Error: ${error.message}</div>`;
    } finally {
        analyzeBtn.disabled = false;
        loadingMsg.classList.add('hidden');
        analyzeBtn.style.animation = '';
    }
});

// Add button press animation
const style = document.createElement('style');
style.textContent = `
    @keyframes buttonPress {
        0% { transform: scale(1) translateY(0); }
        50% { transform: scale(0.95) translateY(3px); }
        100% { transform: scale(1) translateY(0); }
    }

    @keyframes successPulse {
        0% { opacity: 0; transform: translateY(-10px); }
        100% { opacity: 1; transform: translateY(0); }
    }

    .success-btn {
        padding: 12px 30px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        font-family: inherit;
        cursor: pointer;
        background-color: #2dd4bf;
        color: #0f172a;
        font-size: 1rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 6px rgba(0,0,0,0.2);
        position: relative;
        overflow: hidden;
    }

    .success-btn::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        transition: width 0.6s, height 0.6s;
    }

    .success-btn:hover::before {
        width: 300px;
        height: 300px;
    }

    .success-btn:hover {
        background-color: #5eead4;
        transform: translateY(-2px);
        box-shadow: 0 0 20px rgba(45, 212, 191, 0.5);
    }

    .secondary-btn {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: #94a3b8;
        padding: 6px 14px;
        border-radius: 6px;
        font-size: 0.8rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .secondary-btn:hover {
        background: rgba(255, 255, 255, 0.05);
        color: white;
        border-color: rgba(255, 255, 255, 0.4);
    }

    .metric-card {
        background: rgba(255, 255, 255, 0.03);
        padding: 18px;
        border-radius: 8px;
        border: 1px solid rgba(0, 191, 255, 0.2);
        transition: all 0.3s ease;
        animation: cardFloat 3s ease-in-out infinite;
    }

    .metric-card:hover {
        border-color: #00bfff;
        box-shadow: 0 0 15px rgba(0, 191, 255, 0.4);
        transform: translateY(-3px);
    }

    @keyframes cardFloat {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-5px); }
    }

    .metric-title {
        font-size: 0.8rem;
        color: #94a3b8;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 6px;
    }

    .metric-value {
        font-weight: 600;
        color: #f8fafc;
        font-size: 1.1rem;
    }

    .code-text {
        font-family: 'Fira Code', monospace;
        color: #4ade80;
        font-size: 0.95rem;
    }

    .metrics-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.2);
    }

    @media(max-width: 768px) {
        .metrics-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);
