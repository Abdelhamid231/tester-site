@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

echo ============================================================
echo   AI WEB TESTER - DIAGNOSTIC & RUNNER
echo ============================================================
echo.

:: Check for Python
set PYTHON_CMD=
for %%p in (python python3 py) do (
    if not defined PYTHON_CMD (
        %%p --version >nul 2>&1
        if !errorlevel! == 0 set PYTHON_CMD=%%p
    )
)

if not defined PYTHON_CMD (
    echo [ERROR] Python not found. Please install Python (python.org).
    pause
    exit /b
)
echo [INFO] Using !PYTHON_CMD!

:: Check for Node/NPM
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [ERROR] Node.js not found. Please install Node.js.
    pause
    exit /b
)

:: Detect Package Manager
set PKG_MANAGER=npm
bun --version >nul 2>&1
if !errorlevel! == 0 (
    set PKG_MANAGER=bun
    echo [INFO] Bun detected, using Bun for faster installation.
)

:: Ensure V3 is here
if not exist "V3" (
    echo [ERROR] Critical Folder 'V3' is missing at: %cd%\V3
    echo Please ensure the 'V3' folder is in the same directory as this script.
    pause
    exit /b
)

:: Check and Start Ollama
echo [0/4] Checking Ollama Service...
ollama --version >nul 2>&1
if !errorlevel! neq 0 (
    echo [WARNING] Ollama is not installed. Enterprise Pro tests will fail.
    echo [TIP] Please install Ollama from https://ollama.com
) else (
    echo [*] Checking if Ollama is running...
    netstat -ano | findstr :11434 | findstr LISTENING >nul
    if !errorlevel! neq 0 (
        echo [*] Ollama not detected. Starting Ollama Serve...
        start "Ollama Service" /min cmd /c "ollama serve"
        echo [*] Waiting for Ollama to warm up...
        timeout /t 5 >nul
    ) else (
        echo [OK] Ollama is already running.
    )
    
    echo [*] Verifying AI Model (llama3.1:8b)...
    ollama list | findstr "llama3.1:8b" >nul
    if !errorlevel! neq 0 (
        echo [WARNING] AI Model 'llama3.1:8b' is missing.
        echo [!] This is required for Enterprise Pro analysis.
        echo [*] Attempting to pull model (requires 4.7GB download)...
        ollama pull llama3.1:8b
    ) else (
        echo [OK] AI Model 'llama3.1:8b' is ready.
    )
)

echo [1/4] Environment Cleanup...
echo [*] Freeing up port 8000 (Backend)...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/4] Backend Setup...
if exist "ai-web-optimizer-main\backend" (
    cd ai-web-optimizer-main\backend
    echo [*] Installing Python requirements...
    !PYTHON_CMD! -m pip install -r requirements.txt
    if !errorlevel! neq 0 (
        echo [WARNING] Some Python dependencies failed to install.
    )
    cd ..\..
) else (
    echo [ERROR] Backend folder not found at ai-web-optimizer-main\backend
    pause
    exit /b
)

echo [3/4] Frontend Setup...
if exist "ai-web-optimizer-main" (
    cd ai-web-optimizer-main
    if not exist "node_modules" (
        echo [*] node_modules missing. Starting %PKG_MANAGER% install...
        echo [!] This may take 2-5 minutes depending on your internet.
        if "!PKG_MANAGER!"=="bun" (
            call bun install
        ) else (
            call npm install
        )
        if !errorlevel! neq 0 (
            echo [ERROR] Frontend installation failed.
            echo [TIP] Try running '%PKG_MANAGER% install' manually in the ai-web-optimizer-main folder.
            pause
            exit /b
        )
    ) else (
        echo [OK] Frontend dependencies already present.
    )
) else (
    echo [ERROR] Frontend folder not found at ai-web-optimizer-main
    pause
    exit /b
)

echo [4/4] Launching Application...

:: Start backend
echo [*] Starting AI Backend engine...
start "AI Backend" cmd /k "cd backend && !PYTHON_CMD! main.py"

:: Wait for initialization
echo [*] Waiting for AI Backend to be ready...
set "READY_CHECK=0"
for /L %%i in (1,1,20) do (
    if !READY_CHECK! == 0 (
        timeout /t 1 >nul
        netstat -ano | findstr :8000 | findstr LISTENING >nul
        if !errorlevel! == 0 (
            set "READY_CHECK=1"
            echo [OK] AI Backend is ready!
        ) else (
            echo [*] Engine warming up... (Attempt %%i/20)
        )
    )
)

if !READY_CHECK! == 0 (
    echo [WARNING] Backend is taking longer than expected to start.
    echo [TIP] Check the 'AI Backend' window for errors.
    pause
)

:: Start frontend
echo [*] Launching Web Interface...
start http://localhost:5173
if "!PKG_MANAGER!"=="bun" (
    call bun dev
) else (
    call npm run dev
)

if !errorlevel! neq 0 (
    echo [ERROR] Failed to start frontend dev server.
    pause
)

pause
