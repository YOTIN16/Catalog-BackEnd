import express from "express";
import db from "../db.js";

const router = express.Router();

router.get("/api/New_customers", (req, res) => {
    db.query(`SELECT * FROM customer ORDER BY customer_id ASC`, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: results });
    });
});

export default router;