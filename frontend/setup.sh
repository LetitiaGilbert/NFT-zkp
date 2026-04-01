#!/bin/bash

# Setup script for ZKP NFT Verification frontend
# Copies circuit artifacts from zkp folder to frontend/public

set -e

echo "🔧 Setting up ZKP NFT Verification frontend..."

# Check if zkp folder exists
if [ ! -d "../zkp" ]; then
  echo "❌ Error: ../zkp folder not found"
  exit 1
fi

# Create public folder if it doesn't exist
mkdir -p public

# Copy circuit artifacts
echo "📋 Copying circuit artifacts..."

if [ -f "../zkp/circuit_js/circuit.wasm" ]; then
  cp "../zkp/circuit_js/circuit.wasm" public/circuit.wasm
  echo "✓ Copied circuit.wasm"
else
  echo "⚠️  circuit.wasm not found. Make sure Circom has compiled the circuit."
fi

if [ -f "../zkp/circuit_final.zkey" ]; then
  cp "../zkp/circuit_final.zkey" public/circuit_final.zkey
  echo "✓ Copied circuit_final.zkey"
else
  echo "⚠️  circuit_final.zkey not found. Make sure trusted setup is complete."
fi

if [ -f "../zkp/verification_key.json" ]; then
  cp "../zkp/verification_key.json" public/verification_key.json
  echo "✓ Copied verification_key.json"
else
  echo "⚠️  verification_key.json not found."
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. npm install"
echo "2. Edit src/utils/constants.js with contract address"
echo "3. npm run dev"
