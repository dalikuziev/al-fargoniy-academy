@echo off
title Al-Farg'oniy Academy Frontend
cd /d "%~dp0"
set PATH=%~dp0..\tools\node-v22.11.0-win-x64;%PATH%
echo ===================================================
echo  Al-Farg'oniy Academy Frontend Ishga Tushmoqda...
echo  URL: http://localhost:3000
echo ===================================================
call npm.cmd run dev
pause
