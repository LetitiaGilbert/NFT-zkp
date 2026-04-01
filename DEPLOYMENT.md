# 🚀 DEPLOYMENT & LAUNCH GUIDE

Complete step-by-step guide to get your ZKP NFT system live and working.

## 📋 Pre-Launch Checklist

### Environment Setup
- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm v9+ installed (`npm --version`)
- [ ] MetaMask browser extension installed
- [ ] Sepolia testnet ETH (from faucet)
- [ ] Infura or Alchemy API key

### Code Ready
- [ ] All three folders have `npm install` completed
- [ ] `.env` files created in `contracts/` folder
- [ ] No TypeScript errors

---

## 🏁 Launch Sequence (Day of Demo)

### **HOUR 1: ZKP Engineer Setup**

```bash
cd zkp

# Install dependencies
npm install

# Test the circuit works
node prove.js

# Verify proof
node verify.js

# Copy artifacts to frontend
cp nft_js/nft.wasm ../frontend/public/circuit.wasm
cp circuit_final.zkey ../frontend/public/
cp verification_key.json ../frontend/public/

echo "✓ ZKP Circuit Ready"
```

**Verify:** Two files appear in `frontend/public/`

---

### **HOUR 2: Blockchain Engineer Setup**

```bash
cd contracts

# Install dependencies
npm install

# Set up environment file
cp .env.example .env

# Edit .env with your credentials:
# PRIVATE_KEY=0x... (from MetaMask)
# SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

**Copy the Verifier contract address** → Goes to frontend!

**Example output:**
```
✓ Verifier deployed to: 0x1234567890abcdef...
✓ NFTVerification deployed to: 0x...
```

---

### **HOUR 3: Frontend Developer Setup**

```bash
cd frontend

# Install dependencies
npm install

# Update configuration
# Edit src/utils/constants.js

export const VERIFIER_ADDRESS = '0x...';  # Copy from blockchain engineer
export const NETWORK_ID = 11155111;       # Make sure this is correct

# Start development server
npm run dev
```

**Opens** http://localhost:3000 automatically

---

## ✅ Testing Each Component

### Test 1: Proof Generation Works
```bash
# Terminal in zkp folder
node prove.js

# Should output:
# ✓ Proof generated
# ✓ Valid proof: true
```

### Test 2: Contracts Deploy

```bash
# Terminal in contracts folder
npx hardhat run scripts/deploy.js --network sepolia

