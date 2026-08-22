import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV, config } from '../config/constants.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define logs directory relative to project root
const LOGS_DIR = path.join(__dirname, '..', '..', 'logs');
const LOG_FILE = path.join(LOGS_DIR, `system_${ENV}.jsonl`);

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Structured JSONL Logger
 * 
 * According to global project rules:
 * "All logs (Client, Worker, Microservices) must be maximally detailed at all times. 
 * Error responses must include environment metadata, versioning, and internal config markers 
 * (like saltUsed) to ensure environment parity and transparent debugging."
 */
class Logger {
    constructor(componentName) {
        this.componentName = componentName;
    }

    _writeLog(level, message, metadata = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level.toUpperCase(),
            component: this.componentName,
            environment: ENV,
            version: config.version,
            saltUsed: config.saltUsed,
            message,
            ...metadata
        };

        const jsonlString = JSON.stringify(logEntry) + '\n';
        
        // Write to file
        fs.appendFileSync(LOG_FILE, jsonlString, 'utf8');
        
        // Output to console for immediate feedback (pretty printed if needed, or just JSON)
        if (level === 'error') {
            console.error(JSON.stringify(logEntry));
        } else {
            console.log(JSON.stringify(logEntry));
        }
    }

    info(message, metadata = {}) {
        this._writeLog('info', message, metadata);
    }

    warn(message, metadata = {}) {
        this._writeLog('warn', message, metadata);
    }

    error(message, errorObj = null, metadata = {}) {
        const errorMeta = errorObj ? { error: errorObj.message, stack: errorObj.stack, ...metadata } : metadata;
        this._writeLog('error', message, errorMeta);
    }
}

export default Logger;
