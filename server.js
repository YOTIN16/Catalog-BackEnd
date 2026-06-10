import cors from "cors";
import express from "express";
import Register_Users  from "./routes/Check_Register.js"


const app =express();
app.use(cors());
app.use(express.json());

app.use(Register_Users);



app.listen(3000,()=>{
    console.log("Server is working at http://localhost:3000")
});

app.get("/api/test",(req,res)=>{
    res.json({
        status: "OK",
       
    })
});