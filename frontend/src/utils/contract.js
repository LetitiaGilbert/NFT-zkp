import { BrowserProvider, Contract } from 'ethers';
import { VERIFIER_ADDRESS, NETWORK_ID, NETWORK_NAME, EXPLORER_URL } from './constants';
import { formatProofForContract } from './proof';

/**
 * Connect to MetaMask wallet
 * @returns {Promise<string>} User's wallet address
 */
export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts'
    });

    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found');
    }

    // Check network
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const currentChainId = parseInt(chainId);

    if (currentChainId !== NETWORK_ID) {
      throw new Error(
        `Please switch to ${NETWORK_NAME} (Chain ID: ${NETWORK_ID}). Current: ${currentChainId}`
      );
    }

    return accounts[0];
  } catch (error) {
    if (error.code === 4901) {
      throw new Error(`${NETWORK_NAME} network not added to MetaMask`);
    }
    throw error;
  }
}

/**
 * Get ethers.js provider
 * @returns {Promise<BrowserProvider>} Ethers provider
 */
export async function getProvider() {
  if (!window.ethereum) {
    throw new Error('MetaMask not available');
  }
  return new BrowserProvider(window.ethereum);
}

/**
 * Get signer (user's wallet)
 * @returns {Promise<Signer>} Ethers signer
 */
export async function getSigner() {
  const provider = await getProvider();
  return provider.getSigner();
}

/**
 * Get verifier contract instance
 * @param {string} abi - Contract ABI
 * @returns {Promise<Contract>} Ethers contract instance
 */
export async function getVerifierContract(abi) {
  if (!VERIFIER_ADDRESS || VERIFIER_ADDRESS === '0x...') {
    throw new Error('Verifier contract address not configured. Please set VERIFIER_ADDRESS in constants.js');
  }

  const signer = await getSigner();
  return new Contract(VERIFIER_ADDRESS, abi, signer);
}

/**
 * Submit proof to smart contract for verification
 * @param {Array} proof - Formatted proof [a, b, c]
 * @param {Array} publicSignals - Public signals from proof
 * @param {Array} abi - Contract ABI
 * @returns {Promise<{isVerified: boolean, txHash: string}>}
 */
export async function verifyProofOnChain(proof, publicSignals, abi) {
  try {
    const contract = await getVerifierContract(abi);

    console.log('Submitting proof to contract...');
    console.log('Formatted proof:', proof);
    console.log('Public signals:', publicSignals);

    // Call contract verify function
    // Note: This assumes your contract has a verifyProof(proof, publicSignals) function
    // Adjust the function name/parameters based on your actual contract
    const tx = await contract.verifyProof(proof, publicSignals);

    console.log('Transaction sent:', tx.hash);

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    console.log('Transaction confirmed:', receipt.hash);

    return {
      isVerified: receipt.status === 1,
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber
    };
  } catch (error) {
    console.error('On-chain verification failed:', error);
    throw new Error(`Verification failed: ${error.message}`);
  }
}

/**
 * Get transaction link for block explorer
 * @param {string} txHash - Transaction hash
 * @returns {string} Full URL to block explorer
 */
export function getTxLink(txHash) {
  return `${EXPLORER_URL}/tx/${txHash}`;
}

/**
 * Format address for display
 * @param {string} address - Wallet address
 * @returns {string} Shortened address (0x1234...5678)
 */
export function shortAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}
