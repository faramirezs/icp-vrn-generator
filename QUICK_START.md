# 🚀 Quick Start Guide

## One-Command Launch

To start the complete ICP Quantum Random Number Generator with quantum validation:

```bash
./start-quantum-demo.sh
```

This single command will set up and launch everything you need!

## What the Script Does

1. **✅ Prerequisites Check**: Verifies dfx, node, npm, python3, and curl are installed
2. **📦 Dependency Installation**: Automatically installs npm packages if needed
3. **🔧 Python Environment Setup**: Creates virtual environment and installs quantum dependencies
4. **🧹 Cleanup**: Stops any existing services to avoid conflicts
5. **📡 Start ICP Replica**: Launches local Internet Computer development environment
6. **🏗️ Deploy Canisters**: Deploys your random number generator canister
7. **⚛️ Start Quantum Service**: Launches quantum validation service using demo.py
8. **🎨 Start Frontend**: Launches React development server
9. **💓 Health Monitoring**: Monitors all services every 30 seconds
10. **🛑 Clean Shutdown**: Proper cleanup when you press Ctrl+C

## Access Points

Once started, you'll have access to:

- **🌐 Frontend**: http://localhost:5173 or http://localhost:5174
- **⚛️ Quantum API**: http://localhost:8000
- **📚 API Docs**: http://localhost:8000/docs
- **🔧 DFX Dashboard**: http://127.0.0.1:4943

## How to Use

### 1. Generate Random Numbers

1. Open the frontend URL in your browser
2. Navigate to the "Random Generator" tab
3. Set your desired range (e.g., 1-6 for dice)
4. Click "Roll Dice" or "Generate Number"
5. Generate at least 10 numbers for best quantum validation results

### 2. Validate Quantum-Level Randomness

1. Switch to the "Quantum Validation" tab
2. Click "🚀 Prove Quantum-Level Randomness"
3. Watch the magic happen as the system:
   - Fetches your ICP random numbers
   - Generates equivalent quantum numbers
   - Runs NIST statistical tests
   - Proves ICP meets quantum standards!

## Stopping the Services

Press **Ctrl+C** in the terminal where you ran the script. It will cleanly stop all services.

## Troubleshooting

### Port Conflicts

If ports are already in use, the script will:

- Use existing DFX replica if port 4943 is busy
- Kill existing quantum service if port 8000 is busy
- Find next available port (5174) if frontend port 5173 is busy

### Prerequisites Missing

The script will tell you exactly which tool is missing and how to install it:

- **dfx**: `sh -ci "$(curl -fsSL https://internetcomputer.org/install.sh)"`
- **Node.js**: Install Node.js 18+ from nodejs.org
- **Python**: Install Python 3.8+ from python.org

### Service Not Starting

The script includes health checks and will report which service failed to start. Common issues:

- **DFX**: May need `dfx stop` first to clean up previous state
- **Quantum Service**: Check that Python virtual environment was created properly
- **Frontend**: May need `npm install` if dependencies are missing

## Manual Setup (If Needed)

If the automated script fails, you can run each step manually:

```bash
# Install dependencies
npm install

# Setup quantum environment
cd src/quantum-validator && ./setup.sh && cd ../..

# Start services manually
dfx start --clean --background
dfx deploy
cd src/quantum-validator && source venv/bin/activate && python3 demo.py &
cd ../.. && npm start
```

## Features to Explore

- **🎯 Custom Ranges**: Try 1-6 for dice, 1-100 for percentages, any range you want
- **📈 History Tracking**: View all your generated numbers with timestamps
- **🔍 Integrity Verification**: Built-in sequence validation
- **📊 NIST Tests**: Real statistical tests with detailed p-value analysis
- **⚛️ Quantum Comparison**: Statistical proof that ICP randomness meets quantum standards

Enjoy exploring the world's first quantum-validated blockchain randomness! 🎲⚛️
