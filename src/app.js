import dotenv from "dotenv";
dotenv.config();
import express from "express";
import authRoutes from "./modules/auth/auth.routes.js";
import {authMiddleware} from './middleware/auth.middleware.js'
import {permit} from './middleware/permission.middleware.js'
import Record from './modules/records/record.routes.js';
import Dashboard from './modules/dashboard/dashboard.routes.js'

const app = express();

app.get("/protected",authMiddleware,permit('ADMIN'),(req,res)=>{
    res.json({
        message:"Access granted",
        user: req.user
    });
});

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/records",Record);
app.use("/api/dashboard",Dashboard);

export default app;