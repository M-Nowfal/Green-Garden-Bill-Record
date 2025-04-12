import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import styles from "./Auth.module.css";
import { Loader } from "../ui_components/Loader";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Theme } from '../ui_components/Theme';
import { AppContext } from '../../App';
import { toast } from 'sonner';
import { AxiosConfig } from '../axios_config/AxiosConfig';

export const UserRegistration = () => {

    const navigate = useNavigate();
    const { admin } = useLocation().state || {};
    const { theme } = useContext(AppContext);
    const [view, setView] = useState(false);
    const [userDetails, setUserDetails] = useState({ doorNo: "", fName: "", phoneNo: "", email: "", pwd: "", confirmPwd: "" });
    const [activeField, setActiveField] = useState({ doorNo: false, fName: false, phoneNo: false, email: false, pwd: false, confirmPwd: false });
    const inputs = useRef({ doorNo: null, fName: null, phoneNo: null, email: null, pwd: null, confirmPwd: null });
    const [isOtpReseaved, setIsOtpReseaved] = useState(true);
    const fields = [
        { label: "Door No", name: "doorNo", type: "text" },
        { label: "Full Name", name: "fName", type: "text" },
        { label: "Phone No", name: "phoneNo", type: "number" },
        { label: "E-mail", name: "email", type: "email" },
        { label: "Password", name: "pwd", type: "password" },
        { label: "Confirm Password", name: "confirmPwd", type: "password" },
    ].map(field => ({ ...field, id: useId() }));

    const handleRegistration = async (e) => {
        e.preventDefault();
        try {
            if (!validateUserDetails()) {
                return;
            }
            setIsOtpReseaved(false);
            const response = await AxiosConfig().post(`/auth/register`, { email: userDetails.email });
            if (response.data.otpSent) {
                toast.success(response.data.message);
                setIsOtpReseaved(true);
                navigate("/verifyotp", { state: { auth: "register", userDetails } });
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
            setIsOtpReseaved(true);
        }
    };

    useEffect(() => {
        if(!admin) {
            toast.error("Only admin can access this page, If you are new User ask the admin to register you");
            navigate("/");
        }
        inputs.current[0]?.focus();
    }, []);

    const validateUserDetails = () => {
        if (userDetails.pwd !== userDetails.confirmPwd) {
            toast.error("Password Do not match");
            inputs.current[4]?.focus();
            return false;
        }
        if (!/^\d{10}$/.test(userDetails.phoneNo)) {
            toast.error("Enter valid 10-digit phone number");
            inputs.current[2]?.focus();
            return false;
        }
        if (!/^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i.test(userDetails.email)) {
            toast.error("Enter a valid E-mail address");
            inputs.current[3]?.focus();
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
                            <h1 className="text-center text-primary my-3">Registeration</h1>
                            <form onSubmit={handleRegistration}>
                                {fields.map(({ id, label, name, type }, i) => (
                                    <div key={id} className={`${styles.inputContainer} my-4`}>
                                        <label htmlFor={id} className={getLabelClass(name)}>{label}</label>
                                        <input
                                            ref={(el) => inputs.current[i] = el}
                                            type={type === "password" ? (view ? "text" : "password") : type}
                                            name={name}
                                            value={userDetails[name]}
                                            id={id}
                                            className={theme ? styles.inputBoxLight : styles.inputBoxDark}
                                            onFocus={handleFocus}
                                            onBlur={handleBlur}
                                            onChange={handleUserDetails}
                                            required
                                        />
                                    </div>
                                ))}
                                <div className="ms-2">
                                    <input
                                        type="checkbox"
                                        checked={view}
                                        id="show-pwd"
                                        className={styles.showPwdCheckBox}
                                        onChange={() => setView(prev => !prev)}
                                    />
                                    <label htmlFor="show-pwd" className={`${theme ? "text-black" : "text-alice"} ps-3`}>Show Password</label>
                                </div>
                                <div className="text-center my-3">
                                    <input
                                        type="submit"
                                        className={`btn btn-primary w-25 mt-2 ${styles.submitbtn}`}
                                    />
                                </div>
                            </form>
                            <div className="text-end pe-4 my-2">
                                <Link className="link" to="/login">Already have an account</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Theme position={true} />
        </div>
    );
};
