import buildingModel from "../models/building-model.js";
import userModel from "../models/user-model.js";
import waterBilldRecordModel from "../models/water-bill-records-model.js";
import { sendOtp, verifyOtp } from "./otp-controller.js";
import jwt from "jsonwebtoken";

const oldEmail = {};

function findMonthByNumber(month) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    for (let i = 0; i < 12; i++) {
        if ((i + 1) == month) {
            return months[i];
        }
    }
}

export const payWaterBill = async (req, res, next) => {
    try {
        const { doorNo, month, year, amount } = req.body.waterBillDetails;
        if (!await userModel.findOne({ doorNo })) {
            return res.status(404).json({ message: `House ${doorNo} is not registered yet` });
        }
        if (await waterBilldRecordModel.findOne({ doorNo, month: findMonthByNumber(month), year })) {
            return res.status(400).json({ message: `House ${doorNo} has already paid for ${month}/${year}` });
        }
        const payment = await waterBilldRecordModel.create({
            doorNo,
            month: findMonthByNumber(month),
            year,
            amount,
            paid: true
        });

        const updatedBuilding = await buildingModel.findOneAndUpdate(
            { name: doorNo[0], "houses.doorNo": doorNo },
            { $push: { "houses.$.waterBills": payment._id } },
            { new: true }
        );

        if (!updatedBuilding) {
            return res.status(404).json({ message: "Building or house not found" });
        }

        res.status(200).json({ message: "Paid Successfully", paid: true });
    } catch (err) {
        next(err);
    }
}

export const waterBillHistory = async (req, res, next) => {
    try {
        const { doorNo } = req.params;
        const history = await waterBilldRecordModel.find({ doorNo });
        res.status(200).json({ message: `Histories for ${doorNo}`, history });
    } catch (err) {
        next(err);
    }
}

export const editUser = async (req, res, next) => {
    try {
        const { doorNo } = req.body.userDetails;
        const user = await userModel.findOne({ doorNo });
        if (!user) {
            return res.status(404).json({ message: "No User registered in that house" });
        }
        sendOtp(user.email).then(() => {
            oldEmail[doorNo] = user.email;
            res.status(200).json({ message: "OTP Sent to the old E-mail address", otpSent: true });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Failed to send OTP" });
        });
    } catch (err) {
        next(err);
    }
}

export const verifyOtpForEditUser = async (req, res, next) => {
    try {
        const { OTP, userDetails } = req.body;
        if (verifyOtp(OTP, oldEmail[userDetails.doorNo])) {
            await userModel.findOneAndUpdate({ doorNo: userDetails.doorNo }, {
                $set: {
                    name: userDetails.fName,
                    phone: userDetails.phoneNo,
                    email: userDetails.email
                }
            });
            delete oldEmail[userDetails.doorNo];
            res.status(200).json({ message: "User Details Updated Successfully", verified: true });
        } else {
            res.status(401).json({ message: "OTP verification failed", verified: false });
        }
    } catch (err) {
        next(err);
    }
}

export const removeUser = async (req, res, next) => {
    try {
        const { doorNo, phoneNo, email } = req.body.userDetails;
        const user = await userModel.findOne({ doorNo, phone: phoneNo, email });
        if (!user) {
            return res.status(404).json({ message: "No User registered in that house or incorrect phone or email" });
        }
        sendOtp(email).then(() => {
            oldEmail[doorNo] = email;
            res.status(200).json({ message: "OTP Sent Successfully", otpSent: true });
        }).catch(err => {
            console.log(err);
            return res.status(500).json({ error: "Failed to send OTP" });
        });
    } catch (err) {
        next(err);
    }
}

export const verifyOtpForRemoveUser = async (req, res, next) => {
    try {
        const { OTP, userDetails, user } = req.body;
        if (verifyOtp(OTP, userDetails.email)) {
            await userModel.findOneAndDelete({ doorNo: userDetails.doorNo, email: userDetails.email });
            await buildingModel.findOneAndUpdate({ name: userDetails.doorNo[0], "houses.doorNo": userDetails.doorNo }, {
                $set: { "houses.$.owner": null, "houses.$.waterBills": [] }
            });
            const decodedUser = jwt.decode(user);
            if(decodedUser.doorNo == userDetails.doorNo) {
                return res.status(200).json({ message: "User removed Successfully", verified: true, user: true });
            }
            res.status(200).json({ message: "User removed Successfully", verified: true });
        } else {
            res.status(401).json({ message: "OTP verification failed", verified: false });
        }
    } catch (err) {
        next(err);
    }
}