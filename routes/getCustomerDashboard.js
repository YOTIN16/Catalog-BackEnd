import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/api/dashboard/:customerId", (req, res) => {
    const customerId = req.params.customerId;
    db.query(`SELECT * FROM customer WHERE customer_id = ?`, [customerId], (err, customerData) => {
        if (err) return res.status(500).json({ error: err.message });
        if (customerData.length === 0) return res.status(404).json({ error: "ไม่พบข้อมูลลูกค้า" });

        db.query(`SELECT * FROM rewards`, (err, rewardsData) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                profile: customerData[0],
                rewards: rewardsData
            });
        });
    });
});



router.get("/api/dashboard/:phone", (req, res) => {
    const phone = req.params.phone;
    db.query(`SELECT * FROM customer WHERE phone = ?`, [phone], (err, customerData) => {
        if (err) return res.status(500).json({ error: err.message });
        if (customerData.length === 0) return res.status(404).json({ error: "ไม่พบข้อมูลลูกค้า" });

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