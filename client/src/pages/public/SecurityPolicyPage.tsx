import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function SecurityPolicyPage() {
  return (
    <>
      <SEO {...PAGE_SEO.securityPolicy} />
      <LegalPageLayout
        title="Security Policy"
        subtitle="Technical architecture, infrastructure hardening, and access safeguards implemented by ORBIT-I Private Limited."
        lastUpdated="September 2026"
      >
        <p>
          ORBIT-I Private Limited maintains disciplined administrative, technical, and physical safeguards designed to protect our web infrastructure, internal microservices, client databases, and proprietary source repositories against unauthorized access, disclosure, or operational compromise.
        </p>

        <h2>1. Security Architecture &amp; Controls</h2>
        <p>
          <strong>Defense-in-Depth Implementation:</strong> Our platforms enforce end-to-end TLS 1.3 cryptographic transport, least-privilege role-based access control (RBAC), bcrypt credential hashing with work-factor salt, automatic IP rate limiting, automated SQL sanitization, and isolated production container clusters.
        </p>

        <h2>2. Client Account Protection</h2>
        <p>
          We mandate robust password standards and session invalidation upon security events. We recommend that clients:
        </p>
        <ul>
          <li>Never share administrative or client credentials across multiple users.</li>
          <li>Promptly report suspected unauthorized logins or lost credential vectors.</li>
          <li>Utilize unique corporate credentials disconnected from personal accounts.</li>
        </ul>

        <h2>3. Infrastructure &amp; Data Handling</h2>
        <p>
          Internal access to client source code, databases, and deployment environments is strictly segregated. Engineers and project leads are provisioned access on a time-bound, just-in-time principle. Continuous automated offsite database snapshots and disaster recovery warm-standbys are maintained to ensure high business continuity.
        </p>

        <h2>4. Third-Party Hosting &amp; Sub-Processors</h2>
        <p>
          Our cloud compute, CDN, and payment processing nodes reside within Tier-3 and Tier-4 compliant datacenters with ISO/IEC 27001 and SOC 2 certifications. We audit third-party providers on a recurring schedule to verify continuous compliance with global data security standards.
        </p>

        <h2>5. Responsible Vulnerability Disclosure</h2>
        <p>
          <strong>Bug Bounty &amp; Vulnerability Reporting:</strong> Security researchers who discover potential vulnerabilities are invited to report their findings responsibly to{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          . Please include reproducible proof-of-concept steps. We commit to acknowledging receipt within 24 hours and never taking legal action against researchers acting in good faith without data exfiltration.
        </p>

        <h2>6. Continuous Auditing &amp; Revisions</h2>
        <p>
          Software systems require continuous vigilance. We periodically commission external static code analysis, dependency audits, and penetration tests. This policy is updated as emerging threat vectors, regulatory guidelines, and technical controls evolve.
        </p>
      </LegalPageLayout>
    </>
  )
}
