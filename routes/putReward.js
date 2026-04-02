import express from "express";
import db from "../db.js";

const router = express.Router();

router.put("/api/rewards/:id", (req, res) => {
    const rewardId = req.params.id;
    const { rewards_name, points_required } = req.body;
    if (!rewards_name || points_required === undefined) {
        return res.status(400).json({ error: "ข้อมูลไม่ครบถ้วน" });
    }
    const sql = `UPDATE rewards SET rewards_name = ?, points_required = ? WHERE rewards_id = ?`;
    db.query(sql, [rewards_name, points_required, rewardId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "ไม่พบของรางวัล" });
        res.json({ message: "อัปเดตข้อมูลสำเร็จ" });
    });
});

export default router;