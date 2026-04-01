# 📦 DEPENDENCIES INSTALLATION GUIDE

Complete step-by-step guide for installing all dependencies.

---

## ⚡ TL;DR (Quick Version)

```bash
# Terminal 1: Frontend
cd frontend
npm install

# Terminal 2: Smart Contracts
cd ../contracts
npm install

# Terminal 3: ZKP Circuit
cd ../zkp
npm install
```

Done! All dependencies installed. Proceed to DEPLOYMENT.md.

---

## 📋 DETAILED GUIDE

### Prerequisites (One-Time Setup)

#### 1. Install Node.js
**Windows:**
- Download from https://nodejs.org/ (LTS version)
- Run installer
- Restart your computer
- Verify: `node --version` (should show v18+)

**macOS:**
```bash
brew install node
# or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install nodejs npm
```

#### 2. Verify Installation
```bash
node --version          # Should be v16+ (v18+ recommended)
npm --version           # Should be v9+
```

If either shows "command not found", Node.js isn't installed correctly.

---

## 🔧 INSTALL DEPENDENCIES BY FOLDER

### FOLDER 1: FRONTEND (React)

```bash
cd /path/to/NFT-zkp/frontend
npm install
```

**What gets installed:**
```
Dependencies:
  - react@^18.2.0              # UI framework
  - react-dom@^18.2.0          # DOM rendering
  - ethers@^6.9.0              # Web3 wallet & contract interaction
  - snarkjs@^0.7.7             # ZKP proof generation

Dev Dependencies:
  - vite@^5.0.0                # Build tool
  - @vitejs/plugin-react       # React plugin for Vite
  - @types/react               # TypeScript types (optional)
  - @types/react-dom           # TypeScript types (optional)

Total Size: ~500MB
Time: ~2-3 minutes
```

**Verify Installation:**
```bash
npm list
# Should show react, ethers, snarkjs, vite
```

**Start Frontend:**
```bash
npm run dev
# Opens http://localhost:3000
```

---

### FOLDER 2: SMART CONTRACTS (Hardhat)

```bash
cd /path/to/NFT-zkp/contracts
npm install
```

**What gets installed:**
```
Dependencies:
  - ethers@^6.9.0              # Web3 library

Dev Dependencies:
  - hardhat@^2.19.0            # Smart contract development framework
  - @nomiclabs/hardhat-ethers  # Ethers.js integration
  - @nomiclabs/hardhat-etherscan  # Etherscan verification

Total Size: ~600MB
Time: ~2-3 minutes
```

**Verify Installation:**
```bash
npx hardhat --version
# Should show: hardhat/2.19.0
```

**Compile Contracts:**
```bash
npx hardhat compile
# Should create artifacts/ folder with compiled contracts
```

**Run Tests:**
```bash
npx hardhat test
# Should pass all tests
```

---

### FOLDER 3: ZKP CIRCUIT (SnarkJS)

```bash
cd /path/to/NFT-zkp/zkp
npm install
```

**What gets installed:**
```
Dependencies:
  - snarkjs@^0.7.6             # ZKP proof generation & verification

Total Size: ~100MB
Time: ~1-2 minutes
```

**Verify Installation:**
```bash
node -e "console.log(require('snarkjs'))" | grep -q "groth16" && echo "✓ SnarkJS installed"
```

**Test Proof Generation:**
```bash
node prove.js
# Should generate proof.json and public.json
```

---

## 📊 Dependencies Summary

| Package | Version | Purpose | Size | Folder |
|---------|---------|---------|------|--------|
| **react** | ^18.2.0 | UI framework | - | frontend |
| **react-dom** | ^18.2.0 | React rendering | - | frontend |
| **ethers** | ^6.9.0 | Web3 library | 150MB | frontend + contracts |
| **snarkjs** | ^0.7.7 | ZKP proofs | 80MB | frontend + zkp |
| **vite** | ^5.0.0 | Build tool | 50MB | frontend |
| **hardhat** | ^2.19.0 | Smart contract dev | 300MB | contracts |

---

## ❓ COMMON INSTALLATION ISSUES

### Issue 1: "npm: command not found"

**Cause:** Node.js not installed

**Solution:**
1. Download Node.js from https://nodejs.org/
2. Run installer (follow prompts)
3. Close and reopen terminal/PowerShell
4. Verify: `node --version`

---

### Issue 2: "Permission denied" (macOS/Linux)

**Cause:** npm permissions issue

**Solution:**
```bash
# Option 1: Use sudo (not recommended)
sudo npm install

# Option 2: Fix npm permissions (better)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install
```

---

### Issue 3: "npm ERR! code ERESOLVE"

**Cause:** Dependency conflict

**Solution:**
```bash
# Force install (usually works)
npm install --legacy-peer-deps

# Or clear cache
npm cache clean --force
npm install
```

---

### Issue 4: "slow internet / installation hangs"

