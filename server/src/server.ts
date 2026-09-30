import app from './app'
import { env } from './config/env'
import { connectDatabase } from './config/db'
import { initMySQL } from './config/mysql'
import dns from "node:dns";
dns.setServers(["8.8.8.8"]);

async function start() {
  await connectDatabase()
  await initMySQL()

  const server = app.listen(env.port, () => {
    console.log(`[server] ORBIT-I API listening on port ${env.port} (${env.nodeEnv})`)
  })

  const shutdown = (signal: string) => {
    console.log(`[server] received ${signal}, shutting down gracefully...`)
    server.close(() => {
      console.log('[server] closed all connections')
      process.exit(0)
    })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

start().catch((error) => {
  console.error('[server] failed to start', error)
  process.exit(1)
})
