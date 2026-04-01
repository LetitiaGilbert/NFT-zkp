# ZKP Circuit Documentation

## Overview

This Circom circuit proves NFT ownership and properties without revealing sensitive data.

## Circuit Definition

**File:** `nft.circom`

```circom
template NFTProof() {
    // Private inputs
    signal input ownerHash;
    signal input collectionId;

    // Public inputs (revealed in proof)
    signal input expectedOwnerHash;
    signal input expectedCollectionId;

    // Outputs (public signals in the proof)
    signal output pubOwnerHash;
    signal output pubCollectionId;

    // Constraints
    ownerHash === expectedOwnerHash;
    collectionId === expectedCollectionId;

    // Output values
    pubOwnerHash <== expectedOwnerHash;
    pubCollectionId <== expectedCollectionId;
}
```

## What It Does

1. **Takes 4 inputs:**
   - `ownerHash` (private) - Hash of NFT owner
   - `collectionId` (private) - Collection ID
   - `expectedOwnerHash` (public) - Expected owner to verify
   - `expectedCollectionId` (public) - Expected collection to verify

2. **Verifies constraints:**
   - Proves `ownerHash == expectedOwnerHash` WITHOUT revealing `ownerHash`
   - Proves `collectionId == expectedCollectionId` WITHOUT revealing `collectionId`

3. **Outputs public signals:**
   - `pubOwnerHash` = `expectedOwnerHash`
   - `pubCollectionId` = `expectedCollectionId`

## How to Use

### Example Input

File: `input.json`
```json
{
  "ownerHash": "123",
  "expectedOwnerHash": "123",
  "collectionId": "456",
  "expectedCollectionId": "456"
}
```

### Generate Proof

```bash
# 1. Compile circuit
circom nft.circom --r1cs --wasm

# 2. Run proof generation
node prove.js
```

**Output:**
- `proof.json` - The zero-knowledge proof
- `public.json` - Public signals `[123, 456]`

### Verify Proof

**Off-chain (in JS):**
```javascript
const snarkjs = require("snarkjs");
const proof = require("./proof.json");
const publicSignals = require("./public.json");
const vk = require("./verification_key.json");

const isValid = await snarkjs.groth16.verify(vk, publicSignals, proof);
console.log("Valid:", isValid);
```

**On-chain (in Solidity):**
```solidity
// In frontend, format proof and call contract
const isVerified = await nftVerification.verifyNFTOwnership(formattedProof, publicSignals);
```

## Setup Process

The circuit compilation involves:

### Step 1: Compile Circuit
```bash
circom nft.circom --r1cs --wasm
```
Creates:
- `nft.r1cs` - Circuit constraints
- `nft_js/nft.wasm` - WebAssembly version
- `nft_js/generate_witness.js` - Witness generator

### Step 2: Trusted Setup (Groth16)
```bash
# Generate powers of tau
snarkjs powersoftau new bn128 12 pot12_0000.ptau

# Contribute randomness
snarkjs powersoftau contribute pot12_0000.ptau pot12_0001.ptau --name "First Contribution"

# Prepare for use
snarkjs powersoftau prepare phase2 pot12_0001.ptau pot12_final.ptau

# Setup the circuit
snarkjs groth16 setup nft.r1cs pot12_final.ptau circuit_0000.zkey

# Add randomness
snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey --name "Circuit Contribution"

# Export verification key
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
```

Produces:
- `circuit_final.zkey` - Proving key (50MB+, keep secret!)
- `verification_key.json` - Verification key (public)

### Step 3: Generate Proofs
```bash
node prove.js
```

## Proof Generation

**File:** `prove.js` (create if needed)
```javascript
const snarkjs = require("snarkjs");
const fs = require("fs");

async function proveNFT() {
  const input = JSON.parse(fs.readFileSync("input.json"));

  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    input,
    "nft_js/nft.wasm",
    "circuit_final.zkey"
  );

  fs.writeFileSync("proof.json", JSON.stringify(proof, null, 2));
  fs.writeFileSync("public.json", JSON.stringify(publicSignals, null, 2));

  console.log("✓ Proof generated");
  console.log("Proof:", proof);
  console.log("Signals:", publicSignals);
}

proveNFT();
```

## Circuit Customization

### Example 1: Add More Conditions

