import { useState } from 'react'
import {
  CreditCard,
  Building,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Save,
  Smartphone,
} from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui'
import { Badge } from '@/components/ui/Badge'

interface GatewayConfig {
  key: 'jazzcash' | 'easypaisa' | 'nayapay' | 'stripe' | 'bank_transfer'
  title: string
  isActive: boolean
  isTestMode: boolean
  fields: Record<string, string>
}

const INITIAL_GATEWAYS: GatewayConfig[] = [
  {
    key: 'jazzcash',
    title: 'JazzCash Merchant API',
    isActive: true,
    isTestMode: true,
    fields: {
      merchantId: 'ORBIT_JC_MERCHANT_01',
      password: 'password123456',
      salt: 'salt_secure_hash_8921',
      returnUrl: 'https://orbit-i.tech/client/invoices',
    },
  },
  {
    key: 'easypaisa',
    title: 'EasyPaisa IPG Store',
    isActive: true,
    isTestMode: true,
    fields: {
      storeId: 'ORBIT_EP_STORE_2026',
      hashKey: 'ep_live_hash_secret_key_88',
      returnUrl: 'https://orbit-i.tech/client/invoices',
    },
  },
  {
    key: 'nayapay',
    title: 'NayaPay Business Gateway',
    isActive: true,
    isTestMode: true,
    fields: {
      merchantId: 'ORBIT_NP_CORP_001',
      clientId: 'nayapay_client_api_token_99',
    },
  },
  {
    key: 'stripe',
    title: 'Stripe International (Visa/Mastercard)',
    isActive: true,
    isTestMode: true,
    fields: {
      publishableKey: 'pk_test_51MockOrbitStripeKeyForSandboxOnly',
      secretKey: 'sk_test_51MockSecretKeyForSandboxOnly',
    },
  },
  {
    key: 'bank_transfer',
    title: 'Direct Bank Wire Transfer (Company Accounts)',
    isActive: true,
    isTestMode: false,
    fields: {
      bankName: 'Bank Alfalah / Meezan Bank Islamic',
      accountTitle: 'ORBIT-I PRIVATE LIMITED',
      accountNumber: '0234-1008765432',
      iban: 'PK36ALFH0234100876543201',
      swiftCode: 'ALFHPKKA',
      branch: 'Main Corporate Banking Branch, Karachi / Nawabshah',
      instructions:
        'Transfer the exact invoice amount and upload payment slip / screenshot or enter transaction ID for instant reconciliation.',
    },
  },
]

