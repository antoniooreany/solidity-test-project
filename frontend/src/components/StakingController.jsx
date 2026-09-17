import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleStakingArtifact from "../../../artifacts/contracts/SimpleStaking.sol/SimpleStaking.json";

// SimpleStaking UI controller
export function StakingController({ account }) {
  const [contract, setContract] = useState(null);
  const [totalStaked, setTotalStaked] = useState('0');
  const [userStake, setUserStake] = useState('0');
  const [stakeAmount, setStakeAmount] = useState('1');
  const [withdrawAmount, setWithdrawAmount] = useState('0.5');
  const [status, setStatus] = useState('Idle');

  const contractAddress = import.meta.env.VITE_SIMPLE_STAKING_ADDRESS;

  // Initialize contract instance
  useEffect(() => {
    if (!contractAddress) return;
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signerPromise = provider.getSigner();
    signerPromise.then(signer => {
      const c = new ethers.Contract(contractAddress, SimpleStakingArtifact.abi, signer);
      setContract(c);
    }).catch(console.error);
  }, [contractAddress]);

  // Refresh stakes
  const refresh = async () => {
    if (!contract) return;
    try {
      const tot = await contract.totalStaked();
      const usr = await contract.getStake(account);
      setTotalStaked(tot.toString());
      setUserStake(usr.toString());
    } catch (e) {
      console.error('Refresh error', e);
    }
  };

  useEffect(() => {
    if (contract && account) {
      refresh();
    }
  }, [contract, account]);

  const handleStake = async () => {
    if (!contract) return;
    setStatus('Pending');
    try {
      const value = ethers.parseEther(stakeAmount);
      const tx = await contract.stake({ value });
      await tx.wait();
      setStatus('Confirmed');
      await refresh();
    } catch (e) {
      console.error(e);
      setStatus('Failed');
    }
  };

  const handleWithdraw = async () => {
    if (!contract) return;
    setStatus('Pending');
    try {
      const value = ethers.parseEther(withdrawAmount);
      const tx = await contract.withdraw(value);
      await tx.wait();
      setStatus('Confirmed');
      await refresh();
    } catch (e) {
      console.error(e);
      setStatus('Failed');
    }
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      <h3>Staking Dashboard</h3>
      <p>Total Staked: {ethers.formatEther(totalStaked)} ETH</p>
      <p>Your Stake: {ethers.formatEther(userStake)} ETH</p>
      <div style={{ marginTop: '0.5rem' }}>
        <input
          type="text"
          value={stakeAmount}
          onChange={e => setStakeAmount(e.target.value)}
          placeholder="Amount to stake (ETH)"
        />
        <button onClick={handleStake} disabled={status === 'Pending'}>Stake</button>
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <input
          type="text"
          value={withdrawAmount}
          onChange={e => setWithdrawAmount(e.target.value)}
          placeholder="Amount to withdraw (ETH)"
        />
        <button onClick={handleWithdraw} disabled={status === 'Pending'}>Withdraw</button>
      </div>
      <p>Status: {status}</p>
    </div>
  );
}
