@echo off
title Beyond ERP - Starting Services
echo ========================================================
echo Starting Beyond ERP (Backend on 4000, Frontend on 8080)
echo ========================================================

start "Beyond ERP - Backend (Port 4000)" cmd /k "cd backend && npm run dev"
start "Beyond ERP - Frontend (Port 8080)" cmd /k "cd frontend && npm run dev"

echo Services launched in separate visible terminal windows!
echo Backend:  http://localhost:4000
echo Frontend: http://localhost:8080

