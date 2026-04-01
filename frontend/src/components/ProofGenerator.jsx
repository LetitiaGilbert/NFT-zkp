import { useState } from 'react';
import { generateProof, formatProofForContract } from '../utils/proof';
import { verifyProofOnChain, getTxLink } from '../utils/contract';

const DUMMY_VERIFIER_ABI = [
  {
    name: 'verifyProof',
    type: 'function',
    inputs: [
      { name: 'proof', type: 'uint256[8]' },
      { name: 'input', type: 'uint256[]' }
    ],
    outputs: [{ name: '', type: 'bool' }]
  }
];

export default function ProofGenerator({ walletConnected, onVerified }) {
  const [inputs, setInputs] = useState({
    ownerHash: '123',
    expectedOwnerHash: '123',
    collectionId: '456',
    expectedCollectionId: '456'
  });

  const [state, setState] = useState('idle'); // idle, generating, verifying, done
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleVerify = async () => {
    if (!walletConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setError(null);
    setResult(null);
    setState('generating');

    try {
      console.log('Step 1: Generating proof...');
      const { proof, publicSignals } = await generateProof(inputs);

      setState('verifying');
      console.log('Step 2: Verifying on-chain...');

      const { isVerified, txHash, blockNumber } = await verifyProofOnChain(
        formatProofForContract(proof),
        publicSignals,
        DUMMY_VERIFIER_ABI
      );

      setState('done');
      setResult({
        status: isVerified ? 'verified' : 'failed',
        txHash,
        blockNumber,
        publicSignals: publicSignals.map(s => s.toString())
      });

      onVerified(isVerified);
    } catch (err) {
      setState('idle');
      setError(err.message);
      setResult({ status: 'error' });
      onVerified(false);
    }
  };

  const isLoading = state === 'generating' || state === 'verifying';

  return (
    <div>
      <h2>Generate & Verify Proof</h2>

      <div className="input-group">
        <label>Owner Hash (private)</label>
        <input
          type="text"
          name="ownerHash"
          placeholder="e.g. 123"
          value={inputs.ownerHash}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <p className="info-text">Private input: not revealed in proof</p>
      </div>

      <div className="input-group">
        <label>Expected Owner Hash (public)</label>
        <input
          type="text"
          name="expectedOwnerHash"
          placeholder="e.g. 123"
          value={inputs.expectedOwnerHash}
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <p className="info-text">Public output: revealed as public signal</p>
      </div>

      <div className="input-group">
        <label>Collection ID (private)</label>
        <input
          type="text"
          name="collectionId"
          placeholder="e.g. 456"
          value={inputs.collectionId}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>

      <div className="input-group">
        <label>Expected Collection ID (public)</label>
        <input
          type="text"
          name="expectedCollectionId"
          placeholder="e.g. 456"
          value={inputs.expectedCollectionId}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </div>

      <button
        className="btn-primary"
        onClick={handleVerify}
        disabled={isLoading || !walletConnected}
      >
        {state === 'idle' && '🔐 Generate & Verify Proof'}
        {state === 'generating' && '⏳ Generating proof...'}
        {state === 'verifying' && '🔄 Verifying on-chain...'}
        {state === 'done' && '✅ Done'}
      </button>

      {error && <div className="error-text">❌ {error}</div>}

      {result && (
        <div className={`status ${result.status}`}>
          {result.status === 'verified' && (
            <>
              <p>✅ NFT Verified Successfully!</p>
              {result.txHash && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                  <a
                    href={getTxLink(result.txHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tx-link"
                  >
                    View on Etherscan →
                  </a>
                </p>
              )}
              {result.publicSignals && (
                <div style={{ marginTop: '1rem', textAlign: 'left', fontSize: '0.85rem' }}>
                  <strong>Public Signals:</strong>
                  <div className="address">
                    {result.publicSignals.join(', ')}
                  </div>
                </div>
              )}
            </>
          )}

          {result.status === 'failed' && (
            <p>❌ Proof verification failed. Ensure inputs are correct.</p>
          )}

          {result.status === 'error' && (
            <p>❌ An error occurred. Check console for details.</p>
          )}
        </div>
      )}
    </div>
  );
}
