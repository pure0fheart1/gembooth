@echo off
echo Deploying create-checkout-session Edge Function...
echo.
echo You need to get your Supabase access token from:
echo https://supabase.com/dashboard/account/tokens
echo.
set /p TOKEN="Enter your Supabase access token: "
echo.
npx supabase functions deploy create-checkout-session --project-ref cahdabrkluflhlwexqsc --token %TOKEN%
echo.
pause
