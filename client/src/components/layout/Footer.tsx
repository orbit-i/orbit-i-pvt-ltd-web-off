import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { SocialLinks } from '@/components/social/SocialLinks'
import { FOOTER_LINKS, ROUTES } from '@/constants'
import { OFFICE_LOCATION, COMPLIANCE_STATEMENT } from '@/config/companyInfo'
import { CONTACT_EMAIL, CONTACT_PHONE, WEBSITE_URL } from '@/config/socialLinks'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="container-app grid grid-cols-2 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-6">
        <div className="col-span-2 flex flex-col gap-3">
          <Logo />
          <p className="max-w-xs text-sm leading-relaxed text-[var(--color-text-secondary)]">
            ORBIT-I Private Limited builds custom software, cloud platforms and digital products for
            businesses that need to move fast without breaking things.
          </p>
          <div className="flex flex-col gap-1 text-sm text-[var(--color-text-secondary)]">
            <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-blue-600 transition-colors">
              {CONTACT_EMAIL}
            </a>
            <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className="hover:text-blue-600 transition-colors">
              {CONTACT_PHONE}
            </a>
            <a href={WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
              {WEBSITE_URL}
            </a>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">{OFFICE_LOCATION}</p>
          <p className="max-w-sm text-xs leading-relaxed text-[var(--color-text-muted)]">{COMPLIANCE_STATEMENT}</p>
          <SocialLinks className="mt-2" />
        </div>

        <FooterColumn title="Navigation" links={FOOTER_LINKS.navigation} />
        <FooterColumn title="Client" links={FOOTER_LINKS.client} />
        <FooterColumn title="Company" links={FOOTER_LINKS.company} />
        <FooterColumn title="Legal" links={FOOTER_LINKS.legal} />
      </div>

      <div className="border-t border-[var(--color-border)] py-6">
        <div className="container-app flex flex-col items-center justify-between gap-3 text-xs text-[var(--color-text-muted)] sm:flex-row">
          <p>© {year} ORBIT-I Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to={ROUTES.privacy} className="hover:text-[var(--color-text-secondary)]">
              Privacy Policy
            </Link>
            <Link to={ROUTES.refundPolicy} className="hover:text-[var(--color-text-secondary)]">
              Refund Policy
            </Link>
            <Link to={ROUTES.terms} className="hover:text-[var(--color-text-secondary)]">
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, links }: { title: string; links: readonly { label: string; to: string }[] }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">{title}</h4>
      <ul className="mt-4 flex flex-col gap-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-[var(--color-text-secondary)] transition-colors hover:text-blue-600"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
