import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/register", (req, res) => {
    const { email, first_name, last_name, organization, phone, address } = req.body;

    if (!email || !first_name || !last_name) {
        return res.status(400).json({ 
            success: false, 
            message: "กรุณากรอก email ชื่อ และนามสกุล" 
        });
    }

    const checkEmailSql = `SELECT email FROM Users WHERE email = ? LIMIT 1`;

    db.query(checkEmailSql, [email], (err, existing) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (existing.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "อีเมลนี้ถูกใช้งานแล้ว" 
            });
        }

        const insertSql = `
            INSERT INTO Users (email, first_name, last_name, organization, phone, address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        const values = [email, first_name, last_name, organization || null, phone || null, address || null];

        db.query(insertSql, values, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            return res.status(201).json({ 
                success: true, 
                message: "ลงทะเบียนสำเร็จ" 
            });
        });
    });
});



router.post("/Login", (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "กรุณากรอกอีเมล" });
    }

    const checkSql = `SELECT First_Name, Last_Name FROM Users WHERE Email = ? LIMIT 1`;

    db.query(checkSql, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length === 0) {
            return res.status(404).json({ success: false, message: "ไม่พบอีเมลนี้ในระบบ กรุณาลงทะเบียน" });
        }

        // ถ้าเจอข้อมูล ให้ส่งชื่อและนามสกุลกลับไป
        return res.status(200).json({ 
            success: true, 
            message: "ล็อกอินสำเร็จ",
            user: {
                first_name: results[0].First_Name,
                last_name: results[0].Last_Name
            }
        });
    });
});

export default router;