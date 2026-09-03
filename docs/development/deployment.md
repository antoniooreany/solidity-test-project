# Deployment Scripts

This project uses standard Hardhat deployment scripts along with custom JSONL logging to maintain full observability over deployments.

## Principles

1. **Dry-runs first**: Always execute a dry-run against a local fork or using the `dry-run` flag before deploying to a live network.
2. **Observability**: Every deployment step is logged in JSONL format in the `logs/` directory.
3. **Reproducibility**: Deployments rely on strictly locked compiler versions (`0.8.24`) and explicit constructor arguments.

## Commands

```bash
# Run local node
npx hardhat node

# Deploy to local network (dry-run mode if configured)
npx hardhat run scripts/deploy.ts --network localhost
```
