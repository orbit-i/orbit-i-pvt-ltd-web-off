import express from 'express'
import path from 'path'
import fs from 'fs'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import compression from 'compression'
import morgan from 'morgan'
import { env } from './config/env'
import { apiRateLimiter } from './middleware/rateLimiter'
import { notFoundHandler } from './middleware/validate'
import { errorHandler } from './middleware/errorHandler'
import apiRouter from './routes/index'

const app = express()

// --- Security & core middleware -------------------------------------------------
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com', 'https://res.cloudinary.com', 'https://*.orbit-i.tech'],
        connectSrc: ["'self'", 'http://localhost:*', 'https://orbit-i.tech', 'https://api.stripe.com'],
        frameAncestors: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: 'deny' },
    noSniff: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
)
app.use(
  cors({
    origin: [env.clientUrl, env.publicSiteUrl, 'https://orbit-i.tech', 'http://localhost:5173'],
    credentials: true,
  })
)
app.use(compression())
app.use(cookieParser())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(apiRateLimiter)

if (!env.isProduction) {
  app.use(morgan('dev'))
}

// --- Routes -----------------------------------------------------------------------
app.use('/api/v1', apiRouter)

// --- Serve static frontend if available (full-stack deployment) -------------------
const clientDistCandidates = [
  path.resolve(__dirname, '../../client/dist'),
  path.resolve(__dirname, '../client/dist'),
  path.resolve(process.cwd(), 'client/dist'),
  path.resolve(process.cwd(), '../client/dist'),
]

let clientDistPath: string | null = null
for (const candidate of clientDistCandidates) {
  if (fs.existsSync(path.join(candidate, 'index.html'))) {
    clientDistPath = candidate
    break
  }
}

if (clientDistPath) {
  app.use(express.static(clientDistPath))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next()
    }
    res.sendFile(path.join(clientDistPath!, 'index.html'))
  })
}

// --- 404 + error handling ----------------------------------------------------------
app.use(notFoundHandler)
app.use(errorHandler)

export default app
