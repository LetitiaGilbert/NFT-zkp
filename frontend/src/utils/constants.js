// Configuration constants
// TODO: Update with actual contract address and network

export const VERIFIER_ADDRESS = '0x...'; // TODO: Set actual verifier contract address
export const NETWORK_ID = 11155111; // Sepolia testnet
export const NETWORK_NAME = 'Sepolia';
export const EXPLORER_URL = 'https://sepolia.etherscan.io';

// RPC provider (using Infura - you may want to use your own)
export const RPC_URL = `https://sepolia.infura.io/v3/YOUR_INFURA_KEY`; // Optional for fallback

// Circuit file paths (in public folder)
export const CIRCUIT_WASM = '/circuit.wasm';
export const CIRCUIT_ZKEY = '/circuit_final.zkey';
