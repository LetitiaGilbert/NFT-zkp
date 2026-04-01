import * as snarkjs from 'snarkjs';
import { CIRCUIT_WASM, CIRCUIT_ZKEY } from './constants';

/**
 * Generate ZKP proof using SnarkJS
 * @param {Object} inputs - Circuit inputs { ownerHash, expectedOwnerHash, collectionId, expectedCollectionId }
 * @returns {Promise<{proof, publicSignals}>} Proof and public signals
 */
export async function generateProof(inputs) {
  try {
    console.log('Generating proof with inputs:', inputs);

    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      CIRCUIT_WASM,
      CIRCUIT_ZKEY
    );

    console.log('Proof generated successfully');
    console.log('Proof:', proof);
    console.log('Public Signals:', publicSignals);

    return { proof, publicSignals };
  } catch (error) {
    console.error('Proof generation failed:', error);
    throw new Error(`Proof generation failed: ${error.message}`);
  }
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
