import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function RefundPolicyPage() {
  return (
    <>
      <SEO {...PAGE_SEO.refundPolicy} />
      <LegalPageLayout
        title="Refund Policy"
        subtitle="Transparent terms covering digital software products, milestone disbursements, and custom enterprise engineering engagements."
        lastUpdated="August 2026"
      >
        <p>
          This Refund Policy outlines how ORBIT-I Private Limited ("ORBIT-I", "we", "us") handles refunds, cancellations, and milestone reconciliations for digital products, monthly retainers, and custom enterprise engineering projects.
        </p>

        <h2>1. Overview &amp; Service Classification</h2>
        <p>
          Because ORBIT-I delivers a distinct combination of pre-built self-serve digital products and dedicated senior software engineering capacity, refund parameters vary based on the service category.
        </p>

        <h2>2. Self-Serve Digital Software Products</h2>
        <p>
          For standalone turnkey software packages (e.g. Orbit CRM, Orbit Forms), clients may request a refund within <strong>7 calendar days</strong> of initial license issuance, provided the license has not been permanently provisioned onto custom client servers or exceeded moderate evaluation thresholds.
        </p>

        <h2>3. Custom Engineering &amp; Milestone Billing</h2>
        <p>
          <strong>Non-Refundability of Completed Milestones:</strong> Custom software engineering, cloud architecture, and UI/UX design involve committed allocation of senior software architects. Once a discovery deliverable or development sprint milestone has been reviewed, accepted, or deployed, the associated payment is <strong>strictly non-refundable</strong>.
        </p>

        <h2>4. Acceptance Criteria &amp; Bug Remediation</h2>
        <p>
          If delivered code materially fails to satisfy the documented acceptance criteria defined in your Statement of Work (SOW), ORBIT-I will remediate the defects at no additional charge during the designated sprint acceptance window. Quality assurance corrections are prioritized to ensure specifications are fulfilled before proceeding to subsequent milestones.
        </p>

        <h2>5. Retainers &amp; Maintenance Subscriptions</h2>
        <p>
          Dedicated DevOps maintenance retainers, cloud monitoring agreements, and technical support plans reserve engineering availability for the billed calendar period. You may cancel your subscription at any time; cancellation halts subsequent renewal periods, while current active periods are not refunded.
        </p>

        <h2>6. Refund Submission Process</h2>
        <p>
          To submit a formal refund or adjustment inquiry:
        </p>
        <ul>
          <li>Email our finance team at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.</li>
          <li>Include your official <strong>Invoice Number (e.g. INV-2026-XXX)</strong> and organization name.</li>
          <li>State the specific milestone, product license, or service scope under review and detailed justification.</li>
        </ul>

        <h2>7. Processing &amp; Bank Reversal Times</h2>
        <p>
          Approved refund adjustments are processed within <strong>5 to 10 business days</strong>. Funds are refunded via the original payment rail (JazzCash, EasyPaisa, NayaPay, local bank IBAN wire, or Stripe), subject to banking clearing schedules.
        </p>

        <h2>8. Inquiries &amp; Dispute Resolution</h2>
        <p>
          If you have questions regarding this policy or need clarification on a billing statement, please contact{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalPageLayout>
    </>
  )
}
