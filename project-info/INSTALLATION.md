# 🚀 Installation & Setup Guide

## Prerequisites

The GemBooth Dashboard requires **Python 3.6 or higher**.

### Check if Python is Installed

Open Command Prompt or Terminal and run:

```bash
python --version
```

or

```bash
python3 --version
```

If you see a version number like `Python 3.12.0`, you're ready to go!

## Installing Python

If Python is not installed, follow these steps:

### Windows

1. **Download Python:**
   - Visit https://www.python.org/downloads/
   - Download the latest Python 3.x installer
   - **IMPORTANT:** Check "Add Python to PATH" during installation

2. **Verify Installation:**
   ```bash
   python --version
   ```

### Alternative: Microsoft Store

You can also install Python from the Microsoft Store:

1. Open Microsoft Store
2. Search for "Python 3.12" (or latest version)
3. Click "Get" to install

## Using the Dashboard

### Option 1: Interactive Menu (Recommended)

Navigate to the gembooth directory and run:

```bash
cd C:\Users\jamie\Desktop\gembooth
python project-info\gembooth_dashboard.py
```

This will open an interactive menu where you can:
- View specific sections
- Browse through different categories
- Access all information in an organized way

### Option 2: Windows Batch Launcher

Double-click on:
```
project-info\run-dashboard.bat
```

Or run from command line:
```bash
cd C:\Users\jamie\Desktop\gembooth
project-info\run-dashboard.bat
```

### Option 3: View All Information

To see all information at once (great for quick reference):

```bash
python project-info\gembooth_dashboard.py --all
```

Or use the shorthand:
```bash
python project-info\gembooth_dashboard.py -a
```

### Option 4: Quick Reference Card

For the fastest access to essential information, open:
```
project-info\QUICK_REFERENCE.txt
```

This is a simple text file with all the key information formatted for easy reading.

## Features

### 🔐 Secure by Design

- API keys are automatically masked for display
- Only reads configuration files (never writes)
- Full keys are never logged or saved

### 📊 Comprehensive Information

- **Project Overview:** Tech stack, version, description
- **Environment Variables:** All API keys and secrets (safely masked)
- **Supabase:** Database tables, storage buckets, edge functions
- **Stripe:** Payment configuration, test cards, webhooks
- **Commands:** Essential development and deployment commands
- **Links:** Direct links to all dashboards and docs
- **Structure:** Visual project directory layout
- **AI Modes:** All available transformation effects
- **Troubleshooting:** Common issues and solutions

### 🎨 Color-Coded Output

The dashboard uses ANSI colors for better readability:
- **Headers:** Purple/Magenta
- **Sections:** Cyan
- **Labels:** Green
- **Values:** Yellow
- **Commands:** Blue
- **Warnings:** Red

## Troubleshooting

### "Python was not found"

If you see this error:
1. Install Python from python.org or Microsoft Store
2. Make sure "Add to PATH" was checked during installation
3. Restart your terminal/command prompt
4. Try again

### "No .env.local file found"

This means the dashboard can't find your environment variables:
1. Make sure you're running from the gembooth root directory
2. Verify `.env.local` exists in the project root
3. Copy from `.env.example` if needed

### Dashboard shows incorrect information

The dashboard reads directly from configuration files:
1. Make sure `.env.local` is up to date
2. Restart the dashboard after making changes
3. Verify you're in the correct project directory

## Customization

### Adding Custom Notes

Edit `project-info/config.json` to add:
- Important reminders
- Deployment checklists
- Custom links
- Team member information
- Maintenance schedules

The dashboard will automatically include your custom data in future runs.

### Modifying the Dashboard

The main application is in:
```
project-info\gembooth_dashboard.py
```

It's well-commented Python code that you can modify to add new sections or features.

## Tips

1. **Create a Desktop Shortcut:** Right-click `run-dashboard.bat` → Send to → Desktop
2. **Pin to Taskbar:** For quick access on Windows
3. **Bookmark the Project:** Add gembooth folder to your file manager favorites
4. **Regular Updates:** Run the dashboard regularly to stay updated on project status

## Support

If you encounter issues with the dashboard:
1. Check this installation guide
2. Verify Python is properly installed
3. Review the README.md for usage instructions
4. Check that all files in project-info/ are present

## Files in project-info/

```
project-info/
├── gembooth_dashboard.py    # Main Python application
├── config.json              # Customizable configuration
├── README.md                # Feature overview
├── INSTALLATION.md          # This file
├── QUICK_REFERENCE.txt      # Fast-access cheatsheet
└── run-dashboard.bat        # Windows launcher
```

## Next Steps

1. Install Python (if not already installed)
2. Run the dashboard: `python project-info\gembooth_dashboard.py`
3. Explore the interactive menu
4. Bookmark the QUICK_REFERENCE.txt for fast access
5. Customize config.json with your project notes

Happy coding! 🎉

---

**Last Updated:** 2025-10-16
**Python Required:** 3.6+
**Platform:** Windows, macOS, Linux
