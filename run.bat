@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================================
echo   AI WEB OPTIMIZER - STANDALONE RELEASE
echo   Portable and Self-Contained Edition
echo ============================================================
echo.

:: Check for Python
set PYTHON_CMD=python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    set PYTHON_CMD=py
    py --version >nul 2>&1
    if !errorlevel! neq 0 (
        echo [ERROR] Python not found. Please install Python from python.org
        pause
        exit /b
    )
)

:: Check for Node
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js from nodejs.org
    pause
    exit /b
)

:: Ensure V3 is here
if not exist "V3" (
    echo [ERROR] Critical Folder 'V3' is missing. Release is corrupted.
    pause
    exit /b
)

echo [1/4] Configuring Environment...

:: Kill any existing backend on port 8000
echo [*] Checking for existing backend processes...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    echo [*] Killing process on port 8000: %%a
    taskkill /F /PID %%a >nul 2>&1
)

cd ai-web-optimizer-main

echo [2/4] Installing Backend Dependencies...
cd backend
!PYTHON_CMD! -m pip install -r requirements.txt >nul 2>&1
if !errorlevel! neq 0 (
    echo [WARNING] Dependency installation had issues. Backend might fail.
)
echo [OK] Backend ready.

echo [3/4] Installing Frontend Dependencies...
cd ..
call npm install >nul 2>&1
echo [OK] Frontend ready.

echo [4/4] Launching AI Services...
start /b cmd /c "cd backend && !PYTHON_CMD! main.py"

:: Wait a moment for backend to start
timeout /t 2 >nul

echo.
echo ============================================================
echo   APP IS STARTING!
echo   Backend: http://localhost:8000
echo   UI: http://localhost:5173 (Opening now...)
echo ============================================================
echo.

npm run dev

pause
