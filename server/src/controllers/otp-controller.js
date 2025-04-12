//@ts-nocheck
import nodemailer from "nodemailer";

const otpStorage = {};

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendOtp = (email) => {
    try {
        return new Promise((resolve, reject) => {
            const OTP = Math.floor(1000 + Math.random() * 9000);
            otpStorage[email] = OTP;

            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Your OTP Code",
                text: `Yoyr OTP code is: ${OTP}`
            };

            transporter.sendMail(mailOptions, (err, info) => {
                if (err)
                    reject(false);
                resolve(true);
            });
        });
    } catch (err) {
        console.log(err.message);
    }
}

export const verifyOtp = (otp, email) => {
    if (otp == otpStorage[email]) {
        delete otpStorage[email];
        return true;
    } else {
        return false;
    }
}