import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../App';
import styles from "./Auth.module.css";
import { Theme } from '../ui_components/Theme';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosConfig } from '../axios_config/AxiosConfig';
import { Loader } from '../ui_components/Loader';

export const OTPVerification = () => {

    const { theme } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeInp, setActiveInp] = useState({ inp1: false, inp2: false, inp3: false, inp4: false });
    const [otp, setOtp] = useState({ inp1: "", inp2: "", inp3: "", inp4: "" });
    const [isOtpVerified, setIsOtpVerified] = useState(true);
    const [timer, setTimer] = useState(59);
    const inputRef = useRef({ inp1: null, inp2: null, inp3: null, inp4: null });
    const { email, auth, userDetails } = location.state || {};

    useEffect(() => {
        inputRef.current[0]?.focus();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => {
            clearInterval(interval);
        }
    }, []);

    const verifyOtp = async () => {
        try {
            const OTP = Object.values(otp).join("");
            if (OTP.length != 4) {
                toast.error("Enter valid OTP");
                return;
            }
            setIsOtpVerified(false);
            if (auth == "login") {
                const response = await AxiosConfig().post("/user/login/verify-otp", { OTP, userDetails });
                if (response.data.verified) {
                    toast.success(response.data.message);
                    setIsOtpVerified(true);
                    localStorage.setItem("userToken", response.data?.user);
                    navigate("/");
                }
            } else if (auth == "register") {
                const response = await AxiosConfig().post("/auth/register/verify-otp", { OTP, userDetails });
                if (response.data.verified) {
                    toast.success(response.data.message);
                    setIsOtpVerified(true);
                    localStorage.setItem("userToken", response.data?.user);
                    navigate("/");
                }
            } else if (auth == "logout") {
                const response = await AxiosConfig().post("/user/logout/verify-otp", { OTP, userDetails });
                if (response.data.verified) {
                    toast.success(response.data.message);
                    setIsOtpVerified(true);
                    localStorage.removeItem("userToken");
                    navigate("/login");
                }
            } else if (auth == "changepwd") {
                const response = await AxiosConfig().post("/user/change-password/verify-otp", { OTP, userDetails });
                if (response.data.verified) {
                    toast.success(response.data.message);
                    setIsOtpVerified(true);
                    navigate("/newpwd", { state: { email: userDetails.email } });
                }
            } else {
                toast.error("Route is not clear");
                setIsOtpVerified(true);
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
            setIsOtpVerified(true);
            navigate("/");
        }
    }

    const reSendOtp = async () => {
        if (timer > 0)
            return;
        try {
            if (auth == "login") {
                const response = await AxiosConfig().post(`/user/login`, { userDetails });
                if (response.data.otpSent) {
                    toast.success(response.data.message);
                    setOtp({ inp1: "", inp2: "", inp3: "", inp4: "" });
                }
            } else if (auth == "register") {
                const response = await AxiosConfig().post(`/auth/register`, { email: userDetails.email });
                if (response.data.otpSent) {
                    toast.success(response.data.message);
                    setOtp({ inp1: "", inp2: "", inp3: "", inp4: "" });
                }
            }
            setTimer(59);
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
        }
    }

    const handleChange = (e, i) => {
        const { name, value } = e.target;
        if (!/^[0-9]?$/.test(value))
            return;
        setOtp(prev => ({ ...prev, [name]: value }));
        if (value && i < 3) {
            inputRef.current[i + 1].focus();
        }
    }

    const handleKeyDown = (e, i) => {
        if (e.key === "Backspace" && !e.target.value && i > 0) {
            inputRef.current[i - 1].focus();
        } else if (e.key === "ArrowRight" && i < 3) {
            inputRef.current[i + 1].focus();
        } else if (e.key === "ArrowLeft" && i > 0) {
            inputRef.current[i - 1].focus();
        } else if (e.key === "Enter") {
            verifyOtp();
        }
    }

    const handlePaste = (e) => {
        e.preventDefault();
        const pastedOTP = e.clipboardData.getData("text").trim();
        if (/^\d{4}$/.test(pastedOTP)) {
            const newOtp = {};
            const otpkeys = ["inp1", "inp2", "inp3", "inp4"];
            otpkeys.forEach((key, i) => {
                newOtp[key] = pastedOTP[i];
                if (inputRef.current[key]) {
                    inputRef.current[key].value = pastedOTP[i];
                }
            });
            setOtp(newOtp);
        }
    }

    const handleFocus = (e) => {
        setActiveInp(prev => ({ ...prev, [e.target.name]: true }));
    }

    const handleBlur = (e) => {
        setActiveInp(prev => ({ ...prev, [e.target.name]: false }));
    }

    const otpInputs = ["inp1", "inp2", "inp3", "inp4"];

    return (
        <div className={`container-fluid ${theme ? styles.authContainerLight : styles.authContainerDark}`}>
            <div className="row">
                {!isOtpVerified && <Loader />}
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                        <div className={theme ? styles.containerLight : styles.containerDark}>
                            <h1 className={`text-center text-primary my-3 ${!theme && "text-alice"}`}>OTP Verification</h1>
                            <div>
                                <div className="text-center">
                                    <p className={`${!theme && "text-alice"} px-4`}>
                                        Enter the verification code we just sent to your email address.
                                    </p>
                                    <p className={!theme ? "text-alice" : ""}>{email || "example@email.com"}</p>
                                </div>
                                <div className={styles.otpInputs}>
                                    {otpInputs.map((input, i) => (
                                        <input
                                            key={i}
                                            ref={(el) => inputRef.current[i] = el}
                                            maxLength={1}
                                            type="number"
                                            name={input}
                                            value={otp[input]}
                                            className={`${(activeInp[input] || otp[input]) && styles.otpInputActive} ${styles.otpInput} ${!theme && styles.otpInputDark}`}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            onChange={(e) => handleChange(e, i)}
                                            onKeyDown={(e) => handleKeyDown(e, i)}
                                            onPaste={handlePaste}
                                        />
                                    ))}
                                </div>
                                <div className="text-center my-3">
                                    <button className="btn btn-primary w-25" onClick={verifyOtp}>Verify</button>
                                </div>
                                <div className="text-center my-3">
                                    <p className={!theme ? "text-alice" : ""}>
                                        <span className={`cursor-pointer ${timer == 0 && "text-primary"}`} onClick={reSendOtp}>Resend</span>
                                        {timer != 0 && <span> OTP in <span className="text-primary fw-bold">{timer}</span> secs</span>}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Theme position={true} />
        </div>
    );
}
