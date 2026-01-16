#!/bin/bash

# Antigravity Startup Script for Mac/Linux

# Get the directory of the script
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

echo "=========================================="
echo "      Antigravity Startup Helper"
echo "=========================================="
echo ""

# 1. Check for Node.js
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed."
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

# 2. Check for Python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null; then
    if command -v python &> /dev/null; then
        PYTHON_CMD="python"
    else
        echo "[ERROR] Python 3 is not installed."
        echo "Please install Python from https://www.python.org/"
        exit 1
    fi
fi

# 3. Setup Backend Virtual Environment
echo "[1/3] Setting up Backend..."
if [ ! -d "backend/venv" ]; then
    echo "Creating virtual environment..."
    $PYTHON_CMD -m venv backend/venv
fi

# Install/Update requirements
echo "Installing/Updating backend dependencies..."
source backend/venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

# 4. Setup Frontend
echo ""
echo "[2/3] Setting up Frontend..."
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# 5. Launch Application
echo ""
echo "[3/3] Starting Application..."

# Function to run command in a new terminal window (macOS only)
run_in_new_terminal() {
    TITLE=$1
    CMD=$2
    if [[ "$OSTYPE" == "darwin"* ]]; then
        osascript -e "tell application \"Terminal\" to do script \"cd '$DIR' && $CMD\"" \
                  -e "tell application \"Terminal\" to set custom title of first window to \"$TITLE\""
    else
        # For Linux, we'll try common terminal emulators or just run in background
        if command -v gnome-terminal &> /dev/null; then
            gnome-terminal --title="$TITLE" -- bash -c "cd '$DIR' && $CMD; exec bash"
        elif command -v xterm &> /dev/null; then
            xterm -title "$TITLE" -e "cd '$DIR' && $CMD; exec bash" &
        else
            echo "Starting $TITLE in background..."
            eval "$CMD" &
        fi
    fi
}

echo "Starting Backend..."
run_in_new_terminal "Antigravity Backend" "source backend/venv/bin/activate && cd backend && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment for backend to initialize
sleep 2

echo "Starting Frontend..."
run_in_new_terminal "Antigravity Frontend" "cd frontend && npm run dev"

echo ""
echo "=========================================="
echo "Application is starting!"
echo ""
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "Check the new Terminal windows for logs."
else
    echo "Check terminal windows or background processes for logs."
fi
echo ""
echo "Backend URL:  http://localhost:8000"
echo "Frontend URL: http://localhost:5173"
echo "=========================================="
echo ""
