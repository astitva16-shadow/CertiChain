# ✅ Supabase Terminal Setup Complete!

## What's Been Configured

### 1. ✅ Supabase CLI Installed
- **Version**: 2.58.5
- **Installed via**: Scoop (Windows Package Manager)
- **Status**: Logged in and authenticated

### 2. ✅ Project Linked
- **Project**: CertiChain
- **Project ID**: sowkbqvisthqieotosls
- **Region**: South Asia (Mumbai)
- **Status**: ● Linked (active)

### 3. 🔧 Available Supabase Commands

```powershell
# Project Management
supabase projects list              # List all your projects
supabase link --project-ref <id>    # Link to a project
supabase unlink                     # Unlink from project

# Database Operations
supabase db push                    # Push migrations to remote
supabase db pull                    # Pull schema from remote
supabase db diff                    # Show schema differences
supabase db dump --remote           # Dump remote database

# Migrations
supabase migration new <name>       # Create new migration
supabase migration list             # List migrations
supabase migration up               # Apply migrations

# Functions
supabase functions list             # List Edge Functions
supabase functions deploy <name>    # Deploy a function

# Secrets
supabase secrets list               # List secrets
supabase secrets set NAME=value     # Set a secret

# General
supabase status                     # Show local status (needs Docker)
supabase start                      # Start local dev (needs Docker)
supabase stop                       # Stop local dev
```

## 📋 Next Step: Apply Database Schema

Since Docker is not installed (required for local Supabase development), you need to apply the schema manually:

### Option 1: Using Supabase Dashboard (Easiest)

1. **Open SQL Editor**:
   ```
   https://supabase.com/dashboard/project/sowkbqvisthqieotosls/sql/new
   ```

2. **Copy Schema**:
   - Open `supabase\schema.sql` in your editor
   - Copy all contents (Ctrl+A, Ctrl+C)

3. **Paste and Execute**:
   - Paste into SQL Editor
   - Click **RUN** button
   - Wait for success message

4. **Verify Tables Created**:
   - Go to Table Editor
   - You should see: `users` and `certificates` tables

### Option 2: Using Migration Files

Create a migration file:
```powershell
# Create migration from your schema
supabase migration new initial_schema

# Copy your schema.sql contents to the new migration file
# Then push to Supabase
supabase db push
```

## 🎯 Current Project Structure

```
E:\Astitva\PBL\pbl new\
├── .env                          # ✅ Configured with credentials
├── supabase/
│   ├── config.toml               # ✅ Supabase project config
│   ├── schema.sql                # 📄 Your database schema
│   └── migrations/               # 📁 For future migrations
├── src/
│   └── lib/
│       └── supabase.ts           # ✅ Supabase client configured
└── apply-schema.ps1              # 📜 Helper script
```

## 🔗 Quick Links

### Supabase Dashboard
- **Project Home**: https://supabase.com/dashboard/project/sowkbqvisthqieotosls
- **SQL Editor**: https://supabase.com/dashboard/project/sowkbqvisthqieotosls/sql/new
- **Table Editor**: https://supabase.com/dashboard/project/sowkbqvisthqieotosls/editor
- **Auth Settings**: https://supabase.com/dashboard/project/sowkbqvisthqieotosls/auth/users
- **API Settings**: https://supabase.com/dashboard/project/sowkbqvisthqieotosls/settings/api

### Local
- **App**: http://localhost:5174/
- **Project Folder**: E:\Astitva\PBL\pbl new

## 📊 Project Status Summary

| Component | Status | Details |
|-----------|--------|---------|
| Supabase CLI | ✅ Installed | v2.58.5 |
| Project Linked | ✅ Active | sowkbqvisthqieotosls |
| Local .env | ✅ Configured | URL + Anon Key set |
| Database Schema | ⏳ Pending | Run in SQL Editor |
| Authentication | ⏳ Pending | Configure after schema |
| Vercel Env Vars | ⏳ Pending | Add in Vercel dashboard |

## 🚀 Next Actions

1. **Apply Database Schema** (5 min)
   - Go to SQL Editor link above
   - Copy/paste from `supabase\schema.sql`
   - Click Run

2. **Configure Authentication** (2 min)
   - Go to Auth Settings
   - Add redirect URLs:
     - `http://localhost:5174/**`
     - `https://your-app.vercel.app/**`

3. **Test Locally** (3 min)
   - Visit http://localhost:5174/
   - Try signing up
   - Create a certificate

4. **Deploy to Vercel** (5 min)
   - Add environment variables
   - Redeploy
   - Test production

## 💡 Useful Commands for Your Workflow

```powershell
# Check project status
supabase projects list

# View your linked project
supabase projects list | Select-String "●"

# Create a new migration
supabase migration new add_new_feature

# Pull latest schema from remote
supabase db pull

# View differences between local and remote
supabase db diff

# List all Edge Functions
supabase functions list
```

## 🐛 Troubleshooting

### Command not found
```powershell
# Refresh PATH
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Need to reinstall CLI
```powershell
scoop uninstall supabase
scoop install supabase
```

### View CLI version
```powershell
supabase --version
```

---

**Status**: ✅ Supabase is linked and ready to use!  
**Next**: Apply the database schema in SQL Editor
