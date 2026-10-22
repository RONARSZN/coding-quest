@echo off
cd /d "%~dp0"
if not exist node_modules\vite\bin\vite.js (
  call npm.cmd ci
  if errorlevel 1 goto failed
)
if not exist dist\index.html (
  call npm.cmd run build
  if errorlevel 1 goto failed
)
call npm.cmd run preview -- --open
if errorlevel 1 echo Port 5188 may already be running. Open the same address, or stop the existing server first.
pause
exit /b
:failed
echo Setup failed. Read the error above and README.md.
pause
