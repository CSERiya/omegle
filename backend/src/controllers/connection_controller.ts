import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Jwt } from "jsonwebtoken";
import users from "../models/users";
import { joinQueueAndMatch } from "../utils/queue_match";
import { redisClient } from "../config/redis";

export const handleMatchmaking = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { userId, mode } = req.body;

    if (mode != "text" && mode != "video") {
      res.status(400).json({ error: "Invalid mode. Use 'text' or 'video'." });
      return;
    }

    const matchres = await joinQueueAndMatch(redisClient, mode, userId);

    if (matchres.status === "matched") {
      res.json({
        status: "matched",
        roomId: matchres.roomId,
        friendId: matchres.friendId,
      });
      return;
    }

    res.json({ status: "waiting", message: "Looking for a friend..." });
  } catch (error) {
    console.error("Controller error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during matching friends!" });
  }
};
