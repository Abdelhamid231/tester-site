@echo off
setlocal enabledelayedexpansion

echo ============================================================
echo   🚀 AI WEB OPTIMIZER - NEXT GEN RELEASE
echo ============================================================
echo.

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed. Please install Python to continue.
    pause
    exit /b
)

:: Check for Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js to continue.
    pause
    exit /b
)

echo [1/4] Installing Backend Dependencies...
cd ai-web-optimizer-main\backend
pip install -r requirements.txt >nul
echo [OK] Backend ready.

echo [2/4] Installing Frontend Dependencies...
cd ..
call npm install >nul
echo [OK] Frontend ready.

echo [3/4] Starting AI Backend (Port 8000)...
start /b cmd /c "cd backend && python main.py"

echo [4/4] Starting Web UI (Vite)...
echo.
echo ============================================================
echo   ✨ APP IS STARTING!
echo   👉 Backend: http://localhost:8000
echo   👉 UI: http://localhost:5173 (Opening now...)
echo ============================================================
echo.

npm run dev

pause
