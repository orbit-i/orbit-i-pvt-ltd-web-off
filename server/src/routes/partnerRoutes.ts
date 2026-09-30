import { Router } from 'express'
import { partnerService } from '../services/partnerService'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public endpoints
router.get('/', async (_req, res, next) => {
  try {
    const list = await partnerService.list()
    res.json({ success: true, message: 'Partners retrieved successfully', data: list })
  } catch (error) {
    next(error)
  }
})

router.get('/featured', async (_req, res, next) => {
  try {
    const list = await partnerService.listFeatured()
    res.json({ success: true, message: 'Featured partners retrieved successfully', data: list })
  } catch (error) {
    next(error)
  }
})

// Admin endpoints
router.get('/admin/list', authenticate, authorize('admin', 'super_admin'), async (_req, res, next) => {
  try {
    const list = await partnerService.list()
    res.json({ success: true, message: 'All partners retrieved', data: list })
  } catch (error) {
    next(error)
  }
})

router.post('/admin/create', authenticate, authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const { name, logoUrl, websiteUrl, category, description, orderIndex, isFeatured } = req.body
    if (!name) {
      return res.status(400).json({ success: false, message: 'Partner name is required' })
    }
    const created = await partnerService.create({ name, logoUrl, websiteUrl, category, description, orderIndex, isFeatured })
    res.status(201).json({ success: true, message: 'Partner created successfully', data: created })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/:id', authenticate, authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const id = String(req.params.id)
    const updated = await partnerService.update(id, req.body)
    res.json({ success: true, message: 'Partner updated successfully', data: updated })
  } catch (error) {
    next(error)
  }
})

router.delete('/admin/:id', authenticate, authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const id = String(req.params.id)
    await partnerService.remove(id)
    res.json({ success: true, message: 'Partner removed successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
