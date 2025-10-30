# 📊 GemBooth Project Information Dashboard

A comprehensive command-line cheatsheet and information hub for the GemBooth project. This tool provides quick access to all essential project information including API keys, configurations, commands, and links.

## Features

✅ **Environment Variables** - View all API keys and secrets (safely masked)
✅ **Supabase Configuration** - Database tables, storage buckets, edge functions
✅ **Stripe Integration** - Payment configuration, test cards, webhooks
✅ **Quick Commands** - Essential development, deployment, and management commands
✅ **Quick Links** - Direct links to all dashboards and documentation
✅ **Project Structure** - Visual representation of the codebase
✅ **AI Modes** - List of all available transformation modes
✅ **Troubleshooting** - Common issues and solutions

## Usage

### Run Interactive Menu

```bash
# From gembooth root directory
python project-info/gembooth_dashboard.py
```

Or use the Windows launcher:

```bash
run-dashboard.bat
```

### Show All Information at Once

```bash
python project-info/gembooth_dashboard.py --all
```

Or:

```bash
python project-info/gembooth_dashboard.py -a
```

## Menu Options

The interactive menu provides the following options:

1. **Project Overview** - Basic project information and tech stack
2. **Environment Variables & API Keys** - All configuration (safely masked)
3. **Supabase Configuration** - Backend details, tables, functions
4. **Stripe Integration** - Payment setup, test cards, tiers
5. **Quick Commands** - Essential command reference
6. **Quick Links & Dashboards** - URLs to all important resources
7. **Project Structure** - Directory layout
8. **AI Transformation Modes** - Available AI effects
9. **Troubleshooting Guide** - Common problems and solutions
0. **Show All Information** - Display everything at once
q. **Quit** - Exit the dashboard

## Requirements

- Python 3.6 or higher
- No additional dependencies required (uses only standard library)

## Security

- API keys and secrets are automatically masked for display
- Full keys are never logged or saved
- Only reads from `.env.local` file (never writes)

## File Structure

```
project-info/
├── gembooth_dashboard.py    # Main dashboard application
├── config.json              # Editable configuration data
├── README.md                # This file
└── run-dashboard.bat        # Windows quick launcher
```

## Customization

You can edit `config.json` to add custom notes, links, or configuration without modifying the Python code.

## Updating Information

The dashboard reads directly from:
- `.env.local` - Environment variables
- `package.json` - Project dependencies
- `vercel.json` - Deployment configuration

If you update these files, the dashboard will automatically reflect the changes on the next run.

## Tips

- Run with `--all` or `-a` flag to quickly review all information
- Use the interactive menu for targeted information lookup
- Keep this tool handy when switching between projects
- Update the config.json with project-specific notes

## Support

For issues or feature requests related to this dashboard, contact the project maintainer or create an issue in the repository.

---

**Last Updated:** 2025-10-16
**Version:** 1.0.0
**Author:** Claude Code
