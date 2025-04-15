import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext } from '../../App';
import styles from "./Auth.module.css";
import { Theme } from '../ui_components/Theme';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosConfig } from '../axios_config/AxiosConfig';
import { Loader } from '../ui_components/Loader';

const authEndpoints = {
    login: { verify: "/user/login/verify-otp", resend: "/user/login" },
    register: { verify: "/auth/register/verify-otp", resend: "/auth/register" },
    logout: { verify: "/user/logout/verify-otp", resend: "/user/logout" },
    changepwd: { verify: "/user/change-password/verify-otp", resend: "/user/change-password" },
    "edit-user": { verify: "/admin/edit-user/verify-otp", resend: "/admin/edit-user" },
    "remove-user": { verify: "/admin/remove-user/verify-otp", resend: "/admin/remove-user" }
};

export const OTPVerification = () => {
    const { theme, setFirstTime } = useContext(AppContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [activeInp, setActiveInp] = useState({});
    const [otp, setOtp] = useState({ inp1: "", inp2: "", inp3: "", inp4: "" });
    const [isOtpVerified, setIsOtpVerified] = useState(true);
    const [timer, setTimer] = useState(59);
    const inputRef = useRef({});
    const { email, auth, userDetails } = location.state || {};
    const otpInputs = ["inp1", "inp2", "inp3", "inp4"];

    useEffect(() => { inputRef.current["inp1"]?.focus(); }, []);
    useEffect(() => {
        const interval = setInterval(() => setTimer(prev => Math.max(prev - 1, 0)), 1000);
        return () => clearInterval(interval);
    }, []);

    const getOtpString = () => Object.values(otp).join("");

    const verifyOtp = async () => {
        const OTP = getOtpString();
        if (OTP.length !== 4) return toast.error("Enter valid OTP");

        try {
            setIsOtpVerified(false);
            const url = authEndpoints[auth]?.verify;
            if (!url) throw new Error("Route not defined");

            const payload = { OTP, userDetails };
            if (auth === "changepwd") payload.email = userDetails.email;
            if (auth === "remove-user") payload.user = localStorage.getItem("userToken");

            const res = await AxiosConfig().post(url, payload);
            if (res.data.verified) {
                toast.success(res.data.message);
                localStorage.setItem("userToken", res.data?.user || "");
                if (auth === "logout" || (auth === "remove-user" && res.data.user)) {
                    localStorage.removeItem("userToken");
                    navigate("/login");
                } else if (auth === "changepwd") {
                    navigate("/newpwd", { state: { email: userDetails.email } });
                } else if (auth === "login" || auth === "register") {
                    setFirstTime(false);
                } else navigate("/");
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            navigate("/");
        } finally {
            setIsOtpVerified(true);
        }
    };

    const reSendOtp = async () => {
        if (timer > 0) return;
        try {
            const url = authEndpoints[auth]?.resend;
            if (!url) throw new Error("Route not defined");

            const payload = { userDetails };
            if (auth === "register" || auth === "changepwd") payload.email = userDetails.email;

            const res = await AxiosConfig().post(url, payload);
            if (res.data.otpSent) {
                toast.success(res.data.message);
                setOtp({ inp1: "", inp2: "", inp3: "", inp4: "" });
                setTimer(59);
                if (auth === "remove-user") navigate("/verifyotp", { state: { auth, userDetails } });
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
        }
    };

    const handleChange = (e, i) => {
        const { name, value } = e.target;
        if (!/^\d?$/.test(value)) return;
        setOtp(prev => ({ ...prev, [name]: value }));
        if (value && i < 3) inputRef.current[otpInputs[i + 1]]?.focus();
    };

    const handleKeyDown = (e, i) => {
        if (e.key === "Backspace" && !e.target.value && i > 0) inputRef.current[otpInputs[i - 1]]?.focus();
        else if (e.key === "ArrowRight" && i < 3) inputRef.current[otpInputs[i + 1]]?.focus();
        else if (e.key === "ArrowLeft" && i > 0) inputRef.current[otpInputs[i - 1]]?.focus();
        else if (e.key === "Enter") verifyOtp();
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").trim();
        if (/^\d{4}$/.test(pasted)) {
            const newOtp = {};
            otpInputs.forEach((key, i) => {
                newOtp[key] = pasted[i];
                if (inputRef.current[key]) inputRef.current[key].value = pasted[i];
            });
            setOtp(newOtp);
        }
    };

    return (
        <div className={`container-fluid ${theme ? styles.authContainerLight : styles.authContainerDark}`}>
            <div className="row">
                {!isOtpVerified && <Loader />}
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                        <div className={theme ? styles.containerLight : styles.containerDark}>
                            <h1 className={`text-center text-primary my-3 ${!theme && "text-alice"}`}>OTP Verification</h1>
                            <div className="text-center px-4">
                                <p className={!theme ? "text-alice" : ""}>
                                    Enter the verification code we just sent to your email address.
                                    If you don't see the OTP in your inbox, be sure to check your Spam or Junk folder.
                                </p>
                                <p className={!theme ? "text-alice" : ""}>{email || "example@email.com"}</p>
                            </div>
                            <div className={styles.otpInputs}>
                                {otpInputs.map((key, i) => (
                                    <input
                                        key={key}
                                        ref={(el) => inputRef.current[key] = el}
                                        maxLength={1}
                                        type="number"
                                        name={key}
                                        value={otp[key]}
                                        className={`${(activeInp[key] || otp[key]) && styles.otpInputActive} ${styles.otpInput} ${!theme && styles.otpInputDark}`}
                                        onFocus={() => setActiveInp(prev => ({ ...prev, [key]: true }))}
                                        onBlur={() => setActiveInp(prev => ({ ...prev, [key]: false }))}
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
                                    <span className={`cursor-pointer ${timer === 0 && "text-primary"}`} onClick={reSendOtp}>Resend</span>
                                    {timer !== 0 && <> OTP in <span className="text-primary fw-bold">{timer}</span> secs</>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Theme position={true} />
        </div>
    );
};
