import express from "express";
import db from "../db.js";

const router = express.Router();


router.patch("/api/customers/:id", (req, res) => {
    const customerId = req.params.id;
    const { points } = req.body;

 
    if (points === undefined) {
        return res.status(400).json({ error: "กรุณาระบุจำนวนแต้มที่ต้องการอัปเดต" });
    }

    const sql = `UPDATE customer SET points = ? WHERE customer_id = ?`;
    const values = [points, customerId];

    db.query(sql, values, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: "ไม่พบข้อมูลลูกค้าที่ระบุ" });
        }

        res.json({ 
            message: "อัปเดตแต้มลูกค้าสำเร็จ",
            updatedCustomerId: customerId,
            newPoints: points
        });
    });
});

export default router;