import express from "express";
import db from "../db.js";

const router = express.Router();

router.patch("/api/redeem", (req, res) => {
    const { customer_id, points_used } = req.body;
    if (!customer_id || !points_used) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
    }
    const sql = `UPDATE customer SET points = points - ? WHERE customer_id = ? AND points >= ?`;
    db.query(sql, [points_used, customer_id, points_used], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) {
            return res.status(400).json({ error: "แต้มไม่พอหรือไม่มีลูกค้าระบุตัวตน" });
        }
        res.json({ message: "แลกรางวัลสำเร็จ" });
    });
});

export default router;