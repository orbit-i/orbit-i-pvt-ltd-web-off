import { Router } from 'express'
import authRoutes from './authRoutes'
import userRoutes from './userRoutes'
import productRoutes from './productRoutes'
import categoryRoutes from './categoryRoutes'
import orderRoutes from './orderRoutes'
import projectRoutes from './projectRoutes'
import careersRoutes from './careersRoutes'
import uploadRoutes from './uploadRoutes'
import supportRoutes from './supportRoutes'
import { serviceRoutes, caseStudyRoutes, testimonialRoutes, teamRoutes, blogPostRoutes } from './contentRoutes'
import { contactRoutes, adminRoutes } from './miscRoutes'
import internRoutes from './internRoutes'
import paymentRoutes from './paymentRoutes'
import partnerRoutes from './partnerRoutes'
import cmsPageRoutes from './cmsPageRoutes'
import sitemapRoutes from './sitemapRoutes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/products', productRoutes)
router.use('/categories', categoryRoutes)
router.use('/orders', orderRoutes)
router.use('/projects', projectRoutes)
router.use('/services', serviceRoutes)
router.use('/case-studies', caseStudyRoutes)
router.use('/testimonials', testimonialRoutes)
router.use('/team', teamRoutes)
router.use('/partners', partnerRoutes)
router.use('/cms', cmsPageRoutes)
router.use('/blog', blogPostRoutes)
router.use('/careers', careersRoutes)
router.use('/uploads', uploadRoutes)
router.use('/support', supportRoutes)
router.use('/contact', contactRoutes)
router.use('/admin', adminRoutes)
router.use('/interns', internRoutes)
router.use('/payments', paymentRoutes)
router.use('/', sitemapRoutes)

router.get('/health', (_req, res) => {
  res.json({ success: true, message: 'ORBIT-I API is running', data: { timestamp: new Date().toISOString() } })
})

export default router

