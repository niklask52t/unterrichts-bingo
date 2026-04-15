@echo off
title Unterrichts-Bingo Server
cd /d "%~dp0"
echo Starte Unterrichts-Bingo...
echo.
npm install
echo.
echo Server laeuft auf http://localhost:3333
echo Druecke Strg+C zum Beenden.
echo.
node server.js
pause
