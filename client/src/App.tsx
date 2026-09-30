import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { PublicLayout } from '@/layouts/PublicLayout'
import { ClientDashboardLayout } from '@/layouts/ClientDashboardLayout'
import { AdminDashboardLayout } from '@/layouts/AdminDashboardLayout'
import { RoleRoute, GuestOnlyRoute, ContentRoleRoute, SensitiveRoleRoute } from '@/routes/guards'
import { ROUTES } from '@/constants'

import { HomePage } from '@/pages/public/HomePage'
import { AboutPage } from '@/pages/public/AboutPage'
import { ServicesPage } from '@/pages/public/ServicesPage'
import { ServiceDetailPage } from '@/pages/public/ServiceDetailPage'
import { ProductsPage } from '@/pages/public/ProductsPage'
import { ProductDetailPage } from '@/pages/public/ProductDetailPage'
import { CaseStudiesPage, CaseStudyDetailPage } from '@/pages/public/CaseStudiesPages'
import { BlogPage, BlogPostPage, BlogTaxonomyPage } from '@/pages/public/BlogPages'
import { TeamPage } from '@/pages/public/TeamPage'
import { CareersPage, JobDetailPage } from '@/pages/public/CareersPages'
import { ContactPage } from '@/pages/public/ContactPage'
import { InternVerificationPage } from '@/pages/public/InternVerificationPage'
import { PrivacyPolicyPage } from '@/pages/public/PrivacyPolicyPage'
import { RefundPolicyPage } from '@/pages/public/RefundPolicyPage'
import { TermsPage } from '@/pages/public/TermsPage'
import { SecurityPolicyPage } from '@/pages/public/SecurityPolicyPage'
import { WebsiteDisclaimerPage } from '@/pages/public/WebsiteDisclaimerPage'
import { NotFoundPage } from '@/pages/public/NotFoundPage'

import { LoginPage } from '@/pages/public/auth/LoginPage'
import { AdminLoginPage } from '@/pages/public/auth/AdminLoginPage'
import { RegisterPage } from '@/pages/public/auth/RegisterPage'
import { ForgotPasswordPage, ResetPasswordPage } from '@/pages/public/auth/ResetPasswordPages'

import { ClientOverviewPage } from '@/pages/client/ClientOverviewPage'
import { ClientOrdersPage } from '@/pages/client/ClientOrdersPage'
import { ClientProjectsPage, ClientProjectDetailPage } from '@/pages/client/ClientProjectsPages'
import { ClientProfilePage, ClientSettingsPage, ClientSupportPage, ClientInvoicesPage } from '@/pages/client/ClientMiscPages'

