@echo off
echo ========================================
echo   GemBooth - Deploy Edge Functions
echo ========================================
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Supabase CLI not found. Installing via npm...
    npx supabase@latest --version
    echo.
)

echo Step 1: Login to Supabase
echo Run this command in a separate terminal:
echo   npx supabase@latest login
echo.
pause

echo Step 2: Link to your project
echo Find your project ref at: https://supabase.com/dashboard/project/_/settings/general
set /p PROJECT_REF="Enter your project reference ID: "
echo.
npx supabase@latest link --project-ref %PROJECT_REF%
echo.

echo Step 3: Deploy process-image function
npx supabase@latest functions deploy process-image
echo.

echo Step 4: Deploy create-gif function
npx supabase@latest functions deploy create-gif
echo.

echo Step 5: Set Gemini API key secret
set /p GEMINI_KEY="Enter your Gemini API key (from .env.local): "
npx supabase@latest secrets set GEMINI_API_KEY=%GEMINI_KEY%
echo.

echo ========================================
echo   Deployment Complete!
echo ========================================
echo.
echo Next: Test the functions in Supabase dashboard
echo   Functions -^> process-image -^> Test
echo.
pause
