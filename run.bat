@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   🚀 AI WEB OPTIMIZER - NEXT GEN RELEASE
echo   (Portable & Self-Contained Edition)
echo ============================================================
echo.

:: Detect Python
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

:: Detect Node
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
cd ai-web-optimizer-main

echo [2/4] Installing Backend Dependencies...
cd backend
!PYTHON_CMD! -m pip install -r requirements.txt >nul
if !errorlevel! neq 0 (
    echo [WARNING] Dependency installation had issues. Backend might fail.
)
echo [OK] Backend ready.

echo [3/4] Installing Frontend Dependencies...
cd ..
call npm install >nul
echo [OK] Frontend ready.

echo [4/4] Launching AI Services...
start /b cmd /c "cd backend && !PYTHON_CMD! main.py"

echo.
echo ============================================================
echo   ✨ APP IS STARTING!
echo   👉 Backend: http://localhost:8000
echo   👉 UI: http://localhost:5173 (Opening now...)
echo ============================================================
echo.

npm run dev

pause
