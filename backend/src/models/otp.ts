import mongoose, { Document } from "mongoose";

export interface Otp extends Document{
    otp: string;
    email: string;
    expires: Date;
}

const userSchema = new mongoose.Schema<Otp>({
    otp: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    expires: {
        type: Date,
        required: true
    }
},
    { timestamps: true });

export default mongoose.model<Otp>("otp", userSchema);