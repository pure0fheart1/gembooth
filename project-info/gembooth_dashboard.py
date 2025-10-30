#!/usr/bin/env python3
"""
GemBooth Project Information Dashboard
A comprehensive cheatsheet for all project-related information
"""

import os
import sys
from pathlib import Path
from datetime import datetime
import json

# ANSI color codes for terminal output
class Colors:
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    CYAN = '\033[96m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RED = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

def print_header(text):
    """Print a formatted header"""
    print(f"\n{Colors.BOLD}{Colors.HEADER}{'='*80}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}{text.center(80)}{Colors.ENDC}")
    print(f"{Colors.BOLD}{Colors.HEADER}{'='*80}{Colors.ENDC}\n")

def print_section(title):
    """Print a section title"""
    print(f"\n{Colors.BOLD}{Colors.CYAN}▶ {title}{Colors.ENDC}")
    print(f"{Colors.CYAN}{'─'*78}{Colors.ENDC}")

def print_info(label, value, indent=0):
    """Print labeled information"""
    spaces = "  " * indent
    print(f"{spaces}{Colors.GREEN}{label}:{Colors.ENDC} {Colors.YELLOW}{value}{Colors.ENDC}")

def print_command(description, command):
    """Print a command with description"""
    print(f"  {Colors.BLUE}•{Colors.ENDC} {description}")
    print(f"    {Colors.YELLOW}$ {command}{Colors.ENDC}")

def print_link(label, url):
    """Print a labeled link"""
    print(f"  {Colors.GREEN}{label}:{Colors.ENDC} {Colors.CYAN}{url}{Colors.ENDC}")

