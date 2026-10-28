@echo off
title Cosmetic Content Checker AI Server
echo ========================================================
echo   KHOI DONG COSMETIC CONTENT CHECKER AI (PORT 3000)
echo ========================================================
cd /d "%~dp0"
echo Dang chay kiem tra build va khoi dong...
npm run start
pause
