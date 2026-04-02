import { createConnection } from "mysql2";

const db = createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "Add_Point"
})

db.connect((err)=>{
    if (err) {
        console.error("เชื่อมฐานข้อมูลไม่ได้",err.message);
        process.exit(1);
    }
     console.error("เชื่อมฐานข้อมูลได้สำเร็จ");
});

export default db