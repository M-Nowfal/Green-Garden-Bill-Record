import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import styles from "./Auth.module.css";
import { Theme } from '../ui_components/Theme';
import { AppContext } from '../../App';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { AxiosConfig } from '../axios_config/AxiosConfig';
import { Loader } from '../ui_components/Loader';

export const ForgotPassword = () => {

    const { theme } = useContext(AppContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({ phoneNo: "", email: "" });
    const [activeField, setActiveField] = useState({ phoneNo: false, email: false });
    const inputs = useRef({ phoneNo: null, email: null });
    const [isOtpReseaved, setIsOtpReseaved] = useState(true);
    const fields = [
        { label: "Phone No", name: "phoneNo", type: "number" },
        { label: "E-mail", name: "email", type: "email" },
    ].map(field => ({ ...field, id: useId() }));
    const { changePwd } = location.state || {};

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            if (!validateUserDetails()) {
                return;
            }
            setIsOtpReseaved(false);
            const response = await AxiosConfig().post("/user/forgot-password", { userDetails });
            if (response.data.otpSent) {
                toast.success(response.data.message);
                setIsOtpReseaved(true);
                navigate("/verifyotp", { state: { auth: "changepwd", userDetails } });
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
            setIsOtpReseaved(true);
        }
    }

    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    const validateUserDetails = () => {
        if (!/^\d{10}$/.test(userDetails.phoneNo)) {
            toast.error("Enter a valid 10 digit phone number");
            inputs.current[0]?.focus();
            return false;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(userDetails.email)) {
            toast.error("Enter a valid E-mail address");
            inputs.current[3]?.focus();
            return false;
        }
        return true;
    }

    const handleUserDetails = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleFocus = (e) => {
        const { name } = e.target;
        setActiveField(prev => ({ ...prev, [name]: true }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setActiveField(prev => ({ ...prev, [name]: false }));
    };

    const getLabelClass = (name) => {
        const isActive = activeField[name];
        const hasValue = userDetails[name];
        const base = theme ? styles.inputLabelLight : styles.inputLabelDark;
        const active = theme ? styles.inputLabelActiveLight : styles.inputLabelActiveDark;
        const after = theme ? styles.inputLabelAfterLight : styles.inputLabelAfterDark;
        return `${base} ${isActive ? active : hasValue ? `${after} ${active}` : ""}`;
    };

    return (
        <div className={`container-fluid ${theme ? styles.authContainerLight : styles.authContainerDark}`}>
            <div className="row">
                {!isOtpReseaved && <Loader />}
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                        <div className={theme ? styles.containerLight : styles.containerDark}>
                            <h1 className="text-center text-primary my-3">{changePwd ? "Change Password" : "Forgot Password"}</h1>
                            <form onSubmit={handleForgotPassword}>
                                {fields.map(({ id, label, name, type }, i) => (
                                    <div key={id} className={`${styles.inputContainer} my-4`}>
                                        <label htmlFor={id} className={getLabelClass(name)}>{label}</label>
                                        <input
                                            ref={(el) => inputs.current[i] = el}
                                            type={type === "password" ? (view ? "password" : "text") : type}
                                            name={name}
                                            id={id}
                                            className={theme ? styles.inputBoxLight : styles.inputBoxDark}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            value={userDetails[name]}
                                            onChange={handleUserDetails}
                                            required
                                        />
                                    </div>
                                ))}
                                <div className="text-center my-3">
                                    <input type="submit" className={`btn btn-primary w-25 mt-2 ${styles.submitbtn}`} />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Theme position={true} />
        </div>
    );
}
