import express from "express";
import db from "../db.js";

const router = express.Router();

router.post("/api/post_customers", (req, res) => {
    const { name, phone, points } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: "กรุณาระบุชื่อและเบอร์โทรศัพท์" });
    }

    const startingPoints = points || 0;
    
    const sql = `INSERT INTO customer (name, phone, points) VALUES (?, ?, ?)`;
    const values = [name, phone, startingPoints];

    db.query(sql, values, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.status(201).json({ 
            message: "เพิ่มข้อมูลลูกค้าสำเร็จ",
            customerId: results.insertId 
        });
    });
});


router.delete("/api/customers/:id", (req, res) => {
    const { id } = req.params;
    
    // คำสั่ง SQL สำหรับลบลูกค้าตาม ID
    const sql = "DELETE FROM customer WHERE customer_id = ?";
    
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // ถ้าหา ID ไม่เจอ
        if (results.affectedRows === 0) return res.status(404).json({ error: "ไม่พบข้อมูลลูกค้าที่ต้องการลบ" });
        
        // ลบสำเร็จ
        res.json({ message: "ลบข้อมูลลูกค้าสำเร็จ" });
    });
});

export default router;