import { query, execute, isMySQLActive } from '../config/mysql'
import crypto from 'crypto'

export interface InvoiceRecord {
  id: number | string
  invoiceNumber: string
  clientId: number | string
  clientName: string
  clientEmail: string
  projectId?: number | string
  projectTitle?: string
  title: string
  description?: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  dueDate: string
  paidAt?: string
  paymentMethod?: string
  transactionReference?: string
  receiptNumber?: string
  paymentProofUrl?: string
  notes?: string
  createdAt: string
}

export interface PaymentGatewayConfig {
  gatewayKey: 'jazzcash' | 'easypaisa' | 'nayapay' | 'stripe' | 'bank_transfer'
  title: string
  isActive: boolean
  isTestMode: boolean
  config: Record<string, any>
}

// In-memory persistent gateway store
let memoryGateways: PaymentGatewayConfig[] = [
  {
    gatewayKey: 'jazzcash',
    title: 'JazzCash',
    isActive: true,
    isTestMode: true,
    config: {
      merchantId: 'ORBIT_JC_SANDBOX_01',
      password: '••••••••',
      salt: '••••••••',
      returnUrl: 'https://orbit-i.tech/client/invoices',
    },
  },
  {
    gatewayKey: 'easypaisa',
    title: 'EasyPaisa',
    isActive: true,
    isTestMode: true,
    config: {
      storeId: 'ORBIT_EP_SANDBOX_01',
      hashKey: '••••••••',
      returnUrl: 'https://orbit-i.tech/client/invoices',
    },
  },
  {
    gatewayKey: 'nayapay',
    title: 'NayaPay',
    isActive: true,
    isTestMode: true,
    config: {
      merchantId: 'ORBIT_NP_001',
      clientId: 'sandbox_orbit_nayapay',
    },
  },
  {
    gatewayKey: 'stripe',
    title: 'Stripe (Cards)',
    isActive: true,
    isTestMode: true,
    config: {
      publishableKey: 'pk_test_51MockOrbitStripeKeyForSandboxOnly',
      secretKey: 'sk_test_••••••••',
    },
  },
  {
    gatewayKey: 'bank_transfer',
    title: 'Direct Bank Wire Transfer',
    isActive: true,
    isTestMode: false,
    config: {
      bankName: 'Bank Alfalah / Meezan Bank Islamic',
      accountTitle: 'ORBIT-I PRIVATE LIMITED',
      accountNumber: '0234-1008765432',
      iban: 'PK36ALFH0234100876543201',
      swiftCode: 'ALFHPKKA',
      branch: 'Corporate Banking Branch',
      instruction: 'Please transfer the exact invoice amount and upload screenshot / proof or enter transaction reference for instant reconciliation.',
    },
  },
]

let memoryInvoices: InvoiceRecord[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2026-001',
    clientId: 'client-1',
    clientName: 'Apex Enterprise Solutions',
    clientEmail: 'billing@apexsolutions.com',
    projectId: 1,
    projectTitle: 'Custom Cloud Architecture & Microservices',
    title: 'Milestone 1 — Architecture & Core API Setup',
    description: 'Design of containerized services, MySQL database schemas, and JWT security setup.',
    amount: 150000,
    currency: 'PKR',
    status: 'paid',
    dueDate: '2026-03-20',
    paidAt: '2026-03-18T14:32:00Z',
    paymentMethod: 'bank_transfer',
    transactionReference: 'TRX-PK-BA-9948271',
    receiptNumber: 'REC-2026-0001',
    notes: 'Payment verified and credited.',
    createdAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 2,
    invoiceNumber: 'INV-2026-002',
    clientId: 'client-1',
    clientName: 'Apex Enterprise Solutions',
    clientEmail: 'billing@apexsolutions.com',
    projectId: 1,
    projectTitle: 'Custom Cloud Architecture & Microservices',
    title: 'Milestone 2 — Frontend Integration & Client Portal',
    description: 'Implementation of React/Vite dashboards, Dark/Light system design, and role access.',
    amount: 125000,
    currency: 'PKR',
    status: 'pending',
    dueDate: '2026-04-10',
    notes: 'Payable via JazzCash, EasyPaisa, NayaPay, Stripe or Bank Transfer.',
    createdAt: '2026-03-25T11:00:00Z',
  },
  {
    id: 3,
    invoiceNumber: 'INV-2026-003',
    clientId: 'client-2',
    clientName: 'Vanguard Logistics PK',
    clientEmail: 'finance@vanguardlogistics.pk',
    projectId: 2,
    projectTitle: 'Fleet Tracking & Dispatch Mobile Platform',
    title: 'Milestone 1 — Mobile UI & API Handshake',
    description: 'Cross-platform mobile UI flow and real-time socket connections.',
    amount: 200000,
    currency: 'PKR',
    status: 'overdue',
    dueDate: '2026-03-22',
    notes: 'Please settle at your earliest convenience to avoid deployment pause.',
    createdAt: '2026-03-05T09:00:00Z',
  },
]

