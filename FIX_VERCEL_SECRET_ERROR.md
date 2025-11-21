# ⚠️ FIXING: "Secret does not exist" Error on Vercel

## The Problem

You're seeing this error:
```
Environment Variable "VITE_SUPABASE_URL" references Secret "vite_supabase_url", which does not exist.
```

## Why This Happens

Vercel has two features:
1. **Environment Variables** - Direct values you type in
2. **Secrets** - Referenced values stored separately (lowercase, auto-created)

The error means Vercel is trying to find a secret, but we want to use direct environment variables.

## ✅ SOLUTION: Add Variables Directly (Not as Secrets)

### Step-by-Step Fix

#### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click on your **CertiChain** project
- Click **Settings** tab
- Click **Environment Variables** on the left

#### 2. Delete Any Existing Variables (if they exist)
- If you see any variables with errors, delete them
- Click the trash icon next to each one
- Confirm deletion

#### 3. Add Variables One by One

**For Each Variable Below:**
1. Click "Add New" button
2. In the **Name/Key** field, type the variable name EXACTLY (all caps)
3. In the **Value** field, paste the value
4. Select ALL environments:
   - ☑ Production
   - ☑ Preview
   - ☑ Development
5. Click **Save** (don't click any other options about secrets!)

---

### Variable 1: VITE_SUPABASE_URL

**Name (Key):**
```
VITE_SUPABASE_URL
```

**Value:**
```
https://sowkbqvisthqieotosls.supabase.co
```

**Important**: Type the URL directly in the value field. Don't reference anything.

---

### Variable 2: VITE_SUPABASE_ANON_KEY

**Name (Key):**
```
VITE_SUPABASE_ANON_KEY
```

**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNvd2ticXZpc3RocWllb3Rvc2xzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MjM1ODQsImV4cCI6MjA3OTI5OTU4NH0.OQcHq92XEdaGr_MEuICguRr8N9qDxDbDnLh5X--Qa4A
```

**Important**: Paste the entire key directly. It should start with `eyJhbGc...`

---

### Variable 3: VITE_APP_NAME

**Name (Key):**
```
VITE_APP_NAME
```

**Value:**
```
Certificate Management System
```

---

#### 4. Verify They Look Correct

After adding all three, your environment variables page should show:

```
┌─────────────────────────────────────────────────────┐
│ Name                    | Value         | Env       │
├─────────────────────────────────────────────────────┤
│ VITE_SUPABASE_URL       | https://sowk… | P P D     │
│ VITE_SUPABASE_ANON_KEY  | eyJhbGciOiJ… | P P D     │
│ VITE_APP_NAME           | Certificate…  | P P D     │
└─────────────────────────────────────────────────────┘

P = Production, P = Preview, D = Development
```

#### 5. Redeploy

1. Go to **Deployments** tab
2. Find the latest deployment
3. Click the three dots (•••) menu
4. Click **Redeploy**
5. Wait for it to complete

---

## 🎯 Key Points to Avoid the Error

### ✅ DO:
- Use UPPERCASE names: `VITE_SUPABASE_URL`
- Paste values directly into the Value field
- Select all three environments
- Click "Save" after each variable

### ❌ DON'T:
- Don't use lowercase: `vite_supabase_url`
- Don't try to reference secrets: `@vite_supabase_url`
- Don't use the "Reference Secret" option
- Don't skip any environments

---

## 📸 Visual Guide

When adding a variable, the form should look like:

```
┌────────────────────────────────────────────────┐
│ Add New Environment Variable                   │
├────────────────────────────────────────────────┤
│                                                │
│ Name: [VITE_SUPABASE_URL                    ]  │
│                                                │
│ Value:                                         │
│ ┌────────────────────────────────────────────┐ │
│ │ https://sowkbqvisthqieotosls.supabase.co  │ │
│ └────────────────────────────────────────────┘ │
│                                                │
│ Environments:                                  │
│ ☑ Production                                   │
│ ☑ Preview                                      │
│ ☑ Development                                  │
│                                                │
│                        [Cancel]  [Save]        │
└────────────────────────────────────────────────┘
```

**Important**: The Value field should contain the ACTUAL URL/KEY, not a reference!

---

## 🐛 If Error Persists

### Check These:

1. **Variable names are EXACT**
   - Must be: `VITE_SUPABASE_URL` (not `vite_supabase_url`)
   - Copy the names from this document to be sure

2. **No typos in values**
   - Copy-paste the values from this document
   - Don't manually type them

3. **All environments selected**
   - All three boxes should be checked
   - Production, Preview, AND Development

4. **Clean slate approach**
   - Delete ALL existing environment variables
   - Add fresh ones from scratch
   - Follow the steps exactly

### Still Having Issues?

Try using Vercel CLI:

```powershell
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Add environment variables via CLI
vercel env add VITE_SUPABASE_URL production
# When prompted, paste: https://sowkbqvisthqieotosls.supabase.co

vercel env add VITE_SUPABASE_URL preview
# Paste same value

vercel env add VITE_SUPABASE_URL development
# Paste same value

# Repeat for other two variables...
```

---

## ✅ Success Checklist

After fixing, you should have:

- [ ] 3 environment variables visible in Vercel settings
- [ ] Each variable has all 3 environments selected
- [ ] Variable names are UPPERCASE
- [ ] Values are pasted directly (not referenced)
- [ ] Redeployed after adding variables
- [ ] Deployment succeeds (green checkmark)
- [ ] App loads without errors
- [ ] No "secret does not exist" errors

---

## 🎯 Final Check

Visit your Vercel deployment URL and:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Should see NO Supabase errors
4. Theme toggle should work
5. Try signing up - should work!

---

**Next Step**: Add the variables using the exact steps above, then redeploy! 🚀
