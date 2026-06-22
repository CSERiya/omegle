import { Request,Response } from "express"
import bcrypt from "bcrypt"
import { generateOTP } from "../utils/otp_generator"
import  Jwt  from "jsonwebtoken"
import Users from "../models/users"
import OTP from "../models/otp"
import { sendmail } from "../utils/mail_sender"

export const sendOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;
        const otp = generateOTP();
        const hashedotp = await bcrypt.hash(otp, 10);
        const date = new Date(Date.now() + 5 * 60 * 1000)

        await OTP.deleteMany({ email })
        
        await OTP.create({
            otp: hashedotp,
            email,
            expires: date
        });

        await sendmail(email, otp);

        res.json({ success: true, message: "OTP sent successfully on the registered email" });
    }
    catch (error) {
        res.status(500).json({ message: "Failed to send OTP" })
    }
};

export const verifyOTP = async (req: Request, res: Response) => {
    try {
        const { name, email, otp } = req.body;

        const otpcheck = await OTP.findOne({ email });

        if (!otpcheck) return res.status(400).json({ message: "Invalid OTP" });

        if (otpcheck.expires < new Date())
            return res.status(400).json({ message: "OTP expired" });

        const matched = await bcrypt.compare(otp, otpcheck.otp);
        if (!matched) return res.status(400).json({ message: "Wrong OTP" });

        let user = await Users.findOne({ email });
        if (!user) {
            user = await Users.create({
                name,
                email,
                isVerified: true,
                lastLogin: new Date()
            });
        }
        else {
            user.lastLogin = new Date();
            user.isVerified = true;
            await user.save();
        }

        // delete otp
        await OTP.deleteOne({ email });

        const token = Jwt.sign({
            id: user.id
        },
            process.env.JWT_SECRET as string,
            { expiresIn: "5d" });
        
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        res.json({success: true, user})

    }
    catch(error) {
        res.status(500).json({message:"Verification Failed!"})
    }
}

export const logout = async (_req: Request, res:Response) => {
    res.clearCookie("token");
    res.json({message: "Logged out successfully"})
}

