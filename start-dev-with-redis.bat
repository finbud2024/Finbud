echo.
echo Stopping any existing Redis servers...
wsl -d Ubuntu -e bash -c "pkill redis-server || echo No Redis process found to kill"


echo.
echo Starting Redis server in WSL Ubuntu...
start cmd /k "wsl -d Ubuntu -e redis-server"

echo Giving Redis a moment to start up...
timeout /t 5 /nobreak > nul

echo Checking if Redis is running...
for /f %%i in ('wsl -d Ubuntu -e redis-cli ping') do set REDIS_RUNNING=%%i
if "%REDIS_RUNNING%"=="PONG" (
    echo ✅ Redis server is running in WSL Ubuntu
) else (
    echo ❌ Failed to start Redis server. Please check your WSL Ubuntu installation.
    exit /b 1
)

echo Starting Netlify dev environment...
netlify dev 