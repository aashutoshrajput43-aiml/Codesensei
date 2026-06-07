const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// Utility to parse JSON strictly out of AI's markdown response if any
function extractJSON(text) {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Invalid AI formatting");
}

// Utility to retry API calls with exponential backoff
async function generateContentWithRetry(model, prompt, maxRetries = 3) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const result = await model.generateContent(prompt);
            return result.response.text();
        } catch (error) {
            retries++;
            console.warn(`API Error (Attempt ${retries}/${maxRetries}):`, error.message);
            if (retries >= maxRetries) {
                throw error; // Fail after max retries
            }
            // Exponential backoff: wait 1s, 2s, 4s...
            const delay = Math.pow(2, retries - 1) * 1000;
            console.log(`Retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

app.post('/api/analyze', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: "No code provided" });
        }

        const systemPrompt = `You are an Enterprise Code Analysis AI. Analyze the code provided.
    Auto-detect the programming language. If the code is not a recognized programming language (e.g., plain English, pseudo-code, random text), set "detected_language" to "Plain Text / Pseudo-code".
    
    CRITICAL INSTRUCTION: If the code is fully correct, flawless, and has no errors or bugs, the "issues_found" array MUST be completely empty: []. Do not invent or hallucinate errors if none exist.
    
    If the code has logic errors, syntax errors, or is just plain text that needs converting to code, explain exactly what is wrong and how to fix it in clear, simple terms.

    Return ONLY a strict JSON object with this exact structure (do not use markdown wrapping):
    {
      "detected_language": "LanguageName",
      "issues_found": [
        {
          "line_number": 1,
          "type": "Error/Warning/Security/Enhancement",
          "explanation": "Clear description of what is wrong or what this text means.",
          "logic": "1-2 sentences explaining how to fix it or what the optimized code does."
        }
      ],
      "fixed_code": "Provide the optimized, refactored, modern version. If the input was plain text, generate the corresponding code in a sensible language.",
      "complexity": "Time: O(n) | Space: O(1)",
      "git_commit_message": "refactor: concise commit message"
    }

    Code to analyze: \n\n${code}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const responseText = await generateContentWithRetry(model, systemPrompt);
        const jsonResponse = extractJSON(responseText);

        res.json(jsonResponse);
    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze code" });
    }
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, code, context } = req.body;
        if (!message) {
            return res.status(400).json({ error: "No message provided" });
        }

        const systemPrompt = `You are CodeSensei AI, a highly intelligent programming assistant.
${code ? `The user is currently working on this code:\n${code}\n` : `The user currently has no code open.`}
Recent conversation history: ${context && context.length ? context.join(" | ") : "None"}

Please provide a short, helpful, and friendly answer to the user's question. You can answer general programming queries (like "what is SQL") as well as specific questions about their code.

User Question: ${message}`;

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        
        const responseText = await generateContentWithRetry(model, systemPrompt);

        res.json({ reply: responseText });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Failed to process chat" });
    }
});

app.listen(port, () => {
    console.log(`CodeSensei Backend running at http://localhost:${port}`);
});
