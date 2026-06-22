import nodemailer from "nodemailer"

export const sendmail = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER,
            pass: process.env.PASS
        }
    });
    
    await transporter.sendMail({
        from: process.env.USER,
        to: email,
        subject: `Omegle Verification code: ${otp}`,
text: `Your OTP is ${otp}. It will expire in 5 minutes.`
    });
};