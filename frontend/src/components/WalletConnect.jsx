import { useState } from 'react';
import { connectWallet, shortAddress } from '../utils/contract';

export default function WalletConnect({ onConnected }) {
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleConnect = async () => {
    setLoading(true);
    setError(null);

    try {
      const account = await connectWallet();
      setAddress(account);
      onConnected(account);
    } catch (err) {
      setError(err.message);
      console.error('Wallet connection failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (address) {
    return (
      <div>
        <p className="success-text">
          ✓ Connected: <span className="address">{address}</span>
        </p>
      </div>
    );
  }

  return (
    <div>
      <button
        className="btn-primary"
        onClick={handleConnect}
        disabled={loading}
      >
        {loading ? '⏳ Connecting...' : '🔗 Connect MetaMask'}
      </button>
      {error && <div className="error-text">Error: {error}</div>}
    </div>
  );
}
