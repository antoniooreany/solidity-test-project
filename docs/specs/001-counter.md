# Spec 001: Counter Contract

## Overview
A simple smart contract designed as a first step for learning Solidity. It implements a basic counter.

## Requirements

1. **State Variable**: 
   - Must store a non-negative integer value (`uint256`).
2. **Increment Action**:
   - Must provide a function to increase the counter's value by exactly 1.
3. **Read Action**:
   - Must provide a function to read the current counter value.
4. **Access Control**:
   - None. Any address can increment the counter. This is an intentional simplification for the learning process.
5. **Events**:
   - Must emit an event (e.g., `CounterIncremented`) whenever the state value changes.