```circom
template NFTProof() {
    signal input ownerHash;
    signal input collectionId;
    signal input rarity;  // NEW: Rarity level

    signal input expectedOwnerHash;
    signal input expectedCollectionId;
    signal input expectedRarity;  // NEW

    signal output pubOwnerHash;
    signal output pubCollectionId;
    signal output pubRarity;  // NEW

    ownerHash === expectedOwnerHash;
    collectionId === expectedCollectionId;
    rarity === expectedRarity;  // NEW

    pubOwnerHash <== expectedOwnerHash;
    pubCollectionId <== expectedCollectionId;
    pubRarity <== expectedRarity;  // NEW
}

component main = NFTProof();
```

Then update contract and frontend to handle 3 public signals.

### Example 2: Hash-based Verification

```circom
include "node_modules/circomlib/circuits/poseidon.circom";

template NFTProof() {
    signal input ownerSecret;
    signal input expectedOwnerHash;

    signal output pubOwnerHash;

    // Use Poseidon hash instead of direct equality
    component hash = Poseidon(1);
    hash.inputs[0] <== ownerSecret;

    hash.out === expectedOwnerHash;

    pubOwnerHash <== expectedOwnerHash;
}

component main = NFTProof();
```

Requires: `npm install circomlib`

## Testing

### Generate a test proof

```bash
# Use test input
node prove.js

# Verify off-chain
node verify.js
```

**verify.js:**
```javascript
const snarkjs = require("snarkjs");
const fs = require("fs");

async function verify() {
  const proof = JSON.parse(fs.readFileSync("proof.json"));
  const publicSignals = JSON.parse(fs.readFileSync("public.json"));
  const vk = JSON.parse(fs.readFileSync("verification_key.json"));

  const isValid = await snarkjs.groth16.verify(vk, publicSignals, proof);
  console.log("Proof is", isValid ? "VALID ✓" : "INVALID ✗");
}

verify();
```

## Files Generated

| File | Size | Purpose |
|------|------|---------|
| `nft.r1cs` | 1KB | Circuit constraints |
| `nft_js/nft.wasm` | 1-10MB | Circuit in WebAssembly |
| `circuit_final.zkey` | 50-100MB | Proving key (SECRET) |
| `verification_key.json` | 5KB | Verification key (PUBLIC) |
| `proof.json` | 1KB | Generated proof (PUBLIC) |
| `public.json` | tiny | Public signals (PUBLIC) |

## Frontend Integration

1. Copy to `frontend/public/`:
   ```bash
   cp nft_js/nft.wasm ../frontend/public/circuit.wasm
   cp circuit_final.zkey ../frontend/public/
   cp verification_key.json ../frontend/public/
   ```

2. Frontend uses SnarkJS to generate proofs:
   ```javascript
   const { proof, publicSignals } = await snarkjs.groth16.fullProve(
     inputs,
     '/circuit.wasm',
     '/circuit_final.zkey'
   );
   ```

3. Then sends to backend for on-chain verification

## Security Considerations

✅ **What's secure:**
- Private inputs never leave the circuit
- Proof doesn't reveal private data
- Verification key is public
- Can't forge proofs without secrets

⚠️ **What to watch:**
- Keep `circuit_final.zkey` secret (proving key)
- If zkey leaks, anyone can forge proofs
- Don't share zkey publicly
- Verify inputs are hashed properly (if using hashes)

## Troubleshooting

### "Cannot find module 'snarkjs'"
```bash
npm install snarkjs
```

### "Circuit has unsatisfied constraints"
Your input doesn't match the circuit logic.
Check:
- `ownerHash == expectedOwnerHash`?
- `collectionId == expectedCollectionId`?

### Proof generation is slow
- First time: Load WASM (slow)
- Subsequent: Faster
- Normal for complex circuits (can be 30+ seconds)

### "Verification key doesn't match proof"
Verification key must come from the same zkey used to generate proofs.
```bash
# If you regenerated zkey, export key again
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json
```

## Resources

- Circom docs: https://docs.circom.io/
- SnarkJS: https://github.com/iden3/snarkjs
- Circomlib: https://github.com/iden3/circomlib
- ZK primer: https://zcash.com/technology/zksnarks/

## Next Steps

1. ✅ Circuit is defined and tested
2. ⏭️ Share artifacts with frontend engineer:
   - `nft_js/nft.wasm`
   - `circuit_final.zkey`
   - `verification_key.json`
3. ⏭️ Frontend integrates and generates proofs
4. ⏭️ Smart contract verifies proofs on-chain
