@echo off
echo 🚀 Exam Portal - Setup Verification
echo ==================================

echo 📦 Checking MongoDB...
mongosh --eval "db.runCommand('ping')" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ MongoDB is running
) else (
    echo ❌ MongoDB is not running. Please start MongoDB service.
    pause
    exit /b 1
)

echo 📦 Checking Node.js...
node --version | findstr /r "v[1-9][0-9]*" >nul
if %errorlevel% equ 0 (
    echo ✅ Node.js is installed
) else (
    echo ❌ Node.js version 14+ is required
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
npm install >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend dependencies installed
) else (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo 📦 Installing frontend dependencies...
cd frontend
npm install >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend dependencies installed
) else (
    echo ❌ Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo 🌱 Seeding database...
node seedDatabase.js >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Database seeded successfully
) else (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)

echo.
echo 🎯 Setup Complete!
echo ==================
echo Backend URL: http://localhost:5000
echo Frontend URL: http://localhost:5173
echo.
echo 👤 Test Credentials:
echo Admin: admin@examportal.com / admin123
echo Student: student@examportal.com / password123
echo.
echo 🚀 To start the application:
echo 1. Backend: npm start
echo 2. Frontend: cd frontend && npm run dev
echo.
pause
