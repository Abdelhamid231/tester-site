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
    echo Please make sure the 'V3' folder is in the same directory as this script.
    pause
    exit /b
)

echo [1/4] Configuring Environment...

:: Kill any existing backend on port 8000
echo [*] Checking for existing backend processes on port 8000...
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
    echo Try running 'pip install -r requirements.txt' manually in backend folder.
)
echo [OK] Backend dependencies checked.

echo [3/4] Installing Frontend Dependencies...
cd ..
if not exist "node_modules" (
    echo [*] First time setup: Installing frontend dependencies (this may take a while)...
    call npm install >nul 2>&1
) else (
    echo [OK] Frontend dependencies already installed.
)

echo [4/4] Launching AI Services...

:: Start backend in a separate window to keep logs visible if it crashes
echo [*] Starting AI Backend (Port 8000)...
start "AI Backend" cmd /c "cd backend && !PYTHON_CMD! main.py"

:: Wait for backend to be ready
echo [*] Waiting for backend to initialize...
:check_backend
set /a retry_count+=1
if !retry_count! gtr 10 (
    echo [ERROR] Backend failed to start after 10 attempts.
    echo Please check the "AI Backend" window for errors.
    pause
    exit /b
)
timeout /t 2 >nul
curl -s http://localhost:8000/ >nul
if !errorlevel! neq 0 (
    echo     Retrying (!retry_count!/10)...
    goto check_backend
)

echo [OK] Backend is LIVE.

echo.
echo ============================================================
echo   ✨ APP IS READY!
echo   👉 UI: http://localhost:5173
echo   (Press Ctrl+C in this window to stop everything)
echo ============================================================
echo.

:: Open browser automatically
start http://localhost:5173

:: Start frontend dev server
npm run dev

pause
