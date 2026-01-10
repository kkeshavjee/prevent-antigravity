@echo off
cd /d "%~dp0"

:: Check for node_modules in frontend directory
if not exist "frontend\node_modules" (
    echo Installing dependencies...
    cd frontend
    call npm install
    cd ..
)

echo Starting Backend...
:: Launch Backend in a new window
start "Antigravity Backend" cmd /k "uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000"

echo Starting Frontend...
:: Launch Frontend in a new window
start "Antigravity Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Application started!
echo Backend running on http://localhost:8000
echo Frontend running on http://localhost:5173
echo.
pause
