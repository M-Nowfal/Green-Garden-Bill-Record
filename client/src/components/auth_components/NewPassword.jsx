import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import { AppContext } from '../../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader } from '../ui_components/Loader';
import styles from "./Auth.module.css";
import { Theme } from '../ui_components/Theme';
import { toast } from 'sonner';
import { AxiosConfig } from '../axios_config/AxiosConfig';

export const NewPassword = () => {

    const { theme } = useContext(AppContext);
    const navigate = useNavigate();
    const [userDetails, setUserDetails] = useState({ password: "", confirmPassword: "" });
    const [isPwdChanged, setIsPwdChanged] = useState(true);
    const { email } = useLocation().state || {};
    const [activeField, setActiveField] = useState({ password: false, confirmPassword: false });
    const inputs = useRef({ password: null, confirmPassword: null });
    const fields = [
        { label: "Password", name: "password", type: "text" },
        { label: "Confirm Password", name: "confirmPassword", type: "password" },
    ].map(field => ({ ...field, id: useId() }));

    const handleChangePassword = async (e) => {
        e.preventDefault();
        try {
            if (!validateUserDetails()) {
                return;
            }
            setIsPwdChanged(false);
            const response = await AxiosConfig().post("/user/change-password", { userDetails, email });
            if (response.data.changed) {
                toast.success(response.data.message);
                setIsPwdChanged(true);
                navigate("/");
            }
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
            setIsPwdChanged(true);
        }
    }

    useEffect(() => {
        inputs.current[0]?.focus();
    }, []);

    const validateUserDetails = () => {
        if (userDetails.password.length < 6 || userDetails.password.length > 15) {
            toast.error("Enter a valid Password between 6 to 15 characters long");
            inputs.current[0]?.focus();
            return false;
        } else if(userDetails.password !== userDetails.confirmPassword) {
            toast.error("Password do not match");
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
                {!isPwdChanged && <Loader />}
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-4">
                        <div className={theme ? styles.containerLight : styles.containerDark}>
                            <h1 className="text-center text-primary my-3">{"New Password"}</h1>
                            <form onSubmit={handleChangePassword}>
                                {fields.map(({ id, label, name, type }, i) => (
                                    <div key={id} className={`${styles.inputContainer} my-4`}>
                                        <label htmlFor={id} className={getLabelClass(name)}>{label}</label>
                                        <input
                                            ref={(el) => inputs.current[i] = el}
                                            type={type}
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
