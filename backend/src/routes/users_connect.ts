import express from "express";
import { isAuthenticated } from "../middlewares/auth_middleware";
import { chat_mode, video_mode } from "../controllers/connection_controller";

const router = express();

router.post("/chat",isAuthenticated, chat_mode);
router.post("/video-connect",isAuthenticated, video_mode);

export default router;