export const paymentService = {
  // Gateways configuration
  async getGateways(includeSecrets: boolean = false): Promise<PaymentGatewayConfig[]> {
    if (isMySQLActive()) {
      try {
        const rows = await query<any>(`SELECT gateway_key, title, is_active, is_test_mode, config_json FROM payment_gateway_settings`)
        if (rows.length > 0) {
          return rows.map((r: any) => ({
            gatewayKey: r.gateway_key,
            title: r.title,
            isActive: Boolean(r.is_active),
            isTestMode: Boolean(r.is_test_mode),
            config: typeof r.config_json === 'string' ? JSON.parse(r.config_json) : r.config_json,
          }))
        }
      } catch (err) {
        console.error('[paymentService] MySQL error in getGateways, using memory store:', err)
      }
    }

    if (includeSecrets) return memoryGateways

    // Mask secrets for public/client view
    return memoryGateways.map((g) => {
      const sanitizedConfig: Record<string, any> = { ...g.config }
      if (sanitizedConfig.secretKey) delete sanitizedConfig.secretKey
      if (sanitizedConfig.password) delete sanitizedConfig.password
      if (sanitizedConfig.salt) delete sanitizedConfig.salt
      if (sanitizedConfig.hashKey) delete sanitizedConfig.hashKey
      return {
        ...g,
        config: sanitizedConfig,
      }
    })
  },

  async updateGateway(gatewayKey: string, data: Partial<PaymentGatewayConfig>): Promise<PaymentGatewayConfig | null> {
    const idx = memoryGateways.findIndex((g) => g.gatewayKey === gatewayKey)
    if (idx === -1) return null

    memoryGateways[idx] = {
      ...memoryGateways[idx],
      ...data,
      config: { ...memoryGateways[idx].config, ...(data.config || {}) },
    }

    if (isMySQLActive()) {
      try {
        await execute(
          `INSERT INTO payment_gateway_settings (gateway_key, title, is_active, is_test_mode, config_json)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE 
            title = VALUES(title),
            is_active = VALUES(is_active),
            is_test_mode = VALUES(is_test_mode),
            config_json = VALUES(config_json)`,
          [
            gatewayKey,
            memoryGateways[idx].title,
            memoryGateways[idx].isActive ? 1 : 0,
            memoryGateways[idx].isTestMode ? 1 : 0,
            JSON.stringify(memoryGateways[idx].config),
          ]
        )
      } catch (err) {
        console.error('[paymentService] MySQL error in updateGateway:', err)
      }
    }

    return memoryGateways[idx]
  },

  // Invoices management
  async listInvoices(clientId?: string): Promise<InvoiceRecord[]> {
    let list = [...memoryInvoices]
    if (clientId) {
      list = list.filter((i) => String(i.clientId) === String(clientId))
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  },

  async getInvoiceById(id: string | number): Promise<InvoiceRecord | null> {
    const found = memoryInvoices.find((i) => String(i.id) === String(id) || i.invoiceNumber === String(id))
    return found || null
  },

  async processPayment(
    invoiceId: string | number,
    payload: {
      paymentMethod: string
      transactionReference?: string
      paymentProofUrl?: string
      notes?: string
    }
  ): Promise<InvoiceRecord> {
    const inv = await this.getInvoiceById(invoiceId)
    if (!inv) throw new Error('Invoice not found')

    const receiptNumber = `REC-${new Date().getFullYear()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

    inv.status = 'paid'
    inv.paidAt = new Date().toISOString()
    inv.paymentMethod = payload.paymentMethod
    inv.transactionReference = payload.transactionReference || `TXN-${Date.now()}`
    inv.receiptNumber = receiptNumber
    if (payload.paymentProofUrl) inv.paymentProofUrl = payload.paymentProofUrl
    if (payload.notes) inv.notes = payload.notes

    return inv
  },

  async createInvoice(data: Omit<InvoiceRecord, 'id' | 'invoiceNumber' | 'createdAt'>): Promise<InvoiceRecord> {
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(memoryInvoices.length + 1).padStart(3, '0')}`
    const newInvoice: InvoiceRecord = {
      id: Date.now(),
      invoiceNumber,
      createdAt: new Date().toISOString(),
      ...data,
    }
    memoryInvoices.unshift(newInvoice)
    return newInvoice
  },
}
