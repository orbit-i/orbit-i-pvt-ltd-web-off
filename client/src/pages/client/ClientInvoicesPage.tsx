import { useState } from 'react'
import {
  CreditCard,
  Building,
  Printer,
  Smartphone,
  FileCheck,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button, Modal } from '@/components/ui'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { DataTable, type DataTableColumn } from '@/components/dashboard/DataTable'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { CONTACT_EMAIL, CONTACT_PHONE, WEBSITE_URL } from '@/config/socialLinks'
import orbitLogo from '@/assets/brand/orbit-i-logo.png'

export interface ClientInvoice {
  id: number | string
  invoiceNumber: string
  title: string
  projectTitle: string
  amount: number
  currency: string
  status: 'paid' | 'pending' | 'overdue'
  dueDate: string
  paidAt?: string
  paymentMethod?: string
  transactionReference?: string
  receiptNumber?: string
  notes?: string
}

const INITIAL_CLIENT_INVOICES: ClientInvoice[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2026-001',
    title: 'Milestone 1 — Core Architecture & Database Setup',
    projectTitle: 'Custom Cloud Architecture & Microservices',
    amount: 150000,
    currency: 'PKR',
    status: 'paid',
    dueDate: '2026-03-20',
    paidAt: '2026-03-18T14:32:00Z',
    paymentMethod: 'Direct Bank Wire Transfer',
    transactionReference: 'TRX-PK-BA-9948271',
    receiptNumber: 'REC-2026-0001',
    notes: 'Verified and reconciled by ORBIT-I finance.',
  },
  {
    id: 2,
    invoiceNumber: 'INV-2026-002',
    title: 'Milestone 2 — Frontend Integration & Client Portal',
    projectTitle: 'Custom Cloud Architecture & Microservices',
    amount: 125000,
    currency: 'PKR',
    status: 'pending',
    dueDate: '2026-04-10',
    notes: 'Payable online via JazzCash, EasyPaisa, NayaPay, Stripe or Bank Wire.',
  },
  {
    id: 3,
    invoiceNumber: 'INV-2026-003',
    title: 'Milestone 1 — Dispatch Mobile Handshake',
    projectTitle: 'Fleet Tracking & Dispatch Mobile Platform',
    amount: 200000,
    currency: 'PKR',
    status: 'overdue',
    dueDate: '2026-03-22',
    notes: 'Invoice overdue. Please settle to maintain scheduled sprint milestones.',
  },
]

