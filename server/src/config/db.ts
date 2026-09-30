import mongoose from 'mongoose'
import { env } from './env'

mongoose.set('strictQuery', true)
mongoose.set('bufferCommands', false)

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1
}

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 2000 })
    console.log(`[db] connected to MongoDB (${env.isProduction ? 'production' : 'development'})`)
  } catch (error: any) {
    console.warn(`[db] MongoDB is offline (${error.message || error}). Running in MySQL-first Hostinger mode.`)
  }

  mongoose.connection.on('disconnected', () => {
    console.warn('[db] MongoDB connection lost')
  })
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect()
}