def read_env_file(filepath):
    """Read and parse .env file"""
    env_vars = {}
    try:
        if os.path.exists(filepath):
            with open(filepath, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        env_vars[key.strip()] = value.strip()
    except Exception as e:
        print(f"{Colors.RED}Error reading {filepath}: {e}{Colors.ENDC}")
    return env_vars

def show_project_overview():
    """Display project overview"""
    print_header("🎨 GEMBOOTH PROJECT DASHBOARD")

    print_section("Project Overview")
    print_info("Project Name", "GemBooth")
    print_info("Description", "AI-powered photo booth with Google Gemini API")
    print_info("Version", "1.0.0")
    print_info("Tech Stack", "React 18 + Vite + Supabase + Stripe + Gemini AI")
    print_info("Repository", "Local Project")
    print_info("Last Updated", datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

def show_environment_variables():
    """Display all environment variables"""
    print_section("Environment Variables & API Keys")

    # Get project root (parent of project-info)
    project_root = Path(__file__).parent.parent
    env_local = read_env_file(project_root / '.env.local')

    if not env_local:
        print(f"{Colors.RED}  No .env.local file found!{Colors.ENDC}")
        return

    print(f"\n{Colors.BOLD}Gemini AI Configuration:{Colors.ENDC}")
    if 'VITE_GEMINI_API_KEY' in env_local:
        api_key = env_local['VITE_GEMINI_API_KEY']
        masked = api_key[:10] + '...' + api_key[-10:] if len(api_key) > 20 else api_key
        print_info("API Key", masked, indent=1)

    print(f"\n{Colors.BOLD}Supabase Configuration:{Colors.ENDC}")
    print_info("URL", env_local.get('VITE_SUPABASE_URL', 'Not set'), indent=1)
    if 'VITE_SUPABASE_ANON_KEY' in env_local:
        anon_key = env_local['VITE_SUPABASE_ANON_KEY']
        masked = anon_key[:20] + '...' + anon_key[-10:] if len(anon_key) > 30 else anon_key
        print_info("Anon Key", masked, indent=1)
    if 'SUPABASE_SERVICE_ROLE_KEY' in env_local:
        service_key = env_local['SUPABASE_SERVICE_ROLE_KEY']
        masked = service_key[:20] + '...' + service_key[-10:] if len(service_key) > 30 else service_key
        print_info("Service Role Key", masked, indent=1)
        print(f"    {Colors.RED}⚠ NEVER expose to browser!{Colors.ENDC}")

    print(f"\n{Colors.BOLD}Stripe Configuration:{Colors.ENDC}")
    if 'VITE_STRIPE_PUBLISHABLE_KEY' in env_local:
        pub_key = env_local['VITE_STRIPE_PUBLISHABLE_KEY']
        masked = pub_key[:20] + '...' + pub_key[-10:] if len(pub_key) > 30 else pub_key
        print_info("Publishable Key", masked, indent=1)
    if 'STRIPE_SECRET_KEY' in env_local:
        secret_key = env_local['STRIPE_SECRET_KEY']
        masked = secret_key[:20] + '...' + secret_key[-10:] if len(secret_key) > 30 else secret_key
        print_info("Secret Key", masked, indent=1)
    if 'STRIPE_WEBHOOK_SECRET' in env_local:
        webhook = env_local['STRIPE_WEBHOOK_SECRET']
        masked = webhook[:15] + '...' + webhook[-10:] if len(webhook) > 25 else webhook
        print_info("Webhook Secret", masked, indent=1)

def show_supabase_info():
    """Display Supabase configuration and details"""
    print_section("Supabase Backend")

    project_root = Path(__file__).parent.parent
    env_local = read_env_file(project_root / '.env.local')

    supabase_url = env_local.get('VITE_SUPABASE_URL', '')
    if supabase_url:
        project_ref = supabase_url.replace('https://', '').replace('.supabase.co', '')
        print_info("Project Reference", project_ref)
        print_info("Dashboard URL", f"https://supabase.com/dashboard/project/{project_ref}")

    print(f"\n{Colors.BOLD}Database Tables:{Colors.ENDC}")
    tables = [
        ("profiles", "User profiles (username, avatar, bio)"),
        ("photos", "Photo metadata (input_url, output_url, mode, prompt)"),
        ("gifs", "Generated GIFs (gif_url, photo_ids array)"),
        ("usage_stats", "User analytics (photos_created, gifs_created)"),
        ("subscription_tiers", "Tier definitions (free, pro, premium)"),
        ("subscriptions", "User subscriptions (stripe_subscription_id)"),
        ("usage_limits", "Monthly limits and current usage"),
        ("payments", "Payment history")
    ]
    for table, desc in tables:
        print(f"  {Colors.GREEN}•{Colors.ENDC} {Colors.YELLOW}{table}{Colors.ENDC}: {desc}")

    print(f"\n{Colors.BOLD}Storage Buckets:{Colors.ENDC}")
    print_info("user-photos", "Input/output images (10MB limit per file)", indent=1)
    print_info("user-gifs", "Generated GIFs (50MB limit per file)", indent=1)

    print(f"\n{Colors.BOLD}Edge Functions:{Colors.ENDC}")
    functions = [
        ("process-image", "Transform photos with Gemini API"),
        ("create-gif", "Server-side GIF generation"),
        ("create-checkout-session", "Stripe checkout initialization"),
        ("create-portal-session", "Stripe customer portal"),
        ("stripe-webhook", "Handle Stripe webhook events")
    ]
    for func, desc in functions:
        print(f"  {Colors.GREEN}•{Colors.ENDC} {Colors.YELLOW}{func}{Colors.ENDC}: {desc}")

def show_stripe_info():
    """Display Stripe configuration"""
    print_section("Stripe Payment Integration")

    print(f"\n{Colors.BOLD}Test Credit Cards:{Colors.ENDC}")
    print_info("Success", "4242 4242 4242 4242", indent=1)
    print_info("Decline", "4000 0000 0000 0002", indent=1)
    print_info("3D Secure", "4000 0025 0000 3155", indent=1)
    print(f"    {Colors.CYAN}Use any future expiry, any CVC, any ZIP{Colors.ENDC}")

    print(f"\n{Colors.BOLD}Subscription Tiers:{Colors.ENDC}")
    tiers = [
        ("Free", "$0/month", "10 photos, 2 GIFs/month"),
        ("Pro", "$9.99/month", "100 photos, 20 GIFs/month"),
        ("Premium", "$19.99/month", "Unlimited photos & GIFs")
    ]
    for name, price, limits in tiers:
        print(f"  {Colors.GREEN}•{Colors.ENDC} {Colors.YELLOW}{name}{Colors.ENDC}: {price} - {limits}")

    print(f"\n{Colors.BOLD}Webhook Endpoints:{Colors.ENDC}")
    print_info("URL", "https://[project-ref].supabase.co/functions/v1/stripe-webhook", indent=1)
    print_info("Events", "customer.subscription.*, invoice.*, payment_intent.*", indent=1)

def show_quick_commands():
    """Display essential commands"""
    print_section("Quick Commands Reference")

    print(f"\n{Colors.BOLD}Development:{Colors.ENDC}")
    print_command("Start development server", "npm run dev")
    print_command("Build for production", "npm run build")
    print_command("Preview production build", "npm run preview")

    print(f"\n{Colors.BOLD}Supabase:{Colors.ENDC}")
    print_command("Link to Supabase project", "supabase link --project-ref [YOUR_REF]")
    print_command("Apply database migrations", "supabase db push")
    print_command("Reset database (DANGER!)", "supabase db reset")
    print_command("Deploy all Edge Functions", "supabase functions deploy")
    print_command("Deploy specific function", "supabase functions deploy [function-name]")
    print_command("View function logs", "supabase functions logs [function-name]")
    print_command("Set environment secret", "supabase secrets set KEY=value")
    print_command("List all secrets", "supabase secrets list")

    print(f"\n{Colors.BOLD}Deployment:{Colors.ENDC}")
    print_command("Deploy to Vercel preview", "vercel")
    print_command("Deploy to production", "vercel --prod")

    print(f"\n{Colors.BOLD}Stripe:{Colors.ENDC}")
    print_command("Fetch Stripe product prices", "node get-stripe-prices.js")
    print_command("Test webhook locally", "stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook")

def show_quick_links():
    """Display important URLs and dashboards"""
    print_section("Quick Links & Dashboards")

    project_root = Path(__file__).parent.parent
    env_local = read_env_file(project_root / '.env.local')

    supabase_url = env_local.get('VITE_SUPABASE_URL', '')
    if supabase_url:
        project_ref = supabase_url.replace('https://', '').replace('.supabase.co', '')

        print(f"\n{Colors.BOLD}Supabase Dashboards:{Colors.ENDC}")
        print_link("Main Dashboard", f"https://supabase.com/dashboard/project/{project_ref}")
        print_link("Database", f"https://supabase.com/dashboard/project/{project_ref}/editor")
        print_link("Storage", f"https://supabase.com/dashboard/project/{project_ref}/storage/buckets")
        print_link("Edge Functions", f"https://supabase.com/dashboard/project/{project_ref}/functions")
        print_link("Authentication", f"https://supabase.com/dashboard/project/{project_ref}/auth/users")
        print_link("API Docs", f"https://supabase.com/dashboard/project/{project_ref}/api")

    print(f"\n{Colors.BOLD}Stripe Dashboards:{Colors.ENDC}")
    print_link("Dashboard", "https://dashboard.stripe.com")
    print_link("Test Mode", "https://dashboard.stripe.com/test/dashboard")
    print_link("API Keys", "https://dashboard.stripe.com/test/apikeys")
    print_link("Webhooks", "https://dashboard.stripe.com/test/webhooks")
    print_link("Products", "https://dashboard.stripe.com/test/products")
    print_link("Customers", "https://dashboard.stripe.com/test/customers")

    print(f"\n{Colors.BOLD}External Resources:{Colors.ENDC}")
    print_link("Gemini API Console", "https://ai.google.dev")
    print_link("Vercel Dashboard", "https://vercel.com/dashboard")
    print_link("Supabase Docs", "https://supabase.com/docs")
    print_link("Stripe Docs", "https://stripe.com/docs")
    print_link("React Docs", "https://react.dev")
    print_link("Vite Docs", "https://vitejs.dev")

def show_project_structure():
    """Display project directory structure"""
    print_section("Project Structure")

    structure = """
  gembooth/
  ├── src/
  │   ├── components/
  │   │   ├── App.jsx                    # Main photo booth UI
  │   │   ├── AppWithAuth.jsx            # Auth wrapper
  │   │   ├── Auth/                      # Authentication components
  │   │   ├── PricingPage.jsx            # Stripe pricing UI
  │   │   └── SubscriptionManager.jsx    # Subscription management
  │   ├── lib/
  │   │   ├── store.js                   # Zustand state store
  │   │   ├── actions.js                 # Core business logic
  │   │   ├── actions-supabase.js        # Supabase actions
  │   │   ├── modes.js                   # AI transformation modes
  │   │   ├── llm.js                     # Gemini API client
  │   │   ├── supabase/                  # Supabase config
  │   │   └── stripe/                    # Stripe config
  │   └── contexts/
  │       └── AuthContext.jsx            # Auth state provider
  ├── supabase/
  │   ├── migrations/                    # Database schemas
  │   └── functions/                     # Edge Functions (Deno)
  │       ├── process-image/
  │       ├── create-gif/
  │       ├── create-checkout-session/
  │       ├── create-portal-session/
  │       └── stripe-webhook/
  ├── api/                               # Vercel serverless functions
  ├── project-info/                      # This dashboard tool
  ├── .env.local                         # Environment variables
  ├── package.json                       # NPM dependencies
  ├── vite.config.ts                     # Vite configuration
  └── vercel.json                        # Vercel deployment config
    """
    print(f"{Colors.YELLOW}{structure}{Colors.ENDC}")

def show_ai_modes():
    """Display available AI transformation modes"""
    print_section("AI Transformation Modes")

    modes = [
        ("🎨 Renaissance", "Classical renaissance painting style"),
        ("🎭 Cartoon", "Fun cartoon/animated character"),
        ("🗿 Statue", "Marble statue or sculpture"),
        ("🍌 Banana", "Everything is made of bananas"),
        ("🕺 80s", "Retro 1980s aesthetic"),
        ("📸 19th Century", "Victorian-era photograph"),
        ("⚡ Anime", "Japanese anime character"),
        ("🌈 Psychedelic", "Trippy psychedelic art"),
        ("🎮 8-bit", "Retro video game pixel art"),
        ("🧔 Big Beard", "Epic legendary beard"),
        ("💥 Comic Book", "Classic comic book style"),
        ("👴 Old", "Aged 60+ years"),
        ("✏️ Custom", "User-defined prompt")
    ]

    for mode, desc in modes:
        print(f"  {Colors.GREEN}{mode}{Colors.ENDC}: {desc}")

def show_troubleshooting():
    """Display common issues and solutions"""
    print_section("Troubleshooting Guide")

    issues = [
        ("Missing environment variables",
         "Ensure .env.local exists and all variables are set\nRestart dev server after changing .env.local"),

        ("Edge Function errors",
         "Check logs: supabase functions logs [function-name]\nVerify secrets: supabase secrets list"),

        ("Photos not saving to Supabase",
         "Verify user is authenticated\nCheck RLS policies in Supabase Dashboard\nCheck browser Network tab for errors"),

        ("Stripe webhooks not working",
         "Verify webhook URL points to Edge Function\nCheck webhook secret is set\nView delivery in Stripe Dashboard → Webhooks"),

        ("Webcam not working",
         "Ensure browser has camera permissions\nTry different browser (Chrome/Edge recommended)\nCheck if camera is in use by another app")
    ]

    for issue, solution in issues:
        print(f"\n{Colors.BOLD}{Colors.RED}Problem:{Colors.ENDC} {issue}")
        print(f"{Colors.GREEN}Solution:{Colors.ENDC}")
        for line in solution.split('\n'):
            print(f"  {Colors.YELLOW}• {line}{Colors.ENDC}")

def show_menu():
    """Display interactive menu"""
    while True:
        print_header("📋 GEMBOOTH DASHBOARD MENU")

        menu_options = [
            ("1", "Project Overview"),
            ("2", "Environment Variables & API Keys"),
            ("3", "Supabase Configuration"),
            ("4", "Stripe Integration"),
            ("5", "Quick Commands"),
            ("6", "Quick Links & Dashboards"),
            ("7", "Project Structure"),
            ("8", "AI Transformation Modes"),
            ("9", "Troubleshooting Guide"),
            ("0", "Show All Information"),
            ("q", "Quit")
        ]

        for key, desc in menu_options:
            if key == 'q':
                print(f"\n{Colors.RED}{key}. {desc}{Colors.ENDC}")
            else:
                print(f"{Colors.CYAN}{key}.{Colors.ENDC} {desc}")

        choice = input(f"\n{Colors.BOLD}Enter your choice: {Colors.ENDC}").strip().lower()

        if choice == '1':
            show_project_overview()
        elif choice == '2':
            show_environment_variables()
        elif choice == '3':
            show_supabase_info()
        elif choice == '4':
            show_stripe_info()
        elif choice == '5':
            show_quick_commands()
        elif choice == '6':
            show_quick_links()
        elif choice == '7':
            show_project_structure()
        elif choice == '8':
            show_ai_modes()
        elif choice == '9':
            show_troubleshooting()
        elif choice == '0':
            show_all_information()
        elif choice == 'q':
            print(f"\n{Colors.GREEN}Thanks for using GemBooth Dashboard! 👋{Colors.ENDC}\n")
            sys.exit(0)
        else:
            print(f"\n{Colors.RED}Invalid choice. Please try again.{Colors.ENDC}")

        input(f"\n{Colors.BOLD}Press Enter to continue...{Colors.ENDC}")

def show_all_information():
    """Display all information at once"""
    show_project_overview()
    show_environment_variables()
    show_supabase_info()
    show_stripe_info()
    show_quick_commands()
    show_quick_links()
    show_project_structure()
    show_ai_modes()
    show_troubleshooting()

def main():
    """Main entry point"""
    try:
        # Check if we're in the right directory
        project_root = Path(__file__).parent.parent
        if not (project_root / 'package.json').exists():
            print(f"{Colors.RED}Error: Not in GemBooth project directory!{Colors.ENDC}")
            print(f"Current location: {project_root}")
            sys.exit(1)

        # If command line argument provided, show all info and exit
        if len(sys.argv) > 1 and sys.argv[1] in ['--all', '-a']:
            show_all_information()
        else:
            # Show interactive menu
            show_menu()

    except KeyboardInterrupt:
        print(f"\n\n{Colors.GREEN}Thanks for using GemBooth Dashboard! 👋{Colors.ENDC}\n")
        sys.exit(0)
    except Exception as e:
        print(f"\n{Colors.RED}Error: {e}{Colors.ENDC}\n")
        sys.exit(1)

if __name__ == "__main__":
    main()
