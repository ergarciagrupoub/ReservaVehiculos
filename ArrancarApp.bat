@echo off
echo ================================
echo Arrancando BACKEND
echo ================================

cd /d "%~dp0back-reserva-vehiculo"
start "BACKEND" cmd /k npm run dev

echo ================================
echo Arrancando FRONTEND
echo ================================

cd /d "%~dp0front-reserva-vehiculo"
start "FRONTEND" cmd /k npm run dev

echo ================================
echo Todo arrancado
echo ================================
