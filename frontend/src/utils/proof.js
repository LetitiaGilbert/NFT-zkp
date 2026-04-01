import * as snarkjs from 'snarkjs';
import { CIRCUIT_WASM, CIRCUIT_ZKEY } from './constants';

/**
 * Generate ZKP proof using SnarkJS
 * For MVP/hackathon: Uses mock proof generation
 * Production: Replace with actual Circom circuit WASM + zkey
 * @param {Object} inputs - Circuit inputs { ownerHash, expectedOwnerHash, collectionId, expectedCollectionId }
 * @returns {Promise<{proof, publicSignals}>} Proof and public signals
 */
export async function generateProof(inputs) {
  try {
    console.log('Generating proof with inputs:', inputs);

    // MVP/Hackathon: Generate mock proof for demo
    // Production: Uncomment fullProve and ensure WASM/zkey files exist
    const proof = generateMockProof(inputs);

    console.log('Proof generated successfully');
    console.log('Proof:', proof.proof);
    console.log('Public Signals:', proof.publicSignals);

    return proof;

    // Production version (requires proper circuit setup):
    // const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    //   inputs,
    //   CIRCUIT_WASM,
    //   CIRCUIT_ZKEY
    // );
  } catch (error) {
    console.error('Proof generation failed:', error);
    throw new Error(`Proof generation failed: ${error.message}`);
  }
}

/**
 * Generate mock proof for hackathon MVP (no WASM needed)
 * Production: Remove this and use actual Circom circuit
 */
function generateMockProof(inputs) {
  // Create deterministic proof based on inputs
  const hash1 = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString();
  };

  const baseHash1 = hash1(String(inputs.ownerHash));
  const baseHash2 = hash1(String(inputs.collectionId));

  return {
    proof: {
      pi_a: [baseHash1, baseHash2],
      pi_b: [[baseHash1, baseHash2], [baseHash1, baseHash2]],
      pi_c: [baseHash1, baseHash2],
      protocol: 'groth16',
      curve: 'bn128'
    },
    publicSignals: [
      inputs.expectedOwnerHash.toString(),
      inputs.expectedCollectionId.toString()
    ]
  };
}

/**
 * Format proof for Solidity contract (Groth16 format)
 * Converts SnarkJS proof format to solidity-compatible format
 * @param {Object} proof - SnarkJS proof object
 * @returns {Array} [a, b, c] formatted for contract
 */
export function formatProofForContract(proof) {
  // Solidity expects:
  // a = [proof.pi_a[0], proof.pi_a[1]]
  // b = [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]]
  // c = [proof.pi_c[0], proof.pi_c[1]]

  return [
    [proof.pi_a[0], proof.pi_a[1]],
    [[proof.pi_b[0][1], proof.pi_b[0][0]], [proof.pi_b[1][1], proof.pi_b[1][0]]],
    [proof.pi_c[0], proof.pi_c[1]]
  ];
}

/**
 * Verify proof locally (optional, for testing)
 * @param {Object} proof - SnarkJS proof
 * @param {Array} publicSignals - Public signals
 * @param {Object} verificationKey - Verification key JSON
 * @returns {Promise<boolean>} True if proof is valid
 */
export async function verifyProofLocally(proof, publicSignals, verificationKey) {
  try {
    const isValid = await snarkjs.groth16.verify(
      verificationKey,
      publicSignals,
      proof
    );
    return isValid;
  } catch (error) {
    console.error('Local verification failed:', error);
    return false;
  }
}
