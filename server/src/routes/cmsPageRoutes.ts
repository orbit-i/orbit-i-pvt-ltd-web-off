import { Router } from 'express'
import { cmsPageService } from '../services/cmsPageService'
import { securityService } from '../services/securityService'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public endpoints
router.get('/', async (_req, res, next) => {
  try {
    const list = await cmsPageService.list()
    res.json({ success: true, message: 'CMS pages fetched', data: list })
  } catch (error) {
    next(error)
  }
})

router.get('/:slug', async (req, res, next) => {
  try {
    const slug = String(req.params.slug)
    const page = await cmsPageService.getBySlug(slug)
    if (!page) {
      return res.status(404).json({ success: false, message: 'Page not found', data: null })
    }
    res.json({ success: true, message: 'CMS page fetched', data: page })
  } catch (error) {
    next(error)
  }
})

// Admin endpoints
router.get('/admin/list', authenticate, authorize('admin', 'super_admin', 'editor', 'seo_manager'), async (_req, res, next) => {
  try {
    const list = await cmsPageService.listAll()
    res.json({ success: true, message: 'All CMS pages fetched', data: list })
  } catch (error) {
    next(error)
  }
})

router.post('/admin/create', authenticate, authorize('admin', 'super_admin', 'editor', 'seo_manager'), async (req, res, next) => {
  try {
    const { title, slug, contentHtml, excerpt, status, metaTitle, metaDescription, keywords, schemaType } = req.body
    if (!title) {
      return res.status(400).json({ success: false, message: 'Page title is required' })
    }

    const cleanHtml = securityService.sanitizeHtml(contentHtml || '')
    const created = await cmsPageService.create({
      title,
      slug,
      contentHtml: cleanHtml,
      excerpt,
      status: status || 'draft',
      metaTitle,
      metaDescription,
      keywords,
      schemaType,
    })

    res.status(201).json({ success: true, message: 'CMS page created successfully', data: created })
  } catch (error) {
    next(error)
  }
})

router.patch('/admin/:id', authenticate, authorize('admin', 'super_admin', 'editor', 'seo_manager'), async (req, res, next) => {
  try {
    const id = String(req.params.id)
    if (req.body.contentHtml) {
      req.body.contentHtml = securityService.sanitizeHtml(req.body.contentHtml)
    }
    const updated = await cmsPageService.update(id, req.body)
    res.json({ success: true, message: 'CMS page updated successfully', data: updated })
  } catch (error) {
    next(error)
  }
})

router.delete('/admin/:id', authenticate, authorize('admin', 'super_admin'), async (req, res, next) => {
  try {
    const id = String(req.params.id)
    await cmsPageService.remove(id)
    res.json({ success: true, message: 'CMS page removed successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
