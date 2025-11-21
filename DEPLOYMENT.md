# CertiChain - Deployment Guide

## Prerequisites

1. **Supabase Account**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

2. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Install Vercel CLI: `npm i -g vercel`

## Setup Supabase Database

1. Go to your Supabase project dashboard
2. Click on "SQL Editor"
3. Copy and paste the contents of `supabase/schema.sql`
4. Click "Run" to execute the SQL

This will create:
- `users` table for user profiles
- `certificates` table for certificate data
- Row Level Security policies
- Automatic user profile creation trigger

## Environment Variables

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   VITE_APP_NAME=Certificate Management System
   ```

### Vercel Deployment

1. Push your code to GitHub

2. Import project in Vercel:
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Framework Preset: Vite
   - Root Directory: ./

3. Add Environment Variables in Vercel:
   - Go to Project Settings > Environment Variables
   - Add the following:
     ```
     VITE_SUPABASE_URL = https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY = your-anon-key-here
     VITE_APP_NAME = Certificate Management System
     ```

4. Deploy:
   ```bash
   vercel --prod
   ```

## Build Commands

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Post-Deployment

1. **Test Authentication**
   - Sign up with a test account
   - Verify user profile is created in Supabase

2. **Test Certificate Issuance**
   - Issue a test certificate
   - Verify it's stored in the database

3. **Test Certificate Verification**
   - Use the certificate ID to verify
   - Check public access works without authentication

## Troubleshooting

### Environment Variables Not Working
- Ensure all variables start with `VITE_`
- Rebuild after adding new environment variables
- Clear browser cache

### Database Errors
- Check Row Level Security policies are enabled
- Verify user is authenticated for protected operations
- Check Supabase logs for detailed errors

### Build Errors
- Run `npm run build` locally first
- Check for TypeScript errors
- Ensure all dependencies are installed

## Domain Configuration

1. In Vercel Dashboard:
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. In Supabase Dashboard:
   - Go to Authentication > URL Configuration
   - Add your production URL to allowed redirect URLs

## Security Best Practices

1. **Never commit `.env` file**
2. **Rotate API keys periodically**
3. **Use Row Level Security** for all tables
4. **Enable 2FA** on Vercel and Supabase accounts
5. **Monitor usage** in both dashboards

## Support

For issues:
- Check Vercel deployment logs
- Check Supabase logs
- Review browser console for errors
