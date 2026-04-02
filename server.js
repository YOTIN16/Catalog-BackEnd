import cors from "cors";
import express from "express";
import get_new_customer  from "./routes/getCustomer.js"
import post_new_customer  from "./routes/postCustomer.js"
import patch_reward  from "./routes/patchCustomer.js"
import post_reward  from "./routes/postReward.js"
import getCustomerDashboard from "./routes/getCustomerDashboard.js";
import putReward from "./routes/putReward.js";
import patchRedeem from "./routes/patchRedeem.js";
import deleteReward from "./routes/deleteReward.js";
import Get_Phone from "./routes/Search_Phone.js";
import Put_Customer from "./routes/put_customer.js";

const app =express();
app.use(cors());
app.use(express.json());

app.use(get_new_customer);
app.use(post_new_customer);
app.use(patch_reward);
app.use(post_reward);
app.use(getCustomerDashboard);
app.use(putReward);
app.use(patchRedeem);
app.use(deleteReward);
app.use(Put_Customer);
app.use(Get_Phone);


app.listen(3000,()=>{
    console.log("Server is working at http://localhost:3000")
});

app.get("/api/test",(req,res)=>{
    res.json({
        status: "OK",
       
    })
});