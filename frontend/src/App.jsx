import { useState } from 'react';
import WalletConnect from './components/WalletConnect';
import ProofGenerator from './components/ProofGenerator';

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [verified, setVerified] = useState(null);

  return (
    <div className="container">
      <div className="card">
        <h1>🔐 ZKP NFT Verification</h1>
        <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '2rem' }}>
          Prove NFT ownership without revealing private data
        </p>

        <WalletConnect onConnected={() => setWalletConnected(true)} />

        {walletConnected && (
          <>
            <div className="divider"></div>
            <ProofGenerator
              walletConnected={walletConnected}
              onVerified={setVerified}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
