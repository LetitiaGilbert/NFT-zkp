# 🚀 Getting Started - ZKP NFT Verification Frontend

Complete this checklist to get your frontend running:

## ✅ Pre-Flight Checklist (5 min)

- [ ] **Install Node.js**
  - Download from https://nodejs.org/ (LTS version)
  - Verify: `node --version` (should be v18+)

- [ ] **Navigate to frontend folder**
  ```bash
  cd frontend
  ```

- [ ] **Install dependencies**
  ```bash
  npm install
  ```
  This installs React, Ethers.js, SnarkJS, and Vite.

## ⚙️ Configuration (5 min)

- [ ] **Get circuit artifacts from ZKP engineer**
  - `circuit.wasm`
  - `circuit_final.zkey`
  - `verification_key.json`

- [ ] **Copy artifacts to public folder**
  ```bash
  cp ../zkp/circuit_js/circuit.wasm public/
  cp ../zkp/circuit_final.zkey public/
  cp ../zkp/verification_key.json public/
  ```

- [ ] **Get contract address from blockchain engineer**
  - Ask for: deployed verifier contract address
  - Ask for: which network it's on (Sepolia, Mainnet, etc.)

- [ ] **Update `src/utils/constants.js`**
  ```javascript
  export const VERIFIER_ADDRESS = '0x...';  // From blockchain engineer
  export const NETWORK_ID = 11155111;       // Sepolia = 11155111, Mainnet = 1
  ```

## 🎬 Run the App (2 min)

- [ ] **Start development server**
  ```bash
  npm run dev
  ```

- [ ] **Visit http://localhost:3000**
  - App should open automatically
  - See wallet connection UI

## ✨ Test the Flow (5 min)

- [ ] **Install MetaMask browser extension**
  - Chrome/Firefox/Edge: Search "MetaMask" in extension store
  - Create test wallet or import existing

- [ ] **Switch MetaMask to correct network**
  - Click network dropdown in MetaMask
  - Select network matching NETWORK_ID (e.g., Sepolia)

- [ ] **Click "Connect MetaMask"**
  - Accept the permission request
  - Should show "Connected: 0x..."

- [ ] **Enter test inputs**
  - Use same values from `../zkp/input.json`
  - Example: ownerHash="123", expectedOwnerHash="123", collectionId="456", expectedCollectionId="456"

- [ ] **Click "Generate & Verify Proof"**
  - Should take 5-30 seconds first time (circuit initialization)
  - Check browser console (`F12`) for progress
  - Should show either "✅ NFT Verified" or error message

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **npm: command not found** | Install Node.js from https://nodejs.org/ |
| **Circuit files not found** | Copy wasm, zkey, verification_key.json to `public/` |
| **Verifier address not configured** | Update VERIFIER_ADDRESS in `src/utils/constants.js` |
| **Wrong network error** | Switch MetaMask to the correct network (update NETWORK_ID if needed) |
| **Proof generation fails** | Check browser console (F12 → Console tab) for details |
| **"Address not a contract"** | The VERIFIER_ADDRESS may be wrong, ask blockchain engineer |

## 📚 File Reference

| File | Purpose |
|------|---------|
| `src/utils/constants.js` | Configuration (contract address, network) |
| `src/components/WalletConnect.jsx` | MetaMask connection UI |
| `src/components/ProofGenerator.jsx` | Proof generation & verification UI |
| `src/utils/proof.js` | SnarkJS proof generation logic |
| `src/utils/contract.js` | Ethers.js smart contract interaction |
| `public/circuit.wasm` | Compiled circuit (from ZKP engineer) |
| `public/circuit_final.zkey` | Trusted setup (from ZKP engineer) |
| `public/verification_key.json` | Verification key (from ZKP engineer) |

## 🏗️ Build for Production

When ready to deploy:
```bash
npm run build
```

Creates optimized build in `dist/` folder. Deploy to:
- Vercel (easiest, free)
- Netlify
- GitHub Pages
- Any static host

## 📞 Team Coordination

See `../TEAM_COORDINATION.md` for:
- What to ask ZKP engineer for
- What to ask blockchain engineer for
- Full team workflow

## 🎓 How It Works (5 min read)

1. **User connects MetaMask** → `WalletConnect.jsx`
2. **User enters circuit inputs** → `ProofGenerator.jsx`
3. **Click "Generate & Verify"** → calls `generateProof()` in `proof.js`
4. **Proof generated locally** → uses circuit.wasm and circuit_final.zkey in browser
5. **Proof formatted for Solidity** → `formatProofForContract()`
6. **Proof sent to contract** → `verifyProofOnChain()` in `contract.js`
7. **Contract verifies on-chain** → returns true/false
8. **Result displayed** → shows transaction link and status

Everything happens in the browser except the final verification (which blockchain does).

## ✅ You're Ready!

Next step: Get the circuit artifacts and contract address from your team, then run it! 🚀

Questions? Check:
- `README.md` - Detailed documentation
- `INSTALL.md` - Installation help
- `../TEAM_COORDINATION.md` - Team coordination guide
