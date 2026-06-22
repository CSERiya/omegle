import express from "express";
import { isAuthenticated } from "../middlewares/auth_middleware";
import { handleMatchmaking } from "../controllers/connection_controller";

const router = express();

router.post("/chat-mode", isAuthenticated, handleMatchmaking);
router.post("/video-mode", isAuthenticated, handleMatchmaking);

export default router;
