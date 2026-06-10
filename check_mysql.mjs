import { createConnection } from "mysql2";

async function checkPort(port) {
    const db = createConnection({
        host: "localhost",
        port: port,
        user: "root",
        password: ""
    });

    return new Promise((resolve) => {
        db.connect((err) => {
            if (err) {
                console.log(`Port ${port}: Connection failed - ${err.message}`);
                resolve(null);
            } else {
                db.query("SHOW DATABASES", (err, results) => {
                    if (err) {
                        console.log(`Port ${port}: Failed to show databases`);
                    } else {
                        console.log(`Port ${port}: Databases found:`, results.map(r => r.Database));
                    }
                    db.end();
                    resolve(results);
                });
            }
        });
    });
}

async function run() {
    await checkPort(3306);
    await checkPort(3308);
}

run();
