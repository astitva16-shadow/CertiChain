# 🚀 Deploy CertiChain to Netlify

Complete guide to deploy your certificate management system to Netlify.

## 📋 Prerequisites

- GitHub account with your CertiChain repository
- Netlify account (free tier is fine) - [Sign up here](https://app.netlify.com/signup)
- Supabase credentials ready

## 🎯 Quick Deploy Steps

### Step 1: Push to GitHub (Already Done! ✅)

Your code is already on GitHub:
```
https://github.com/astitva16-shadow/CertiChain
```

### Step 2: Connect to Netlify

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Log in with GitHub (recommended)

2. **Import Project**
   - Click **"Add new site"** → **"Import an existing project"**
   - Or click: https://app.netlify.com/start

3. **Connect to GitHub**
   - Click **"Deploy with GitHub"**
   - Authorize Netlify to access your repositories
   - Search for and select: **CertiChain**

### Step 3: Configure Build Settings

On the deploy configuration page, enter:

```
┌─────────────────────────────────────────────┐
│ Build Settings                              │
├─────────────────────────────────────────────┤
│ Branch to deploy:                           │
│ [main                                    ▼] │
│                                             │
│ Base directory:                             │
│ [                                         ] │
│ (leave empty)                               │
│                                             │
│ Build command:                              │
│ [npm run build                            ] │
│                                             │
│ Publish directory:                          │
│ [dist                                     ] │
│                                             │
└─────────────────────────────────────────────┘
```

**Important values:**
- **Branch**: `main`
- **Base directory**: (leave empty)
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 4: Add Environment Variables

**BEFORE** clicking "Deploy site", scroll down to **"Advanced build settings"** and add environment variables:

Click **"New variable"** and add these 3 variables:

#### Variable 1:
```
Key:   VITE_SUPABASE_URL
Value: https://sowkbqvisthqieotosls.supabase.co
```

#### Variable 2:
```
Key:   VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvd2ticXZpc3RocWllb3Rvc2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjM1ODQsImV4cCI6MjA3OTI5OTU4NH0.OQcHq92XEdaGr_MEuICguRr8N9qDxDbDnLh5X--Qa4A
```

#### Variable 3:
```
Key:   VITE_APP_NAME
Value: Certificate Management System
```

### Step 5: Deploy!

1. Click **"Deploy CertiChain"** button
2. Wait for build to complete (2-3 minutes)
3. Watch the deploy logs for any errors

## 🎨 After Deployment

### 1. Get Your Netlify URL

After successful deployment:
- Your site will be at: `https://random-name-123.netlify.app`
- Example: `https://certichain-astitva.netlify.app`

### 2. Update Supabase Redirect URLs

1. Go to Supabase Dashboard:
   ```
   https://supabase.com/dashboard/project/sowkbqvisthqieotosls/auth/url-configuration
   ```

2. Add your Netlify URL:
   ```
   Site URL: https://your-app.netlify.app
   
   Redirect URLs:
   - http://localhost:5174/**
   - https://your-app.netlify.app/**
   ```

3. Click **Save**

### 3. Customize Domain (Optional)

In Netlify dashboard:
1. Go to **Site settings** → **Domain management**
2. Click **Options** → **Edit site name**
3. Change to: `certichain-astitva` (or any available name)
4. Your URL becomes: `https://certichain-astitva.netlify.app`

Or add a custom domain:
1. Click **Add custom domain**
2. Enter your domain (e.g., `certichain.com`)
3. Follow DNS setup instructions

## 🔧 Post-Deployment Configuration

### Configure Redirects for SPA

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

Then commit and push:
```powershell
git add netlify.toml
git commit -m "feat: Add Netlify configuration"
git push
```

Netlify will automatically redeploy!

## 🎯 Environment Variables Management

### View/Edit Variables After Deployment

1. Go to Netlify Dashboard
2. Select your site
3. Go to **Site configuration** → **Environment variables**
4. Here you can:
   - View existing variables
   - Add new variables
   - Edit variable values
   - Delete variables

### Update a Variable

1. Click on the variable
2. Click **Edit**
3. Change the value
4. Click **Save**
5. Trigger a new deploy:
   - Go to **Deploys** tab
   - Click **Trigger deploy** → **Deploy site**

## 🔄 Automatic Deployments

Netlify automatically deploys when you push to GitHub!

```powershell
# Make changes
git add .
git commit -m "Update feature"
git push

# Netlify automatically detects and deploys! 🚀
```

### Deploy Previews

- Every pull request gets a preview URL
- Test changes before merging
- Preview URL format: `deploy-preview-[PR#]--your-site.netlify.app`

## ✅ Verification Checklist

After deployment, test these:

- [ ] Site loads at Netlify URL
- [ ] Theme toggle works (light/dark mode)
- [ ] All animations are smooth
- [ ] Can sign up with email/password
- [ ] User appears in Supabase Auth
- [ ] Can issue a certificate
- [ ] Certificate saves to Supabase
- [ ] Dashboard shows certificates
- [ ] Can verify certificate by ID
- [ ] QR code works
- [ ] No console errors (F12)

## 🐛 Troubleshooting

### Build Failed

**Error**: "Build failed" or dependencies error
**Solution**:
1. Check build logs in Netlify
2. Verify `package.json` is committed
3. Make sure Node version is compatible
4. Try adding Node version in netlify.toml:
   ```toml
   [build.environment]
     NODE_VERSION = "18"
   ```

### "Cannot find module" Error

**Error**: Build fails with missing modules
**Solution**:
```powershell
# Clean install locally
rm -r node_modules
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Environment Variables Not Working

**Error**: App loads but can't connect to Supabase
**Solution**:
1. Check variables are spelled correctly (UPPERCASE)
2. No extra spaces in values
3. Redeploy after adding variables
4. Check browser console for specific error

### Site Not Found (404)

**Error**: Routes show 404 when refreshed
**Solution**: Add the `netlify.toml` file with redirects (see above)

### Build Takes Too Long

**Error**: Build timeout
**Solution**: Build should complete in 2-3 minutes. If taking longer:
1. Check for infinite loops in code
2. Verify dependencies aren't too large
3. Contact Netlify support if persistent

## 📊 Netlify Features to Use

### 1. Deploy Logs
- View real-time build progress
- Debug build errors
- See deployment history

### 2. Analytics
- Free basic analytics
- Page views, unique visitors
- Geographic data

### 3. Forms (Optional)
- Add contact forms easily
- No backend needed
- Built-in spam filtering

### 4. Functions (Optional)
- Serverless functions
- Great for API endpoints
- Run backend code

### 5. Split Testing
- A/B test your site
- Compare versions
- Traffic splitting

## 🔗 Useful Links

### Netlify
- **Dashboard**: https://app.netlify.com
- **Documentation**: https://docs.netlify.com
- **Status**: https://www.netlifystatus.com

### Your Project
- **GitHub Repo**: https://github.com/astitva16-shadow/CertiChain
- **Supabase**: https://supabase.com/dashboard/project/sowkbqvisthqieotosls
- **Local Dev**: http://localhost:5174/

## 🎉 You're Done!

Your app is now:
- ✅ Deployed on Netlify
- ✅ Connected to Supabase
- ✅ Auto-deploying on every push
- ✅ Production-ready
- ✅ HTTPS enabled (automatic)
- ✅ CDN distributed globally

### What You Get

- **Global CDN**: Fast loading worldwide
- **Auto SSL**: HTTPS certificate included
- **Continuous Deployment**: Push to deploy
- **Deploy Previews**: Test before going live
- **Free Hosting**: No credit card needed
- **99.9% Uptime**: Reliable hosting

## 🚀 Next Steps

1. **Custom Domain** (Optional)
   - Buy domain from Namecheap, GoDaddy, etc.
   - Connect to Netlify
   - Auto SSL certificate

2. **Set up CI/CD**
   - Already working! ✅
   - Push to GitHub = Auto deploy

3. **Monitor Performance**
   - Use Netlify Analytics
   - Check Supabase usage
   - Monitor error logs

4. **Share Your App**
   - Send Netlify URL to users
   - Share on social media
   - Add to your portfolio!

---

**Your CertiChain is now live on Netlify!** 🎊

Visit your Netlify URL and start issuing certificates! 🎓
