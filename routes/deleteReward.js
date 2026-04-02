import express from "express";
import db from "../db.js";

const router = express.Router();

router.delete("/api/rewards/:id", (req, res) => {
    const rewardId = req.params.id;
    const sql = `DELETE FROM rewards WHERE rewards_id = ?`;
    db.query(sql, [rewardId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.affectedRows === 0) return res.status(404).json({ error: "ไม่พบของรางวัล" });
        res.json({ message: "ลบของรางวัลสำเร็จ" });
    });
});

export default router;