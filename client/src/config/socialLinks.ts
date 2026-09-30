import { Mail, Phone, Globe } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaTiktok } from 'react-icons/fa6'
import type { ElementType } from 'react'

export interface SocialLink {
  name: string
  url: string
  icon: ElementType
}

export const CONTACT_EMAIL = 'contactus@orbit-i.tech'
export const CONTACT_PHONE = '+92 3190375751'
export const WEBSITE_URL = 'https://orbit-i.tech/'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/orbit-i-private-limited/'
export const WHATSAPP_CHANNEL_URL = 'https://whatsapp.com/channel/0029Vb8I4kvJJhzUXqEnB50J'
export const TIKTOK_URL = 'https://www.tiktok.com/@orbitiprivatelimited'
export const FACEBOOK_URL = 'https://www.facebook.com/orbitiprivatelimited'
export const INSTAGRAM_URL = 'https://www.instagram.com/orbiti_private_limited?utm_source=qr&stkn=ZnE1c25zdG96Y3Zp'

/**
 * Official social and contact links for ORBIT-I Private Limited.
 */
export const socialLinks: SocialLink[] = [
  { name: 'LinkedIn', url: LINKEDIN_URL, icon: FaLinkedin },
  { name: 'WhatsApp', url: WHATSAPP_CHANNEL_URL, icon: FaWhatsapp },
  { name: 'Facebook', url: FACEBOOK_URL, icon: FaFacebook },
  { name: 'Instagram', url: INSTAGRAM_URL, icon: FaInstagram },
  { name: 'TikTok', url: TIKTOK_URL, icon: FaTiktok },
  { name: 'Email', url: `mailto:${CONTACT_EMAIL}`, icon: Mail },
  { name: 'Phone', url: `tel:${CONTACT_PHONE.replace(/\s+/g, '')}`, icon: Phone },
  { name: 'Website', url: WEBSITE_URL, icon: Globe },
]
