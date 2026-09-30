import { Router } from 'express'
import { paymentService } from '../services/paymentService'
import { authenticate, authorize } from '../middleware/auth'

const router = Router()

// Public / Client: Get active payment methods for checkout (safe, secrets masked)
router.get('/gateways', async (_req, res, next) => {
  try {
    const gateways = await paymentService.getGateways(false)
    res.json({ success: true, message: 'Active payment gateways retrieved', data: gateways })
  } catch (error) {
    next(error)
  }
})

// SuperAdmin / Admin: Get full gateway settings (including configured keys)
router.get('/admin/gateways', authenticate, authorize('super_admin', 'admin'), async (_req, res, next) => {
  try {
    const gateways = await paymentService.getGateways(true)
    res.json({ success: true, message: 'Admin gateway settings retrieved', data: gateways })
  } catch (error) {
    next(error)
  }
})

// SuperAdmin: Update gateway keys and test/live modes
router.put('/admin/gateways/:gatewayKey', authenticate, authorize('super_admin'), async (req, res, next) => {
  try {
    const gatewayKey = String(req.params.gatewayKey)
    const updated = await paymentService.updateGateway(gatewayKey, req.body)
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Gateway not found' })
    }
    res.json({ success: true, message: `Gateway ${gatewayKey} updated successfully`, data: updated })
  } catch (error) {
    next(error)
  }
})

// Client: Invoices list
router.get('/invoices', authenticate, async (req: any, res, next) => {
  try {
    const clientId = req.user?.id || req.user?._id
    const invoices = await paymentService.listInvoices(req.user?.role === 'client' ? clientId : undefined)
    res.json({ success: true, message: 'Invoices retrieved successfully', data: invoices })
  } catch (error) {
    next(error)
  }
})

// Admin: Invoices list
router.get('/admin/invoices', authenticate, authorize('admin', 'super_admin'), async (_req, res, next) => {
  try {
    const invoices = await paymentService.listInvoices()
    res.json({ success: true, message: 'All invoices retrieved', data: invoices })
  } catch (error) {
    next(error)
  }
})

// Pay invoice / Checkout
router.post('/invoices/:id/pay', authenticate, async (req, res) => {
  try {
    const id = String(req.params.id)
    const { paymentMethod, transactionReference, paymentProofUrl, notes } = req.body

    if (!paymentMethod) {
      return res.status(400).json({ success: false, message: 'Payment method is required' })
    }

    const updated = await paymentService.processPayment(id, {
      paymentMethod,
      transactionReference,
      paymentProofUrl,
      notes,
    })

    res.json({
      success: true,
      message: 'Payment processed and verified. Legal receipt generated.',
      data: updated,
    })
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message || 'Payment processing failed' })
  }
})

// Get Invoice Legal Receipt
router.get('/invoices/:id/receipt', authenticate, async (req, res, next) => {
  try {
    const id = String(req.params.id)
    const inv = await paymentService.getInvoiceById(id)
    if (!inv) {
      return res.status(404).json({ success: false, message: 'Invoice not found' })
    }

    const receipt = {
      receiptNumber: inv.receiptNumber || `REC-2026-${inv.invoiceNumber.replace(/\D/g, '')}`,
      invoiceNumber: inv.invoiceNumber,
      issuedDate: inv.paidAt || inv.createdAt,
      paidAt: inv.paidAt || new Date().toISOString(),
      billedTo: {
        name: inv.clientName,
        email: inv.clientEmail,
        company: inv.clientName,
      },
      company: {
        legalName: 'ORBIT-I Private Limited',
        registration: 'SECP Registered Corporate Entity | PSEB Partner',
        ntn: 'NTN: 9028471-8',
        phone: '+92 3190375751',
        email: 'contactus@orbit-i.tech',
        website: 'https://orbit-i.tech/',
        address: 'Karachi & Nawabshah, Pakistan',
      },
      items: [
        {
          description: `${inv.title}${inv.projectTitle ? ` (${inv.projectTitle})` : ''}`,
          amount: inv.amount,
          currency: inv.currency,
        },
      ],
      subtotal: inv.amount,
      tax: 0,
      totalPaid: inv.amount,
      currency: inv.currency,
      paymentMethod: inv.paymentMethod || 'Online Checkout',
      transactionReference: inv.transactionReference || 'VERIFIED-SETTLEMENT',
      status: 'PAID & SETTLED',
      verificationUrl: `https://orbit-i.tech/client/invoices?verify=${inv.invoiceNumber}`,
    }

    res.json({ success: true, message: 'Legal receipt generated', data: receipt })
  } catch (error) {
    next(error)
  }
})

export default router
