import { LegalPageLayout } from '@/components/legal/LegalPageLayout'
import { SEO } from '@/components/seo/SEO'
import { PAGE_SEO } from '@/config/seo'
import { CONTACT_EMAIL } from '@/config/socialLinks'

export function WebsiteDisclaimerPage() {
  return (
    <>
      <SEO {...PAGE_SEO.disclaimer} />
      <LegalPageLayout
        title="Website Disclaimer"
        subtitle="General informational scope, professional advice disclaimer, and liability boundaries for ORBIT-I Private Limited."
        lastUpdated="September 2026"
      >
        <p>
          The information, technical articles, architecture overviews, and case studies published on this website are provided by ORBIT-I Private Limited ("ORBIT-I", "we", "us") for general informational, educational, and initial scoping purposes only.
        </p>

        <h2>1. No Professional Advice Statement</h2>
        <p>
          <strong>Not Legal or Financial Advice:</strong> Content presented on this website does not constitute formal legal, taxation, securities, or financial advice. Clients and visitors must consult licensed attorneys, registered tax advisors, or financial professionals appropriate to their specific enterprise jurisdiction before executing contractual or financial decisions.
        </p>

        <h2>2. Technical Accuracy &amp; Availability</h2>
        <p>
          While ORBIT-I strives to ensure the technical rigor and accuracy of descriptions, product features, and pricing structures on this website, technology stacks and software offerings change rapidly. We provide no guarantee that informational content is completely up-to-date, comprehensive, or free from typographical nuances. Service specifications may be altered without prior public announcement.
        </p>

        <h2>3. Case Studies &amp; Performance Projections</h2>
        <p>
          Any case studies, client testimonials, benchmarks, or efficiency metrics cited on our website represent historical client engagements under specific conditions. They do not constitute an explicit warranty or guarantee of identical results for future software engagements. Final system performance depends upon architecture scopes, client team participation, and hosting environments.
        </p>

        <h2>4. Third-Party Links &amp; Integrations</h2>
        <p>
          Our platform may link to external APIs, documentation portals, or third-party cloud tools for illustrative convenience. ORBIT-I does not control or assume liability for the data governance, uptime, privacy practices, or content integrity of third-party platforms.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted under applicable law, ORBIT-I Private Limited shall not be held liable for any direct, indirect, incidental, or consequential damages resulting from reliance on website materials. Formal commitments are strictly bounded by executed Statements of Work (SOWs).
        </p>

        <h2>6. Clarifications &amp; Contact</h2>
        <p>
          For questions or formal clarifications regarding this disclaimer, please reach out to our legal liaison at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </LegalPageLayout>
    </>
  )
}
