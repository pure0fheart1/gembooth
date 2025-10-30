#!/usr/bin/env python3
"""
GemBooth Project Dashboard - Web Version
Modern web-based dashboard using Flask
"""

from flask import Flask, render_template, jsonify
from pathlib import Path
import os
from datetime import datetime

app = Flask(__name__,
           template_folder='templates',
           static_folder='static')

def load_env_data():
    """Load environment variables from .env.local"""
    env_data = {}
    project_root = Path(__file__).parent.parent
    env_file = project_root / '.env.local'

    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_data[key.strip()] = value.strip()

    return env_data

def mask_key(key):
    """Mask sensitive keys for display"""
    if not key or key == 'Not set':
        return key
    if len(key) > 30:
        return key[:20] + '...' + key[-10:]
    return key[:10] + '...' if len(key) > 10 else key

@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')

@app.route('/api/overview')
def api_overview():
    """API endpoint for project overview"""
    env_data = load_env_data()

    return jsonify({
        'project': {
            'name': 'GemBooth',
            'version': '1.0.0',
            'description': 'AI-powered photo booth with Google Gemini API',
            'tech_stack': 'React 18 + Vite + Supabase + Stripe + Gemini AI',
            'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        },
        'stats': {
            'database_tables': 8,
            'edge_functions': 5,
            'storage_buckets': 2,
            'ai_modes': 13
        },
        'status': {
            'environment': '✅ Configured' if env_data else '❌ Missing',
            'gemini': '✅ Set' if env_data.get('VITE_GEMINI_API_KEY') else '❌ Missing',
            'supabase': '✅ Set' if env_data.get('VITE_SUPABASE_URL') else '❌ Missing',
            'stripe': '✅ Set' if env_data.get('VITE_STRIPE_PUBLISHABLE_KEY') else '❌ Missing'
        }
    })

@app.route('/api/api-keys')
def api_keys():
    """API endpoint for API keys and secrets"""
    env_data = load_env_data()

    return jsonify({
        'gemini': {
            'api_key': mask_key(env_data.get('VITE_GEMINI_API_KEY', 'Not set')),
            'url': 'https://ai.google.dev'
        },
        'supabase': {
            'url': env_data.get('VITE_SUPABASE_URL', 'Not set'),
            'anon_key': mask_key(env_data.get('VITE_SUPABASE_ANON_KEY', 'Not set')),
            'service_role_key': mask_key(env_data.get('SUPABASE_SERVICE_ROLE_KEY', 'Not set'))
        },
        'stripe': {
            'publishable_key': mask_key(env_data.get('VITE_STRIPE_PUBLISHABLE_KEY', 'Not set')),
            'secret_key': mask_key(env_data.get('STRIPE_SECRET_KEY', 'Not set')),
            'webhook_secret': mask_key(env_data.get('STRIPE_WEBHOOK_SECRET', 'Not set'))
        }
    })

@app.route('/api/supabase')
def api_supabase():
    """API endpoint for Supabase information"""
    env_data = load_env_data()
    supabase_url = env_data.get('VITE_SUPABASE_URL', '')
    project_ref = supabase_url.replace('https://', '').replace('.supabase.co', '') if supabase_url else ''

    return jsonify({
        'project_ref': project_ref,
        'dashboard_url': f'https://supabase.com/dashboard/project/{project_ref}' if project_ref else '',
        'tables': [
            {'name': 'profiles', 'description': 'User profiles (username, avatar, bio)'},
            {'name': 'photos', 'description': 'Photo metadata (input_url, output_url, mode)'},
            {'name': 'gifs', 'description': 'Generated GIFs (gif_url, photo_ids)'},
            {'name': 'usage_stats', 'description': 'User analytics (photos_created, gifs_created)'},
            {'name': 'subscription_tiers', 'description': 'Tier definitions (free, pro, premium)'},
            {'name': 'subscriptions', 'description': 'User subscriptions (stripe_subscription_id)'},
            {'name': 'usage_limits', 'description': 'Monthly limits and current usage'},
            {'name': 'payments', 'description': 'Payment history'}
        ],
        'storage_buckets': [
            {'name': 'user-photos', 'description': 'Input/output images (10MB limit)'},
            {'name': 'user-gifs', 'description': 'Generated GIFs (50MB limit)'}
        ],
        'edge_functions': [
            {'name': 'process-image', 'description': 'Transform photos with Gemini API'},
            {'name': 'create-gif', 'description': 'Server-side GIF generation'},
            {'name': 'create-checkout-session', 'description': 'Stripe checkout initialization'},
            {'name': 'create-portal-session', 'description': 'Stripe customer portal'},
            {'name': 'stripe-webhook', 'description': 'Handle Stripe webhook events'}
        ]
    })

@app.route('/api/stripe')
def api_stripe():
    """API endpoint for Stripe information"""
    return jsonify({
        'test_cards': [
            {'name': 'Success', 'number': '4242 4242 4242 4242'},
            {'name': 'Decline', 'number': '4000 0000 0000 0002'},
            {'name': '3D Secure', 'number': '4000 0025 0000 3155'}
        ],
        'tiers': [
            {'name': 'Free', 'price': '$0/month', 'limits': '10 photos, 2 GIFs/month'},
            {'name': 'Pro', 'price': '$9.99/month', 'limits': '100 photos, 20 GIFs/month'},
            {'name': 'Premium', 'price': '$19.99/month', 'limits': 'Unlimited photos & GIFs'}
        ]
    })

@app.route('/api/commands')
def api_commands():
    """API endpoint for quick commands"""
    return jsonify({
        'development': [
            {'description': 'Start dev server', 'command': 'npm run dev'},
            {'description': 'Build for production', 'command': 'npm run build'},
            {'description': 'Preview production build', 'command': 'npm run preview'}
        ],
        'supabase': [
            {'description': 'Link to project', 'command': 'supabase link --project-ref [YOUR_REF]'},
            {'description': 'Apply migrations', 'command': 'supabase db push'},
            {'description': 'Deploy all functions', 'command': 'supabase functions deploy'},
            {'description': 'Deploy specific function', 'command': 'supabase functions deploy [name]'},
            {'description': 'View function logs', 'command': 'supabase functions logs [name]'},
            {'description': 'Set environment secret', 'command': 'supabase secrets set KEY=value'},
            {'description': 'List all secrets', 'command': 'supabase secrets list'}
        ],
        'deployment': [
            {'description': 'Deploy to preview', 'command': 'vercel'},
            {'description': 'Deploy to production', 'command': 'vercel --prod'}
        ],
        'stripe': [
            {'description': 'Fetch product prices', 'command': 'node get-stripe-prices.js'}
        ]
    })

@app.route('/api/links')
def api_links():
    """API endpoint for quick links"""
    env_data = load_env_data()
    supabase_url = env_data.get('VITE_SUPABASE_URL', '')
    project_ref = supabase_url.replace('https://', '').replace('.supabase.co', '') if supabase_url else ''

    return jsonify({
        'supabase': [
            {'name': 'Dashboard', 'url': f'https://supabase.com/dashboard/project/{project_ref}' if project_ref else 'https://supabase.com/dashboard'},
            {'name': 'Database', 'url': f'https://supabase.com/dashboard/project/{project_ref}/editor' if project_ref else '#'},
            {'name': 'Storage', 'url': f'https://supabase.com/dashboard/project/{project_ref}/storage/buckets' if project_ref else '#'},
            {'name': 'Edge Functions', 'url': f'https://supabase.com/dashboard/project/{project_ref}/functions' if project_ref else '#'},
            {'name': 'Authentication', 'url': f'https://supabase.com/dashboard/project/{project_ref}/auth/users' if project_ref else '#'}
        ],
        'stripe': [
            {'name': 'Dashboard', 'url': 'https://dashboard.stripe.com'},
            {'name': 'Test Mode', 'url': 'https://dashboard.stripe.com/test/dashboard'},
            {'name': 'API Keys', 'url': 'https://dashboard.stripe.com/test/apikeys'},
            {'name': 'Webhooks', 'url': 'https://dashboard.stripe.com/test/webhooks'},
            {'name': 'Products', 'url': 'https://dashboard.stripe.com/test/products'}
        ],
        'external': [
            {'name': 'Gemini API Console', 'url': 'https://ai.google.dev'},
            {'name': 'Vercel Dashboard', 'url': 'https://vercel.com/dashboard'},
            {'name': 'Supabase Docs', 'url': 'https://supabase.com/docs'},
            {'name': 'Stripe Docs', 'url': 'https://stripe.com/docs'},
            {'name': 'React Docs', 'url': 'https://react.dev'},
            {'name': 'Vite Docs', 'url': 'https://vitejs.dev'}
        ]
    })

@app.route('/api/ai-modes')
def api_ai_modes():
    """API endpoint for AI transformation modes"""
    return jsonify({
        'modes': [
            {'emoji': '🎨', 'name': 'Renaissance', 'description': 'Classical renaissance painting style'},
            {'emoji': '🎭', 'name': 'Cartoon', 'description': 'Fun animated character'},
            {'emoji': '🗿', 'name': 'Statue', 'description': 'Marble sculpture'},
            {'emoji': '🍌', 'name': 'Banana', 'description': 'Everything is made of bananas'},
            {'emoji': '🕺', 'name': '80s', 'description': 'Retro 1980s aesthetic'},
            {'emoji': '📸', 'name': '19th Century', 'description': 'Victorian-era photograph'},
            {'emoji': '⚡', 'name': 'Anime', 'description': 'Japanese anime character'},
            {'emoji': '🌈', 'name': 'Psychedelic', 'description': 'Trippy psychedelic art'},
            {'emoji': '🎮', 'name': '8-bit', 'description': 'Retro video game pixel art'},
            {'emoji': '🧔', 'name': 'Big Beard', 'description': 'Epic legendary beard'},
            {'emoji': '💥', 'name': 'Comic Book', 'description': 'Classic comic book style'},
            {'emoji': '👴', 'name': 'Old', 'description': 'Aged 60+ years'},
            {'emoji': '✏️', 'name': 'Custom', 'description': 'User-defined prompt'}
        ]
    })

@app.route('/api/troubleshooting')
def api_troubleshooting():
    """API endpoint for troubleshooting guide"""
    return jsonify({
        'issues': [
            {
                'problem': 'Missing environment variables',
                'solutions': [
                    'Ensure .env.local exists and is properly formatted',
                    'Restart dev server after changing .env.local',
                    'Check all required variables are set'
                ]
            },
            {
                'problem': 'Edge Function errors',
                'solutions': [
                    'Check logs: supabase functions logs [function-name]',
                    'Verify secrets: supabase secrets list',
                    'Ensure CORS headers are included in responses'
                ]
            },
            {
                'problem': 'Photos not saving to Supabase',
                'solutions': [
                    'Verify user is authenticated',
                    'Check RLS policies in Supabase Dashboard',
                    'Check browser Network tab for 403/401 errors',
                    'Verify storage bucket exists and has proper policies'
                ]
            },
            {
                'problem': 'Stripe webhooks not working',
                'solutions': [
                    'Verify webhook URL points to Edge Function',
                    'Check webhook secret is set in Supabase',
                    'View webhook delivery in Stripe Dashboard → Webhooks',
                    'Check stripe-webhook function logs for errors'
                ]
            },
            {
                'problem': 'Webcam not working',
                'solutions': [
                    'Ensure browser has camera permissions',
                    'Try different browser (Chrome/Edge recommended)',
                    'Check if camera is in use by another application',
                    'Test in HTTPS environment (not HTTP)'
                ]
            }
        ]
    })

def main():
    """Main entry point"""
    print("🎨 GemBooth Dashboard - Web Version")
    print("=" * 50)
    print("\n🌐 Starting web server...")
    print(f"📍 Dashboard will be available at: http://localhost:5555")
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("\n✨ Press Ctrl+C to stop the server\n")

    app.run(host='127.0.0.1', port=5555, debug=True)

if __name__ == '__main__':
    main()
