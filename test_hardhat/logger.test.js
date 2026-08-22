import fs from 'fs';
import path from 'path';
import assert from 'node:assert';
import Logger from '../scripts/utils/logger.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

describe("JSONL Logger", function () {
    const logsDir = path.join(__dirname, '..', 'logs');
    const testLogFile = path.join(logsDir, `system_development.jsonl`);

    before(function() {
        if (fs.existsSync(testLogFile)) {
            fs.unlinkSync(testLogFile);
        }
    });

    it("should write a valid JSONL line with deployment metadata", function () {
        const logger = new Logger("Deployment");
        logger.info("Test deployment start", { event: "DEPLOYMENT_START", network: "sepolia", deployer: "0x123..." });

        const content = fs.readFileSync(testLogFile, "utf8");
        const lines = content.trim().split("\n");
        const lastLine = lines[lines.length - 1];

        const logObj = JSON.parse(lastLine);
        assert.equal(logObj.message, "Test deployment start");
        assert.equal(logObj.component, "Deployment");
        assert.equal(logObj.event, "DEPLOYMENT_START");
        assert.equal(logObj.network, "sepolia");
        assert.equal(logObj.deployer, "0x123...");
        assert.equal(logObj.level, "INFO");
        assert.ok(logObj.timestamp, "Timestamp should be present");
        assert.ok(logObj.version, "Version should be present");
        assert.ok(logObj.saltUsed, "saltUsed should be present");
    });
});
