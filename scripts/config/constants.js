/**
 * Global Configuration and Constants
 * 
 * According to global project rules:
 * "All global constants (Versions, Salts, Endpoints) must be automatically 
 * synchronized across all system layers during the build/deploy process."
 */

const ENV = process.env.NODE_ENV || 'development';

// Core global configurations to be synchronized across Client, Worker, and Microservices
const GLOBAL_CONFIG = {
    development: {
        version: '1.0.0-dev',
        saltUsed: 'dev_salt_9283',
        endpoints: {
            rpc: 'http://127.0.0.1:8545',
            api: 'http://localhost:3000/api'
        }
    },
    staging: {
        version: '1.0.0-rc.1',
        saltUsed: 'stg_salt_4412',
        endpoints: {
            rpc: 'https://staging-rpc.example.com',
            api: 'https://staging-api.example.com'
        }
    },
    production: {
        version: '1.0.0',
        saltUsed: process.env.PROD_SALT || 'PROD_SALT_MISSING',
        endpoints: {
            rpc: 'https://mainnet.infura.io/v3/YOUR-PROJECT-ID',
            api: 'https://api.example.com'
        }
    }
};

function getActiveConfig() {
    if (!GLOBAL_CONFIG[ENV]) {
        throw new Error(`Configuration for environment '${ENV}' not found.`);
    }
    return GLOBAL_CONFIG[ENV];
}

module.exports = {
    ENV,
    config: getActiveConfig()
};
