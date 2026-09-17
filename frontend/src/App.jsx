import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletConnect } from './components/WalletConnect';
import { StorageViewer } from './components/StorageViewer';
import { StorageUpdater } from './components/StorageUpdater';
import { CounterController } from './components/CounterController';
import { StakingController } from './components/StakingController';
import { TransactionStatus } from './components/TransactionStatus';
import SimpleStorageArtifact from '../../artifacts/contracts/SimpleStorage.sol/SimpleStorage.json';
import MyTokenArtifact from '../../artifacts/contracts/MyToken.sol/MyToken.json';
import { TokenController } from './components/TokenController';
function App() {
  const [activeTab, setActiveTab] = useState('storage');
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState(''); const contractAddress = import.meta.env.VITE_SIMPLE_STORAGE_ADDRESS;
  const [error, setError] = useState('');
  const [value, setValue] = useState(null);
  const [count, setCount] = useState(0);
// placeholder balance removed
  const [txStatus, setTxStatus] = useState('Idle');

  // Token address from .env
  const tokenAddress = import.meta.env.VITE_MY_TOKEN_ADDRESS;
  console.log('Token address from env:', tokenAddress);


  // State for token balance
  const [tokenBalance, setTokenBalance] = useState(null);

  // Fetch token balance for the connected account
  const fetchBalance = async () => {
    if (!account || !tokenAddress) {
      console.log('fetchBalance aborted: account or tokenAddress missing', { account, tokenAddress });
      return;
    }
    try {
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const tokenContract = new ethers.Contract(tokenAddress, MyTokenArtifact.abi, provider);
      const rawBal = await tokenContract.balanceOf(account);
      // Assuming 18 decimals
      const formatted = ethers.formatUnits(rawBal, 18);
      console.log('fetchBalance called, account:', account, 'tokenAddress:', tokenAddress);
      console.log('Fetched raw token balance:', rawBal.toString());
      console.log('Formatted token balance:', formatted);
      setTokenBalance(formatted);
    } catch (err) {
      console.error('Error fetching token balance:', err);
    }
  };

  // Send tokens to recipient
  const sendTokens = async (recipient, amount) => {
    if (!account) { setError('Please connect wallet first.'); return; }
    if (!tokenAddress) { setError('Token address missing in .env'); return; }
    if (!recipient) { setError('Введите адрес'); return; }
    if (!amount || isNaN(amount)) { setError('Введите число'); return; }
    setError('');
    setTxStatus('Awaiting wallet');
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const tokenContract = new ethers.Contract(tokenAddress, MyTokenArtifact.abi, signer);
      const parsed = ethers.parseUnits(amount, 18);
      console.log('sendTokens called with recipient:', recipient, 'amount:', amount);
      console.log('Attempting token transfer...');
      const tx = await tokenContract.transfer(recipient, parsed);
      console.log('Transaction sent, hash:', tx.hash);
      setTxStatus('Pending');
      await tx.wait();
      console.log('Transaction confirmed');
      setTxStatus('Confirmed');
      // Refresh balance after a short delay
      setTimeout(fetchBalance, 300);
    } catch (err) {
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setTxStatus('Failed (Rejected by user)');
      } else {
        setTxStatus('Failed');
        setError(err.message);
      }
    }
  };

  // Refresh token balance when account or token address changes
  useEffect(() => {
    fetchBalance();
  }, [account, tokenAddress]);


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

      let netName = networkObj.name;
      if (netName === 'unknown') netName = `Chain ID: ${networkObj.chainId}`;
      setNetwork(netName);

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

  const incrementCounter = () => {
    setCount((prev) => prev + 1);
  };

  // Placeholder sendTokens removed – real implementation defined above

  const switchNetwork = async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7A69' }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x7A69',
                chainName: 'Hardhat Localhost',
                rpcUrls: ['http://127.0.0.1:8545'],
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              },
            ],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      } else {
        console.error('Failed to switch network:', switchError);
      }
    }
  };

  useEffect(() => {
    fetchValue();
  }, [account]);

  useEffect(() => {
    if (!contractAddress) return;
    try {
      const provider = new ethers.JsonRpcProvider('http://127.0.0.1:8545');
      const contract = new ethers.Contract(contractAddress, SimpleStorageArtifact.abi, provider);

      const handleValueChanged = (_oldVal, newVal) => {
        setValue(newVal.toString());
      };

      contract.on('ValueChanged', handleValueChanged);

      return () => {
        contract.off('ValueChanged', handleValueChanged);
      };
    } catch (err) {
      console.error('Failed to subscribe to ValueChanged event:', err);
    }
  }, [contractAddress]);

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
      <h1>Smart Contract Dashboard</h1>

      {!contractAddress && (
        <div style={{ color: 'orange', marginBottom: '1rem' }}>
          <strong>Warning:</strong> VITE_SIMPLE_STORAGE_ADDRESS is not set in .env
        </div>
      )}

      <WalletConnect
        account={account}
        network={network}
        connectWallet={connectWallet}
        switchNetwork={switchNetwork}
        error={error}
      />

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('storage')}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: activeTab === 'storage' ? 'bold' : 'normal',
          }}
        >
          SimpleStorage
        </button>
        <button
          onClick={() => setActiveTab('counter')}
          style={{
            padding: '0.5rem 1rem',
            fontWeight: activeTab === 'counter' ? 'bold' : 'normal',
          }}
        >
          Counter
        </button>
        <button
          onClick={() => setActiveTab('token')}
          style={{ padding: '0.5rem 1rem', fontWeight: activeTab === 'token' ? 'bold' : 'normal' }}
        >
          MyToken (ERC-20)
        </button>
      </div>

      {activeTab === 'storage' && (
        <>
          <StorageViewer value={value} />
          <StorageUpdater value={value} updateValue={updateValue} txStatus={txStatus} />
        </>
      )}

      {activeTab === 'counter' && (
        <CounterController
          count={count}
          increment={incrementCounter}
          isPending={txStatus === 'Pending'}
        />
      )}

      {activeTab === 'token' && (
        <TokenController
          balance={tokenBalance}
          sendTokens={sendTokens}
          isPending={txStatus === 'Pending'}
        />
      )}

      <TransactionStatus status={txStatus} />
    </div>
  );
}

export default App;