**Solution:**
```bash
# Use faster npm mirror
npm config set registry https://registry.npmmirror.com

# Or use alternative package manager (pnpm - faster)
npm install -g pnpm
pnpm install
```

---

### Issue 5: "disk space full"

**Solution:**
```bash
# Check disk space
df -h

# Clean npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🔄 INSTALLATION VERIFICATION CHECKLIST

### After Each npm install

**Frontend:**
```bash
cd frontend
ls node_modules | grep -E "react|ethers|snarkjs|vite"
# Should show all packages
npm run dev
# Should start dev server
```

**Contracts:**
```bash
cd contracts
npx hardhat compile
# Should compile without errors
npx hardhat test
# Should run tests
```

**ZKP Circuit:**
```bash
cd zkp
node -e "const snarkjs = require('snarkjs'); console.log('✓ SnarkJS ready')"
node prove.js
# Should generate proof.json
```

---

## 📝 PACKAGE.JSON FILES

### frontend/package.json
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "ethers": "^6.9.0",
    "snarkjs": "^0.7.7"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

### contracts/package.json
```json
{
  "devDependencies": {
    "@nomiclabs/hardhat-ethers": "^2.2.3",
    "@nomiclabs/hardhat-etherscan": "^3.1.7",
    "ethers": "^6.9.0",
    "hardhat": "^2.19.0"
  }
}
```

### zkp/package.json
```json
{
  "dependencies": {
    "snarkjs": "^0.7.6"
  }
}
```

---

## 🚀 NEXT STEPS AFTER INSTALLATION

### 1. Verify Everything Works

```bash
# Frontend
cd frontend && npm run dev &

# Contracts (new terminal)
cd contracts && npx hardhat test &

# Circuit (new terminal)
cd zkp && node prove.js &
```

All should complete without errors.

### 2. Configure Environment

**For Smart Contracts:**
```bash
cd contracts
cp .env.example .env

# Edit .env:
# PRIVATE_KEY=0x... (from MetaMask)
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

**For Frontend:**
```bash
# Edit frontend/src/utils/constants.js
# VERIFIER_ADDRESS = '0x...' (after contracts deployed)
```

### 3. Follow DEPLOYMENT.md

Once all dependencies installed, follow the step-by-step deployment guide.

---

## 💾 disk Space Required

| Component | Size | Notes |
|-----------|------|-------|
| Frontend node_modules | 500MB | React, Vite, ethers, snarkjs |
| Contracts node_modules | 600MB | Hardhat, plugins |
| Circuit node_modules | 100MB | SnarkJS |
| **TOTAL** | **~1.2GB** | Should have 2GB free |

**Check available space:**
```bash
df -h /
# Should show >2GB available
```

---

## 🔧 Advanced: Custom Dependency Versions

If you need specific versions (not recommended for hackathon):

```bash
# Install specific version
npm install ethers@6.8.0

# Install latest
npm install ethers@latest

# Install from git
npm install https://github.com/ethers-io/ethers.js.git
```

---

## 📚 WHAT EACH DEPENDENCY DOES

### Frontend

**React** - UI framework
- Creates interactive user interface
- Manages state and component lifecycle
- ~2000+ npm packages depend on it

**Ethers.js** - Web3 library
- Connects to MetaMask wallet
- Calls smart contract functions
- Sends transactions

**SnarkJS** - ZKP library
- Generates Groth16 proofs
- Loads circuit.wasm and zkey
- Formats proofs for blockchain

**Vite** - Build tool
- Bundles React code
- Hot module reloading (dev mode)
- Optimizes for production

### Contracts

**Hardhat** - Smart contract framework
- Compiles Solidity
- Manages deployments
- Provides testing environment
- Interacts with blockchain

**Ethers.js** - Same as frontend
- Used for contract interactions
- Deploy scripts use it

### Circuit

**SnarkJS** - Same as frontend
- Generates and verifies proofs
- Used in both frontend and circuit testing

---

## ✅ You're Ready!

After `npm install` in all three folders:

✅ Frontend can start (`npm run dev`)
✅ Contracts can compile (`npx hardhat compile`)
✅ Circuit can generate proofs (`node prove.js`)

**Next:** Follow DEPLOYMENT.md for the launch sequence!

---

## 🆘 QUICK HELP

**Stuck?** Try these in order:

```bash
# 1. Clear npm cache
npm cache clean --force

# 2. Remove lock file and node_modules
rm -rf node_modules package-lock.json

# 3. Reinstall
npm install

# 4. Still broken? Use legacy flag
npm install --legacy-peer-deps
```

If still stuck, check:
- Node.js version: `node --version` (should be v16+)
- npm version: `npm --version` (should be v9+)
- Disk space: `df -h /` (should be >2GB free)
- Internet connection: `npm ping` should respond

---

That's it! Dependencies are the hardest part. Once installed, everything else is easy. 🚀
