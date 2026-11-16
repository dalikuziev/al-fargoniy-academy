@echo off
title Al-Farg'oniy Academy
cd /d "%~dp0"

echo ===================================================
echo  Al-Farg'oniy Academy tizimi ishga tushmoqda...
echo ===================================================
echo  1. Backend API:     http://127.0.0.1:8000
echo  2. Swagger Docs:    http://127.0.0.1:8000/docs
echo  3. React Frontend:  http://localhost:3000
echo ===================================================

set "PATH=%~dp0tools\node-v22.11.0-win-x64;%PATH%"

start "Backend FastAPI (8000)" cmd /k "python run.py"
start "Frontend React Vite (3000)" cmd /k "cd /d "%~dp0frontend" && npm.cmd run dev"

echo.
echo Serverlar ishga tushirildi!
echo Brauzerda oching:
echo   -> http://localhost:3000
echo   -> http://127.0.0.1:8000
echo.
pause
