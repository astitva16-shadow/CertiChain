# Apply Database Schema to Supabase
# This script applies the schema.sql to your Supabase database

Write-Host "🚀 Applying database schema to Supabase..." -ForegroundColor Cyan

# Read the schema file
$schemaPath = "supabase\schema.sql"
$schema = Get-Content $schemaPath -Raw

Write-Host "✅ Schema file loaded" -ForegroundColor Green
Write-Host ""
Write-Host "📋 To apply this schema to your Supabase database:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Go to: https://supabase.com/dashboard/project/sowkbqvisthqieotosls/sql/new" -ForegroundColor White
Write-Host ""
Write-Host "2. Copy the contents from: supabase\schema.sql" -ForegroundColor White
Write-Host ""
Write-Host "3. Paste into the SQL Editor and click 'Run'" -ForegroundColor White
Write-Host ""
Write-Host "OR use the Supabase CLI (if you have Docker installed):" -ForegroundColor Yellow
Write-Host ""
Write-Host "   supabase db reset --linked" -ForegroundColor White
Write-Host ""
Write-Host "📝 Schema Preview (first 500 characters):" -ForegroundColor Cyan
Write-Host $schema.Substring(0, [Math]::Min(500, $schema.Length)) -ForegroundColor Gray
Write-Host "..." -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Project linked to: sowkbqvisthqieotosls" -ForegroundColor Green
