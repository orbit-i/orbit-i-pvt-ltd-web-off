"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.internService = void 0;
const mysql_1 = require("../config/mysql");
const crypto_1 = __importDefault(require("crypto"));
// In-memory persistent seed cache when running standalone or before MySQL connection
let memoryInterns = [
    {
        id: 1,
        certificateId: 'ORBIT-I/INT/2026/01',
        fullName: 'Muhammad Zeeshan',
        email: 'zeeshan.dev@gmail.com',
        phone: '+92 300 1234567',
        department: 'Full Stack Development',
        role: 'Full Stack Engineering Intern',
        startDate: '2026-01-01',
        endDate: '2026-03-25',
        duration: '3 Months',
        completionStatus: 'completed',
        certificateStatus: 'valid',
        gradePerformance: 'Distinction (A+)',
        verificationCode: 'ORB-SEC-7890-VLD-2026',
        issueDate: '2026-03-25',
        remarks: 'Demonstrated outstanding architectural skills in React, Node.js, and cloud deployment pipelines.',
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        certificateId: 'ORBIT-I/INT/2026/02',
        fullName: 'Ayesha Khan',
        email: 'ayesha.ai@gmail.com',
        phone: '+92 301 7654321',
        department: 'Artificial Intelligence & Data',
        role: 'AI / ML Research Intern',
        startDate: '2026-01-01',
        endDate: '2026-03-25',
        duration: '3 Months',
        completionStatus: 'completed',
        certificateStatus: 'valid',
        gradePerformance: 'Grade A',
        verificationCode: 'ORB-SEC-7891-VLD-2026',
        issueDate: '2026-03-25',
        remarks: 'Successfully trained and evaluated NLP model pipelines with high precision.',
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        certificateId: 'ORBIT-I/INT/2026/03',
        fullName: 'Hamza Farooq',
        email: 'hamza.uiux@gmail.com',
        phone: '+92 312 9876543',
        department: 'UI/UX & Product Design',
        role: 'Product Design Intern',
        startDate: '2026-02-01',
        endDate: '2026-04-30',
        duration: '3 Months',
        completionStatus: 'in_progress',
        certificateStatus: 'valid',
        gradePerformance: 'In Progress (A)',
        verificationCode: 'ORB-SEC-7892-PRG-2026',
        issueDate: '2026-02-01',
        remarks: 'Currently working on enterprise corporate design systems and client portals.',
        createdAt: new Date().toISOString(),
    },
];
exports.internService = {
    async verifyByCertificateId(certificateId) {
        const sanitizedId = certificateId.trim().toUpperCase();
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                const rows = await (0, mysql_1.query)(`SELECT 
            id, certificate_id as certificateId, full_name as fullName, email, phone,
            department, role, start_date as startDate, end_date as endDate, duration,
            completion_status as completionStatus, certificate_status as certificateStatus,
            grade_performance as gradePerformance, verification_code as verificationCode,
            issue_date as issueDate, remarks, created_at as createdAt
           FROM interns 
           WHERE UPPER(certificate_id) = ? LIMIT 1`, [sanitizedId]);
                if (rows.length > 0)
                    return rows[0];
            }
            catch (err) {
                console.error('[internService] MySQL error in verifyByCertificateId, falling back to memory store:', err);
            }
        }
        const found = memoryInterns.find((i) => i.certificateId.toUpperCase() === sanitizedId);
        return found || null;
    },
    async list(search, status) {
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                let sql = `SELECT 
          id, certificate_id as certificateId, full_name as fullName, email, phone,
          department, role, start_date as startDate, end_date as endDate, duration,
          completion_status as completionStatus, certificate_status as certificateStatus,
          grade_performance as gradePerformance, verification_code as verificationCode,
          issue_date as issueDate, remarks, created_at as createdAt
         FROM interns WHERE 1=1`;
                const params = [];
                if (status) {
                    sql += ` AND certificate_status = ?`;
                    params.push(status);
                }
                if (search) {
                    sql += ` AND (certificate_id LIKE ? OR full_name LIKE ? OR department LIKE ? OR role LIKE ?)`;
                    const s = `%${search}%`;
                    params.push(s, s, s, s);
                }
                sql += ` ORDER BY id DESC`;
                return await (0, mysql_1.query)(sql, params);
            }
            catch (err) {
                console.error('[internService] MySQL error in list, falling back to memory store:', err);
            }
        }
        let results = [...memoryInterns];
        if (status) {
            results = results.filter((i) => i.certificateStatus === status);
        }
        if (search) {
            const s = search.toLowerCase();
            results = results.filter((i) => i.certificateId.toLowerCase().includes(s) ||
                i.fullName.toLowerCase().includes(s) ||
                i.department.toLowerCase().includes(s) ||
                i.role.toLowerCase().includes(s));
        }
        return results.reverse();
    },
    async create(data) {
        const verificationCode = `ORB-${crypto_1.default.randomBytes(4).toString('hex').toUpperCase()}-${Date.now().toString().slice(-4)}`;
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                const result = await (0, mysql_1.execute)(`INSERT INTO interns (
            certificate_id, full_name, email, phone, department, role,
            start_date, end_date, duration, completion_status, certificate_status,
            grade_performance, verification_code, issue_date, remarks
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [
                    data.certificateId.trim().toUpperCase(),
                    data.fullName.trim(),
                    data.email.trim(),
                    data.phone || null,
                    data.department.trim(),
                    data.role.trim(),
                    data.startDate,
                    data.endDate,
                    data.duration || '3 Months',
                    data.completionStatus || 'completed',
                    data.certificateStatus || 'valid',
                    data.gradePerformance || 'A+',
                    verificationCode,
                    data.issueDate,
                    data.remarks || null,
                ]);
                return {
                    id: result.insertId,
                    ...data,
                    certificateId: data.certificateId.trim().toUpperCase(),
                    verificationCode,
                    createdAt: new Date().toISOString(),
                };
            }
            catch (err) {
                console.error('[internService] MySQL error in create, falling back to memory store:', err);
            }
        }
        const newRecord = {
            id: Date.now(),
            ...data,
            certificateId: data.certificateId.trim().toUpperCase(),
            verificationCode,
            createdAt: new Date().toISOString(),
        };
        memoryInterns.push(newRecord);
        return newRecord;
    },
    async update(id, data) {
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                const sets = [];
                const params = [];
                if (data.certificateId) {
                    sets.push('certificate_id = ?');
                    params.push(data.certificateId.toUpperCase());
                }
                if (data.fullName) {
                    sets.push('full_name = ?');
                    params.push(data.fullName);
                }
                if (data.email) {
                    sets.push('email = ?');
                    params.push(data.email);
                }
                if (data.phone !== undefined) {
                    sets.push('phone = ?');
                    params.push(data.phone);
                }
                if (data.department) {
                    sets.push('department = ?');
                    params.push(data.department);
                }
                if (data.role) {
                    sets.push('role = ?');
                    params.push(data.role);
                }
                if (data.startDate) {
                    sets.push('start_date = ?');
                    params.push(data.startDate);
                }
                if (data.endDate) {
                    sets.push('end_date = ?');
                    params.push(data.endDate);
                }
                if (data.duration) {
                    sets.push('duration = ?');
                    params.push(data.duration);
                }
                if (data.completionStatus) {
                    sets.push('completion_status = ?');
                    params.push(data.completionStatus);
                }
                if (data.certificateStatus) {
                    sets.push('certificate_status = ?');
                    params.push(data.certificateStatus);
                }
                if (data.gradePerformance) {
                    sets.push('grade_performance = ?');
                    params.push(data.gradePerformance);
                }
                if (data.issueDate) {
                    sets.push('issue_date = ?');
                    params.push(data.issueDate);
                }
                if (data.remarks !== undefined) {
                    sets.push('remarks = ?');
                    params.push(data.remarks);
                }
                if (sets.length > 0) {
                    params.push(id);
                    await (0, mysql_1.execute)(`UPDATE interns SET ${sets.join(', ')} WHERE id = ?`, params);
                    const rows = await (0, mysql_1.query)(`SELECT * FROM interns WHERE id = ? LIMIT 1`, [id]);
                    if (rows.length > 0)
                        return rows[0];
                }
            }
            catch (err) {
                console.error('[internService] MySQL error in update, falling back to memory store:', err);
            }
        }
        const idx = memoryInterns.findIndex((i) => String(i.id) === String(id));
        if (idx === -1)
            return null;
        memoryInterns[idx] = { ...memoryInterns[idx], ...data };
        return memoryInterns[idx];
    },
    async delete(id) {
        if ((0, mysql_1.isMySQLActive)()) {
            try {
                await (0, mysql_1.execute)(`DELETE FROM interns WHERE id = ?`, [id]);
                return true;
            }
            catch (err) {
                console.error('[internService] MySQL error in delete, falling back to memory store:', err);
            }
        }
        const idx = memoryInterns.findIndex((i) => String(i.id) === String(id));
        if (idx === -1)
            return false;
        memoryInterns.splice(idx, 1);
        return true;
    },
};
//# sourceMappingURL=internService.js.map