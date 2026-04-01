# Smart Contracts Documentation

## Overview

Complete Solidity implementation for on-chain ZKP proof verification.

### Contracts

#### 1. **Verifier.sol**
- Implements Groth16 proof verification using ALT_BN128 curve operations
- Uses Solidity's built-in elliptic curve precompiles (ecAdd, ecMul, ecPairing)
- Pure view function - no state changes, just verification
- Verification key constants embedded (specific to your circuit)

**Key Functions:**
```solidity
function verifyProof(uint256[8] memory proof, uint256[] memory pubSignals)
    public view returns (bool)
```

**How it works:**
1. Takes proof in format: `[pi_a[0], pi_a[1], pi_b[0][0], pi_b[0][1], pi_b[1][0], pi_b[1][1], pi_c[0], pi_c[1]]`
2. Takes public signals as array: `[expectedOwnerHash, expectedCollectionId]`
3. Uses elliptic curve math to verify proof validity
4. Returns true/false

#### 2. **NFTVerification.sol**
- Main contract for tracking verified users
- Wraps the Verifier for state management
- Stores verification history and timestamps
- Emits events for transparency

**Key Functions:**
```solidity
function verifyNFTOwnership(uint256[8] calldata proof, uint256[] calldata publicSignals)
    external returns (bool)
```

- Calls Verifier to check proof
- Tracks user verification state
- Emits `ProofVerified` event
- Returns verification result

## Deployment

### Prerequisites
1. Node.js v16+
2. Private key for deploying
3. Sepolia testnet ETH (for gas)
4. Infura or Alchemy API key (for RPC)

### Setup

```bash
cd contracts
npm install
cp .env.example .env
```

**Edit `.env`:**
```bash
# Your private key (from MetaMask)
PRIVATE_KEY=0x...

# Infura RPC URL for Sepolia
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Etherscan API key (for verification)
ETHERSCAN_API_KEY=YOUR_KEY
```

### Deploy to Sepolia Testnet

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

**Output:**
```
✓ Verifier deployed to: 0x...
✓ NFTVerification deployed to: 0x...
```

Copy the `Verifier` address → paste into `frontend/src/utils/constants.js`

### Deploy Locally (for testing)

```bash
npx hardhat node  # In one terminal - starts local network

# In another terminal:
npx hardhat run scripts/deploy.js --network localhost
```

## Testing

Run unit tests locally:
```bash
npx hardhat test
```

**What's tested:**
- Valid proof verification
- Invalid proof rejection
- Public signal validation
- Verification state tracking
- Event emission

## Verification Key Setup

⚠️ **IMPORTANT**: The verification key constants in `Verifier.sol` are **circuit-specific**.

If your Circom circuit changes:

1. **Re-generate the verification key:**
   ```bash
   cd ../zkp
   snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
   ```

2. **Extract constants** using snarkjs export:
   ```bash
   snarkjs zkey export solidityverifier Verifier.sol
   ```
   This generates a complete Solidity contract.

3. **Copy the new verification key constants** to `Verifier.sol`

## Cost Estimation

On Ethereum Sepolia testnet:
- **Deployment**: ~500k-700k gas (~$5-10 USD)
- **Verification**: ~400k-500k gas per call (~$3-7 USD)
- **Gas prices**: Variable (check Sepolia faucet)

For mainnet: Multiply by current ETH price (~$3000/ETH)

## Network Configuration

Supports these networks in `hardhat.config.js`:

| Network | Chain ID | RPC |
|---------|----------|-----|
| Localhost | 1337 | http://127.0.0.1:8545 |
| Sepolia | 11155111 | Infura/Alchemy |

**To add other networks:**
```javascript
// hardhat.config.js
networks: {
  polygon: {
    url: "https://polygon-rpc.com",
    accounts: [process.env.PRIVATE_KEY]
  }
}
```

Then deploy:
```bash
npx hardhat run scripts/deploy.js --network polygon
```

## Contract ABI

Export for frontend integration:
```bash
npx hardhat run -c scripts/export-abi.js
```

Generates `Verifier.json` and `NFTVerification.json` in `artifacts/contracts/`

## Security Notes

✅ **What's checked:**
- Proof format validation
- Elliptic curve point validity
- Public signal count
- Pairing equation verification

⚠️ **Assumptions:**
- Circuit is correct (you trust the ZKP engineer)
- Verification key is not tampered with
- No replay protection (add nonce if needed)

## Troubleshooting

### "Insufficient funds"
Get testnet ETH from Sepolia faucet:
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://faucets.chain.link/sepolia

### "Invalid RPC URL"
Check your Infura/Alchemy key is correct and active

### "Proof verification fails"
- Verify proof and public signals match what circuit generated
- Check verification key hasn't changed
- Ensure public signals are in correct order

### "Hardhat never connects"
```bash
# Kill any existing node processes
pkill -f "hardhat node"
npx hardhat node  # Try again
```

## Next Steps

1. ✅ Deploy contracts
2. ✅ Copy Verifier address to frontend
3. ⏭️ Run frontend (`npm run dev` in frontend folder)
4. ⏭️ Connect wallet and verify NFT
