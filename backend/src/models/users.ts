import mongoose, { Document } from "mongoose";

export interface User extends Document{
    name: string;
    email: string;
    isVerified: boolean;
    lastLogin: Date;
}

const userSchema = new mongoose.Schema<User>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastLogin: {
        type: Date
    }
},
    { timestamps: true });

export default mongoose.model<User>("Users", userSchema);