# 🚀 Setup Guide for CertiChain

Complete guide to set up and deploy your CertiChain application with all new features.

## 📦 What's New in v2.0

✅ **Supabase Backend Integration** - Full backend with PostgreSQL database  
✅ **Dark/Light Theme** - Beautiful theme switching with animations  
✅ **Framer Motion Animations** - Smooth, professional animations  
✅ **Vercel Deployment** - Ready for production deployment  
✅ **Enhanced UI** - Modern design with glass morphism and gradients  

## 🛠️ Step 1: Local Setup

### 1.1 Install Dependencies
```bash
npm install
```

This installs:
- `@supabase/supabase-js` - Backend client
- `framer-motion` - Animation library
- `lucide-react` - Icon library
- `react-router-dom` - Routing
- All UI dependencies

### 1.2 Environment Configuration
```bash
cp .env.example .env
```

Your `.env` should look like:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_NAME=Certificate Management System
```

**⚠️ Important**: Don't commit `.env` to Git!

## 🗄️ Step 2: Supabase Setup

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and region
4. Set database password (save it!)
5. Wait for project to initialize (~2 minutes)

### 2.2 Run Database Schema

1. In Supabase Dashboard, click **SQL Editor** (left sidebar)
2. Open `supabase/schema.sql` from your project
3. Copy the entire SQL content
4. Paste in SQL Editor
5. Click **Run** or press `Ctrl+Enter`

This creates:
- ✅ `users` table with RLS policies
- ✅ `certificates` table with RLS policies
- ✅ Automatic user profile creation trigger
- ✅ Indexes for performance
- ✅ Security policies

### 2.3 Get API Credentials

1. Go to **Settings** > **API** in Supabase Dashboard
2. Copy these values:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
3. Update your `.env` file

### 2.4 Configure Authentication

1. Go to **Authentication** > **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)
4. Go to **URL Configuration**
5. Add Site URL: `http://localhost:5173`
6. Add Redirect URLs:
   - `http://localhost:5173/**`
   - `https://your-domain.vercel.app/**` (add after deployment)

## 🎨 Step 3: Test Locally

### 3.1 Start Development Server
```bash
npm run dev
```

App runs at: http://localhost:5173

### 3.2 Test Features

1. **Theme Toggle**
   - Click sun/moon icon in header
   - Test light, dark, and system themes
   - Check animations

2. **Authentication**
   - Click "Sign In" button
   - Register with email/password
   - Verify user appears in Supabase Auth

3. **Certificate Issuance**
   - Go to Issue Certificate page
   - Fill in details
   - Generate and download
   - Check it saves to database

4. **Verification**
   - Go to Verify page
   - Enter certificate ID
   - Check verification works

## 🚀 Step 4: Deploy to Vercel

### 4.1 Prepare for Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add Supabase backend and theme support"
   git push origin main
   ```

2. **Build locally to test**
   ```bash
   npm run build
   npm run preview
   ```

### 4.2 Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

5. Add **Environment Variables**:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key
   VITE_APP_NAME = Certificate Management System
   ```

6. Click **Deploy**

### 4.3 Update Supabase URLs

After deployment:
1. Copy your Vercel URL (e.g., `your-app.vercel.app`)
2. Go to Supabase **Authentication** > **URL Configuration**
3. Add to Redirect URLs:
   - `https://your-app.vercel.app/**`
4. Update Site URL to your production domain

## 🎯 Step 5: Test Production

Visit your Vercel URL and test:

1. ✅ Theme switching works
2. ✅ Animations are smooth
3. ✅ Sign up/Login works
4. ✅ Certificate creation saves to database
5. ✅ Verification works
6. ✅ Dashboard shows certificates

## 🔧 Customization Guide

### Change Theme Colors

Edit `src/index.css`:
```css
:root {
  --primary: 220 90% 56%;      /* Change primary color */
  --accent: 262 83% 58%;       /* Change accent color */
  --success: 142 71% 45%;      /* Change success color */
}
```

### Modify Animations

Edit animation components in `src/components/ui/animated-components.tsx`:
```typescript
// Change animation duration
transition={{ duration: 0.6, delay }}

// Change animation type
transition={{ type: "spring", stiffness: 100 }}
```

### Update App Name

1. Change in `.env`:
   ```env
   VITE_APP_NAME=Your Custom Name
   ```

2. Update in `src/components/Header.tsx`:
   ```tsx
   <span className="text-xl">Your App Name</span>
   ```

## 🐛 Troubleshooting

### Build Errors

**Error**: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

**Error**: "Environment variables not loaded"
- Ensure variables start with `VITE_`
- Restart dev server after changes
- Check `.env` is in project root

### Supabase Errors

**Error**: "No such table"
- Run the SQL schema again
- Check table names match

**Error**: "Row Level Security"
- Ensure RLS policies are enabled
- Check user is authenticated
- Review policies in SQL Editor

### Deployment Issues

**Error**: "Build failed on Vercel"
- Check build works locally first
- Verify environment variables are set
- Check Vercel build logs

**Error**: "Auth redirect not working"
- Add Vercel URL to Supabase redirect URLs
- Include wildcard: `https://your-app.vercel.app/**`

## 📚 Additional Resources

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [React Router Docs](https://reactrouter.com/)

### Database Management
- **Supabase Table Editor** - Visual table editor
- **SQL Editor** - Run custom queries
- **Database Backups** - Available in project settings

### Monitoring
- **Vercel Analytics** - Page views and performance
- **Supabase Logs** - Database and auth logs
- **Browser Console** - Client-side errors

## ✅ Checklist

Before going live:

- [ ] Database schema applied
- [ ] RLS policies enabled
- [ ] Environment variables set
- [ ] Authentication tested
- [ ] Certificate issuance works
- [ ] Verification works
- [ ] Dashboard loads
- [ ] Theme toggle works
- [ ] Animations smooth
- [ ] Build successful
- [ ] Deployed to Vercel
- [ ] Production tested
- [ ] Domain configured (optional)
- [ ] SSL certificate active

## 🎉 You're Done!

Your CertiChain application is now:
- ✅ Running with Supabase backend
- ✅ Deployed to Vercel
- ✅ Featuring beautiful animations
- ✅ Supporting dark/light themes
- ✅ Production-ready

Enjoy your modern certificate management system! 🚀

---

Need help? Check:
- `DEPLOYMENT.md` for deployment details
- `README.md` for feature overview
- Supabase documentation for database help
- Vercel documentation for deployment help
