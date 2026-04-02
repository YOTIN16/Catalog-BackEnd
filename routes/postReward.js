import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/api/all-rewards", (req, res) => {
    const sql = "SELECT * FROM rewards"; 
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching rewards:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results); // ส่ง Array ของรางวัลทั้งหมดกลับไป
    });
});


router.post("/api/rewards", (req, res) => {
    const { rewards_name, points_required } = req.body;

    if (!rewards_name || points_required === undefined) {
        return res.status(400).json({ error: "กรุณาระบุชื่อของรางวัลและแต้มที่ต้องใช้" });
    }

    const sql = "INSERT INTO rewards (rewards_name, points_required) VALUES (?, ?)";
    const values = [rewards_name, points_required];

    db.query(sql, values, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        res.status(201).json({ 
            message: "เพิ่มของรางวัลใหม่สำเร็จ",
            rewardId: results.insertId 
        });
    });
});


router.put("/api/rewards/:id", (req, res) => {
    const { id } = req.params;
    const { rewards_name, points_required } = req.body;

    const sql = "UPDATE rewards SET rewards_name = ?, points_required = ? WHERE rewards_id = ?";
    db.query(sql, [rewards_name, points_required, id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "ไม่พบรหัสรางวัลที่ต้องการแก้ไข" });
        
        res.json({ message: "อัปเดตข้อมูลของรางวัลสำเร็จ" });
    });
});


router.delete("/api/rewards/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM rewards WHERE rewards_id = ?";
    
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "ไม่พบรหัสรางวัลที่ต้องการลบ" });
        
        res.json({ message: "ลบของรางวัลสำเร็จ" });
    });
});

export default router;