#!/bin/bash

echo "========================================"
echo "  GemBooth - Deploy Edge Functions"
echo "========================================"
echo

# Check if Supabase CLI is available
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI not found. Using npx..."
    SUPABASE_CMD="npx supabase@latest"
else
    SUPABASE_CMD="supabase"
fi

echo "Step 1: Login to Supabase"
echo "Opening browser for login..."
$SUPABASE_CMD login
echo

echo "Step 2: Link to your project"
echo "Find your project ref at: https://supabase.com/dashboard/project/_/settings/general"
read -p "Enter your project reference ID: " PROJECT_REF
echo
$SUPABASE_CMD link --project-ref $PROJECT_REF
echo

echo "Step 3: Deploy process-image function"
$SUPABASE_CMD functions deploy process-image
echo

echo "Step 4: Deploy create-gif function"
$SUPABASE_CMD functions deploy create-gif
echo

echo "Step 5: Set Gemini API key secret"
read -p "Enter your Gemini API key (from .env.local): " GEMINI_KEY
$SUPABASE_CMD secrets set GEMINI_API_KEY=$GEMINI_KEY
echo

echo "========================================"
echo "  Deployment Complete!"
echo "========================================"
echo
echo "Next: Test the functions in Supabase dashboard"
echo "  Functions -> process-image -> Test"
echo
