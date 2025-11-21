# 🚀 Quick Reference Card

## Essential Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run linter

# Git
git add .
git commit -m "message"
git push origin main
```

## Environment Variables (.env)

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_APP_NAME=Certificate Management System
```

## Supabase Quick Setup

1. **Create Project**: [supabase.com](https://supabase.com)
2. **Run Schema**: Copy `supabase/schema.sql` → SQL Editor → Run
3. **Get Keys**: Settings → API → Copy URL & anon key
4. **Configure Auth**: Authentication → URL Configuration → Add URLs

## Vercel Quick Deploy

1. **Push Code**: `git push origin main`
2. **Import**: [vercel.com/new](https://vercel.com/new)
3. **Configure**: Framework = Vite, Add env vars
4. **Deploy**: Click Deploy button

## Key Files

```
Configuration:
├── .env                    # Your environment variables
├── vercel.json            # Vercel deployment config
└── supabase/schema.sql    # Database schema

Theme:
├── src/components/ThemeProvider.tsx
├── src/components/ThemeToggle.tsx
└── src/index.css          # CSS variables

Backend:
├── src/lib/supabase.ts    # Supabase client
└── src/lib/database.types.ts

Animations:
├── src/components/ui/animated-button.tsx
└── src/components/ui/animated-components.tsx
```

## Common Issues & Fixes

### Environment Variables Not Working
```bash
# Restart dev server
npm run dev
```

### Build Fails
```bash
# Clean and reinstall
rm -rf node_modules
npm install
npm run build
```

### Supabase Connection Error
- Check credentials in .env
- Verify database schema is applied
- Check Supabase project is active

### Theme Not Switching
- Check ThemeProvider wraps App
- Clear browser cache
- Check localStorage

## Database Tables

### users
- id, email, full_name, organization, created_at

### certificates
- id, user_id, certificate_id, recipient_name, recipient_email
- course_name, issue_date, certificate_data, qr_code
- is_verified, metadata, created_at

## Animation Components

```typescript
<FadeIn delay={0.2}>Content</FadeIn>
<SlideIn direction="left">Content</SlideIn>
<ScaleIn delay={0.3}>Content</ScaleIn>
<AnimatedCard>Content</AnimatedCard>
<AnimatedButton>Click Me</AnimatedButton>
<FloatingElement>Floats</FloatingElement>
```

## Theme Usage

```typescript
import { useTheme } from '@/components/ThemeProvider';

const { theme, setTheme } = useTheme();
setTheme('dark');  // 'light' | 'dark' | 'system'
```

## Supabase Functions

```typescript
import { supabase, signIn, createCertificate } from '@/lib/supabase';

// Auth
await signIn(email, password);
await signUp(email, password);
await signOut();

// Certificates
await createCertificate(data);
await getCertificates(userId);
await verifyCertificate(certId);
```

## URLs

- **Local Dev**: http://localhost:5173
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard

## Checklist Before Going Live

- [ ] .env configured with Supabase credentials
- [ ] Database schema applied
- [ ] Authentication tested
- [ ] Certificate creation works
- [ ] Verification works
- [ ] Theme toggle works
- [ ] Build successful locally
- [ ] Pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set in Vercel
- [ ] Production tested
- [ ] Supabase redirect URLs updated

## Need Help?

📖 **Documentation**:
- `README.md` - Overview
- `SETUP_GUIDE.md` - Detailed setup
- `DEPLOYMENT.md` - Deployment guide
- `FEATURES.md` - Feature list

🔗 **External Docs**:
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [Framer Motion](https://www.framer.com/motion/)

---

💡 **Pro Tip**: Save this file for quick reference during development!
