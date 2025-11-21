# 🔑 Vercel Environment Variables Setup

## Required Environment Variables for Vercel Deployment

Add these **3 environment variables** in your Vercel project settings:

### 1. VITE_SUPABASE_URL
```
Name: VITE_SUPABASE_URL
Value: https://sowkbqvisthqieotosls.supabase.co
Environments: ☑ Production  ☑ Preview  ☑ Development
```

### 2. VITE_SUPABASE_ANON_KEY
```
Name: VITE_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvd2ticXZpc3RocWllb3Rvc2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjM1ODQsImV4cCI6MjA3OTI5OTU4NH0.OQcHq92XEdaGr_MEuICguRr8N9qDxDbDnLh5X--Qa4A
Environments: ☑ Production  ☑ Preview  ☑ Development
```

### 3. VITE_APP_NAME
```
Name: VITE_APP_NAME
Value: Certificate Management System
Environments: ☑ Production  ☑ Preview  ☑ Development
```

## 📋 Step-by-Step Guide

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/dashboard
2. Select your **CertiChain** project
3. Click **Settings** tab
4. Click **Environment Variables** in the left sidebar

### Step 2: Add First Variable
1. Click **Add New** button
2. Enter:
   - **Key**: `VITE_SUPABASE_URL`
   - **Value**: `https://sowkbqvisthqieotosls.supabase.co`
3. Select all environments:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
4. Click **Save**

### Step 3: Add Second Variable
1. Click **Add New** button again
2. Enter:
   - **Key**: `VITE_SUPABASE_ANON_KEY`
   - **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvd2ticXZpc3RocWllb3Rvc2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjM1ODQsImV4cCI6MjA3OTI5OTU4NH0.OQcHq92XEdaGr_MEuICguRr8N9qDxDbDnLh5X--Qa4A`
3. Select all environments
4. Click **Save**

### Step 4: Add Third Variable
1. Click **Add New** button again
2. Enter:
   - **Key**: `VITE_APP_NAME`
   - **Value**: `Certificate Management System`
3. Select all environments
4. Click **Save**

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click the three dots (•••) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (~2-3 minutes)

## ✅ Verification

After redeployment, your app should:
- ✅ Load without errors
- ✅ Show theme toggle
- ✅ Allow sign up/login
- ✅ Connect to Supabase successfully

## 🔗 Quick Copy-Paste Format

If you prefer to copy-paste, here's the format:

```
VITE_SUPABASE_URL=https://sowkbqvisthqieotosls.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvd2ticXZpc3RocWllb3Rvc2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjM1ODQsImV4cCI6MjA3OTI5OTU4NH0.OQcHq92XEdaGr_MEuICguRr8N9qDxDbDnLh5X--Qa4A
VITE_APP_NAME=Certificate Management System
```

## 📸 What It Should Look Like

```
┌────────────────────────────────────────────────────────┐
│ Environment Variables                                  │
├────────────────────────────────────────────────────────┤
│ VITE_SUPABASE_URL              Production Preview Dev  │
│ https://sowkbqvisthqieotosls.  ☑         ☑        ☑    │
│                                                        │
│ VITE_SUPABASE_ANON_KEY         Production Preview Dev  │
│ eyJhbGciOiJIUzI1NiIsInR5cC...  ☑         ☑        ☑    │
│                                                        │
│ VITE_APP_NAME                  Production Preview Dev  │
│ Certificate Management System  ☑         ☑        ☑    │
└────────────────────────────────────────────────────────┘
```

## ⚠️ Important Notes

### Why These Variables?
- **VITE_SUPABASE_URL**: Your Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Public key for client access (safe to expose)
- **VITE_APP_NAME**: Your application name

### Security
- ✅ Anon key is safe to use client-side (it's public)
- ✅ Row Level Security (RLS) protects your data
- ✅ Never expose service_role key (keep it secret)
- ✅ Database password is NOT needed for frontend

### Why NOT add Database Password?
The database password (`@Astitvay2276`) is:
- ❌ NOT needed for frontend/Vercel
- ❌ Only used for direct database connections
- ❌ Should never be in frontend code
- ✅ Used only in Supabase CLI or backend services

## 🐛 Troubleshooting

### Build Fails
**Error**: "Environment variable not found"
**Solution**: Make sure all three variables are added exactly as shown

### App Loads But Can't Connect
**Error**: "Failed to connect to Supabase"
**Solution**: 
1. Check variables are spelled correctly
2. Verify no extra spaces in values
3. Ensure all environments are checked

### Still Getting Errors?
1. Check browser console for specific errors
2. Verify Supabase project is active
3. Check redirect URLs in Supabase Auth settings

## 🎯 After Adding Variables

Once variables are added and redeployed:

1. **Update Supabase Redirect URLs**:
   - Go to: https://supabase.com/dashboard/project/sowkbqvisthqieotosls/auth/url-configuration
   - Add your Vercel URL: `https://your-app.vercel.app/**`

2. **Test Your Deployment**:
   - Visit your Vercel URL
   - Try signing up
   - Create a certificate
   - Verify it works!

## ✅ Checklist

Before marking as complete:

- [ ] All 3 environment variables added
- [ ] All environments selected (Prod, Preview, Dev)
- [ ] Redeployed after adding variables
- [ ] Deployment successful (no build errors)
- [ ] App loads on Vercel URL
- [ ] Theme toggle works
- [ ] Can sign up/login
- [ ] Can create certificates
- [ ] Supabase redirect URLs updated

---

**Status**: ⏳ Ready to add to Vercel
**Next**: Add variables and redeploy
