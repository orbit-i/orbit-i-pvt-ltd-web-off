import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
import { initMySQL, getPool, execute } from '../config/mysql'

async function seedMySQL() {
  console.log('[seed-mysql] Starting Hostinger MySQL database seeding...')

  const connected = await initMySQL()
  if (!connected) {
    console.error('[seed-mysql] ERROR: Could not connect to MySQL. Please ensure MySQL is running and DB_HOST, DB_USER, DB_PASSWORD, DB_NAME are configured in server/.env')
    process.exit(1)
  }

  const pool = getPool()
  if (!pool) {
    console.error('[seed-mysql] ERROR: No MySQL pool available.')
    process.exit(1)
  }

  // 1. Run schema.sql
  const schemaPath = path.join(__dirname, '../../database/schema.sql')
  console.log(`[seed-mysql] Reading schema from: ${schemaPath}`)
  const sql = fs.readFileSync(schemaPath, 'utf8')

  // Split statements by semicolon
  const statements = sql
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith('--'))

  for (const statement of statements) {
    try {
      await pool.query(statement)
    } catch (err: any) {
      // Ignore table exists or safe warnings
      if (!err.message?.includes('already exists')) {
        console.warn(`[seed-mysql] Statement notice: ${err.message}`)
      }
    }
  }
  console.log('[seed-mysql] Database tables created / verified successfully.')

  // 2. Hash default passwords
  const adminPasswordHash = await bcrypt.hash('OrbitAdmin#2026', 10)
  const superPasswordHash = await bcrypt.hash('OrbitSuper#2026', 10)
  const clientPasswordHash = await bcrypt.hash('ClientPass#2026', 10)

  // 3. Seed users
  await execute(
    `INSERT INTO users (email, password_hash, full_name, role, phone, company)
     VALUES 
      ('superadmin@orbit-i.com', ?, 'ORBIT-I Super Admin', 'super_admin', '+92 3190375751', 'ORBIT-I Private Limited'),
      ('admin@orbit-i.com', ?, 'ORBIT-I System Admin', 'admin', '+92 3190375751', 'ORBIT-I Private Limited'),
      ('client@apexsolutions.com', ?, 'Apex Enterprise Client', 'client', '+92 300 1234567', 'Apex Solutions')
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), role = VALUES(role)`,
    [superPasswordHash, adminPasswordHash, clientPasswordHash]
  )
  console.log('[seed-mysql] Default users seeded (superadmin@orbit-i.com, admin@orbit-i.com, client@apexsolutions.com).')

  // 4. Seed intern records
  await execute(
    `INSERT INTO interns (certificate_id, full_name, email, phone, department, role, start_date, end_date, duration, completion_status, certificate_status, grade_performance, verification_code, issue_date, remarks)
     VALUES 
      ('ORBIT-I/INT/2026/01', 'Muhammad Zeeshan', 'zeeshan.dev@gmail.com', '+92 300 1234567', 'Full Stack Development', 'Full Stack Engineering Intern', '2026-01-01', '2026-03-25', '3 Months', 'completed', 'valid', 'Distinction (A+)', 'ORB-SEC-7890-VLD-2026', '2026-03-25', 'Demonstrated outstanding architectural skills in React, Node.js, and cloud deployment pipelines.'),
      ('ORBIT-I/INT/2026/02', 'Ayesha Khan', 'ayesha.ai@gmail.com', '+92 301 7654321', 'Artificial Intelligence & Data', 'AI / ML Research Intern', '2026-01-01', '2026-03-25', '3 Months', 'completed', 'valid', 'Grade A', 'ORB-SEC-7891-VLD-2026', '2026-03-25', 'Successfully trained and evaluated NLP model pipelines with high precision.'),
      ('ORBIT-I/INT/2026/03', 'Hamza Farooq', 'hamza.uiux@gmail.com', '+92 312 9876543', 'UI/UX & Product Design', 'Product Design Intern', '2026-02-01', '2026-04-30', '3 Months', 'in_progress', 'valid', 'In Progress (A)', 'ORB-SEC-7892-PRG-2026', '2026-02-01', 'Currently working on enterprise corporate design systems and client portals.')
     ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), certificate_status = VALUES(certificate_status)`
  )
  console.log('[seed-mysql] Seed interns registered.')

  // 5. Seed payment gateway settings
  const defaultGateways = [
    {
      key: 'jazzcash',
      title: 'JazzCash',
      active: 1,
      test: 1,
      json: JSON.stringify({
        merchantId: 'ORBIT_JC_SANDBOX_01',
        password: '••••••••',
        salt: '••••••••',
        returnUrl: 'https://orbit-i.tech/client/invoices',
      }),
    },
    {
      key: 'easypaisa',
      title: 'EasyPaisa',
      active: 1,
      test: 1,
      json: JSON.stringify({
        storeId: 'ORBIT_EP_SANDBOX_01',
        hashKey: '••••••••',
        returnUrl: 'https://orbit-i.tech/client/invoices',
      }),
    },
    {
      key: 'nayapay',
      title: 'NayaPay',
      active: 1,
      test: 1,
      json: JSON.stringify({
        merchantId: 'ORBIT_NP_001',
        clientId: 'sandbox_orbit_nayapay',
      }),
    },
    {
      key: 'stripe',
      title: 'Stripe (Cards)',
      active: 1,
      test: 1,
      json: JSON.stringify({
        publishableKey: 'pk_test_51MockOrbitStripeKeyForSandboxOnly',
        secretKey: 'sk_test_••••••••',
      }),
    },
    {
      key: 'bank_transfer',
      title: 'Direct Bank Wire Transfer',
      active: 1,
      test: 0,
      json: JSON.stringify({
        bankName: 'Bank Alfalah / Meezan Bank Islamic',
        accountTitle: 'ORBIT-I PRIVATE LIMITED',
        accountNumber: '0234-1008765432',
        iban: 'PK36ALFH0234100876543201',
        swiftCode: 'ALFHPKKA',
        branch: 'Corporate Banking Branch',
        instruction: 'Please transfer the exact invoice amount and upload screenshot / proof or enter transaction reference for instant reconciliation.',
      }),
    },
  ]

  for (const gw of defaultGateways) {
    await execute(
      `INSERT INTO payment_gateway_settings (gateway_key, title, is_active, is_test_mode, config_json)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE title = VALUES(title), is_active = VALUES(is_active)`,
      [gw.key, gw.title, gw.active, gw.test, gw.json]
    )
  }
  console.log('[seed-mysql] Payment gateway settings configured.')

  // 6. Seed corporate team members
  await execute(`
    INSERT INTO team_members (name, designation, department, bio, skills_json, linkedin_url, order_index, is_published)
    VALUES 
      ('Muhammad Saad', 'Chief Executive Officer & Founder', 'Executive Leadership', 'Technologist and executive steering ORBIT-I Private Limited. Focused on building high-performance enterprise systems and software solutions.', '["Enterprise Architecture", "Strategic Growth", "Cloud Operations"]', 'https://www.linkedin.com/company/orbit-i-private-limited/', 1, 1),
      ('Abdul Rehman', 'Chief Technology Officer', 'Engineering Leadership', 'Lead architect specializing in distributed systems, high-concurrency microservices, and secure relational database design.', '["TypeScript", "Node.js", "MySQL Optimization", "System Security"]', 'https://www.linkedin.com/company/orbit-i-private-limited/', 2, 1),
      ('Syeda Fatima Zahra', 'Principal AI & Machine Learning Engineer', 'AI Research & Data', 'Specialist in applied Natural Language Processing, computer vision, and predictive analytics.', '["Python", "PyTorch", "Transformers", "FastAPI"]', 'https://www.linkedin.com/company/orbit-i-private-limited/', 3, 1),
      ('Bilal Ahmed Khan', 'Lead Full-Stack Solutions Engineer', 'Full Stack Engineering', 'Full-stack specialist with deep expertise in modern React, Vite, Node.js REST APIs, and financial transaction processing.', '["React 19", "Node/Express", "Payment Gateways"]', 'https://www.linkedin.com/company/orbit-i-private-limited/', 4, 1)
    ON DUPLICATE KEY UPDATE name = VALUES(name)
  `)
  console.log('[seed-mysql] Corporate team members seeded.')

  // 7. Seed corporate partners
  await execute(`
    INSERT INTO partners (name, logo_url, website_url, category, description, order_index, is_featured)
    VALUES
      ('JazzCash Merchant Solutions', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=200&q=80', 'https://www.jazzcash.com.pk/', 'fintech', 'Direct mobile wallet and payment gateway merchant integration.', 1, 1),
      ('EasyPaisa Business Gateways', 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=200&q=80', 'https://easypaisa.com.pk/', 'fintech', 'Instant OTC and direct wallet checkout integration.', 2, 1),
      ('Meezan Bank Limited', 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=200&q=80', 'https://www.meezanbank.com/', 'enterprise', 'Corporate banking partner for verified IBAN wire settlements.', 3, 1),
      ('Hostinger Cloud Infrastructure', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=200&q=80', 'https://www.hostinger.com/', 'cloud', 'High-availability Node.js runtime and MySQL cloud cluster hosting partner.', 4, 1)
    ON DUPLICATE KEY UPDATE name = VALUES(name)
  `)
  console.log('[seed-mysql] Corporate partners seeded.')

  console.log('\n[seed-mysql] SUCCESS! All MySQL tables and seed data are ready for Hostinger.')
  process.exit(0)
}

seedMySQL().catch((err) => {
  console.error('[seed-mysql] Seeding failed:', err)
  process.exit(1)
})
