# 🚀 Vercel Deployment - Environment Variables Setup

## Issue: Environment Variable References Non-Existent Secret

Vercel requires exact case-sensitive secret names. Here's how to fix it:

## ✅ Solution: Add Environment Variables in Vercel

### Step 1: Go to Vercel Dashboard

1. Visit [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your **CertiChain** project
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add These Environment Variables

Add the following variables with their values:

#### Variable 1: VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://your-project-id.supabase.co
Environment: Production, Preview, Development (select all)
```

#### Variable 2: VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your anon key)
Environment: Production, Preview, Development (select all)
```

#### Variable 3: VITE_APP_NAME
```
Name: VITE_APP_NAME
Value: Certificate Management System
Environment: Production, Preview, Development (select all)
```

### Step 3: Get Your Supabase Credentials

If you don't have these yet:

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Select your project (or create one)
3. Go to **Settings** (gear icon) → **API**
4. Copy:
   - **Project URL** → This is your `VITE_SUPABASE_URL`
   - **anon/public key** → This is your `VITE_SUPABASE_ANON_KEY`

### Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click on the latest deployment
3. Click **Redeploy** button
4. Select **Use existing Build Cache** (optional)
5. Click **Redeploy**

## 🔧 Alternative: Using Vercel CLI

If you prefer using the command line:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add VITE_SUPABASE_URL
# When prompted, enter: https://your-project-id.supabase.co
# Select: Production, Preview, Development

vercel env add VITE_SUPABASE_ANON_KEY
# When prompted, enter your anon key
# Select: Production, Preview, Development

vercel env add VITE_APP_NAME
# When prompted, enter: Certificate Management System
# Select: Production, Preview, Development

# Redeploy
vercel --prod
```

## ⚠️ Important Notes

### DO NOT use "Secrets" feature for these variables
- Secrets are lowercase and reference-based
- Environment Variables are direct and case-sensitive
- Use **Environment Variables**, not Secrets

### Variable Names Must Match Exactly
```
✅ Correct: VITE_SUPABASE_URL
❌ Wrong: vite_supabase_url
❌ Wrong: SUPABASE_URL
```

### All VITE_ Prefixed Variables
Vite requires environment variables to start with `VITE_` to be accessible in the browser.

## 🎯 Quick Checklist

Before redeploying, verify:

- [ ] Variable names are UPPERCASE with underscores
- [ ] All three variables are added
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Values are correct (no extra spaces)
- [ ] Using "Environment Variables" not "Secrets"

## 🐛 Troubleshooting

### Error: "Variable does not exist"
- Check variable name case (must be UPPERCASE)
- Ensure using Environment Variables, not Secrets
- Verify all environments are selected

### Error: "Supabase connection failed"
- Check VITE_SUPABASE_URL is correct
- Verify VITE_SUPABASE_ANON_KEY is complete
- Ensure no trailing spaces in values

### Build succeeds but app doesn't work
- Check browser console for errors
- Verify environment variables are loaded
- Check Network tab for API calls

## 📸 Screenshot Guide

1. **Settings → Environment Variables**
   ```
   Name: VITE_SUPABASE_URL
   Value: [paste your URL]
   [x] Production
   [x] Preview  
   [x] Development
   ```

2. **Click "Save"** for each variable

3. **Go to Deployments** → Click latest → **Redeploy**

## ✅ Success Verification

After redeploying:

1. Visit your deployment URL
2. Open browser DevTools (F12)
3. Go to Console tab
4. Check for errors
5. Try signing up/logging in
6. Verify theme toggle works
7. Test certificate creation

## 🔗 Useful Links

- [Vercel Environment Variables Docs](https://vercel.com/docs/concepts/projects/environment-variables)
- [Supabase Dashboard](https://supabase.com/dashboard)
- [Your GitHub Repo](https://github.com/astitva16-shadow/CertiChain)

---

Need more help? Check the main DEPLOYMENT.md file for complete deployment instructions.
