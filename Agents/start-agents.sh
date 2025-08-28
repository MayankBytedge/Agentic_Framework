#!/bin/bash

# BytEdge AI Agents - Quick Start Script

echo "🚗 BytEdge AI Agents - Starting Individual Agent System..."
echo "=" * 60

# Check if Python is installed  
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Check if GEMINI_API_KEY is set
if [ -z "$GEMINI_API_KEY" ]; then
    echo "⚠️  GEMINI_API_KEY environment variable not set."
    echo "Please set your API key:"
    echo "export GEMINI_API_KEY='your_api_key_here'"
    echo ""
    echo "Get your API key from: https://makersuite.google.com/app/apikey"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
pip install -r agent-requirements.txt

# Start the server
echo "🚀 Starting BytEdge AI Agent Server..."
python agent-server.py
