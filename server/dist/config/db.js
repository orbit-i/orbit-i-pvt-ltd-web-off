"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMongoConnected = isMongoConnected;
exports.connectDatabase = connectDatabase;
exports.disconnectDatabase = disconnectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
mongoose_1.default.set('strictQuery', true);
mongoose_1.default.set('bufferCommands', false);
function isMongoConnected() {
    return mongoose_1.default.connection.readyState === 1;
}
async function connectDatabase() {
    try {
        await mongoose_1.default.connect(env_1.env.mongoUri, { serverSelectionTimeoutMS: 2000 });
        console.log(`[db] connected to MongoDB (${env_1.env.isProduction ? 'production' : 'development'})`);
    }
    catch (error) {
        console.warn(`[db] MongoDB is offline (${error.message || error}). Running in MySQL-first Hostinger mode.`);
    }
    mongoose_1.default.connection.on('disconnected', () => {
        console.warn('[db] MongoDB connection lost');
    });
}
async function disconnectDatabase() {
    await mongoose_1.default.disconnect();
}
//# sourceMappingURL=db.js.map