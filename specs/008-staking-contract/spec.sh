#!/usr/bin/env bash
# speckit spec for SimpleStaking contract

describe "SimpleStaking" {
  before_each {
    # Deploy contract (using hardhat scripts)
    npx hardhat run scripts/deploy_simple_staking.js --network localhost
  }

  it "has zero totalStaked initially" {
    expect $(npx hardhat run scripts/call_totalStaked.js --network localhost) to_eq 0
  }

  it "allows a user to stake ETH" {
    # Stake 1 ether
    npx hardhat run scripts/stake.js --network localhost --value 1ether
    expect $(npx hardhat run scripts/call_totalStaked.js --network localhost) to_eq 1000000000000000000
  }

  it "allows withdrawal of staked ETH" {
    # Stake then withdraw half
    npx hardhat run scripts/stake.js --network localhost --value 1ether
    npx hardhat run scripts/withdraw.js --network localhost --value 0.5ether
    expect $(npx hardhat run scripts/call_totalStaked.js --network localhost) to_eq 500000000000000000
  }
}
