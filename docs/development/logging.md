# Observability & Logging

We utilize JSONL (JSON Lines) format for structured logging during deployment.

## Why JSONL?
- Easily parsed by log aggregators (ELK, Datadog).
- Human-readable (one JSON object per line).
- Great for auditing contract addresses, gas costs, and transaction hashes.

## Format Example
```json
{"timestamp": "2026-08-22T06:20:00Z", "level": "info", "event": "DEPLOYMENT_START", "network": "sepolia", "deployer": "0x..."}
{"timestamp": "2026-08-22T06:20:15Z", "level": "info", "event": "CONTRACT_DEPLOYED", "contract": "Token", "address": "0x...", "txHash": "0x..."}
```
