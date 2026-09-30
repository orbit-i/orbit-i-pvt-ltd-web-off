"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConfig = void 0;
exports.initMySQL = initMySQL;
exports.getPool = getPool;
exports.isMySQLActive = isMySQLActive;
exports.query = query;
exports.execute = execute;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'orbit_i',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
};
let pool = null;
let isConnected = false;
async function initMySQL() {
    try {
        pool = promise_1.default.createPool(exports.dbConfig);
        // Test connection
        const connection = await pool.getConnection();
        await connection.ping();
        connection.release();
        isConnected = true;
        console.log(`[mysql] Successfully connected to MySQL database: ${exports.dbConfig.database} @ ${exports.dbConfig.host}:${exports.dbConfig.port}`);
        return true;
    }
    catch (error) {
        console.warn(`[mysql] Could not connect to MySQL server (${error.message || error}). Fallback active. To connect to Hostinger, set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in server/.env`);
        isConnected = false;
        return false;
    }
}
function getPool() {
    return pool;
}
function isMySQLActive() {
    return isConnected;
}
/**
 * Parameterized query helper to strictly prevent SQL injection
 */
async function query(sql, params = []) {
    if (!pool || !isConnected) {
        throw new Error('MySQL connection is not active');
    }
    const [rows] = await pool.execute(sql, params);
    return rows;
}
/**
 * Parameterized execute helper for INSERT/UPDATE/DELETE returning ResultSetHeader
 */
async function execute(sql, params = []) {
    if (!pool || !isConnected) {
        throw new Error('MySQL connection is not active');
    }
    const [result] = await pool.execute(sql, params);
    return result;
}
//# sourceMappingURL=mysql.js.map