@echo off
title AGAHI Vision Zero - Web Dashboard
cd /d "%~dp0"
echo ========================================================
echo Starting AGAHI Vision Zero Streamlit Web Dashboard...
echo ========================================================
streamlit run app.py
pause
