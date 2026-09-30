import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function TermsPage() {
  return (
    <>
      <SEO {...PAGE_SEO.terms} />
      <LegalPageLayout
        title="Terms & Conditions"
        subtitle="Standard terms of engagement, contractual agreements, and platform usage conditions for ORBIT-I Private Limited."
        lastUpdated="August 2026"
      >
        <p>
          These Terms &amp; Conditions govern your access to and use of the website, client portal, software products, and consulting engagements provided by ORBIT-I Private Limited ("ORBIT-I", "we", "us"). Please review these terms carefully before engaging our services or registering an account.
        </p>

        <h2>1. Introduction &amp; Binding Agreement</h2>
        <p>
          By accessing this website, creating a client account, placing an order, or executing a proposal or statement of work with ORBIT-I, you signify your full agreement to these terms. If you are entering into this agreement on behalf of a company or legal entity, you represent that you possess lawful authority to bind that entity.
        </p>

        <h2>2. Acceptable Platform Usage</h2>
        <p>
          You agree to utilize our website, client platform, and API infrastructure exclusively for legitimate commercial and project management purposes. You agree not to:
        </p>
        <ul>
          <li>Probe, scan, or reverse engineer platform security safeguards or API endpoints without written consent.</li>
          <li>Introduce malicious scripts, automated crawlers with abusive throughput, or denial-of-service traffic.</li>
          <li>Misrepresent your identity, impersonate another entity, or attempt unauthorized access to other clients' data.</li>
        </ul>

        <h2>3. Services, Milestones &amp; SOWs</h2>
        <p>
          <strong>Contractual Precedence:</strong> ORBIT-I provides custom enterprise software engineering, cloud architecture, and product development under formal Statements of Work (SOW) or signed Service Agreements. Where a signed agreement contains terms that directly conflict with these general terms, the provisions of the signed agreement shall prevail.
        </p>

        <h2>4. Client Accounts &amp; Access Controls</h2>
        <p>
          Client portal accounts are granted specifically for tracking sprint progress, managing verified invoices, reviewing source milestones, and raising support tickets. You are solely responsible for maintaining strong credential security and for all actions undertaken under your authenticated credentials.
        </p>

        <h2>5. Intellectual Property Rights</h2>
        <p>
          All trademarks, corporate marks, site copy, graphics, and proprietary software frameworks showcased on this public website remain the exclusive intellectual property of ORBIT-I Private Limited.
        </p>
        <p>
          For custom client engagements, ownership of custom-developed codebase and deliverables transitions to the client upon full settlement of contractually agreed milestone invoices, subject to third-party open-source license agreements.
        </p>

        <h2>6. Fees, Invoicing &amp; Taxes</h2>
        <p>
          Fees for digital products and engineering milestones are invoiced in PKR, USD, or mutually agreed currencies. Clients are responsible for applicable sales tax, withholding deductions where applicable with valid tax exemption certificates, and banking intermediary fees.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          <strong>Liability Disclaimer:</strong> To the maximum extent permitted by applicable law, ORBIT-I Private Limited and its directors, engineers, and affiliates shall not be liable for indirect, punitive, or consequential damages, loss of revenue, or operational downtime arising from website usage or external cloud provider interruptions.
        </p>

        <h2>8. Governing Law &amp; Jurisdiction</h2>
        <p>
          <strong>Statutory Jurisdiction:</strong> These Terms &amp; Conditions are governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>. Any legal dispute or proceeding arising out of or in connection with these terms shall fall under the exclusive jurisdiction of the competent courts of Islamabad, Pakistan.
        </p>

        <h2>9. Legal Questions &amp; Notices</h2>
        <p>
          Official legal notices or inquiries regarding contract execution may be served electronically to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>{' '}
          or addressed to our registered corporate office.
        </p>
      </LegalPageLayout>
    </>
  )
}
