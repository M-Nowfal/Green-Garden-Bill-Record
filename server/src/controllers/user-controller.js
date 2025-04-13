//@ts-nocheck
import userModel from "../models/user-model.js";
import { sendOtp, verifyOtp } from "./otp-controller.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const userLogin = async (req, res, next) => {
    try {
        const { doorNo, email, phoneNo, pwd } = req.body.userDetails;
        const userExist = await userModel.findOne({ doorNo, email, phone: phoneNo });
        if (!userExist) {
            return res.status(400).json({ message: "User Not Found, Register as New User" });
        }
        if (await bcrypt.compare(pwd, userExist.password)) {
            sendOtp(email).then(() => {
                res.status(200).json({ message: "OTP Sent Successfully", otpSent: true });
            }).catch(err => {
                return res.status(500).json({ error: "Failed to send OTP" });
            });
        } else {
            res.status(400).json({ message: "Incorrect Password" });
        }
    } catch (err) {
        next(err);
    }
}

export const verifyOtpForUserLogin = async (req, res, next) => {
    try {
        const { OTP, userDetails } = req.body;
        if (verifyOtp(OTP, userDetails.email)) {
            const user = { doorNo: userDetails.doorNo, fName: userDetails.fName, phoneNo: userDetails.phoneNo, email: userDetails.email };
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                maxAge: 24 * 60 * 60 * 30000
            }).status(200).json({ message: "Logged In Successfully", verified: true, user: token });
        } else {
            return res.status(500).json({ error: "OTP verification Failed" });
        }
    } catch (err) {
        next(err);
    }
}

export const userLogOut = async (req, res, next) => {
    try {
        const { email, phoneNo, pwd } = req.body.userDetails;
        const userExist = await userModel.findOne({ email, phone: phoneNo });
        if (!userExist) {
            return res.status(400).json({ message: "User Not Found Enter correct details" });
        }
        if (await bcrypt.compare(pwd, userExist.password)) {
            sendOtp(email).then(() => {
                res.status(200).json({ message: "OTP Sent Successfully", otpSent: true });
            }).catch(err => {
                return res.status(500).json({ error: "Failed to send OTP" });
            });
        } else {
            res.status(400).json({ message: "Incorrect Password" });
        }
    } catch (err) {
        next(err);
    }
}

export const verifyOtpForUserLogOut = async (req, res, next) => {
    try {
        const { OTP, userDetails } = req.body;
        if (verifyOtp(OTP, userDetails.email)) {
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
            });
            res.status(200).json({ message: 'Logged out successfully', verified: true });
        } else {
            return res.status(500).json({ error: "OTP verification Failed" });
        }
    } catch (err) {
        next(err);
    }
}

export const changePassword = async (req, res, next) => {
    try {
        const { email, phoneNo } = req.body.userDetails;
        const userExist = await userModel.findOne({ email, phone: phoneNo });
        if (!userExist) {
            return res.status(400).json({ message: "Incorrect phone or email" });
        }
        sendOtp(email).then(() => {
            res.status(200).json({ message: "OTP Sent Successfully", otpSent: true });
        }).catch(err => {
            return res.status(500).json({ error: "Failed to send OTP" });
        });
    } catch (err) {
        next(err);
    }
}

export const verifyOtpForChangePassword = async (req, res, next) => {
    try {
        const { OTP, userDetails } = req.body;
        if (verifyOtp(OTP, userDetails.email)) {
            return res.status(200).json({ message: 'Enter new Password', verified: true });
        } else {
            return res.status(500).json({ error: "OTP verification Failed" });
        }
    } catch (err) {
        next(err);
    }
}

export const changeUserPassword = async (req, res, next) => {
    try {
        const { userDetails, email } = req.body;
        const newHashedPassword = await bcrypt.hash(userDetails.password, 10);
        await userModel.findOneAndUpdate({ email }, { $set: { password: newHashedPassword } });
        res.status(200).json({ message: "Password Updated Successfully", changed: true });
    } catch (err) {
        next(err);
    }
}

export const getUser = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.body?.user;
        const user = jwt.decode(token);
        res.status(200).json({ message: "Authorized", user });
    } catch (err) {
        next(err);
    }
}