@echo off
title AGAHI Vision Zero - Full Platform Launcher
cd /d "%~dp0"
echo ========================================================
echo Starting AGAHI Vision Zero Python ML Backend (Port 8000)...
echo ========================================================
start "AGAHI ML Backend" python backend_api.py
timeout /t 2 /nobreak > nul

echo ========================================================
echo Starting AGAHI Vision Zero React Frontend (Port 5173)...
echo ========================================================
start "AGAHI React Frontend" cmd /c "set PATH=C:\Users\HP\.nodejs;%%PATH%% && npm run dev"
timeout /t 3 /nobreak > nul

start http://localhost:5173
echo ========================================================
echo AGAHI Platform running at http://localhost:5173
echo ML Backend running at http://localhost:8000
echo ========================================================
pause
