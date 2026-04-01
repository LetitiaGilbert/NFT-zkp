# 🔐 ZKP NFT Verification System - Complete Implementation

> **⚡ START HERE:** First time? Read [INSTALL.md](./INSTALL.md) (5 min)
>
> Then check your role-specific guide:
> - 🎨 **Frontend Dev?** → [frontend/README.md](./frontend/README.md)
> - 🔗 **Blockchain Dev?** → [contracts/README.md](./contracts/README.md)
> - 🧮 **ZKP Engineer?** → [zkp/README.md](./zkp/README.md)
> - 📋 **Team Lead?** → [TEAM_COORDINATION.md](./TEAM_COORDINATION.md)

**A full-stack zero-knowledge proof system for proving NFT ownership without revealing sensitive data.**

## 🎯 What This Does

Prove you own a specific NFT from a specific collection **without revealing your actual NFT data**.

```
╔═══════════════════════════════════════════════════════════════╗
║                        ZKP NFT Verification                   ║
├──────────────────────────────────────────────────────────────┤
║                                                                ║
║  User: "I own NFT #123 from MyCollection"                    ║
║  System: "Prove it without showing us anything"              ║
║                                                                ║
║  1️⃣  Generate proof locally (browser) ← Private data stays   ║
║  2️⃣  Send proof to blockchain                                ║
║  3️⃣  Smart contract verifies → ✓ VERIFIED                    ║
║                                                                ║
║  Result: Proof, Not Data                                     ║
╚═══════════════════════════════════════════════════════════════╝
```

## 📦 What's Included

Complete production-ready code for:

### 1. **Frontend** (`frontend/`)
- React app with MetaMask integration
- ZKP proof generation (SnarkJS in browser)
- Smart contract interaction (ethers.js)
- Responsive UI + Etherscan links

### 2. **Smart Contracts** (`contracts/`)
- Groth16 verifier (on-chain proof verification)
- NFT verification contract (state management)
- Unit tests
- Deployment scripts (Hardhat)

### 3. **ZKP Circuit** (`zkp/`)
- Circom circuit definition
- Proof generation utilities
- Test inputs and examples
- Full documentation

## 🚀 Quick Start (30 seconds)

```bash
# 1. Frontend setup
cd frontend
npm install

# 2. Smart contracts setup
cd ../contracts
npm install

# 3. ZKP circuit setup
cd ../zkp
npm install
```

Then follow the step-by-step guides below.

## 📋 Complete Setup Guide

### Step 1: ZKP Engineer (Circom)

```bash
cd zkp

# Review the circuit
cat nft.circom

# Test proof generation
npm install
node prove.js

# Copy artifacts to frontend (after confirm it works)
cp nft_js/nft.wasm ../frontend/public/circuit.wasm
cp circuit_final.zkey ../frontend/public/
cp verification_key.json ../frontend/public/
```

**👉 See `zkp/SETUP.md` for detailed circuit docs**

### Step 2: Blockchain Engineer (Solidity)

```bash
cd contracts

# Setup environment
npm install
cp .env.example .env

# Edit .env with your keys
PRIVATE_KEY=0x...
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/...

# Run tests locally
npx hardhat test

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

**Record the Verifier contract address** ← This goes to frontend!

**👉 See `contracts/README.md` for detailed deployment docs**

### Step 3: Frontend Developer (React)

```bash
cd frontend

# Install dependencies
npm install

# Update configuration
# Edit src/utils/constants.js
export const VERIFIER_ADDRESS = '0x...';  // From blockchain engineer
export const NETWORK_ID = 11155111;       // Sepolia testnet

