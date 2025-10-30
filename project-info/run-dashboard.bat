@echo off
REM GemBooth Dashboard Launcher
REM Quick launcher for the project information dashboard

title GemBooth Dashboard

echo.
echo ===============================================
echo      GemBooth Project Dashboard
echo ===============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH!
    echo Please install Python 3.6 or higher from python.org
    echo.
    pause
    exit /b 1
)

REM Get the directory of this batch file
cd /d "%~dp0"

REM Go up one level to project root
cd ..

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] Cannot find package.json!
    echo This script must be run from the GemBooth project.
    echo.
    pause
    exit /b 1
)

REM Run the dashboard
python project-info\gembooth_dashboard.py

REM Keep window open if there was an error
if errorlevel 1 (
    echo.
    echo [ERROR] Dashboard exited with an error!
    echo.
    pause
)
