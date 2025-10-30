#!/usr/bin/env python3
"""
GemBooth Project Dashboard - Professional GUI Version
A sleek, modern graphical interface for project information
"""

import tkinter as tk
from tkinter import ttk, scrolledtext, messagebox
import os
from pathlib import Path
from datetime import datetime

class ModernDashboard:
    """Professional dashboard with modern UI/UX"""

    # Modern color scheme
    COLORS = {
        'bg_dark': '#1a1a2e',
        'bg_medium': '#16213e',
        'bg_light': '#0f3460',
        'accent': '#e94560',
        'accent_hover': '#ff5577',
        'text_primary': '#ffffff',
        'text_secondary': '#a8b2d1',
        'success': '#00d4aa',
        'warning': '#ffd700',
        'info': '#00bfff',
        'card_bg': '#1e2749',
        'sidebar_bg': '#0e1628'
    }

    def __init__(self, root):
        self.root = root
        self.root.title("GemBooth Project Dashboard")
        self.root.geometry("1400x900")
        self.root.configure(bg=self.COLORS['bg_dark'])

        # Configure style
        self.setup_styles()

        # Load environment variables
        self.load_env_data()

        # Create main layout
        self.create_layout()

        # Center window
        self.center_window()

    def setup_styles(self):
        """Configure ttk styles for modern look"""
        style = ttk.Style()
        style.theme_use('clam')

        # Configure colors for various widgets
        style.configure('Sidebar.TFrame', background=self.COLORS['sidebar_bg'])
        style.configure('Main.TFrame', background=self.COLORS['bg_dark'])
        style.configure('Card.TFrame', background=self.COLORS['card_bg'])

        # Button styles
        style.configure('Sidebar.TButton',
                       background=self.COLORS['sidebar_bg'],
                       foreground=self.COLORS['text_secondary'],
                       borderwidth=0,
                       focuscolor='none',
                       padding=15)
        style.map('Sidebar.TButton',
                 background=[('active', self.COLORS['bg_light'])],
                 foreground=[('active', self.COLORS['text_primary'])])

        style.configure('Active.TButton',
                       background=self.COLORS['accent'],
                       foreground=self.COLORS['text_primary'],
                       borderwidth=0,
                       padding=15)

        # Label styles
        style.configure('Title.TLabel',
                       background=self.COLORS['bg_dark'],
                       foreground=self.COLORS['text_primary'],
                       font=('Segoe UI', 24, 'bold'))

        style.configure('Heading.TLabel',
                       background=self.COLORS['card_bg'],
                       foreground=self.COLORS['text_primary'],
                       font=('Segoe UI', 16, 'bold'))

        style.configure('Info.TLabel',
                       background=self.COLORS['card_bg'],
                       foreground=self.COLORS['text_secondary'],
                       font=('Segoe UI', 10))

    def center_window(self):
        """Center the window on screen"""
        self.root.update_idletasks()
        width = self.root.winfo_width()
        height = self.root.winfo_height()
        x = (self.root.winfo_screenwidth() // 2) - (width // 2)
        y = (self.root.winfo_screenheight() // 2) - (height // 2)
        self.root.geometry(f'{width}x{height}+{x}+{y}')

    def load_env_data(self):
        """Load environment variables from .env.local"""
        self.env_data = {}
        project_root = Path(__file__).parent.parent
        env_file = project_root / '.env.local'

        if env_file.exists():
            with open(env_file, 'r') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#') and '=' in line:
                        key, value = line.split('=', 1)
                        self.env_data[key.strip()] = value.strip()

    def create_layout(self):
        """Create main dashboard layout"""
        # Main container
        main_container = ttk.Frame(self.root, style='Main.TFrame')
        main_container.pack(fill=tk.BOTH, expand=True)

        # Sidebar
        self.create_sidebar(main_container)

        # Content area
        self.content_frame = ttk.Frame(main_container, style='Main.TFrame')
        self.content_frame.pack(side=tk.LEFT, fill=tk.BOTH, expand=True, padx=30, pady=30)

        # Show overview by default
        self.show_overview()

    def create_sidebar(self, parent):
        """Create navigation sidebar"""
        sidebar = ttk.Frame(parent, style='Sidebar.TFrame', width=250)
        sidebar.pack(side=tk.LEFT, fill=tk.Y)
        sidebar.pack_propagate(False)

        # Logo/Title
        logo_frame = ttk.Frame(sidebar, style='Sidebar.TFrame')
        logo_frame.pack(fill=tk.X, pady=30, padx=20)

        title = tk.Label(logo_frame, text="🎨 GemBooth",
                        bg=self.COLORS['sidebar_bg'],
                        fg=self.COLORS['accent'],
                        font=('Segoe UI', 20, 'bold'))
        title.pack()

        subtitle = tk.Label(logo_frame, text="Project Dashboard",
                           bg=self.COLORS['sidebar_bg'],
                           fg=self.COLORS['text_secondary'],
                           font=('Segoe UI', 10))
        subtitle.pack()

        # Navigation buttons
        nav_buttons = [
            ("📊 Overview", self.show_overview),
            ("🔑 API Keys", self.show_api_keys),
            ("🗄️ Supabase", self.show_supabase),
            ("💳 Stripe", self.show_stripe),
            ("⚡ Commands", self.show_commands),
            ("🔗 Quick Links", self.show_links),
            ("📁 Structure", self.show_structure),
            ("🎨 AI Modes", self.show_ai_modes),
            ("🔧 Troubleshoot", self.show_troubleshooting),
        ]

        for text, command in nav_buttons:
            btn = tk.Button(sidebar, text=text,
                          command=command,
                          bg=self.COLORS['sidebar_bg'],
                          fg=self.COLORS['text_secondary'],
                          activebackground=self.COLORS['bg_light'],
                          activeforeground=self.COLORS['text_primary'],
                          relief=tk.FLAT,
                          anchor='w',
                          font=('Segoe UI', 11),
                          padx=20,
                          pady=15,
                          cursor='hand2')
            btn.pack(fill=tk.X, padx=10, pady=2)

            # Hover effects
            btn.bind('<Enter>', lambda e, b=btn: b.config(bg=self.COLORS['bg_light'],
                                                           fg=self.COLORS['text_primary']))
            btn.bind('<Leave>', lambda e, b=btn: b.config(bg=self.COLORS['sidebar_bg'],
                                                           fg=self.COLORS['text_secondary']))

    def clear_content(self):
        """Clear content area"""
        for widget in self.content_frame.winfo_children():
            widget.destroy()

    def create_card(self, parent, title, content_func):
        """Create a modern card widget"""
        card = ttk.Frame(parent, style='Card.TFrame')
        card.pack(fill=tk.BOTH, expand=True, pady=10)

        # Card header
        header = ttk.Label(card, text=title, style='Heading.TLabel')
        header.pack(anchor='w', padx=20, pady=(20, 10))

        # Card content
        content_frame = ttk.Frame(card, style='Card.TFrame')
        content_frame.pack(fill=tk.BOTH, expand=True, padx=20, pady=(0, 20))

        content_func(content_frame)

        return card

    def create_info_row(self, parent, label, value, color=None):
        """Create an information row"""
        row = ttk.Frame(parent, style='Card.TFrame')
        row.pack(fill=tk.X, pady=5)

        lbl = tk.Label(row, text=label + ":",
                      bg=self.COLORS['card_bg'],
                      fg=self.COLORS['text_secondary'],
                      font=('Segoe UI', 10, 'bold'),
                      width=20,
                      anchor='w')
        lbl.pack(side=tk.LEFT, padx=(0, 10))

        val_color = color or self.COLORS['info']
        val = tk.Label(row, text=value,
                      bg=self.COLORS['card_bg'],
                      fg=val_color,
                      font=('Segoe UI', 10),
                      anchor='w')
        val.pack(side=tk.LEFT, fill=tk.X, expand=True)

    def mask_key(self, key):
        """Mask sensitive keys"""
        if len(key) > 30:
            return key[:20] + '...' + key[-10:]
        return key

    def show_overview(self):
        """Show project overview"""
        self.clear_content()

        # Title
        title = ttk.Label(self.content_frame, text="Project Overview",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        # Cards container
        cards = ttk.Frame(self.content_frame, style='Main.TFrame')
        cards.pack(fill=tk.BOTH, expand=True)

        # Project Info Card
        def project_content(frame):
            self.create_info_row(frame, "Project Name", "GemBooth")
            self.create_info_row(frame, "Version", "2.0.0")
            self.create_info_row(frame, "Tech Stack", "React 18 + Vite + Supabase + Stripe")
            self.create_info_row(frame, "AI Model", "Google Gemini 2.5 Flash Image Preview")
            self.create_info_row(frame, "Last Updated", datetime.now().strftime("%Y-%m-%d %H:%M"))

        self.create_card(cards, "📋 Project Information", project_content)

        # Quick Stats Card
        def stats_content(frame):
            self.create_info_row(frame, "Database Tables", "9 tables", self.COLORS['success'])
            self.create_info_row(frame, "Edge Functions", "5 functions", self.COLORS['success'])
            self.create_info_row(frame, "Storage Buckets", "2 buckets", self.COLORS['success'])
            self.create_info_row(frame, "AI Modes", "22 modes", self.COLORS['success'])

        self.create_card(cards, "📊 Quick Statistics", stats_content)

        # Status Card
        def status_content(frame):
            env_status = "✅ Configured" if self.env_data else "❌ Missing"
            status_color = self.COLORS['success'] if self.env_data else self.COLORS['accent']

            self.create_info_row(frame, "Environment", env_status, status_color)

            # Check for Gemini API key (both old and new variable names)
            gemini_set = self.env_data.get('VITE_GEMINI_API_KEY') or self.env_data.get('GEMINI_API_KEY')
            self.create_info_row(frame, "Gemini API",
                               "✅ Set" if gemini_set else "❌ Missing",
                               self.COLORS['success'] if gemini_set else self.COLORS['accent'])
            self.create_info_row(frame, "Supabase",
                               "✅ Set" if self.env_data.get('VITE_SUPABASE_URL') else "❌ Missing",
                               self.COLORS['success'] if self.env_data.get('VITE_SUPABASE_URL') else self.COLORS['accent'])
            self.create_info_row(frame, "Stripe",
                               "✅ Set" if self.env_data.get('VITE_STRIPE_PUBLISHABLE_KEY') else "❌ Missing",
                               self.COLORS['success'] if self.env_data.get('VITE_STRIPE_PUBLISHABLE_KEY') else self.COLORS['accent'])

        self.create_card(cards, "🔍 Configuration Status", status_content)

        # Features Card
        def features_content(frame):
            features = [
                ("Gallery View", "Browse all photos and GIFs"),
                ("Batch Upload", "Upload multiple photos at once"),
                ("Favorite Modes", "Star your favorite AI modes"),
                ("Demo Mode", "Try app without signup"),
                ("Welcome Tutorial", "Onboarding for new users"),
                ("Legal Pages", "Privacy, Terms, Content Policy"),
                ("Usage Tracking", "Real-time usage limits display")
            ]

            for feature, desc in features:
                row = ttk.Frame(frame, style='Card.TFrame')
                row.pack(fill=tk.X, pady=3)

                bullet = tk.Label(row, text="✨",
                                bg=self.COLORS['card_bg'],
                                fg=self.COLORS['warning'],
                                font=('Segoe UI', 10))
                bullet.pack(side=tk.LEFT, padx=(0, 10))

                feat = tk.Label(row, text=feature,
                              bg=self.COLORS['card_bg'],
                              fg=self.COLORS['info'],
                              font=('Segoe UI', 10, 'bold'),
                              width=20,
                              anchor='w')
                feat.pack(side=tk.LEFT)

                dsc = tk.Label(row, text=desc,
                             bg=self.COLORS['card_bg'],
                             fg=self.COLORS['text_secondary'],
                             font=('Segoe UI', 9),
                             anchor='w')
                dsc.pack(side=tk.LEFT, fill=tk.X, expand=True)

        self.create_card(cards, "✨ Recent Features", features_content)

    def show_api_keys(self):
        """Show API keys and secrets"""
        self.clear_content()

        title = ttk.Label(self.content_frame, text="API Keys & Secrets",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        cards = ttk.Frame(self.content_frame, style='Main.TFrame')
        cards.pack(fill=tk.BOTH, expand=True)

        # Gemini Card
        def gemini_content(frame):
            key = self.env_data.get('VITE_GEMINI_API_KEY') or self.env_data.get('GEMINI_API_KEY', 'Not set')
            self.create_info_row(frame, "API Key", self.mask_key(key) if key != 'Not set' else key)

            note = tk.Label(frame, text="📝 Can be VITE_GEMINI_API_KEY or GEMINI_API_KEY",
                          bg=self.COLORS['card_bg'],
                          fg=self.COLORS['text_secondary'],
                          font=('Segoe UI', 8, 'italic'))
            note.pack(anchor='w', pady=(5, 0))

            link = tk.Label(frame, text="🔗 Get API Key at ai.google.dev",
                          bg=self.COLORS['card_bg'],
                          fg=self.COLORS['info'],
                          font=('Segoe UI', 9, 'underline'),
                          cursor='hand2')
            link.pack(anchor='w', pady=(10, 0))

        self.create_card(cards, "🤖 Google Gemini AI", gemini_content)

        # Supabase Card
        def supabase_content(frame):
            url = self.env_data.get('VITE_SUPABASE_URL', 'Not set')
            anon = self.env_data.get('VITE_SUPABASE_ANON_KEY', 'Not set')
            service = self.env_data.get('SUPABASE_SERVICE_ROLE_KEY', 'Not set')

            self.create_info_row(frame, "Project URL", url)
            self.create_info_row(frame, "Anon Key", self.mask_key(anon) if anon != 'Not set' else anon)
            self.create_info_row(frame, "Service Role", self.mask_key(service) if service != 'Not set' else service)

            warning = tk.Label(frame, text="⚠️ Never expose Service Role Key to browser!",
                             bg=self.COLORS['card_bg'],
                             fg=self.COLORS['accent'],
                             font=('Segoe UI', 9, 'bold'))
            warning.pack(anchor='w', pady=(10, 0))

        self.create_card(cards, "🗄️ Supabase Configuration", supabase_content)

        # Stripe Card
        def stripe_content(frame):
            pub = self.env_data.get('VITE_STRIPE_PUBLISHABLE_KEY', 'Not set')
            secret = self.env_data.get('STRIPE_SECRET_KEY', 'Not set')
            webhook = self.env_data.get('STRIPE_WEBHOOK_SECRET', 'Not set')

            self.create_info_row(frame, "Publishable Key", self.mask_key(pub) if pub != 'Not set' else pub)
            self.create_info_row(frame, "Secret Key", self.mask_key(secret) if secret != 'Not set' else secret)
            self.create_info_row(frame, "Webhook Secret", self.mask_key(webhook) if webhook != 'Not set' else webhook)

        self.create_card(cards, "💳 Stripe Payment", stripe_content)

    def show_supabase(self):
        """Show Supabase information"""
        self.clear_content()

        title = ttk.Label(self.content_frame, text="Supabase Backend",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        # Scrollable content
        canvas = tk.Canvas(self.content_frame, bg=self.COLORS['bg_dark'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(self.content_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas, style='Main.TFrame')

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        # Database Tables
        def tables_content(frame):
            tables = [
                ("profiles", "User profiles, avatars, bios"),
                ("photos", "Photo metadata and URLs"),
                ("gifs", "Generated GIF files"),
                ("usage_stats", "User analytics"),
                ("favorite_modes", "User's favorite AI modes"),
                ("subscription_tiers", "Pricing tiers"),
                ("subscriptions", "User subscriptions"),
                ("usage_limits", "Monthly limits"),
                ("payments", "Payment history")
            ]

            for table, desc in tables:
                row = ttk.Frame(frame, style='Card.TFrame')
                row.pack(fill=tk.X, pady=3)

                bullet = tk.Label(row, text="•",
                                bg=self.COLORS['card_bg'],
                                fg=self.COLORS['success'],
                                font=('Segoe UI', 12, 'bold'))
                bullet.pack(side=tk.LEFT, padx=(0, 10))

                tbl = tk.Label(row, text=table,
                             bg=self.COLORS['card_bg'],
                             fg=self.COLORS['warning'],
                             font=('Segoe UI', 10, 'bold'),
                             width=20,
                             anchor='w')
                tbl.pack(side=tk.LEFT)

                dsc = tk.Label(row, text=desc,
                             bg=self.COLORS['card_bg'],
                             fg=self.COLORS['text_secondary'],
                             font=('Segoe UI', 9),
                             anchor='w')
                dsc.pack(side=tk.LEFT, fill=tk.X, expand=True)

        self.create_card(scrollable_frame, "📊 Database Tables", tables_content)

        # Edge Functions
        def functions_content(frame):
            functions = [
                ("process-image", "Transform photos with Gemini API"),
                ("create-gif", "Server-side GIF generation"),
                ("create-checkout-session", "Stripe checkout initialization"),
                ("create-portal-session", "Stripe customer portal"),
                ("stripe-webhook", "Handle Stripe webhook events")
            ]

            for func, desc in functions:
                row = ttk.Frame(frame, style='Card.TFrame')
                row.pack(fill=tk.X, pady=3)

                bullet = tk.Label(row, text="⚡",
                                bg=self.COLORS['card_bg'],
                                fg=self.COLORS['info'],
                                font=('Segoe UI', 10))
                bullet.pack(side=tk.LEFT, padx=(0, 10))

                fn = tk.Label(row, text=func,
                            bg=self.COLORS['card_bg'],
                            fg=self.COLORS['warning'],
                            font=('Segoe UI', 10, 'bold'),
                            width=25,
                            anchor='w')
                fn.pack(side=tk.LEFT)

                dsc = tk.Label(row, text=desc,
                             bg=self.COLORS['card_bg'],
                             fg=self.COLORS['text_secondary'],
                             font=('Segoe UI', 9),
                             anchor='w')
                dsc.pack(side=tk.LEFT, fill=tk.X, expand=True)

        self.create_card(scrollable_frame, "⚙️ Edge Functions", functions_content)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def show_stripe(self):
        """Show Stripe information"""
        self.clear_content()

        title = ttk.Label(self.content_frame, text="Stripe Integration",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        cards = ttk.Frame(self.content_frame, style='Main.TFrame')
        cards.pack(fill=tk.BOTH, expand=True)

        # Test Cards
        def testcards_content(frame):
            self.create_info_row(frame, "Success", "4242 4242 4242 4242", self.COLORS['success'])
            self.create_info_row(frame, "Decline", "4000 0000 0000 0002", self.COLORS['accent'])
            self.create_info_row(frame, "3D Secure", "4000 0025 0000 3155", self.COLORS['warning'])

            note = tk.Label(frame, text="Use any future expiry, any CVC, any ZIP",
                          bg=self.COLORS['card_bg'],
                          fg=self.COLORS['text_secondary'],
                          font=('Segoe UI', 9, 'italic'))
            note.pack(anchor='w', pady=(10, 0))

        self.create_card(cards, "💳 Test Credit Cards", testcards_content)

        # Subscription Tiers
        def tiers_content(frame):
            tiers = [
                ("Free", "$0/month", "10 photos, 2 GIFs"),
                ("Pro", "$9.99/month", "100 photos, 20 GIFs"),
                ("Premium", "$19.99/month", "Unlimited")
            ]

            for tier, price, limits in tiers:
                row = ttk.Frame(frame, style='Card.TFrame')
                row.pack(fill=tk.X, pady=5)

                t = tk.Label(row, text=tier,
                           bg=self.COLORS['card_bg'],
                           fg=self.COLORS['warning'],
                           font=('Segoe UI', 10, 'bold'),
                           width=10,
                           anchor='w')
                t.pack(side=tk.LEFT, padx=(0, 10))

                p = tk.Label(row, text=price,
                           bg=self.COLORS['card_bg'],
                           fg=self.COLORS['success'],
                           font=('Segoe UI', 10),
                           width=15,
                           anchor='w')
                p.pack(side=tk.LEFT, padx=(0, 10))

                l = tk.Label(row, text=limits,
                           bg=self.COLORS['card_bg'],
                           fg=self.COLORS['text_secondary'],
                           font=('Segoe UI', 9),
                           anchor='w')
                l.pack(side=tk.LEFT, fill=tk.X, expand=True)

        self.create_card(cards, "💰 Subscription Tiers", tiers_content)

    def show_commands(self):
        """Show quick commands"""
        self.clear_content()

        title = ttk.Label(self.content_frame, text="Quick Commands",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        # Scrollable content
        canvas = tk.Canvas(self.content_frame, bg=self.COLORS['bg_dark'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(self.content_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas, style='Main.TFrame')

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        # Development Commands
        def dev_content(frame):
            commands = [
                ("Start dev server", "npm run dev"),
                ("Build production", "npm run build"),
                ("Preview build", "npm run preview")
            ]

            for desc, cmd in commands:
                self.create_command_row(frame, desc, cmd)

        self.create_card(scrollable_frame, "⚡ Development", dev_content)

        # Supabase Commands
        def supabase_content(frame):
            commands = [
                ("Apply migrations", "supabase db push"),
                ("Deploy all functions", "supabase functions deploy"),
                ("View function logs", "supabase functions logs [name]"),
                ("Set secret", "supabase secrets set KEY=value"),
                ("List secrets", "supabase secrets list")
            ]

            for desc, cmd in commands:
                self.create_command_row(frame, desc, cmd)

        self.create_card(scrollable_frame, "🗄️ Supabase", supabase_content)

        # Deployment Commands
        def deploy_content(frame):
            commands = [
                ("Preview deployment", "vercel"),
                ("Production deploy", "vercel --prod")
            ]

            for desc, cmd in commands:
                self.create_command_row(frame, desc, cmd)

        self.create_card(scrollable_frame, "🚀 Deployment", deploy_content)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def create_command_row(self, parent, desc, cmd):
        """Create a command row with copy functionality"""
        row = ttk.Frame(parent, style='Card.TFrame')
        row.pack(fill=tk.X, pady=8)

        desc_lbl = tk.Label(row, text=desc,
                          bg=self.COLORS['card_bg'],
                          fg=self.COLORS['text_secondary'],
                          font=('Segoe UI', 9))
        desc_lbl.pack(anchor='w')

        cmd_frame = tk.Frame(row, bg=self.COLORS['bg_dark'], relief=tk.FLAT)
        cmd_frame.pack(fill=tk.X, pady=(5, 0))

        cmd_lbl = tk.Label(cmd_frame, text=f"$ {cmd}",
                         bg=self.COLORS['bg_dark'],
                         fg=self.COLORS['success'],
                         font=('Consolas', 9),
                         anchor='w',
                         padx=10,
                         pady=5)
        cmd_lbl.pack(side=tk.LEFT, fill=tk.X, expand=True)

        copy_btn = tk.Button(cmd_frame, text="📋 Copy",
                           bg=self.COLORS['bg_light'],
                           fg=self.COLORS['text_primary'],
                           font=('Segoe UI', 8),
                           relief=tk.FLAT,
                           cursor='hand2',
                           padx=10,
                           pady=5,
                           command=lambda: self.copy_to_clipboard(cmd))
        copy_btn.pack(side=tk.RIGHT)

    def copy_to_clipboard(self, text):
        """Copy text to clipboard"""
        self.root.clipboard_clear()
        self.root.clipboard_append(text)
        messagebox.showinfo("Copied", f"Copied to clipboard:\n{text}")

    def show_links(self):
        """Show quick links"""
        self.clear_content()

        title = ttk.Label(self.content_frame, text="Quick Links",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        cards = ttk.Frame(self.content_frame, style='Main.TFrame')
        cards.pack(fill=tk.BOTH, expand=True)

        # Supabase Links
        def supabase_links(frame):
            url = self.env_data.get('VITE_SUPABASE_URL', '')
            if url:
                project_ref = url.replace('https://', '').replace('.supabase.co', '')
                links = [
                    ("Dashboard", f"https://supabase.com/dashboard/project/{project_ref}"),
                    ("Database", f"https://supabase.com/dashboard/project/{project_ref}/editor"),
                    ("Storage", f"https://supabase.com/dashboard/project/{project_ref}/storage/buckets"),
                    ("Functions", f"https://supabase.com/dashboard/project/{project_ref}/functions")
                ]
            else:
                links = [("Dashboard", "https://supabase.com/dashboard")]

            for name, link in links:
                self.create_link_row(frame, name, link)

        self.create_card(cards, "🗄️ Supabase Dashboards", supabase_links)

        # Stripe Links
        def stripe_links(frame):
            links = [
                ("Dashboard", "https://dashboard.stripe.com"),
                ("Test Mode", "https://dashboard.stripe.com/test/dashboard"),
                ("API Keys", "https://dashboard.stripe.com/test/apikeys"),
                ("Webhooks", "https://dashboard.stripe.com/test/webhooks")
            ]

            for name, link in links:
                self.create_link_row(frame, name, link)

        self.create_card(cards, "💳 Stripe Dashboards", stripe_links)

        # External Resources
        def external_links(frame):
            links = [
                ("Gemini API", "https://ai.google.dev"),
                ("Vercel", "https://vercel.com/dashboard"),
                ("React Docs", "https://react.dev"),
                ("Vite Docs", "https://vitejs.dev")
            ]

            for name, link in links:
                self.create_link_row(frame, name, link)

        self.create_card(cards, "📚 External Resources", external_links)

    def create_link_row(self, parent, name, url):
        """Create a clickable link row"""
        import webbrowser

        row = ttk.Frame(parent, style='Card.TFrame')
        row.pack(fill=tk.X, pady=5)

        link = tk.Label(row, text=f"🔗 {name}",
                      bg=self.COLORS['card_bg'],
                      fg=self.COLORS['info'],
                      font=('Segoe UI', 10, 'underline'),
                      cursor='hand2',
                      anchor='w')
        link.pack(side=tk.LEFT)
        link.bind('<Button-1>', lambda e: webbrowser.open(url))

        url_lbl = tk.Label(row, text=url,
                         bg=self.COLORS['card_bg'],
                         fg=self.COLORS['text_secondary'],
                         font=('Segoe UI', 8),
                         anchor='w')
        url_lbl.pack(side=tk.LEFT, padx=(10, 0))

    def show_structure(self):
        """Show project structure"""
        self.clear_content()

        title = ttk.Label(self.content_frame, text="Project Structure",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        # Text widget for structure
        text_frame = ttk.Frame(self.content_frame, style='Card.TFrame')
        text_frame.pack(fill=tk.BOTH, expand=True)

        text = scrolledtext.ScrolledText(text_frame,
                                        bg=self.COLORS['bg_dark'],
                                        fg=self.COLORS['text_secondary'],
                                        font=('Consolas', 9),
                                        wrap=tk.WORD,
                                        padx=20,
                                        pady=20)
        text.pack(fill=tk.BOTH, expand=True)

        structure = """gembooth/
├── src/
│   ├── components/
│   │   ├── App.jsx                    # Main photo booth UI
│   │   ├── AppWithAuth.jsx            # Auth wrapper & routing
│   │   ├── Auth/                      # Authentication components
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   └── SignupForm.jsx
│   │   ├── Gallery.jsx                # Photo & GIF gallery
│   │   ├── BatchUpload.jsx            # Batch photo upload
│   │   ├── PricingPage.jsx            # Stripe pricing cards
│   │   ├── SubscriptionPage.jsx       # Subscription management
│   │   ├── UsageLimitBanner.jsx       # Usage display
│   │   ├── EmptyState.jsx             # Empty state component
│   │   ├── Landing/                   # Landing page components
│   │   ├── Legal/                     # Legal pages
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── TermsOfService.jsx
│   │   │   └── ContentModeration.jsx
│   │   └── Onboarding/                # Tutorial & onboarding
│   │       └── WelcomeTutorial.jsx
│   ├── lib/
│   │   ├── store.js                   # Zustand state store
│   │   ├── actions.js                 # Core business logic
│   │   ├── actions-supabase.js        # Supabase actions
│   │   ├── actions-demo.js            # Demo mode actions
│   │   ├── modes.js                   # 22 AI transformation modes
│   │   ├── llm.js                     # Gemini API client
│   │   ├── imageData.js               # Image cache
│   │   ├── favoriteModes.js           # Favorite modes utility
│   │   ├── supabase/                  # Supabase config
│   │   │   ├── client.js
│   │   │   └── auth.js
│   │   └── stripe/                    # Stripe integration
│   │       ├── config.js
│   │       └── subscriptionService.js
│   ├── contexts/
│   │   └── AuthContext.jsx            # Global auth provider
│   └── pages/                         # Additional page components
│       └── ContentModeration.jsx
├── supabase/
│   ├── migrations/                    # Database schema migrations
│   │   ├── 20250106000000_initial_schema.sql
│   │   ├── 20250106000001_rls_policies.sql
│   │   ├── 20250106000002_storage_setup.sql
│   │   ├── 20250107000000_subscriptions_schema.sql
│   │   └── 20250117000000_add_favorite_modes.sql
│   └── functions/                     # Supabase Edge Functions (Deno)
│       ├── process-image/             # Gemini AI transformation
│       ├── create-gif/                # Server-side GIF generation
│       ├── create-checkout-session/   # Stripe checkout
│       ├── create-portal-session/     # Stripe customer portal
│       └── stripe-webhook/            # Stripe webhook handler
├── api/                               # Vercel serverless functions
├── project-info/                      # Project documentation & dashboard
├── .env.local                         # Environment variables
├── package.json                       # Dependencies
├── vite.config.ts                     # Vite configuration
└── vercel.json                        # Vercel deployment config"""

        text.insert('1.0', structure)
        text.config(state=tk.DISABLED)

    def show_ai_modes(self):
        """Show AI transformation modes"""
        self.clear_content()

        title = ttk.Label(self.content_frame, text="AI Transformation Modes",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        # Grid of modes
        canvas = tk.Canvas(self.content_frame, bg=self.COLORS['bg_dark'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(self.content_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas, style='Main.TFrame')

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        modes = [
            ("🎨 Renaissance", "Classical renaissance painting"),
            ("😃 Cartoon", "Cute simple cartoon style"),
            ("🏛️ Statue", "Classical marble sculpture"),
            ("🍌 Banana", "Person wearing banana costume"),
            ("✨ 80s", "Retro 1980s yearbook photo"),
            ("🎩 19th Century", "Victorian daguerreotype"),
            ("🍣 Anime", "Photorealistic anime character"),
            ("🌈 Psychedelic", "1960s psychedelic poster art"),
            ("🎮 8-bit", "Minimalist pixel art (80x80)"),
            ("🧔🏻 Big Beard", "Epic huge beard transformation"),
            ("💥 Comic Book", "Classic comic panel style"),
            ("👵🏻 Old", "Aged 60+ years transformation"),
            ("🎬 Film Noir", "1940s dramatic black & white"),
            ("🧱 Claymation", "Stop-motion clay character"),
            ("🤖 Cyberpunk", "Futuristic neon dystopia"),
            ("🖼️ Oil Painting", "Classical oil with brushstrokes"),
            ("🎨 Pop Art", "Andy Warhol style"),
            ("🧟 Zombie", "Horror movie undead"),
            ("🦸 Superhero", "Comic book hero costume"),
            ("⚔️ Medieval Knight", "Full plate armor warrior"),
            ("⛪ Stained Glass", "Gothic cathedral window"),
            ("💧 Watercolor", "Soft watercolor painting")
        ]

        for i, (mode, desc) in enumerate(modes):
            card = tk.Frame(scrollable_frame, bg=self.COLORS['card_bg'],
                          relief=tk.FLAT, padx=15, pady=15)
            card.pack(fill=tk.X, pady=5)

            mode_lbl = tk.Label(card, text=mode,
                              bg=self.COLORS['card_bg'],
                              fg=self.COLORS['warning'],
                              font=('Segoe UI', 12, 'bold'),
                              anchor='w')
            mode_lbl.pack(anchor='w')

            desc_lbl = tk.Label(card, text=desc,
                              bg=self.COLORS['card_bg'],
                              fg=self.COLORS['text_secondary'],
                              font=('Segoe UI', 9),
                              anchor='w')
            desc_lbl.pack(anchor='w', pady=(5, 0))

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

    def show_troubleshooting(self):
        """Show troubleshooting guide"""
        self.clear_content()

        title = ttk.Label(self.content_frame, text="Troubleshooting Guide",
                         style='Title.TLabel')
        title.pack(anchor='w', pady=(0, 20))

        # Scrollable content
        canvas = tk.Canvas(self.content_frame, bg=self.COLORS['bg_dark'], highlightthickness=0)
        scrollbar = ttk.Scrollbar(self.content_frame, orient="vertical", command=canvas.yview)
        scrollable_frame = ttk.Frame(canvas, style='Main.TFrame')

        scrollable_frame.bind(
            "<Configure>",
            lambda e: canvas.configure(scrollregion=canvas.bbox("all"))
        )

        canvas.create_window((0, 0), window=scrollable_frame, anchor="nw")
        canvas.configure(yscrollcommand=scrollbar.set)

        issues = [
            ("Missing environment variables",
             ["Ensure .env.local exists",
              "Restart dev server after changes",
              "Check all VITE_ prefixed variables"]),

            ("Edge Function errors",
             ["Check logs: supabase functions logs [name]",
              "Verify secrets: supabase secrets list",
              "Ensure CORS headers included",
              "Redeploy after changing secrets"]),

            ("Photos not saving to Supabase",
             ["Verify user is authenticated",
              "Check RLS policies allow insert",
              "Verify storage bucket exists",
              "Check browser Network tab for 403/401"]),

            ("Stripe webhooks not working",
             ["Verify webhook URL in Stripe Dashboard",
              "Check webhook secret matches",
              "View delivery status in Stripe",
              "Check stripe-webhook function logs"]),

            ("Stripe Customer Portal empty",
             ["Switch Stripe Dashboard to TEST mode",
              "Verify products added to portal config",
              "Check portal is activated",
              "Test products only visible in test mode"])
        ]

        for problem, solutions in issues:
            card = tk.Frame(scrollable_frame, bg=self.COLORS['card_bg'],
                          relief=tk.FLAT, padx=20, pady=15)
            card.pack(fill=tk.X, pady=10)

            prob_lbl = tk.Label(card, text=f"❗ {problem}",
                              bg=self.COLORS['card_bg'],
                              fg=self.COLORS['accent'],
                              font=('Segoe UI', 11, 'bold'),
                              anchor='w')
            prob_lbl.pack(anchor='w')

            sol_frame = ttk.Frame(card, style='Card.TFrame')
            sol_frame.pack(fill=tk.X, pady=(10, 0))

            for solution in solutions:
                sol_row = ttk.Frame(sol_frame, style='Card.TFrame')
                sol_row.pack(fill=tk.X, pady=2)

                bullet = tk.Label(sol_row, text="•",
                                bg=self.COLORS['card_bg'],
                                fg=self.COLORS['success'],
                                font=('Segoe UI', 10, 'bold'))
                bullet.pack(side=tk.LEFT, padx=(0, 10))

                sol_lbl = tk.Label(sol_row, text=solution,
                                 bg=self.COLORS['card_bg'],
                                 fg=self.COLORS['text_secondary'],
                                 font=('Segoe UI', 9),
                                 anchor='w')
                sol_lbl.pack(side=tk.LEFT, fill=tk.X, expand=True)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

def main():
    """Main entry point"""
    root = tk.Tk()
    app = ModernDashboard(root)
    root.mainloop()

if __name__ == "__main__":
    main()
