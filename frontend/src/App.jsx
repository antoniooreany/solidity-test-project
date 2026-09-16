import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletConnect } from './components/WalletConnect';
import { StorageViewer } from './components/StorageViewer';
import { StorageUpdater } from './components/StorageUpdater';
import { TransactionStatus } from './components/TransactionStatus';
import SimpleStorageArtifact from '../../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json';

function App() {
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');
  const [error, setError] = useState('');
  const [value, setValue] = useState(null);
  const [txStatus, setTxStatus] = useState('Idle');

  const contractAddress = import.meta.env.VITE_SIMPLE_STORAGE_ADDRESS;

  const connectWallet = async () => {
    setError('');
    if (!window.ethereum) {
      setError('MetaMask is not installed.');
      return;
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAccount(accounts[0]);

      const provider = new ethers.BrowserProvider(window.ethereum);
      const networkObj = await provider.getNetwork();

      // Simple network display formatting
      let netName = networkObj.name;
      if (netName === 'unknown') netName = `Chain ID: ${networkObj.chainId}`;
      setNetwork(netName);

      // Only check network if we expect Hardhat localhost
      if (networkObj.chainId !== 31337n) {
        setError('Warning: You are not connected to the local Hardhat network (chainId 31337).');
      }
    } catch (err) {
      if (err.code === 4001) {
        setError('User rejected the connection request.');
      } else {
        setError(err.message);
      }
    }
  };

  const fetchValue = async () => {
    if (!contractAddress) {
      setError('Contract address missing in frontend/.env. Please restart Vite dev server.');
      return;
    }
    try {
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const code = await provider.getCode(contractAddress);
      if (code === '0x') {
        setError(`No contract found at ${contractAddress}. Please re-deploy to localhost.`);
        setValue(null);
        return;
      }
      const contract = new ethers.Contract(contractAddress, SimpleStorageArtifact.abi, provider);
      const val = await contract.getValue();
      setValue(val.toString());
    } catch (err) {
      console.error('Error fetching value:', err);
    }
  };

  const updateValue = async (newValue) => {
    if (!account) {
      setError('Please connect wallet first.');
      return;
    }
    if (!contractAddress) {
      setError('Contract address missing in frontend/.env.');
      return;
    }
    setError('');
    setTxStatus('Awaiting wallet');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, SimpleStorageArtifact.abi, signer);

      const tx = await contract.setValue(newValue);
      setTxStatus('Pending');

      await tx.wait();
      setTxStatus('Confirmed');

      // Fetch newly updated value from node
      setTimeout(() => {
        fetchValue();
      }, 300);
    } catch (err) {
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setTxStatus('Failed (Rejected by user)');
      } else {
        setTxStatus('Failed');
        setError(err.message);
      }
    }
  };

  useEffect(() => {
    fetchValue();
  }, [account]);

  // Listen for account/network changes & auto-restore connected wallet
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
        if (accounts.length > 0) {
          connectWallet();
        }
      });

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) setAccount(accounts[0]);
        else setAccount('');
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>SimpleStorage UI</h1>

      {!contractAddress && (
        <div style={{ color: 'orange', marginBottom: '1rem' }}>
          <strong>Warning:</strong> VITE_SIMPLE_STORAGE_ADDRESS is not set in .env
        </div>
      )}

      <WalletConnect
        account={account}
        network={network}
        connectWallet={connectWallet}
        error={error}
      />

      <StorageViewer value={value} />

      <StorageUpdater updateValue={updateValue} txStatus={txStatus} />

      <TransactionStatus status={txStatus} />
    </div>
  );
}

export default App;
