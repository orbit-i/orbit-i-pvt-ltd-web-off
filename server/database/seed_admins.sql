-- ==============================================================================
-- ORBIT-I Private Limited — SuperAdmin & Admin Credentials Setup Script
-- Compatible with: MySQL 8.x / MariaDB / Hostinger phpMyAdmin
-- ==============================================================================

INSERT INTO `users` (`email`, `password_hash`, `full_name`, `role`, `is_active`, `phone`, `company`)
VALUES 
  ('ab.samad@orbit-i.tech', '$2b$10$ymIsbnSNdmWpDn5nn1HOweN0/X.YTIsambUf9JcI6o7GuXiGAoLX.', 'Abdul Samad', 'super_admin', 1, '+92 3190375751', 'ORBIT-I Private Limited'),
  ('maria.almani@orbit-i.tech', '$2b$10$b/JeTp.rHDLl9E16j3teZOI/6oIE.UEMsYMUG9S6MzzbGaJpHYbMW', 'Maria Almani', 'super_admin', 1, '+92 3190375751', 'ORBIT-I Private Limited'),
  ('m.muneeb@orbit-i.tech', '$2b$10$NFMc1FMZpcp98SElU7zgMuzJhL7c0t38.xbC0JjDdAD1jajv28dqC', 'Muhammad Muneeb', 'super_admin', 1, '+92 3190375751', 'ORBIT-I Private Limited')
ON DUPLICATE KEY UPDATE 
  `password_hash` = VALUES(`password_hash`),
  `role` = 'super_admin',
  `is_active` = 1;
