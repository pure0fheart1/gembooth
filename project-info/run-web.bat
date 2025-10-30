@echo off
REM GemBooth Dashboard - Web Launcher (Flask)

title GemBooth Dashboard - Web

echo.
echo ===============================================
echo      GemBooth Dashboard - Web Version
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

REM Check if Flask is installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Flask is not installed. Installing Flask...
    echo.
    pip install flask
    if errorlevel 1 (
        echo [ERROR] Failed to install Flask!
        echo Please install manually: pip install flask
        echo.
        pause
        exit /b 1
    )
    echo.
    echo Flask installed successfully!
    echo.
)

echo Starting Web Dashboard...
echo.
echo The dashboard will be available at:
echo http://localhost:5555
echo.
echo Press Ctrl+C to stop the server
echo.

REM Run the Flask web server
python project-info\dashboard_web.py

REM Keep window open if there was an error
if errorlevel 1 (
    echo.
    echo [ERROR] Dashboard exited with an error!
    echo.
    pause
)
