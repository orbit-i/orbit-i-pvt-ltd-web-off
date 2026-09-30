import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function PrivacyPolicyPage() {
  return (
    <>
      <SEO {...PAGE_SEO.privacyPolicy} />
      <LegalPageLayout
        title="Privacy Policy"
        subtitle="How ORBIT-I Private Limited collects, safeguards, and utilizes client, enterprise, and visitor data across our digital platforms."
        lastUpdated="August 2026"
      >
        <p>
          ORBIT-I Private Limited ("ORBIT-I", "we", "us") respects your privacy. This policy describes, in transparent terms, the categories of information we collect through this website, client portal, and software services, and how we handle and protect that data in compliance with applicable law.
        </p>

        <h2>1. Introduction &amp; Scope</h2>
        <p>
          This Privacy Policy applies to all visitors, registered clients, partners, and applicants who access the ORBIT-I website, client portal, API endpoints, or communications infrastructure. By interacting with our platforms, you acknowledge and agree to the information practices described in this policy.
        </p>

        <h2>2. Information We Collect</h2>
        <p>
          We collect only information reasonably necessary to conduct business, fulfill engineering milestones, process payments, and support clients. Information is gathered through direct submissions, automated platform logging, and authorized third-party service providers.
        </p>

        <h2>3. Categories of Personal Information</h2>
        <ul>
          <li><strong>Identity and Contact:</strong> Full legal name, official email, phone number, organization name, billing address, and account credentials.</li>
          <li><strong>Account &amp; Project Operations:</strong> Cryptographically hashed credentials, order records, architectural specifications, project milestones, support tickets, and direct messages.</li>
          <li><strong>Financial &amp; Transaction Details:</strong> Invoices, payment timestamps, transaction IDs, payment gateway references (e.g. JazzCash, EasyPaisa, NayaPay, Bank Wire, Stripe). <em>We never record or store raw card numbers, CVVs, or online banking passwords.</em></li>
          <li><strong>Technical &amp; Telemetry Data:</strong> IP addresses, browser fingerprint, operating system, session diagnostics, performance metrics, and security audit logs.</li>
          <li><strong>Recruitment &amp; Traineeship Data:</strong> Resumes, portfolios, academic credentials, GitHub/LinkedIn references, and interview evaluations.</li>
        </ul>

        <h2>4. Payment Safety &amp; Anti-Fraud Guidelines</h2>
        <p>
          <strong>Critical Payment Security Notice:</strong> Never send credit or debit card numbers, CVV codes, online-banking passwords, OTP codes, or cryptocurrency private keys to ORBIT-I through email, WhatsApp, or contact forms. All payments must strictly be executed through our official portal checkout or verifiable invoices with designated corporate bank accounts.
        </p>

        <h2>5. How We Use Information</h2>
        <p>
          We utilize collected information solely to provide, maintain, and protect our engineering solutions:
        </p>
        <ul>
          <li>Authenticating user access to client dashboard, source code artifacts, and project milestones.</li>
          <li>Processing orders, issuing tax-compliant invoices, and reconciling payments.</li>
          <li>Delivering dedicated technical support, sprint updates, and emergency maintenance notices.</li>
          <li>Preventing distributed denial-of-service (DDoS) attacks, brute-force incursions, and fraudulent access.</li>
          <li>Meeting corporate reporting requirements under SECP and FBR statutory obligations.</li>
        </ul>
        <p>
          <strong>ORBIT-I does not monetize, sell, or rent your personal information to data brokers or third-party advertisers.</strong>
        </p>

        <h2>6. Cookies &amp; Local Storage</h2>
        <p>
          Our platform uses session cookies and secure local storage strictly for essential operations: preserving authentication sessions, remembering interface preferences, and telemetry security. You can adjust your browser settings to restrict cookies, although certain authenticated client features may become unavailable.
        </p>

        <h2>7. Data Storage &amp; Cryptographic Security</h2>
        <p>
          We apply enterprise-grade technical safeguards including TLS 1.3 encryption in transit, Argon2/bcrypt password hashing, least-privilege role-based access control (RBAC), and automated database backups. While no transmission method across the internet is infallible, we continuously monitor and patch vulnerabilities.
        </p>

        <h2>8. Third-Party Service Providers</h2>
        <p>
          We collaborate with vetted enterprise infrastructure providers (such as cloud hosting, transactional mail systems, and financial payment gateways) under strict confidentiality and data protection agreements.
        </p>

        <h2>9. User Rights &amp; Data Control</h2>
        <p>
          You retain full rights to request an export of your personal data, seek rectification of erroneous information, or request account closure, subject to retention requirements imposed by tax and corporate regulations.
        </p>

        <h2>10. Corporate &amp; Legal Registration</h2>
        <p>
          ORBIT-I Private Limited is an incorporated entity under the Companies Act with the <strong>Securities and Exchange Commission of Pakistan (SECP)</strong>, fully registered with the <strong>Federal Board of Revenue (FBR)</strong> and affiliated with the <strong>Pakistan Software Export Board (PSEB)</strong>.
        </p>

        <h2>11. Privacy Contact &amp; Grievances</h2>
        <p>
          For privacy inquiries, data rectification, or compliance questions, please contact our Data Protection Officer at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalPageLayout>
    </>
  )
}