import { AdminOverviewPage } from '@/pages/admin/AdminOverviewPage'
import { AdminBlogPage } from '@/pages/admin/AdminBlogPage'
import { AdminClientsPage } from '@/pages/admin/AdminClientsPage'
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage'
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage'
import { AdminProjectsPage } from '@/pages/admin/AdminProjectsPage'
import { AdminInternsPage } from '@/pages/admin/AdminInternsPage'
import { AdminPaymentGatewaysPage } from '@/pages/admin/AdminPaymentGatewaysPage'
import { PartnersPage } from '@/pages/public/PartnersPage'
import { AdminPartnersPage } from '@/pages/admin/AdminPartnersPage'
import { AdminCmsPages } from '@/pages/admin/AdminCmsPages'
import { AdminTeamPage } from '@/pages/admin/AdminTeamPage'
import {
  AdminCareersPage,
  AdminApplicationsPage,
  AdminLeadsPage,
  AdminCaseStudiesPage,
  AdminCategoriesPage,
  AdminTagsPage,
  AdminTestimonialsPage,
  AdminSettingsPage,
  AdminSeoDashboardPage,
} from '@/pages/admin/AdminMiscPages'
import { AdminSupportPage } from './pages/admin/AdminSupportPage'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public site */}
            <Route element={<PublicLayout />}>
              <Route path={ROUTES.home} element={<HomePage />} />
              <Route path={ROUTES.about} element={<AboutPage />} />
              <Route path={ROUTES.services} element={<ServicesPage />} />
              <Route path="/services/:slug" element={<ServiceDetailPage />} />
              <Route path={ROUTES.products} element={<ProductsPage />} />
              <Route path="/products/:slug" element={<ProductDetailPage />} />
              <Route path={ROUTES.caseStudies} element={<CaseStudiesPage />} />
              <Route path="/case-studies/:slug" element={<CaseStudyDetailPage />} />
              <Route path={ROUTES.blog} element={<BlogPage />} />
              <Route path="/blog/category/:slug" element={<BlogTaxonomyPage type="category" />} />
              <Route path="/blog/tag/:slug" element={<BlogTaxonomyPage type="tag" />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path={ROUTES.team} element={<TeamPage />} />
              <Route path={ROUTES.partners} element={<PartnersPage />} />
              <Route path={ROUTES.careers} element={<CareersPage />} />
              <Route path="/careers/:id" element={<JobDetailPage />} />
              <Route path={ROUTES.contact} element={<ContactPage />} />
              <Route path={ROUTES.internVerification} element={<InternVerificationPage />} />
              <Route path="/verify-intern" element={<InternVerificationPage />} />
              <Route path={ROUTES.privacy} element={<PrivacyPolicyPage />} />
              <Route path={ROUTES.refundPolicy} element={<RefundPolicyPage />} />
              <Route path={ROUTES.terms} element={<TermsPage />} />
              <Route path={ROUTES.securityPolicy} element={<SecurityPolicyPage />} />
              <Route path={ROUTES.disclaimer} element={<WebsiteDisclaimerPage />} />

              <Route path={ROUTES.login} element={<GuestOnlyRoute><LoginPage /></GuestOnlyRoute>} />
              <Route path={ROUTES.register} element={<GuestOnlyRoute><RegisterPage /></GuestOnlyRoute>} />
              <Route path={ROUTES.forgotPassword} element={<GuestOnlyRoute><ForgotPasswordPage /></GuestOnlyRoute>} />
              <Route path={ROUTES.resetPassword} element={<GuestOnlyRoute><ResetPasswordPage /></GuestOnlyRoute>} />
            </Route>

            {/* Standalone Secret Admin & SuperAdmin Security Gate */}
            <Route path={ROUTES.adminLogin} element={<AdminLoginPage />} />
            <Route path="/admin-gate" element={<AdminLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Client dashboard */}
            <Route
              element={
                <RoleRoute roles={['client']}>
                  <ClientDashboardLayout />
                </RoleRoute>
              }
            >
              <Route path={ROUTES.clientDashboard} element={<ClientOverviewPage />} />
              <Route path={ROUTES.clientOrders} element={<ClientOrdersPage />} />
              <Route path={ROUTES.clientProjects} element={<ClientProjectsPage />} />
              <Route path="/client/projects/:id" element={<ClientProjectDetailPage />} />
              <Route path={ROUTES.clientProfile} element={<ClientProfilePage />} />
              <Route path={ROUTES.clientSettings} element={<ClientSettingsPage />} />
              <Route path={ROUTES.clientSupport} element={<ClientSupportPage />} />
              <Route path={ROUTES.clientInvoices} element={<ClientInvoicesPage />} />
            </Route>

            {/* Sensitive admin dashboard — editors must not access operational data. */}
            <Route
              element={
                <SensitiveRoleRoute>
                  <AdminDashboardLayout />
                </SensitiveRoleRoute>
              }
            >
              <Route path={ROUTES.adminDashboard} element={<AdminOverviewPage />} />
              <Route path={ROUTES.adminInterns} element={<AdminInternsPage />} />
              <Route path={ROUTES.adminPaymentGateways} element={<AdminPaymentGatewaysPage />} />
              <Route path={ROUTES.adminPartners} element={<AdminPartnersPage />} />
              <Route path={ROUTES.adminCmsPages} element={<AdminCmsPages />} />
              <Route path={ROUTES.adminClients} element={<AdminClientsPage />} />
              <Route path={ROUTES.adminProducts} element={<AdminProductsPage />} />
              <Route path={ROUTES.adminOrders} element={<AdminOrdersPage />} />
              <Route path={ROUTES.adminProjects} element={<AdminProjectsPage />} />
              <Route path={ROUTES.adminCareers} element={<AdminCareersPage />} />
              <Route path={ROUTES.adminApplications} element={<AdminApplicationsPage />} />
              <Route path={ROUTES.adminLeads} element={<AdminLeadsPage />} />
              <Route path={ROUTES.adminSupport} element={<AdminSupportPage />} />
              <Route path={ROUTES.adminTestimonials} element={<AdminTestimonialsPage />} />
              <Route path={ROUTES.adminTeam} element={<AdminTeamPage />} />
              <Route path={ROUTES.adminSettings} element={<AdminSettingsPage />} />
            </Route>

            {/* Content administration — editors and SEO managers can manage content workflows without sensitive admin access. */}
            <Route
              element={
                <ContentRoleRoute>
                  <AdminDashboardLayout />
                </ContentRoleRoute>
              }
            >
              <Route path={ROUTES.adminSeoDashboard} element={<AdminSeoDashboardPage />} />
              <Route path={ROUTES.adminCaseStudies} element={<AdminCaseStudiesPage />} />
              <Route path={ROUTES.adminBlog} element={<AdminBlogPage />} />
              <Route path={ROUTES.adminCategories} element={<AdminCategoriesPage />} />
              <Route path={ROUTES.adminTags} element={<AdminTagsPage />} />
            </Route>

            {/* Global catch-all 404 handler */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
