#!/bin/bash

# ICP Quantum Randomness Validator Setup Script

echo "🌟 Setting up ICP Quantum Randomness Validator..."

# Create virtual environment
echo "📦 Creating Python virtual environment..."
cd "$(dirname "$0")"
python3 -m venv venv

# Activate virtual environment
echo "🔄 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📚 Installing dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Setup complete!"
echo ""
echo "🚀 To start the quantum validation service:"
echo "   cd src/quantum-validator"
echo "   source venv/bin/activate"
echo "   python main.py"
echo ""
echo "🔬 Service will be available at: http://localhost:8000"
echo "📊 API documentation at: http://localhost:8000/docs"
echo ""
echo "⚡ For IBM Quantum integration:"
echo "   1. Create account at https://quantum-computing.ibm.com/"
echo "   2. Get your API token"
echo "   3. Set environment variable: export IBM_QUANTUM_TOKEN=your_token"
