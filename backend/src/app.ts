import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import user_auth from "./routes/user_auth"

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth",user_auth)

export default app;
