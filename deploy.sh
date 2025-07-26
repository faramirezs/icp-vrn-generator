#!/bin/bash

# 🎲 icp-vrn Deployment Script
# Deploys ICP canisters and starts the frontend development server

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to check if dfx is running
check_dfx_running() {
    if dfx ping >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to wait for dfx to be ready
wait_for_dfx() {
    log_info "Waiting for dfx replica to be ready..."
    local max_attempts=30
    local attempt=1

    while [ $attempt -le $max_attempts ]; do
        if check_dfx_running; then
            log_success "dfx replica is ready!"
            return 0
        fi

        echo -n "."
        sleep 2
        attempt=$((attempt + 1))
    done

    log_error "dfx replica failed to start after ${max_attempts} attempts"
    return 1
}

# Function to start dfx in background if not running
ensure_dfx_running() {
    if check_dfx_running; then
        log_success "dfx replica is already running"
        return 0
    fi

    log_info "Starting dfx replica in background..."
    dfx start --clean --background

    if wait_for_dfx; then
        return 0
    else
        log_error "Failed to start dfx replica"
        return 1
    fi
}

# Function to deploy canisters
deploy_canisters() {
    log_info "Deploying canisters..."

    # Check if we need to pull dependencies first
    if ! dfx canister status llm >/dev/null 2>&1; then
        log_info "Pulling external canister dependencies..."
        dfx deps pull
        dfx deps deploy
    fi

    # Deploy all canisters
    dfx deploy

    log_success "Canisters deployed successfully!"
}

# Function to install npm dependencies
install_dependencies() {
    log_info "Installing npm dependencies..."
    npm install
    log_success "Dependencies installed!"
}

# Function to generate candid files
generate_candid() {
    log_info "Generating Candid interface files..."
    npm run generate-candid
    log_success "Candid files generated!"
}

# Function to build frontend
build_frontend() {
    log_info "Building frontend..."
    npm run build
    log_success "Frontend built!"
}

# Function to start development server
start_dev_server() {
    log_info "Starting development server..."
    log_warning "The development server will start at http://localhost:5173"
    log_warning "Press Ctrl+C to stop the server"

    # Give user a moment to read the message
    sleep 2

    # Start the development server (this will block)
    npm start
}

# Function to display canister information
show_canister_info() {
    log_info "Canister Information:"
    echo ""

    # Get canister IDs and URLs
    local backend_id=$(dfx canister id backend 2>/dev/null || echo "Not deployed")
    local frontend_id=$(dfx canister id frontend 2>/dev/null || echo "Not deployed")
    local llm_id=$(dfx canister id llm 2>/dev/null || echo "Not deployed")

    echo "📦 Backend Canister:"
    echo "   ID: $backend_id"
    if [ "$backend_id" != "Not deployed" ]; then
        echo "   URL: http://localhost:4943/?canisterId=$backend_id"
        echo "   Candid UI: http://localhost:4943/?canisterId=$backend_id&id=$backend_id"
    fi
    echo ""

    echo "🌐 Frontend Canister:"
    echo "   ID: $frontend_id"
    if [ "$frontend_id" != "Not deployed" ]; then
        echo "   URL: http://localhost:4943/?canisterId=$frontend_id"
    fi
    echo ""

    echo "🤖 LLM Canister:"
    echo "   ID: $llm_id"
    echo ""

    echo "🚀 Development Server: http://localhost:5173"
    echo ""
}

# Function to cleanup on exit
cleanup() {
    log_info "Deployment script interrupted"
    exit 1
}

# Main deployment function
main() {
    echo ""
    log_info "🎲 icp-vrn Deployment Script Starting..."
    echo ""

    # Set up cleanup trap
    trap cleanup INT TERM

    # Check prerequisites
    log_info "Checking prerequisites..."

    if ! command -v dfx &> /dev/null; then
        log_error "dfx is not installed. Please install DFX SDK first."
        exit 1
    fi

    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed. Please install Node.js and npm first."
        exit 1
    fi

    if ! command -v cargo &> /dev/null; then
        log_error "cargo is not installed. Please install Rust first."
        exit 1
    fi

    log_success "Prerequisites check passed!"
    echo ""

    # Step 1: Ensure dfx is running
    ensure_dfx_running || exit 1
    echo ""

    # Step 2: Install dependencies
    install_dependencies || exit 1
    echo ""

    # Step 3: Deploy canisters (this will automatically run generate-candid)
    deploy_canisters || exit 1
    echo ""

    # Step 4: Build frontend
    build_frontend || exit 1
    echo ""

    # Step 5: Show deployment information
    show_canister_info

    # Step 6: Start development server
    start_dev_server
}

# Parse command line arguments
case "${1:-}" in
    --help|-h)
        echo "🎲 icp-vrn Deployment Script"
        echo ""
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --help, -h     Show this help message"
        echo "  --no-start     Deploy canisters but don't start dev server"
        echo "  --clean        Clean deployment (restart dfx with --clean)"
        echo ""
        echo "This script will:"
        echo "  1. Start dfx replica (if not running)"
        echo "  2. Install npm dependencies"
        echo "  3. Deploy all canisters"
        echo "  4. Build frontend"
        echo "  5. Start development server at http://localhost:5173"
        echo ""
        exit 0
        ;;
    --no-start)
        # Run deployment without starting dev server
        ensure_dfx_running || exit 1
        install_dependencies || exit 1
        deploy_canisters || exit 1
        build_frontend || exit 1
        show_canister_info
        log_success "Deployment complete! Run 'npm start' to start the development server."
        exit 0
        ;;
    --clean)
        log_info "Performing clean deployment..."
        if check_dfx_running; then
            log_info "Stopping existing dfx replica..."
            dfx stop
        fi
        log_info "Starting fresh dfx replica..."
        dfx start --clean --background
        wait_for_dfx || exit 1
        install_dependencies || exit 1
        deploy_canisters || exit 1
        build_frontend || exit 1
        show_canister_info
        start_dev_server
        ;;
    "")
        # Default behavior - run full deployment
        main
        ;;
    *)
        log_error "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac
