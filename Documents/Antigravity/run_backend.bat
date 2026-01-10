@echo off
echo Starting Backend Server...

uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
pause
