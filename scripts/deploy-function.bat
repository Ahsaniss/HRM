@echo off
REM filepath: c:\Users\Ahsan\Desktop\hrm clone\performance-pulse-46\deploy-function.bat
echo ========================================
echo   Supabase Edge Function Deployment
echo ========================================
echo.

REM Step 1: Login
echo Step 1: Login to Supabase...
echo A browser window will open for authentication.
npx supabase@latest login
if %ERRORLEVEL% NEQ 0 (
    echo Error: Login failed
    pause
    exit /b 1
)

echo.
echo ✅ Login successful!
echo.

REM Step 2: Link project
echo Step 2: Link to your Supabase project
echo.
echo Go to: https://app.supabase.com/projects
echo Click your project → Settings → General
echo Copy the "Reference ID"
echo.
set /p PROJECT_REF=Paste Project Reference ID: 

npx supabase@latest link --project-ref %PROJECT_REF%
if %ERRORLEVEL% NEQ 0 (
    echo Error: Project linking failed
    pause
    exit /b 1
)

echo.
echo ✅ Project linked!
echo.

REM Step 3: Set secrets
echo Step 3: Set environment variables...
echo.
npx supabase@latest secrets set SUPABASE_URL=https://%PROJECT_REF%.supabase.co

echo.
echo Go to: https://app.supabase.com/project/%PROJECT_REF%/settings/api
echo Copy the "service_role" key (secret!)
echo.
set /p SERVICE_KEY=Paste Service Role Key: 

npx supabase@latest secrets set SUPABASE_SERVICE_ROLE_KEY=%SERVICE_KEY%

echo.
echo ✅ Secrets configured!
echo.

REM Step 4: Deploy
echo Step 4: Deploying function...
npx supabase@latest functions deploy create-employee --no-verify-jwt

if %ERRORLEVEL% NEQ 0 (
    echo Error: Deployment failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ DEPLOYMENT SUCCESSFUL!
echo ========================================
echo.
echo Function URL:
echo https://%PROJECT_REF%.supabase.co/functions/v1/create-employee
echo.
echo You can test it with:
echo curl -X POST https://%PROJECT_REF%.supabase.co/functions/v1/create-employee
echo.
pause