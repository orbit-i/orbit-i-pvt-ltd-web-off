import multer from 'multer'
import { ApiError } from '../utils/ApiError'
import { securityService } from '../services/securityService'

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])

const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.sh', '.bash', '.php', '.phtml', '.php3', '.php4', '.php5',
  '.js', '.vbs', '.scr', '.jar', '.apk', '.msi', '.com', '.ps1', '.hta', '.dll'
]

const storage = multer.memoryStorage()

export const uploadSecure = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit prevents memory exhaustion attacks
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const rawName = file.originalname.toLowerCase()

    // 1. Block dangerous or double extensions
    const hasDangerousExtension = DANGEROUS_EXTENSIONS.some((ext) => rawName.endsWith(ext) || rawName.includes(ext + '.'))
    if (hasDangerousExtension) {
      securityService.logSecurityEvent('FILE_REJECTED_DANGEROUS_EXT', req.ip || '0.0.0.0', undefined, req.headers['user-agent'], `Blocked attempt to upload file: ${file.originalname}`)
      return callback(ApiError.badRequest('File type rejected by corporate security policy.'))
    }

    // 2. MIME type verification
    if (!allowedMimeTypes.has(file.mimetype)) {
      return callback(ApiError.badRequest('Only JPEG, PNG, WebP images and PDF documents are allowed.'))
    }

    callback(null, true)
  },
})

export const uploadImage = uploadSecure
