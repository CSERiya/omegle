import express from "express";
import { sendOTP, verifyOTP, logout } from "../controllers/auth_controller";
import { isAuthenticated } from "../middlewares/auth_middleware";

const router = express();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/logout", logout);

router.get("/login", isAuthenticated, (req, res) => {
    res.json({ message: "You are successfully logged in" });
});

export default router;