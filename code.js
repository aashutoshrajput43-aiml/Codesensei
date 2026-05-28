// Initialize CodeMirror Editor
const codeEditor = CodeMirror.fromTextArea(document.getElementById('codeInput'), {
    mode: "javascript", 
    theme: "dracula",
    lineNumbers: false, // Line numbers hata diye
    matchBrackets: true,
    // Placeholder description add kar diya
    placeholder: " Welcome! Paste your source code below, and our AI assistant will\n perform  a deep architectural and behavioral analysis....\n CodeSensei is an Enterprise AI tool designed to analyze your code:\n-> Detect hidden bugs\n-> Provide optimization refactored solutions instantly. \n-> Also gives you a Git Comment"
});

const API_KEY = "AIzaSyBrxUfaEOFpArhUpcv0m465dbl8zlcbV-s"; // Aapki Active Key

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

function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Invalid AI formatting. Please try again.");
}

// 🔥 Chatbot Widget Close Event 🔥
closeChatBtn.addEventListener('click', () => {
    chatWidget.classList.add('hidden');
});

// 🔥 Double Click Chat Trigger 🔥
window.openSenseiChat = function(explanation, logic) {
    chatWidget.classList.remove('hidden');
    
    // User message
    chatBody.innerHTML += `<div class="msg user-msg">Tell me about this: "${explanation}"</div>`;
    chatBody.scrollTop = chatBody.scrollHeight;
    
    // Sensei reply with slight delay for realistic feel
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
            <div class="panel-header">
                Optimized Source Code
                <button id="copyBtn" class="secondary-btn">Copy to Clipboard</button>
            </div>
            <textarea id="codeOutput" readonly>${globalAIResponse.fixed_code}</textarea>

            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-title">Algorithm Complexity</div>
                    <div class="metric-value">${globalAIResponse.complexity || "N/A"}</div>
                </div>
                <div class="metric-card">
                    <div class="metric-title">Suggested Git Commit</div>
                    <code class="metric-value code-text">${globalAIResponse.git_commit_message || "N/A"}</code>
                </div>
            </div>`;
        
        document.getElementById('copyBtn').addEventListener('click', function() {
            navigator.clipboard.writeText(globalAIResponse.fixed_code);
            this.innerText = "Copied!";
            setTimeout(() => this.innerText = "Copy to Clipboard", 2000);
        });

        solutionPanel.scrollIntoView({ behavior: 'smooth' });
    });
}

analyzeBtn.addEventListener('click', async () => {
    // Grab value from CodeMirror instead of the hidden textarea
    const rawCode = codeEditor.getValue().trim();
    if (!rawCode) return alert("Please  code for analysis.");

    analyzeBtn.disabled = true;
    loadingMsg.classList.remove('hidden');
    analysisOutput.innerHTML = `<div class="empty-state" style="color:#2563eb;">Running diagnostics...</div>`;
    resultsSection.classList.add('hidden');
    chatWidget.classList.add('hidden');
    
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
        analysisOutput.innerHTML = `<div class="empty-state" style="color: #ef4444;">API Error: ${error.message}</div>`;
    } finally {
        analyzeBtn.disabled = false;
        loadingMsg.classList.add('hidden');
    }
});
