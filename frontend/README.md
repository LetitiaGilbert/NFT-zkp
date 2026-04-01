# ZKP NFT Verification - Frontend Setup

## Overview
React + Ethers.js frontend for ZKP NFT verification. Allows users to:
1. Connect MetaMask wallet
2. Input NFT data (owner hash, collection ID)
3. Generate ZKP proof locally
4. Submit proof to smart contract for verification
5. View verification result

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Copy Circuit Artifacts
The frontend needs compiled circuit files. After your ZKP engineer completes circuit compilation:

```bash
cp ../zkp/circuit_js/circuit.wasm public/
cp ../zkp/circuit_final.zkey public/
cp ../zkp/verification_key.json public/
```

### 3. Configure Contract Address
Edit `src/utils/constants.js` and set:
- `VERIFIER_ADDRESS` - Your deployed Solidity verifier contract address
- `NETWORK_ID` - Your blockchain network (11155111 for Sepolia)

### 4. Start Development Server
```bash
npm run dev
```

Opens http://localhost:3000 automatically.

## Project Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── WalletConnect.jsx       # MetaMask connection UI
│   │   └── ProofGenerator.jsx      # Proof generation & verification UI
│   ├── utils/
│   │   ├── constants.js            # Configuration
│   │   ├── proof.js                # SnarkJS proof generation
│   │   └── contract.js             # Ethers.js contract interaction
│   ├── App.jsx                     # Main app component
│   ├── index.css                   # Styling
│   └── main.jsx                    # Entry point
├── public/
│   ├── circuit.wasm                # Circuit WASM (from ZKP engineer)
│   ├── circuit_final.zkey          # Circuit trusted setup (from ZKP engineer)
│   └── verification_key.json       # Verification key (from ZKP engineer)
├── index.html
├── vite.config.js
└── package.json
```

## How It Works

### Proof Generation Flow
1. User connects MetaMask wallet
2. Enters inputs (ownerHash, expectedOwnerHash, collectionId, expectedCollectionId)
3. Clicks "Generate & Verify Proof"
4. Frontend generates ZKP proof locally using SnarkJS:
   - Loads circuit.wasm and circuit_final.zkey
   - Runs Groth16 proof generation
   - Returns proof and public signals
5. Proof is submitted to smart contract via ethers.js
6. Contract verifies proof on-chain
7. Result is displayed to user

### File Dependencies

#### From ZKP Engineer (Circom)
- `circuit.wasm` - Compiled circuit WASM binary
- `circuit_final.zkey` - Trusted setup (ceremony output)
- `verification_key.json` - Verification key (needed for proof verification)

These files are produced by:
```bash
circom circuit.circom --r1cs --wasm
snarkjs powersoftau ...
snarkjs groth16 setup ...
snarkjs zkey export verificationkey ...
```

#### From Blockchain Engineer (Solidity)
- Verifier contract ABI (JSON)
- Deployed verifier contract address
- Network details (chain ID, RPC URL)

## Integration Points

### ZKP ↔ Frontend
- Frontend calls `generateProof(inputs)` which uses circuit.wasm and circuit_final.zkey
- Returns proof in SnarkJS format
- Frontend reformats for Solidity: `formatProofForContract(proof)`

### Frontend ↔ Smart Contract
- Frontend calls `contract.verifyProof(proof, publicSignals)`
- Contract returns boolean or emits event
- Frontend displays result and links to Etherscan

## Key Features

✅ MetaMask wallet connection
✅ Local proof generation (no server needed)
✅ On-chain verification via contract
✅ Network validation (warns if on wrong chain)
✅ Responsive UI with loading states
✅ Error handling and user feedback
✅ Block explorer links (Etherscan)

## Configuration

Edit `src/utils/constants.js`:

```javascript
export const VERIFIER_ADDRESS = '0x...'; // Your verifier contract
export const NETWORK_ID = 11155111;      // Sepolia = 11155111, Mainnet = 1, etc.
export const NETWORK_NAME = 'Sepolia';
export const EXPLORER_URL = 'https://sepolia.etherscan.io';
```

## Customizing the Circuit Interface

The current setup assumes your circuit has these inputs:
- `ownerHash` - Private input
- `expectedOwnerHash` - Public output
- `collectionId` - Private input
- `expectedCollectionId` - Public output

**To customize:**
1. Edit `src/components/ProofGenerator.jsx` - change input fields and labels
2. Update `inputs` state object to match your circuit's signal names
3. Ensure circuit ABI in `DUMMY_VERIFIER_ABI` matches your contract function signature

## Troubleshooting

### "Circuit files not found"
Make sure `circuit.wasm`, `circuit_final.zkey`, and `verification_key.json` are in the `public/` folder.

### "Verifier contract address not configured"
Set `VERIFIER_ADDRESS` in `src/utils/constants.js`

### "Please switch to correct network"
Check `NETWORK_ID` in constants. MetaMask must be on that network.

### Proof generation takes long time
First proof generation can be slow due to circuit initialization. Subsequent proofs are faster.

## Build for Production
```bash
npm run build
```

Outputs optimized build to `dist/` folder. Deploy to any static host (Vercel, Netlify, etc.)

## Notes

- ⚠️ This is MVP code for hackathons. For production, add:
  - Input validation
  - Circuit parameter verification
  - Contract function error decoding
  - Fallback providers
  - Transaction monitoring/retry logic
  - Gas estimation

- 🔒 Proof generation happens locally in the browser. No data is sent to servers.

- 🌐 Works on any EVM blockchain (Ethereum, Polygon, Arbitrum, etc.)
