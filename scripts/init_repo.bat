@echo off
setlocal
echo ==========================================
echo      Antigravity Git Setup Helper
echo ==========================================
echo.

:: Try to find git
set GIT_CMD=git
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 'git' command not found in PATH.
    echo Checking common installation locations...
    if exist "c:\Users\Karim Keshavjee\AppData\Local\Programs\Git\cmd\git.exe" (
        set "GIT_CMD=c:\Users\Karim Keshavjee\AppData\Local\Programs\Git\cmd\git.exe"
        echo Found Git at: "c:\Users\Karim Keshavjee\AppData\Local\Programs\Git\cmd\git.exe"
    ) else (
        echo ERROR: Could not find git.exe. Please ensure Git is installed.
        pause
        exit /b
    )
)

echo.
echo 1. Initializing repository...
"%GIT_CMD%" init

echo.
echo 2. Adding files...
"%GIT_CMD%" add .

echo.
echo 3. Committing files...
"%GIT_CMD%" commit -m "Initial setup of Antigravity project"

echo.
echo ==========================================
echo      Connect to GitHub
echo ==========================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g., https://github.com/user/repo.git): "

if "%REPO_URL%"=="" (
    echo No URL provided. Skipping remote connection.
) else (
    echo.
    echo Connecting to %REPO_URL%...
    "%GIT_CMD%" remote remove origin >nul 2>nul
    "%GIT_CMD%" remote add origin %REPO_URL%
    "%GIT_CMD%" branch -M main
    "%GIT_CMD%" push -u origin main
)

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
pause
