import mysql, { Pool, PoolOptions } from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

export const dbConfig: PoolOptions = {
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
}

let pool: Pool | null = null
let isConnected = false

export async function initMySQL(): Promise<boolean> {
  try {
    pool = mysql.createPool(dbConfig)
    // Test connection
    const connection = await pool.getConnection()
    await connection.ping()
    connection.release()
    isConnected = true
    console.log(`[mysql] Successfully connected to MySQL database: ${dbConfig.database} @ ${dbConfig.host}:${dbConfig.port}`)
    return true
  } catch (error: any) {
    console.warn(`[mysql] Could not connect to MySQL server (${error.message || error}). Fallback active. To connect to Hostinger, set DB_HOST, DB_USER, DB_PASSWORD, DB_NAME in server/.env`)
    isConnected = false
    return false
  }
}

export function getPool(): Pool | null {
  return pool
}

export function isMySQLActive(): boolean {
  return isConnected
}

/**
 * Parameterized query helper to strictly prevent SQL injection
 */
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  if (!pool || !isConnected) {
    throw new Error('MySQL connection is not active')
  }
  const [rows] = await pool.execute(sql, params)
  return rows as T[]
}

/**
 * Parameterized execute helper for INSERT/UPDATE/DELETE returning ResultSetHeader
 */
export async function execute(sql: string, params: any[] = []): Promise<any> {
  if (!pool || !isConnected) {
    throw new Error('MySQL connection is not active')
  }
  const [result] = await pool.execute(sql, params)
  return result
}
