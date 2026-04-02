import express from "express";
import db from "../db.js";

const router = express.Router();


router.post("/api/put_customers", (req, res) => {
    const { name, phone, points } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: "กรุณากรอกชื่อและเบอร์โทรศัพท์" });
    }

    const sql = "INSERT INTO customer (name, phone, points) VALUES (?, ?, ?)";
  
    const startingPoints = points ? Number(points) : 0; 

    db.query(sql, [name, phone, startingPoints], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.status(201).json({ 
            message: "เพิ่มลูกค้าใหม่สำเร็จ",
            customerId: results.insertId 
        });
    });
});

router.patch("/api/customers/:id", (req, res) => {
    const { id } = req.params;
    const { name, phone, points } = req.body;

    const sql = "UPDATE customer SET name = ?, phone = ?, points = ? WHERE customer_id = ?";
    db.query(sql, [name, phone, Number(points), id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "อัปเดตข้อมูลลูกค้าสำเร็จ" });
    });
});

export default router;