import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import styles from "./Auth.module.css";
import { Link, useNavigate } from 'react-router-dom';
import { Theme } from '../ui_components/Theme';
import { AppContext } from '../../App';
import { toast } from 'sonner';
import { AxiosConfig } from '../axios_config/AxiosConfig';
import { Loader } from '../ui_components/Loader';

export const LogIn = () => {

    const navigate = useNavigate();
    const { theme } = useContext(AppContext);
    const [view, setView] = useState(true);
    const [userDetails, setUserDetails] = useState({ doorNo: "", fName: "", phoneNo: "", email: "", pwd: "" });
    const [activeField, setActiveField] = useState({ doorNo: false, fName: false, phoneNo: false, email: false, pwd: false });
    const inputs = useRef({ doorNo: null, fName: null, phoneNo: null, email: null, pwd: null });
    const [isOtpReseaved, setIsOtpReseaved] = useState(true);
    const fields = [
        { label: "Door No", name: "doorNo", type: "text" },
        { label: "Full Name", name: "fName", type: "text" },
        { label: "Phone No", name: "phoneNo", type: "number" },
        { label: "E-mail", name: "email", type: "email" },
        { label: "Password", name: "pwd", type: "password" },
    ].map(field => ({ ...field, id: useId() }));

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            if (!validateUserDetails()) {
                return;
            }
            setIsOtpReseaved(false);
            const response = await AxiosConfig().post(`/user/login`, { userDetails });
            if (response.data.otpSent) {
                navigate("/verifyotp", { state: { auth: "login", userDetails } });
                toast.success(response.data.message);
                setIsOtpReseaved(true);
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
            setIsOtpReseaved(true);
        }
    };

    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    const validateUserDetails = () => {
        if (!/^\d{10}$/.test(userDetails.phoneNo)) {
            toast.error("Enter valid 10-digit phone number");
            inputs.current[2]?.focus();
            return false;
        }
        if (userDetails.pwd.length < 6 || userDetails.pwd.length > 15) {
            toast.error("Password must be between 6 and 15 characters long.");
            inputs.current[4]?.focus();
            return false;
        }
        const credentials = {
            len: userDetails.doorNo.split("").length > 4,
            buildingName: !/^[A-HJ-R]$/.test(userDetails.doorNo[0]),
            sep: !(userDetails.doorNo[1] === " " || userDetails.doorNo[1] === "-"),
            door: (() => {
                const door = parseInt(userDetails.doorNo.slice(2) || 0, 10);
                return door < 1 || door > 24;
            })()
        };
        if (credentials.len || credentials.buildingName || credentials.sep || credentials.door) {
            toast.error("Enter a valid Door No like A-01");
            inputs.current[0]?.focus();
            return false;
        }
        if (!/^[A-Za-z. ]+$/.test(userDetails.fName)) {
            toast.error("Enter a correct Full Name");
            inputs.current[1]?.focus();
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

    const getEyeClass = () => {
        const eye = "fa-solid fa-eye";
        const eyeslash = "fa-solid fa-eye-slash";
        return `${view ? eye : eyeslash} ${theme ? styles.eyeIconLight : styles.eyeIconDark}`;
    }

    return (
        <div className={`container-fluid ${theme ? styles.authContainerLight : styles.authContainerDark}`}>
            <div className="row">
                {!isOtpReseaved && <Loader />}
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                        <div className={theme ? styles.containerLight : styles.containerDark}>
                            <h1 className="text-center text-primary my-3">Login</h1>
                            <form onSubmit={handleLogin}>
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
                                        {type === "password" && (
                                            <i
                                                className={getEyeClass()}
                                                onClick={() => setView(prev => !prev)}
                                                role="button"
                                                aria-label={view ? "Hide password" : "Show password"}
                                                tabIndex={0}
                                            />
                                        )}
                                    </div>
                                ))}
                                <div className="text-center my-3">
                                    <input type="submit" className={`btn btn-primary w-25 mt-2 ${styles.submitbtn}`} />
                                </div>
                            </form>
                            <div className="d-flex">
                                <div className="me-auto m-2">
                                    <Link className="link" to="/forgotpwd">Forgot Password</Link>
                                </div>
                                <div className="ms-auto m-2">
                                    <Link className="link" to="/register">New User SignIn</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Theme position={true} />
        </div>
    );
};