export function ClientInvoicesPage() {
  const [invoices, setInvoices] = useState<ClientInvoice[]>(INITIAL_CLIENT_INVOICES)
  const [selectedInvoice, setSelectedInvoice] = useState<ClientInvoice | null>(null)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isReceiptOpen, setIsReceiptOpen] = useState(false)
  const [receiptData, setReceiptData] = useState<ClientInvoice | null>(null)

  // Checkout State
  const [selectedChannel, setSelectedChannel] = useState<'jazzcash' | 'easypaisa' | 'nayapay' | 'stripe' | 'bank_transfer'>('jazzcash')
  const [accountNumber, setAccountNumber] = useState('')
  const [bankTrxId, setBankTrxId] = useState('')
  const [slipFile, setSlipFile] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleOpenCheckout = (inv: ClientInvoice) => {
    setSelectedInvoice(inv)
    setAccountNumber('')
    setBankTrxId('')
    setSlipFile(null)
    setIsCheckoutOpen(true)
  }

  const handleOpenReceipt = (inv: ClientInvoice) => {
    setReceiptData(inv)
    setIsReceiptOpen(true)
  }

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedInvoice) return

    setIsProcessing(true)

    setTimeout(() => {
      const receiptNo = `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`
      const trxRef =
        selectedChannel === 'bank_transfer'
          ? bankTrxId || `BANK-${Date.now()}`
          : `${selectedChannel.toUpperCase()}-${Date.now().toString().slice(-6)}`

      const channelName =
        selectedChannel === 'jazzcash'
          ? 'JazzCash Mobile Account'
          : selectedChannel === 'easypaisa'
          ? 'EasyPaisa IPG'
          : selectedChannel === 'nayapay'
          ? 'NayaPay Wallet'
          : selectedChannel === 'stripe'
          ? 'Stripe Credit/Debit Card'
          : 'Direct Bank Wire Transfer'

      const updatedList = invoices.map((inv) => {
        if (inv.id === selectedInvoice.id) {
          const updated: ClientInvoice = {
            ...inv,
            status: 'paid',
            paidAt: new Date().toISOString(),
            paymentMethod: channelName,
            transactionReference: trxRef,
            receiptNumber: receiptNo,
          }
          setReceiptData(updated)
          return updated
        }
        return inv
      })

      setInvoices(updatedList)
      setIsProcessing(false)
      setIsCheckoutOpen(false)
      setIsReceiptOpen(true)
    }, 1200)
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const columns: DataTableColumn<ClientInvoice>[] = [
    {
      header: 'Invoice #',
      render: (i) => (
        <span className="font-mono text-xs font-semibold text-primary-400">
          {i.invoiceNumber}
        </span>
      ),
    },
    {
      header: 'Description & Project',
      render: (i) => (
        <div>
          <p className="font-medium text-[var(--color-text-primary)]">{i.title}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{i.projectTitle}</p>
        </div>
      ),
    },
    {
      header: 'Amount',
      render: (i) => (
        <span className="font-mono text-sm font-bold text-[var(--color-text-primary)]">
          {formatCurrency(i.amount, i.currency)}
        </span>
      ),
    },
    {
      header: 'Due Date',
      render: (i) => (
        <span className="text-xs text-[var(--color-text-muted)]">{formatDate(i.dueDate)}</span>
      ),
    },
    {
      header: 'Status',
      render: (i) => (
        <Badge
          tone={
            i.status === 'paid'
              ? 'success'
              : i.status === 'pending'
              ? 'warning'
              : 'danger'
          }
        >
          {i.status.toUpperCase()}
        </Badge>
      ),
    },
    {
      header: 'Action',
      render: (i) => (
        <div>
          {i.status === 'paid' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenReceipt(i)}
              className="gap-1.5 text-xs text-[var(--color-success)]"
            >
              <FileCheck className="size-3.5" /> View Receipt
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => handleOpenCheckout(i)}
              className="gap-1.5 text-xs"
            >
              <CreditCard className="size-3.5" /> Pay Now
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
            Billing &amp; Invoices
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Review invoices, execute payments via JazzCash, EasyPaisa, NayaPay, Stripe or Bank Wire, and download official legal tax receipts.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card hoverable={false} className="flex flex-col gap-1 p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Total Paid</p>
          <p className="font-mono text-2xl font-bold text-[var(--color-success)]">
            PKR 150,000
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">1 Invoice Settled</p>
        </Card>
        <Card hoverable={false} className="flex flex-col gap-1 p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Pending Payment</p>
          <p className="font-mono text-2xl font-bold text-[var(--color-warning)]">
            PKR 125,000
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">Due by Apr 10, 2026</p>
        </Card>
        <Card hoverable={false} className="flex flex-col gap-1 p-4">
          <p className="text-xs text-[var(--color-text-muted)]">Overdue</p>
          <p className="font-mono text-2xl font-bold text-[var(--color-danger)]">
            PKR 200,000
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)]">Immediate action required</p>
        </Card>
      </div>

      {/* Invoices DataTable */}
      <DataTable
        columns={columns}
        rows={invoices}
        keyField={(i) => String(i.id)}
        emptyTitle="No invoices found"
      />

      {/* Dynamic Payment Checkout Modal */}
      <Modal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        title={`Payment Checkout — ${selectedInvoice?.invoiceNumber}`}
      >
        {selectedInvoice && (
          <form onSubmit={handleCompletePayment} className="flex flex-col gap-5">
            {/* Amount Banner */}
            <div className="flex items-center justify-between rounded-[var(--radius-md)] border border-primary-500/30 bg-primary-500/10 p-3.5">
              <div>
                <p className="text-xs text-[var(--color-text-muted)]">Total Payable Amount</p>
                <p className="font-mono text-xl font-bold text-primary-300">
                  {formatCurrency(selectedInvoice.amount, selectedInvoice.currency)}
                </p>
              </div>
              <Badge tone="primary">{selectedInvoice.invoiceNumber}</Badge>
            </div>

            {/* Gateway Selection Tabs */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Select Payment Method
              </label>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {[
                  { id: 'jazzcash', label: 'JazzCash', icon: Smartphone },
                  { id: 'easypaisa', label: 'EasyPaisa', icon: Smartphone },
                  { id: 'nayapay', label: 'NayaPay', icon: Smartphone },
                  { id: 'stripe', label: 'Stripe Card', icon: CreditCard },
                  { id: 'bank_transfer', label: 'Bank Wire', icon: Building },
                ].map((ch) => {
                  const isSel = selectedChannel === ch.id
                  return (
                    <button
                      key={ch.id}
                      type="button"
                      onClick={() => setSelectedChannel(ch.id as any)}
                      className={`flex flex-col items-center gap-1.5 rounded-[var(--radius-sm)] border p-2.5 text-center text-xs font-medium transition-all ${
                        isSel
                          ? 'border-primary-500 bg-primary-500/15 text-primary-300 shadow-sm'
                          : 'border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text-secondary)] hover:border-primary-500/40 hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      <ch.icon className="size-4" />
                      <span>{ch.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Gateway Specific Input */}
            {selectedChannel === 'bank_transfer' ? (
              <div className="flex flex-col gap-3 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-background)] p-3.5">
                <p className="text-xs font-semibold text-[var(--color-text-primary)]">
                  ORBIT-I Official Bank Details:
                </p>
                <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                  <p><strong>Bank:</strong> Bank Alfalah / Meezan Bank Islamic</p>
                  <p><strong>Title:</strong> ORBIT-I PRIVATE LIMITED</p>
                  <p><strong>Account #:</strong> 0234-1008765432</p>
                  <p><strong>IBAN:</strong> PK36ALFH0234100876543201</p>
                </div>
                <div className="mt-2 flex flex-col gap-2">
                  <Input
                    label="Transaction Reference / Deposit ID"
                    value={bankTrxId}
                    onChange={(e) => setBankTrxId(e.target.value)}
                    placeholder="e.g. TRX-99281726"
                    required
                  />
                  <div className="text-xs text-[var(--color-text-muted)]">
                    Upload deposit slip screenshot (optional, recommended):
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSlipFile(e.target.files[0].name)
                      }
                    }}
                    className="text-xs text-[var(--color-text-secondary)]"
                  />
                  {slipFile && (
                    <p className="text-xs text-[var(--color-success)]">Selected: {slipFile}</p>
                  )}
                </div>
              </div>
            ) : selectedChannel === 'stripe' ? (
              <div className="flex flex-col gap-3">
                <Input
                  label="Card Number"
                  placeholder="4242 4242 4242 4242"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Expiry (MM/YY)" placeholder="12/28" required />
                  <Input label="CVC" placeholder="123" required />
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Input
                  label={`${selectedChannel.toUpperCase()} Mobile Account Number`}
                  placeholder="03XXXXXXXXX"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  required
                />
                <p className="text-[11px] text-[var(--color-text-muted)]">
                  You will receive an instant push confirmation / prompt on your {selectedChannel} mobile app.
                </p>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4">
              <span className="text-xs text-[var(--color-text-muted)]">
                Secure 256-bit encrypted settlement
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isProcessing}>
                  Authorize &amp; Pay
                </Button>
              </div>
            </div>
          </form>
        )}
      </Modal>

      {/* Official Legal Receipt Modal */}
      <Modal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        title="Official Legal Payment Receipt"
      >
        {receiptData && (
          <div className="flex flex-col gap-4">
            <div
              id="legal-receipt-print"
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-[var(--color-text-primary)] print:border-black print:bg-white print:text-black"
            >
              {/* Receipt Header */}
              <div className="flex items-start justify-between border-b border-[var(--color-border)] pb-4 print:border-gray-300">
                <div className="flex items-center gap-3">
                  <img src={orbitLogo} alt="ORBIT-I" className="h-10 w-auto" />
                  <div>
                    <h3 className="font-display text-base font-bold text-[var(--color-text-primary)] print:text-black">
                      ORBIT-I PRIVATE LIMITED
                    </h3>
                    <p className="text-[11px] text-[var(--color-text-muted)] print:text-gray-600">
                      SECP Reg: 0219842 • PSEB Member • NTN: 9028471-8
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] print:text-gray-600">
                      {CONTACT_EMAIL} | {CONTACT_PHONE} | {WEBSITE_URL}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[var(--color-success)] print:border-green-600 print:text-green-800">
                    PAID &amp; SETTLED
                  </span>
                  <p className="mt-1 font-mono text-xs font-bold text-primary-400 print:text-black">
                    {receiptData.receiptNumber || 'REC-2026-0001'}
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] print:text-gray-600">
                    Date: {receiptData.paidAt ? formatDate(receiptData.paidAt) : formatDate(new Date().toISOString())}
                  </p>
                </div>
              </div>

              {/* Billed To & Payment Details */}
              <div className="grid grid-cols-2 gap-4 py-4 text-xs">
                <div>
                  <p className="font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">
                    Billed To:
                  </p>
                  <p className="font-medium text-[var(--color-text-primary)] print:text-black mt-0.5">
                    Apex Enterprise Solutions
                  </p>
                  <p className="text-[var(--color-text-secondary)] print:text-gray-700">
                    billing@apexsolutions.com
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-[var(--color-text-muted)] uppercase tracking-wider text-[10px]">
                    Transaction Details:
                  </p>
                  <p className="text-[var(--color-text-secondary)] print:text-gray-700 mt-0.5">
                    <strong>Invoice:</strong> {receiptData.invoiceNumber}
                  </p>
                  <p className="text-[var(--color-text-secondary)] print:text-gray-700">
                    <strong>Method:</strong> {receiptData.paymentMethod || 'Online Checkout'}
                  </p>
                  <p className="font-mono text-[10px] text-primary-400 print:text-black">
                    <strong>TRX ID:</strong> {receiptData.transactionReference}
                  </p>
                </div>
              </div>

              {/* Itemized Table */}
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--color-border)] text-[var(--color-text-muted)] print:border-gray-300">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] print:divide-gray-200">
                  <tr>
                    <td className="py-2.5">
                      <p className="font-medium text-[var(--color-text-primary)] print:text-black">{receiptData.title}</p>
                      <p className="text-[10px] text-[var(--color-text-muted)] print:text-gray-600">{receiptData.projectTitle}</p>
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-[var(--color-text-primary)] print:text-black">
                      {formatCurrency(receiptData.amount, receiptData.currency)}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-[var(--color-border)] font-bold print:border-gray-400">
                    <td className="py-2.5 text-[var(--color-text-primary)] print:text-black">Total Paid:</td>
                    <td className="py-2.5 text-right font-mono text-sm text-[var(--color-success)] print:text-black">
                      {formatCurrency(receiptData.amount, receiptData.currency)}
                    </td>
                  </tr>
                </tfoot>
              </table>

              <div className="mt-4 border-t border-[var(--color-border)] pt-3 text-center text-[10px] text-[var(--color-text-muted)] print:text-gray-600">
                This is a computer-generated tax invoice receipt issued by ORBIT-I Private Limited. Verified under electronic transaction ordinance.
              </div>
            </div>

            <div className="flex justify-end gap-2 print:hidden">
              <Button variant="outline" size="sm" onClick={handlePrintReceipt} className="gap-1.5">
                <Printer className="size-4" /> Print / Save PDF
              </Button>
              <Button size="sm" onClick={() => setIsReceiptOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
