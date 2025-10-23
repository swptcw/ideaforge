@echo off
echo ========================================
echo   IdeaForge - Business Idea Generator
echo ========================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting the app...
echo The app will open automatically in your browser!
echo.
call npm run dev
