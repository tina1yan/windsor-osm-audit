@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
 echo Install Node.js 22 or newer from https://nodejs.org/ and run again.
 pause
 exit /b 1
)
echo This downloads public data and writes a new local run. It does not upload to OSM.
node refresh.mjs
pause
