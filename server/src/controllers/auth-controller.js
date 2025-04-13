//@ts-nocheck
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import bcryptjs from "bcryptjs";
import { sendOtp, verifyOtp } from "./otp-controller.js";
import userModel from "../models/user-model.js";
import buildingModel from "../models/building-model.js";

export const getToken = async (req, res, next) => {
    try {
        const token = req.cookies?.token || req.body?.user;
        if (!token)
            return res.status(401).json({ message: "Unauthorized", verified: false });
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token", verified: false });
    }
};

export const registerNewUser = async (req, res, next) => {
    try {
        const { email } = req.body;
        sendOtp(email).then(() => {
            res.status(200).json({ message: "OTP Sent Successfully", otpSent: true });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Failed to send OTP" });
        });
    } catch (err) {
        next(err);
    }
};

export const verifyRegistrationOtp = async (req, res, next) => {
    try {
        const { OTP, userDetails } = req.body;
        if (verifyOtp(OTP, userDetails.email)) {
            const hashedPwd = await bcryptjs.hash(userDetails.pwd, 10);

            const user = {
                doorNo: userDetails.doorNo,
                fName: userDetails.fName,
                phoneNo: userDetails.phoneNo,
                email: userDetails.email
            };

            const buildingId = await buildingModel.findOne({ name: user.doorNo.charAt(0).toUpperCase() });

            if (!buildingId) {
                return res.status(404).json({ message: "Building Not Found" });
            }

            const userExist = await userModel.findOne({ phone: user.phoneNo, email: user.email });

            if (userExist) {
                return res.status(400).json({ message: "User Already Exist", verified: false });
            }

            const newUser = await userModel.create({
                name: user.fName,
                phone: user.phoneNo,
                email: user.email,
                password: hashedPwd,
                doorNo: user.doorNo,
                building: buildingId._id
            });

            const updateResult = await buildingModel.updateOne(
                { name: buildingId.name, "houses.doorNo": user.doorNo },
                { $set: { "houses.$.owner": newUser._id } }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(500).json({ message: "Failed to update building with new user." });
            }

            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                maxAge: 24 * 60 * 60 * 1000 * 30
            }).status(200).json({ message: "Registered Successfully", verified: true, user: token });

        } else {
            return res.status(400).json({ error: "OTP verification Failed" });
        }
    } catch (err) {
        console.error("Error in verifyRegistrationOtp:", err);
        next(err);
    }
};

export const validate = async (req, res, next) => {
    try {
        res.status(200).json({ message: "Validation Failed", verified: true });
    } catch (err) {
        next(err);
    }
};