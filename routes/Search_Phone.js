import express from "express";
import db from "../db.js";

const router = express.Router();


router.get("/api/dashboard/phone/:phone", (req, res) => {
    const phone = req.params.phone;

    const sqlCustomer = `SELECT * FROM customer WHERE TRIM(phone) = ? LIMIT 1`;

    db.query(sqlCustomer, [phone], (err, customerData) => {
        if (err) return res.status(500).json({ error: err.message });
        
        if (customerData.length === 0) {
            return res.status(404).json({ error: "ไม่พบข้อมูลลูกค้าจากเบอร์โทรศัพท์นี้" });
        }

     
        db.query(`SELECT * FROM rewards`, (err, rewardsData) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                profile: customerData[0],
                rewards: rewardsData
            });
        });
    });
});

export default router;