"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const db_1 = require("./config/db");
const mysql_1 = require("./config/mysql");
const node_dns_1 = __importDefault(require("node:dns"));
node_dns_1.default.setServers(["8.8.8.8"]);
async function start() {
    await (0, db_1.connectDatabase)();
    await (0, mysql_1.initMySQL)();
    const server = app_1.default.listen(env_1.env.port, () => {
        console.log(`[server] ORBIT-I API listening on port ${env_1.env.port} (${env_1.env.nodeEnv})`);
    });
    const shutdown = (signal) => {
        console.log(`[server] received ${signal}, shutting down gracefully...`);
        server.close(() => {
            console.log('[server] closed all connections');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
start().catch((error) => {
    console.error('[server] failed to start', error);
    process.exit(1);
});
//# sourceMappingURL=server.js.map