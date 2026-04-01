# ZKP Circuit Setup & Proof Generation

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Take a look at the circuit
cat nft.circom

# 3. Check test inputs
cat input.json

# 4. Generate a proof
node prove.js

# 5. Verify the proof (off-chain)
node verify.js

# 6. Copy artifacts to frontend
cp nft_js/nft.wasm ../frontend/public/circuit.wasm
cp circuit_final.zkey ../frontend/public/
cp verification_key.json ../frontend/public/
```

## This Folder

Contains the Circom circuit for ZKP NFT verification.

### Files

- **nft.circom** - The circuit definition
  - Proves: `ownerHash == expectedOwnerHash AND collectionId == expectedCollectionId`
  - Private inputs: `ownerHash`, `collectionId`
  - Public outputs: `pubOwnerHash`, `pubCollectionId`

- **input.json** - Test input values
  - Set both to match for a valid proof
  - Change to test invalid proofs

- **proof.json** - Generated proof (after running `node prove.js`)
- **public.json** - Public signals from the proof

- **verification_key.json** - Key for verifying proofs

- **package.json** - Dependencies (SnarkJS)

## Workflow

### 1. Understand the Circuit

```circom
signal input ownerHash;           // Private: Only you know
signal input expectedOwnerHash;   // Public: Revealed in proof

ownerHash === expectedOwnerHash;  // Constraint: Must be equal
```

This circuit proves you know a value that matches a public hash, without revealing the value itself.

### 2. Test with Example Input

```json
{
  "ownerHash": "123",
  "expectedOwnerHash": "123",
  "collectionId": "456",
  "expectedCollectionId": "456"
}
```

Run:
```bash
node prove.js
```

Should show:
```
✓ Proof generated
Valid proof: true
```

### 3. Create Your Own Inputs

Edit `input.json` with your test data:
```json
{
  "ownerHash": "your_value",
  "expectedOwnerHash": "your_value",
  "collectionId": "your_value",
  "expectedCollectionId": "your_value"
}
```

Then run `node prove.js` again.

### 4. Share with Team

Once circuit is working, share with frontend:

```bash
# Copy circuit artifacts to frontend
cp nft_js/nft.wasm ../frontend/public/circuit.wasm
cp circuit_final.zkey ../frontend/public/
cp verification_key.json ../frontend/public/
```

Frontend will use these to generate proofs in the browser.

## Setting Up SnarkJS

If `node prove.js` doesn't work, create it:

**prove.js:**
```javascript
const snarkjs = require("snarkjs");
const fs = require("fs");

async function generateProof() {
  try {
    console.log("📋 Reading inputs...");
    const input = JSON.parse(fs.readFileSync("input.json"));

    console.log("🔧 Generating proof...");
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      input,
      "nft_js/nft.wasm",
      "circuit_final.zkey"
    );

    console.log("✓ Proof generated!\n");

    fs.writeFileSync("proof.json", JSON.stringify(proof, null, 2));
    fs.writeFileSync("public.json", JSON.stringify(publicSignals));

    console.log("Proof saved to proof.json");
    console.log("Public signals saved to public.json");
    console.log("\nPublic signals:", publicSignals);

    // Verify the proof
    console.log("\n📝 Verifying proof...");
    const vk = JSON.parse(fs.readFileSync("verification_key.json"));
    const isValid = await snarkjs.groth16.verify(vk, publicSignals, proof);
    console.log("✓ Valid proof:", isValid);
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

generateProof();
```

Then:
```bash
node prove.js
```

## Modifying the Circuit

### Add a New Constraint

Current circuit:
```circom
ownerHash === expectedOwnerHash;
collectionId === expectedCollectionId;
```

Example: Add rarity check
```circom
signal input rarity;
signal input expectedRarity;
signal output pubRarity;

ownerHash === expectedOwnerHash;
collectionId === expectedCollectionId;
rarity === expectedRarity;  // NEW

pubRarity <== expectedRarity;  // NEW
```

Then update `input.json`:
```json
{
  "ownerHash": "123",
  "expectedOwnerHash": "123",
  "collectionId": "456",
  "expectedCollectionId": "456",
  "rarity": "5",
  "expectedRarity": "5"
}
```

And update frontend to handle 3 public signals instead of 2.

### Use Hashing

For more complex circuits, use hashing (requires circomlib):

```bash
npm install circomlib
```

Then in circuit:
```circom
include "node_modules/circomlib/circuits/poseidon.circom";

template NFTProof() {
    signal input ownerSecret;
    signal input expectedOwnerHash;

    signal output pubOwnerHash;

    component hash = Poseidon(1);
    hash.inputs[0] <== ownerSecret;

    hash.out === expectedOwnerHash;

    pubOwnerHash <== expectedOwnerHash;
}

component main = NFTProof();
```

This proves you know a secret that hashes to a public value.

## Compiling the Circuit

If you modify the circuit, recompile:

```bash
# Install Circom first (https://docs.circom.io/)
circom nft.circom --r1cs --wasm
```

This updates:
- `nft.r1cs` - Constraint system
- `nft_js/nft.wasm` - WebAssembly binary

## Testing Proofs

### Test with different inputs

Make `test_proof.js`:
```javascript
const snarkjs = require("snarkjs");
const fs = require("fs");

const testCases = [
  { ownerHash: "123", expectedOwnerHash: "123", collectionId: "456", expectedCollectionId: "456", valid: true },
  { ownerHash: "999", expectedOwnerHash: "123", collectionId: "456", expectedCollectionId: "456", valid: false },
  { ownerHash: "123", expectedOwnerHash: "123", collectionId: "999", expectedCollectionId: "456", valid: false },
];

async function test() {
  const vk = JSON.parse(fs.readFileSync("verification_key.json"));

  for (const testCase of testCases) {
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      testCase,
      "nft_js/nft.wasm",
      "circuit_final.zkey"
    );

    const isValid = await snarkjs.groth16.verify(vk, publicSignals, proof);
    const expected = testCase.valid;

    console.log(
      `${isValid === expected ? "✓" : "✗"} ownerHash=${testCase.ownerHash}, expected=${testCase.valid}, got=${isValid}`
    );
  }
}

test();
```

Run:
```bash
node test_proof.js
```

## Troubleshooting

### Can't find nft.wasm
Make sure Circom circom compiled the circuit:
```bash
# Install Circom: https://docs.circom.io/getting-started/installation/
circom nft.circom --r1cs --wasm
```

### "Cannot find module nft_js"
Same issue - run circom to generate it.

### Proof generation is slow
- First time: Loads WASM (can be 10-30 seconds)
- Normal behavior, not a bug
- Subsequent proofs are faster

### "Invalid proof" when input is correct
Check:
1. Are you using the same `nft.wasm` and `zkey`?
2. Is input JSON format correct?
3. Did you modify the circuit without recompiling?

## Next Steps

1. ✅ Review the circuit (nft.circom)
2. ✅ Run `node prove.js` to test
3. ⏭️ Copy artifacts to frontend:
   - `nft_js/nft.wasm`
   - `circuit_final.zkey`
   - `verification_key.json`
4. ⏭️ Frontend integrates the proof generation
5. ⏭️ Smart contract verifies on-chain

## Resources

- **Circom Docs:** https://docs.circom.io/
- **SnarkJS:** https://github.com/iden3/snarkjs
- **Circomlib:** https://github.com/iden3/circomlib
- **ZK Explanation:** https://zcash.com/technology/zksnarks/