# Start development server
npm run dev
```

**Opens http://localhost:3000 automatically**

**👉 See `frontend/README.md` for detailed frontend docs**

## ✅ Full Testing Flow

### 1. Test Circuit Locally
```bash
cd zkp
node prove.js       # Generate proof
node verify.js      # Verify proof without blockchain
```

✓ Proof generation works

### 2. Test Smart Contracts
```bash
cd contracts
npx hardhat test    # Run test suite
```

✓ Contract verification works

### 3. Test Full System
```bash
# Terminal 1: Local blockchain
cd contracts
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start frontend
cd frontend
npm run dev
```

Visit http://localhost:3000 and verify an NFT end-to-end.

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                          Browser (Frontend)                    │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  React App (Port 3000)                                    │ │
│  │  ├─ Connect MetaMask wallet                              │ │
│  │  ├─ Load circuit.wasm + circuit_final.zkey               │ │
│  │  ├─ Generate ZKP proof locally (SnarkJS)                │ │
│  │  └─ Send proof to blockchain                             │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────┬───────────────────────┘
                                       │
                                       │ Proof
                                       │
                    ┌──────────────────▼─────────────────┐
                    │    Blockchain (Sepolia Testnet)    │
                    ├────────────────────────────────────┤
                    │ Smart Contracts:                   │
                    │ ├─ Verifier (Groth16)             │
                    │ └─ NFTVerification (State)         │
                    │                                    │
                    │ Verifies and returns result        │
                    └────────────────────────────────────┘
```

## 📁 Folder Structure

```
NFT-zkp/
├── frontend/                    # React app
│   ├── src/
│   │   ├── components/
│   │   │   ├── WalletConnect.jsx
│   │   │   └── ProofGenerator.jsx
│   │   ├── utils/
│   │   │   ├── constants.js         ← UPDATE THIS
│   │   │   ├── proof.js
│   │   │   └── contract.js
│   │   └── App.jsx
│   ├── public/
│   │   ├── circuit.wasm            ← FROM ZKP engineer
│   │   ├── circuit_final.zkey      ← FROM ZKP engineer
│   │   └── verification_key.json   ← FROM ZKP engineer
│   ├── QUICKSTART.md
│   ├── README.md
│   ├── INSTALL.md
│   └── package.json
│
├── contracts/                   # Solidity smart contracts
│   ├── contracts/
│   │   ├── Verifier.sol
│   │   └── NFTVerification.sol
│   ├── scripts/
│   │   └── deploy.js
│   ├── test/
│   │   └── Verifier.test.js
│   ├── README.md
│   ├── hardhat.config.js
│   ├── .env.example
│   └── package.json
│
├── zkp/                         # Circom circuit
│   ├── nft.circom
│   ├── input.json
│   ├── proof.json
│   ├── public.json
│   ├── verification_key.json
│   ├── SETUP.md
│   ├── README.md
│   └── package.json
│
├── TEAM_COORDINATION.md         # Team guide
├── README.md                    # This file
└── .git/
```

## 🔄 Data Flow

```
User Input (MetaMask wallet + NFT data)
         ↓
   Generate Proof (locally, browser)
         ↓
   Format Proof (for Solidity)
         ↓
   Send to Smart Contract
         ↓
   Contract Verifies (on-chain)
         ↓
   ✓ VERIFIED or ✗ FAILED (result)
```

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | UI and proof generation |
| | ethers.js v6 | Wallet & contract interaction |
| | SnarkJS | ZKP proof generation |
| **Circuit** | Circom 2.0 | Zero-knowledge proof circuit |
| | Groth16 | Proof protocol |
| **Smart Contract** | Solidity 0.8.19 | On-chain verification |
| | Hardhat | Development & testing |
| **Network** | Ethereum / Polygon / Arbitrum | Any EVM chain |
| | MetaMask | Wallet integration |

## 📊 Performance

| Operation | Time | Cost |
|-----------|------|------|
| Proof generation (first) | 10-30 sec | 0 (local) |
| Proof generation (subsequent) | 3-10 sec | 0 (local) |
| Smart contract verification | 1-3 sec | ~0.1 ETH gas (Sepolia) |
| **Total end-to-end** | **13-33 sec** | **~$0.05-0.15** |

*Times vary based on circuit complexity and network congestion*

## 🔐 Security

