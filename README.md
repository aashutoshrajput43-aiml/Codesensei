# CodeSensei 🥷✨

**CodeSensei** is an intelligent, web-based code analysis tool designed to help developers write flawless code. Powered by AI, it instantly detects syntax errors, logical bugs, and offers optimized refactoring solutions with algorithm complexity metrics.

**Features**: Enhanced animations, glassmorphic UI, AI-powered analysis, responsive design, and Vercel-ready deployment!

![CodeSensei - Enterprise AI Code Analysis](https://img.shields.io/badge/CodeSensei-2.0.0-blue?style=flat-square)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 🚀 Key Features

* **🤖 Intelligent Code Analysis**: Leverages the Gemini 2.5 Flash API to detect hidden bugs and suggest professional fixes.
* **💻 Interactive Code Editor**: Integrated with **CodeMirror** for real-time syntax highlighting, auto-indentation, and bracket matching.
* **🥷 Sensei Chatbot**: Double-click on any highlighted error to summon the "Sensei AI" widget for a detailed, conversational explanation of the issue.
* **✨ Premium Animations**: Full page entrance, button interactions, error reveals, chat bubbles, and metric card animations.
* **1️⃣ Click Optimization**: Even if the code is flawless, the tool provides a modernized, elegant refactoring of the source code along with Time/Space complexity analysis.
* **🎨 Premium UI/UX**: Built with a modern dark theme, glassmorphism effects, and smooth animations for an immersive developer experience.
* **📱 Fully Responsive**: Optimized for desktop, tablet, and mobile devices with adaptive animations.
* **⚡ Production Ready**: Vercel-configured, optimized for deployment, and performance-tested.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **HTML5** | Semantic markup and structure |
| **CSS3** | Glassmorphism, animations, responsive design |
| **JavaScript (Vanilla)** | Interactive features & DOM manipulation |
| **CodeMirror 5.65** | Syntax highlighting & code editing |
| **Google Gemini 2.5 Flash API** | AI-powered code analysis |
| **Vercel** | Deployment & hosting |

---

## 💡 How It Works

1. **Paste your code** into the CodeSensei editor.
2. Click **"Run Analysis"** to trigger AI analysis.
3. The AI scans the code, auto-detects the programming language, and flags any errors in the right panel.
4. **Double-click** any error line to open the Sensei Chatbot for a deep-dive explanation.
5. Click **"Improve your code"** to instantly generate an optimized, refactored version of your script.
6. View algorithm complexity and suggested Git commit message.

---

## 🎯 Animation Enhancements (v2.0)

### Page Load Animations
- ✅ Navbar slide-down entrance
- ✅ Logo scale & rotate animation
- ✅ Container fade-in with stagger
- ✅ Panel slide-up entrance

### Interactive Animations
- ✅ Button ripple effect on hover
- ✅ Button 3D press animation on click
- ✅ Textarea focus glow effect
- ✅ Error line glitch & shake effects

### Results & Feedback
- ✅ Solution panel slide-in animation
- ✅ Metric cards rotation & glow effects
- ✅ Chat bubble pop animation
- ✅ Message staggered entrance
- ✅ Badge pop-in with rotation

### Continuous Effects
- ✅ Panel border glow pulse
- ✅ Chat widget floating animation
- ✅ Loading state pulse animation
- ✅ Scrollbar dynamic effects

---

## ⚙️ Setup & Installation

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aashutoshrajput43-aiml/Codesensei.git
   cd Codesensei
   ```

2. **Get your Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy your active key

3. **Add your API key to `Code.js`:**
   ```javascript
   const API_KEY = "YOUR_GEMINI_API_KEY";
   ```

4. **Open in Browser:**
   - Simply open `index.html` in your favorite browser
   - No server setup required!
   - Start analyzing code immediately ⚡

### Deploy to Vercel (Recommended)

1. **Push to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Environment Variables:
     - Add `VITE_API_KEY` (optional - for security)
   - Click "Deploy"
   - Your site is now live! 🎉

3. **Alternative: One-Click Deploy Button**
   - Coming soon with environment setup

---

## 📋 API Configuration

### Google Gemini API
The project uses Google's Gemini 2.5 Flash API for code analysis.

**Rate Limits:**
- Free tier: 60 requests per minute
- Upgrade for higher limits

**Setup:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create API key
3. Keep your key private (don't commit to version control)

---

## 🔐 Security Best Practices

⚠️ **IMPORTANT**: Never commit your API key to version control!

**For Production:**
1. Store API key in environment variables
2. Use Vercel Environment Variables dashboard
3. Access via `process.env.API_KEY`
4. Consider using a backend proxy for additional security

---

## 📱 Browser Compatibility

| Browser | Support | Version |
|---------|---------|---------|
| Chrome | ✅ Full | Latest |
| Firefox | ✅ Full | Latest |
| Safari | ✅ Full | Latest |
| Edge | ✅ Full | Latest |
| Mobile | ✅ Optimized | All Modern |

---

## 🎨 Customization

### Change Colors
Edit `:root` variables in `Code.css`:
```css
:root {
    --color-primary: #38bdf8;  /* Cyan */
    --color-success: #2dd4bf;  /* Teal */
    --color-error: #fb7185;    /* Rose */
}
```

### Adjust Animations
Edit keyframes in `Code.css`:
```css
@keyframes panelSlideUp {
    from { /* Customize entrance */ }
    to { /* Customize exit */ }
}
```

### Modify UI Text
Edit strings in `Code.js` for custom messages and labels.

---

## 🐛 Troubleshooting

### API Not Working
- Verify API key is valid and active
- Check network tab in browser DevTools
- Ensure you haven't exceeded rate limits
- Check Google AI Studio for account status

### Animations Not Showing
- Ensure browser supports CSS animations (all modern browsers do)
- Check browser DevTools for JS errors
- Clear browser cache and reload

### Code Not Analyzing
- Verify code is valid syntax
- Try with simpler code first
- Check browser console for errors
- Ensure API key is correctly configured

---

## 📈 Performance Optimization

✅ **Optimizations Included:**
- CDN-hosted dependencies (CodeMirror, fonts)
- Optimized animations (GPU acceleration via transform/opacity)
- Lazy loading for chat widget
- Minified CSS & JS ready for production
- Responsive image handling

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

**Created with ❤️ by:**
- **Aashutosh Rajput** - Full Stack Development & AI Integration
- **Aayush Batole** - UI/UX Design & Frontend Development

---

## 🙏 Acknowledgments

- Google Gemini API for powerful AI analysis
- CodeMirror for the excellent code editor
- The open-source community for inspiration

---

## 📞 Support & Contact

- 📧 Email: aashutoshrajput43@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/aashutoshrajput43-aiml/Codesensei/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/aashutoshrajput43-aiml/Codesensei/discussions)

---

## 🎉 Deployed Live

🚀 **Live Demo**: [CodeSensei on Vercel](https://codesensei-demo.vercel.app) *(Coming Soon)*

---

## 📊 Project Status

| Component | Status |
|-----------|--------|
| Core Analysis | ✅ Complete |
| Animations | ✅ Complete |
| Responsive Design | ✅ Complete |
| Vercel Configuration | ✅ Complete |
| Documentation | ✅ Complete |
| Production Ready | ✅ YES |

---

**Version:** 2.0.0 with Enhanced Animations & Vercel Deployment  
**Last Updated:** May 28, 2026
