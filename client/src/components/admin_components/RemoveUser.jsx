import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import styles from "../auth_components/Auth.module.css";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Theme } from '../ui_components/Theme';
import { AppContext } from '../../App';
import { toast } from 'sonner';
import { AxiosConfig } from '../axios_config/AxiosConfig';
import { Loader } from '../ui_components/Loader';

export const RemoveUser = () => {

    const navigate = useNavigate();
    const { admin } = useLocation().state || {};
    const { theme } = useContext(AppContext);
    const [userDetails, setUserDetails] = useState({ doorNo: "", phoneNo: "", email: "" });
    const [activeField, setActiveField] = useState({ doorNo: false, phoneNo: false, email: false });
    const inputs = useRef({ doorNo: null, phoneNo: null, email: null });
    const [isOtpReseaved, setIsOtpReseaved] = useState(true);
    const fields = [
        { label: "Door No", name: "doorNo", type: "text" },
        { label: "Phone No", name: "phoneNo", type: "number" },
        { label: "E-mail", name: "email", type: "email" },
    ].map(field => ({ ...field, id: useId() }));

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            if (!validateUserDetails()) {
                return;
            }
            setIsOtpReseaved(false);
            const response = await AxiosConfig().post(`/admin/remove-user`, { userDetails });
            if (response.data.otpSent) {
                toast.success(response.data.message);
                navigate("/verifyotp", { state: { auth: "remove-user", userDetails } });
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
        if(!admin) {
            toast.error("Only Admin can access this page");
            navigate("/admin");
        }
        inputs.current[0]?.focus();
    }, []);

    const validateUserDetails = () => {
        if (!/^\d{10}$/.test(userDetails.phoneNo)) {
            toast.error("Enter valid 10-digit phone number");
            inputs.current[2]?.focus();
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
                            <h1 className="text-center text-primary my-3">Remove User</h1>
                            <form onSubmit={handleEditUser}>
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
};
