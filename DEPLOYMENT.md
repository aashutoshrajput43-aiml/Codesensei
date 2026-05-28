# 🚀 CodeSensei - Vercel Deployment Guide

## Quick Deployment to Vercel (5 Minutes)

### Prerequisites
- GitHub Account
- Vercel Account (free at vercel.com)
- Google Gemini API Key

---

## Step 1: Get Your Gemini API Key

1. Visit **[Google AI Studio](https://makersuite.google.com/app/apikey)**
2. Click **"Create API Key"**
3. Choose your Google Cloud project (or create new)
4. Click **"Create API Key in Google Cloud Console"**
5. Copy the key and keep it safe

---

## Step 2: Prepare Your Repository

Your repository is already Vercel-ready! Verify these files exist:

✅ `index.html` - Main application  
✅ `Code.js` - Application logic  
✅ `Code.css` - Styles with animations  
✅ `package.json` - Project metadata  
✅ `vercel.json` - Vercel configuration  
✅ `.gitignore` - Security (protects API keys)  

---

## Step 3: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

1. **Ensure code is pushed to GitHub:**
   ```bash
   git add .
   git commit -m "chore: Ready for Vercel deployment"
   git push origin main
   ```

2. **Go to Vercel Dashboard:**
   - Visit [vercel.com](https://vercel.com)
   - Click **"New Project"**
   - Select **"Import Git Repository"**

3. **Select Your Repository:**
   - Search for `Codesensei`
   - Click **"Import"**

4. **Configure Project:**
   - Framework: Leave as **"Other"**
   - Root Directory: `./`
   - Build Command: Leave empty (static site)
   - Output Directory: Leave empty
   - Click **"Deploy"**

5. **Add Environment Variables** (Optional but Recommended):
   - Go to Project Settings → **Environment Variables**
   - Add: `API_KEY` = `YOUR_GEMINI_API_KEY`
   - (You can also add it directly in Code.js)

6. **Wait for Deployment:**
   - Vercel builds and deploys automatically
   - You'll get a live URL in seconds!

---

### Option B: Manual Deployment (CLI)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from project directory:**
   ```bash
   cd Codesensei
   vercel
   ```

4. **Follow the prompts:**
   - Select account
   - Link to existing project? (say `no` first time)
   - Set project name
   - Confirm settings
   - Deployment complete! ✅

---

## Step 4: Add API Key Securely

### In Vercel Dashboard:
1. Go to your project on Vercel
2. Settings → **Environment Variables**
3. Add new variable:
   - Name: `VITE_API_KEY`
   - Value: `YOUR_GEMINI_API_KEY`
4. Re-deploy:
   ```bash
   vercel --prod
   ```

### Update Code.js:
Replace the hardcoded API key with:
```javascript
const API_KEY = process.env.VITE_API_KEY || "YOUR_FALLBACK_KEY";
```

---

## Step 5: Enable Auto-Deploys

Vercel automatically deploys on every push to main branch! 🎉

To verify:
1. Make a small change to your code
2. Push to GitHub
3. Vercel automatically rebuilds and deploys
4. Check your live site in seconds

---

## 🎯 Your Vercel URL

After deployment, you'll get a URL like:

```
https://codesensei-xxxxx.vercel.app
```

**Share this link with friends and colleagues!**

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Page loads without errors
- [ ] Can paste code in editor
- [ ] Run Analysis button works
- [ ] Animations play smoothly
- [ ] Chat widget opens on error click
- [ ] All UI elements responsive on mobile

---

## 🐛 Troubleshooting

### Site shows blank page
- Check browser console for errors (F12)
- Verify all CSS/JS files loaded (Network tab)
- Clear cache and reload

### API calls failing
- Verify API key is correctly set
- Check Vercel environment variables
- Ensure API key is still valid (not expired)
- Check API usage limits in Google Cloud

### Animations not working
- Supported in all modern browsers
- Check browser console for JS errors
- Verify CSS file fully loaded

---

## 📊 Performance Metrics

After deployment, monitor performance:

1. **Go to Vercel Dashboard**
2. **Click on your project**
3. **Analytics tab:**
   - Monitor page speed
   - Track requests
   - View error logs

---

## 🔄 Update & Redeploy

### To push updates:
```bash
git add .
git commit -m "feat: Your changes"
git push origin main
```

Vercel automatically rebuilds and deploys! ✨

### To manually redeploy:
```bash
vercel --prod
```

---

## 🔐 Security Best Practices

✅ **DO:**
- Keep API keys in environment variables
- Use `.gitignore` to prevent key leaks
- Rotate keys regularly
- Monitor API usage

❌ **DON'T:**
- Commit API keys to Git
- Share keys publicly
- Use same key across projects
- Leave console.log() with sensitive data

---

## 🎁 Pro Features (Optional)

### Custom Domain
1. Go to Project Settings
2. Domains tab
3. Add custom domain
4. Follow DNS setup instructions

### Team Collaboration
1. Settings → General
2. Invite team members
3. Set permissions
4. Collaborate seamlessly

### Analytics & Monitoring
- Real-time traffic analytics
- Error tracking
- Performance metrics
- Usage reports

---

## 📞 Need Help?

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **CodeSensei Issues:** GitHub Issues tab
- **Google AI Studio:** [makersuite.google.com](https://makersuite.google.com)

---

## 🎉 Success!

Your CodeSensei is now live on Vercel with:
- ✨ Full animations and effects
- 🚀 Production-ready deployment
- 🔄 Automatic updates on push
- 📱 Mobile optimized
- ⚡ Fast CDN delivery

**Share your deployment URL and start analyzing code! 🥷**

---

**Last Updated:** May 28, 2026  
**Version:** 2.0.0 (Production Ready)
