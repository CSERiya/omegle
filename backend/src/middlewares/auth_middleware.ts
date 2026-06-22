import Jwt  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (req: any, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies.token;
        if (!token)
            return res.status(401).json({ message: "Not logged in" });

        const decodes = Jwt.verify(token, process.env.JWT_SECRET as string);
        req.user = decodes;

        next();
    }
    catch {
        res.status(401).json({ message: "Invalid Token" })
    }
};