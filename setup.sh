#!/bin/bash

echo "🚀 Exam Portal - Setup Verification"
echo "=================================="

# Check if MongoDB is running
echo "📦 Checking MongoDB..."
if mongosh --eval "db.runCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running. Please start MongoDB service."
    exit 1
fi

# Check Node.js version
echo "📦 Checking Node.js..."
if node --version | grep -E "v[1-9][0-9]+" > /dev/null; then
    echo "✅ Node.js $(node --version) is installed"
else
    echo "❌ Node.js version 14+ is required"
    exit 1
fi

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "$(dirname "$0")"
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Backend dependencies installed"
else
    echo "❌ Failed to install backend dependencies"
    exit 1
fi

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Seed database
echo "🌱 Seeding database..."
node seedDatabase.js > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
else
    echo "❌ Failed to seed database"
    exit 1
fi

echo ""
echo "🎯 Setup Complete!"
echo "=================="
echo "Backend URL: http://localhost:5000"
echo "Frontend URL: http://localhost:5173"
echo ""
echo "👤 Test Credentials:"
echo "Admin: admin@examportal.com / admin123"
echo "Student: student@examportal.com / password123"
echo ""
echo "🚀 To start the application:"
echo "1. Backend: npm start"
echo "2. Frontend: cd frontend && npm run dev"