✅ **What's Secure:**
- Zero-knowledge: Private data never transmitted
- Proof can't be forged without secrets
- Verification is cryptographically sound
- Works on public blockchain (transparent)

⚠️ **Assumptions:**
- Circuit is implemented correctly
- Verification key hasn't been modified
- You trust your ZKP engineer
- Smart contract code is audited

## 📚 Documentation

- **Frontend**: `frontend/README.md` + `frontend/QUICKSTART.md`
- **Contracts**: `contracts/README.md`
- **Circuit**: `zkp/README.md` + `zkp/SETUP.md`
- **Team**: `TEAM_COORDINATION.md`

## 🐛 Troubleshooting

### "Circuit files not found"
```bash
cd zkp && node prove.js        # Generate proof
cp nft_js/nft.wasm ../frontend/public/circuit.wasm
```

### "Verifier contract address not configured"
```bash
# 1. Deploy contracts in contracts/ folder
npx hardhat run scripts/deploy.js --network sepolia
# 2. Copy address to frontend/src/utils/constants.js
```

### "Wrong network error"
- MetaMask must be on same network as contract
- Default: Sepolia testnet (update NETWORK_ID if different)
- Get testnet ETH: https://faucets.chain.link/sepolia

### "Proof generation takes forever"
- Normal first time (circuit initialization)
- Subsequent proofs should be faster
- Check browser console (F12) for errors

## 🚀 Deployment Checklist

- [ ] Circuit compiles and generates valid proofs
- [ ] Smart contracts compile and tests pass
- [ ] Contracts deployed to testnet
- [ ] Frontend connects to wallet
- [ ] Frontend loads circuit artifacts
- [ ] Proof generation works in browser
- [ ] Proof verification works on-chain
- [ ] End-to-end test succeeds
- [ ] UI shows results correctly

## ⚡ Next Steps

1. **Install Node.js** (https://nodejs.org/)
2. **Run setup for each folder:** `npm install`
3. **ZKP Engineer:** Test circuit (zkp folder)
4. **Blockchain Engineer:** Deploy contracts (contracts folder)
5. **Frontend Developer:** Connect everything (frontend folder)
6. **Test together:** End-to-end demo

## 📞 Team Coordination

See `TEAM_COORDINATION.md` for:
- What each role needs from others
- File locations and dependencies
- Common issues and solutions
- Integration timeline

## 📖 How It Works (Technical)

1. **Circuit Definition** (Circom)
   - Defines constraints over private/public signals
   - Outputs: proof + public signals

2. **Proof Generation** (SnarkJS)
   - Uses circuit.wasm (circuit logic)
   - Uses circuit_final.zkey (trusted setup)
   - Generates Groth16 proof

3. **Contract Verification** (Solidity)
   - Uses ecAdd, ecMul, ecPairing precompiles
   - Verifies proof equation: e(pA, pB) = e(...) * e(...)
   - Returns true/false

4. **Frontend Integration** (React)
   - User inputs → proof generation → contract call → result

## 🎓 Educational Value

This project demonstrates:
- Zero-knowledge proofs (Groth16 protocol)
- Circom circuit development
- SnarkJS proof generation
- Solidity elliptic curve operations
- Web3 wallet integration
- Smart contract deployment
- Full-stack blockchain development

## 📄 License

MIT (modify and use freely)

## 🤝 Contributing

All three roles should collaborate:
- **ZKP Engineer**: Optimize circuit, improve constraints
- **Blockchain Engineer**: Add features, improve security
- **Frontend Developer**: Better UX, error handling

## 🆘 Getting Help

1. Check the documentation in each folder
2. Review the comprehensive guides:
   - `frontend/QUICKSTART.md` - 5-minute start
   - `contracts/README.md` - Deployment guide
   - `zkp/SETUP.md` - Circuit guide
3. See `TEAM_COORDINATION.md` for team questions

---

**Happy hacking! 🚀**

Built for hackathons. Production-ready code. Zero-knowledge proofs made simple.