# Should output:
# ✓ Verifier deployed to: 0x...
# ✓ NFTVerification deployed to: 0x...
```

### Test 3: Frontend Loads

Visit http://localhost:3000

Should see:
- [ ] Title: "🔐 ZKP NFT Verification"
- [ ] Button: "🔗 Connect MetaMask"
- [ ] No red errors in console (F12)

---

## 🎬 End-to-End Demo Flow

### Prerequisites
1. MetaMask connected to Sepolia testnet
2. Sepolia ETH in wallet
3. Frontend running on localhost:3000
4. Contract deployed (address in constants.js)

### Demo Steps

**1. Start Frontend**
```bash
cd frontend
npm run dev
```

**2. Connect Wallet**
- Click "🔗 Connect MetaMask"
- Accept permission request
- Shows "✓ Connected: 0x..."

**3. Enter Test Input**
```
Owner Hash: 123
Expected Owner Hash: 123
Collection ID: 456
Expected Collection ID: 456
```

(Match values for valid proof → use different for invalid)

**4. Generate & Verify**
- Click "🔐 Generate & Verify Proof"
- Wait 10-30 seconds first time
- Shows one of:
  - ✅ "NFT Verified Successfully!"
  - ❌ "Proof verification failed"
  - ⚠️ Error message

**5. Check Results**
- Click Etherscan link
- See transaction on blockchain
- Proof was verified on-chain!

---

## ⚡ Quick Commands Reference

### Frontend
```bash
cd frontend
npm install           # First time only
npm run dev          # Start dev server
npm run build        # Build for production
```

### Contracts
```bash
cd contracts
npm install                                    # First time only
npx hardhat compile                          # Compile Solidity
npx hardhat test                             # Run tests
npx hardhat run scripts/deploy.js --network sepolia  # Deploy
```

### Circuit
```bash
cd zkp
npm install          # First time only
node prove.js       # Generate proof
node verify.js      # Verify proof
```

---

## 🔧 Troubleshooting During Demo

| Problem | Solution |
|---------|----------|
| **"Can't connect to MetaMask"** | Install MetaMask extension, refresh page |
| **"Wrong network"** | Switch MetaMask to Sepolia testnet |
| **"Circuit files not found"** | Copy from zkp/nft_js/ to frontend/public/ |
| **"Contract address invalid"** | Update VERIFIER_ADDRESS in constants.js |
| **"Proof generation hangs"** | Normal first time (10-30 sec), check console (F12) |
| **"Verification fails"** | Check input values match (123, 123, 456, 456) |
| **"No gas"** | Get Sepolia ETH: https://faucets.chain.link/sepolia |

---

## 📊 What to Show a Judge

### 1. **Show the Circuit** (30 seconds)
```bash
cd zkp
cat nft.circom
```
Explain: Circle proves equality without revealing values.

### 2. **Show Proof Generated** (30 seconds)
```bash
node prove.js
cat proof.json
```
Explain: This is the cryptographic proof.

### 3. **Show Smart Contract** (1 minute)
```bash
cd ../contracts
cat contracts/Verifier.sol
```
Explain: Contract verifies on blockchain using elliptic curves.

### 4. **Demo the System** (2 minutes)
1. Refresh frontend
2. Connect MetaMask
3. Enter inputs
4. Generate proof
5. Show Etherscan transaction
6. Explain: "Proof verified without revealing NFT data"

### 5. **The "Wow" Moment**
"We just proved NFT ownership 100% on-chain, cryptographically secure, without revealing any private information. That's the magic of zero-knowledge proofs."

---

## 🏆 Demo Talking Points

**For Judges/Investors:**

1. **Privacy**: "User data never leaves their browser"
2. **Security**: "Cryptographically sound (Groth16)"
3. **Decentralized**: "Verification happens on blockchain"
4. **Scalable**: "Proofs are small (~1KB) regardless of data size"
5. **Real Use Case**: "Anti-sybil, gated access, privacy-preserving voting"

---

## 📝 Deployment on Mainnet (After Hackathon)

If you want to go live on Ethereum mainnet:

```bash
cd contracts

# Update hardhat.config.js to add mainnet:
# networks: {
#   mainnet: {
#     url: process.env.MAINNET_RPC_URL,
#     accounts: [process.env.PRIVATE_KEY]
#   }
# }

# Get mainnet RPC URL from Infura/Alchemy
# Fund wallet with real ETH

# Deploy
npx hardhat run scripts/deploy.js --network mainnet
```

**Cost:** ~$2000-5000 in gas (depending on ETH price)

---

## 🎉 Success Criteria

You've succeeded when:

✅ Circuit generates valid proofs
✅ Contracts compile and deploy
✅ Frontend connects to MetaMask
✅ Proof generation works in browser
✅ Smart contract verifies proof
✅ Results display correctly
✅ End-to-end test passes
✅ Judge/investor understands the value

---

## 🆘 Emergency Troubleshooting

### "Everything is broken"
```bash
# Nuclear option: Start fresh
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### "Can't deploy"
```bash
# Check you have Sepolia ETH
# Check private key is correct
# Check RPC URL works

# Try local first
npx hardhat run scripts/deploy.js --network localhost
```

### "Proof generation fails"
```bash
# Check browser console (F12 → Console tab)
# Check that circuit files copied correctly
# Is file named exactly "circuit.wasm"?
ls frontend/public/
```

---

## 📞 Who to Contact

- **ZKP issues**: ZKP engineer (circuit, proofs)
- **Contract issues**: Blockchain engineer (deployment, verification)
- **Frontend issues**: Frontend developer (wallet, UI)
- **Integration issues**: Whoever has time!

---

## 🎯 Timeline for Demo Day

| Time | Task | Owner |
|------|------|-------|
| T-60min | Setup all dependencies | All |
| T-30min | Deploy contracts | Blockchain Eng |
| T-20min | Test proof generation | ZKP Eng |
| T-10min | Update constants.js | Frontend Dev |
| T-5min | Final check (F12 console) | All |
| T-0min | **Demo starts** | Frontend Dev |

---

## ✨ You're Ready!

Follow this guide step-by-step and you'll have a fully working ZKP NFT verification system.

The hardest part is done. Now just execute it.

**Good luck! 🚀**

---

**Pro Tips:**
- Test multiple times before going live
- Keep a backup of your .env file
- Have testnet ETH ready
- Screenshot successful transactions
- Have demo video as backup
- Practice your explanation
