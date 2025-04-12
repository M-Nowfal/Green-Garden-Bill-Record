import React, { useContext, useState } from 'react';
import { Toggler } from "../components/ui_components/Toggler"
import { AppContext } from '../App';
import styles from "./Settings.module.css";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Settings = () => {

    const { theme, setCurrentActiveIcon } = useContext(AppContext);
    const navigate = useNavigate();
    const [settings, setSettings] = useState({ Vibration: false, Notification: false });
    const options = ["Vibration", "Notification", "Change Password", "Login", "Logout", "Admin"];

    function handleOnClick(option) {
        if (option == options[2]) {
            navigate("/forgotpwd", { state: { changePwd: true } });
        } else if (option == options[3]) {
            navigate("/login");
        } else if (option == options[4]) {
            navigate("/logout");
        } else if (option == options[5]) {
            navigate("/admin");
        }
    }

    return (
        <div className="container-fluid p-5">
            <div className={`${styles.backBtn} cursor-pointer`} onClick={() => setCurrentActiveIcon("home")}>
                <i className={`${theme ? "" : "text-alice"} fa-solid fa-arrow-left fs-5 ps-3 pt-4`} />
            </div>
            <div className={theme ? styles.settingsLight : styles.settingsDark}>
                <div className="row">
                    <div className="col-12 col-lg-11">
                        <h1><i className="fa-solid fa-gear rotate" /> Settings</h1>
                        <hr />
                        {options.map((option, i) => (
                            <div key={option}>
                                <div className="position-relative">
                                    <h4
                                        className="cursor-pointer"
                                        onClick={() => handleOnClick(option)}
                                    >{i < 2 ? (settings[option] ? "Disable" : "Enable") : ""} {option}</h4>
                                    {i < 2 && <div role="button" className={`me-sm-4 me-lg-5 ${styles.settingsTogglerContainer}`} onClick={() => setSettings(prev => ({ ...prev, [option]: !prev[option] }))}>
                                        <Toggler toggle={settings[option]} />
                                    </div>}
                                </div>
                                <hr />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
