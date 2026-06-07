# CodeSensei | Enterprise AI 🥷

An enterprise-grade, AI-powered code analysis and diagnostic tool. **CodeSensei** provides a sleek split-view interface to evaluate your source code, uncover bugs, and provide real-time suggestions using Google's Generative AI. 

## ✨ Features

- **AI-Powered Diagnostics**: Deep analysis of your source code using Gemini to find logic errors, syntax issues, and optimization opportunities.
- **Sensei AI Chat**: An interactive chat widget to ask follow-up questions. Simply double-click on any highlighted error line to get a detailed explanation!
- **Rich Code Editor**: Integrated with CodeMirror for syntax highlighting, auto-detection, and support for multiple languages (JavaScript, Python, Java, C++, HTML/CSS).
- **Immersive UI**: Features a beautiful "Night Mode" with WebGL-powered light-ray visual effects, along with a clean "Day Mode".
- **History & Export**: Keep track of your recent analyses and seamlessly export your diagnostic reports to Markdown.

## 🚀 Tech Stack

- **Frontend**: HTML5, Vanilla CSS, JavaScript, CodeMirror, OGL (for WebGL effects), Marked.js.
- **Backend**: Node.js, Express, `@google/generative-ai`, Supabase.

## 🛠️ Setup & Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/aashutoshrajput43-aiml/Codesensei.git
   ```
2. Navigate into the project directory:
   ```bash
   cd Codesensei
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```
4. Set up your environment variables by creating a `.env` file in the root directory and adding your API keys (e.g., your Gemini API key).

5. Start the development server:
   ```bash
   node server.js
   ```
6. Open `index.html` in your browser (or use a live server) to access the CodeSensei interface.

## 📝 License

This project is licensed under the ISC License.
