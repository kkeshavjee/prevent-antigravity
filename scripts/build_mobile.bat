@echo off
echo ==========================================
echo       PREVENT Dawn - Mobile Build
echo ==========================================
echo.
echo 1. Configuring Frontend...
cd frontend

echo 2. Installing Dependencies...
call npm install

echo 3. Building Web Assets...
call npm run build

echo 4. Adding Android Platform (if missing)...
if not exist android\ (
    call npx cap add android
)

echo 5. Syncing with Capacitor...
call npx cap sync

echo.
echo ==========================================
echo Build Complete!
echo.
echo To compile the APK:
echo 1. Open Android Studio
echo 2. Select the 'frontend/android' folder
echo 3. Go to Build > Build Bundle(s) / APK(s) > Build APK(s)
echo.
echo Launching Android Studio... (if installed)
call npx cap open android
pause