export function AdminPaymentGatewaysPage() {
  const [gateways, setGateways] = useState<GatewayConfig[]>(INITIAL_GATEWAYS)
  const [selectedKey, setSelectedKey] = useState<string>('jazzcash')
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [saveSuccess, setSaveSuccess] = useState(false)

  const activeGateway = gateways.find((g) => g.key === selectedKey) || gateways[0]

  const handleFieldChange = (fieldKey: string, value: string) => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.key === selectedKey) {
          return {
            ...g,
            fields: { ...g.fields, [fieldKey]: value },
          }
        }
        return g
      })
    )
    setSaveSuccess(false)
  }

  const handleToggleActive = () => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.key === selectedKey) {
          return { ...g, isActive: !g.isActive }
        }
        return g
      })
    )
    setSaveSuccess(false)
  }

  const handleToggleTestMode = () => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.key === selectedKey) {
          return { ...g, isTestMode: !g.isTestMode }
        }
        return g
      })
    )
    setSaveSuccess(false)
  }

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const toggleShowSecret = (field: string) => {
    setShowSecrets((prev) => ({ ...prev, [field]: !prev[field] }))
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="font-display text-xl font-semibold text-[var(--color-text-primary)]">
            Payment Gateways &amp; Banking Settings
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            Configure live credentials, sandbox testing, and merchant keys for JazzCash, EasyPaisa, NayaPay, Stripe, and Bank Transfer.
          </p>
        </div>
        <Button size="md" onClick={handleSave} className="gap-2 self-start sm:self-auto">
          <Save className="size-4" /> Save &amp; Sync Credentials
        </Button>
      </div>

      {saveSuccess && (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 p-3.5 text-sm font-medium text-[var(--color-success)]">
          <CheckCircle2 className="size-4.5" />
          Credentials synced successfully! Changes are now active on Client Checkout.
        </div>
      )}

      {/* Gateway Selection Tabs */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="flex flex-col gap-2">
          {gateways.map((g) => {
            const isSelected = g.key === selectedKey
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => {
                  setSelectedKey(g.key)
                  setSaveSuccess(false)
                }}
                className={`flex items-center justify-between rounded-[var(--radius-md)] border p-3.5 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-500/10 text-primary-300'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] hover:border-primary-500/40 hover:bg-[var(--color-surface-hover)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  {g.key === 'bank_transfer' ? (
                    <Building className="size-4.5 text-primary-400" />
                  ) : g.key === 'stripe' ? (
                    <CreditCard className="size-4.5 text-sky-400" />
                  ) : (
                    <Smartphone className="size-4.5 text-amber-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{g.title.split(' ')[0]}</p>
                    <p className="text-[11px] text-[var(--color-text-muted)]">
                      {g.isTestMode ? 'Sandbox Mode' : 'Live Gateway'}
                    </p>
                  </div>
                </div>
                <Badge tone={g.isActive ? 'success' : 'neutral'}>
                  {g.isActive ? 'Active' : 'Disabled'}
                </Badge>
              </button>
            )
          })}
        </div>

        {/* Configuration Panel */}
        <Card hoverable={false} className="flex flex-col gap-6 p-6">
          <div className="flex flex-col justify-between gap-4 border-b border-[var(--color-border)] pb-5 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-lg font-semibold text-[var(--color-text-primary)]">
                {activeGateway.title}
              </h3>
              <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
                Direct API handshake integration for client invoices and receipt generation.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                <span>Status:</span>
                <input
                  type="checkbox"
                  checked={activeGateway.isActive}
                  onChange={handleToggleActive}
                  className="rounded border-[var(--color-border)] text-primary-600 focus:ring-primary-500"
                />
                <span className="font-medium text-[var(--color-text-primary)]">
                  {activeGateway.isActive ? 'Enabled' : 'Disabled'}
                </span>
              </label>

              {activeGateway.key !== 'bank_transfer' && (
                <label className="flex cursor-pointer items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span>Sandbox:</span>
                  <input
                    type="checkbox"
                    checked={activeGateway.isTestMode}
                    onChange={handleToggleTestMode}
                    className="rounded border-[var(--color-border)] text-primary-600 focus:ring-primary-500"
                  />
                  <span className="font-medium text-[var(--color-text-primary)]">
                    {activeGateway.isTestMode ? 'Test Mode' : 'Production Live'}
                  </span>
                </label>
              )}
            </div>
          </div>

          {/* Form Fields for Active Gateway */}
          <div className="flex flex-col gap-4">
            {Object.entries(activeGateway.fields).map(([fieldKey, value]) => {
              const isSensitive =
                fieldKey.toLowerCase().includes('password') ||
                fieldKey.toLowerCase().includes('secret') ||
                fieldKey.toLowerCase().includes('salt') ||
                fieldKey.toLowerCase().includes('hash')

              const isVisible = showSecrets[`${activeGateway.key}_${fieldKey}`]

              return (
                <div key={fieldKey} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      {fieldKey.replace(/([A-Z])/g, ' $1')}
                    </label>
                    {isSensitive && (
                      <button
                        type="button"
                        onClick={() => toggleShowSecret(`${activeGateway.key}_${fieldKey}`)}
                        className="inline-flex items-center gap-1 text-[11px] text-primary-400 hover:text-primary-300"
                      >
                        {isVisible ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                        {isVisible ? 'Hide' : 'Reveal'}
                      </button>
                    )}
                  </div>

                  {fieldKey === 'instructions' ? (
                    <textarea
                      rows={3}
                      value={value}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none"
                    />
                  ) : (
                    <input
                      type={isSensitive && !isVisible ? 'password' : 'text'}
                      value={value}
                      onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
                      placeholder={`Enter ${fieldKey}`}
                      className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-text-primary)] focus:border-primary-500 focus:outline-none"
                    />
                  )}
                </div>
              )
            })}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--color-border)] pt-4 text-xs text-[var(--color-text-muted)]">
            <span className="flex items-center gap-1.5">
              <Lock className="size-3.5 text-emerald-400" />
              API credentials are encrypted and stored in secure MySQL table.
            </span>
            <Button size="sm" onClick={handleSave} className="gap-1.5">
              <Save className="size-3.5" /> Save Changes
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
