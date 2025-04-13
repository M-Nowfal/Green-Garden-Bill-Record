import React, { useContext, useEffect, useState } from 'react';
import styles from "./User.module.css";
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosConfig } from '../components/axios_config/AxiosConfig';
import { Loader } from '../components/ui_components/Loader';

export const User = () => {

    const { theme, setCurrentActiveIcon } = useContext(AppContext);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getUser = async () => {
            try {
                const response = await AxiosConfig().post("/user/get-user", { user: localStorage.getItem("userToken") });
                setUser(response.data.user);
            } catch (err) {
                const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
                toast.error(msg);
                console.log(err.message);
            }
        }
        getUser();
    }, []);

    if (!user) {
        return (
            <Loader />
        );
    }

    return (
        <div className="container">
            <div className={`cursor-pointer position-absolute`} onClick={() => setCurrentActiveIcon("home")}>
                <i className={`${theme ? "" : "text-alice"} fa-solid fa-arrow-left fs-5 ps-3 pt-4`} />
            </div>
            <div className="row">
                <div className="col-11 ms-3">
                    <div className="d-flex justify-content-center align-items-center vh-100">
                        <div className={`${theme ? styles["user-container-light"] : styles["user-container-dark"]}`}>
                            <div className="text-center m-3">
                                <i className={`fa-solid fa-user text-alice fs-1`} />
                            </div>
                            <table>
                                <tbody>
                                    <tr>
                                        <th className="p-2">Door No &nbsp;</th>
                                        <th className="ps-2">:</th>
                                        <td className="ps-2">{user ? user.doorNo : "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-2">Name &nbsp;</th>
                                        <th className="ps-2">:</th>
                                        <td className="ps-2">{user ? user.fName : "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-2">Phone &nbsp;</th>
                                        <th className="ps-2">:</th>
                                        <td className="ps-2">{user ? user.phoneNo : "N/A"}</td>
                                    </tr>
                                    <tr>
                                        <th className="p-2">E-mail &nbsp;</th>
                                        <th className="ps-2">:</th>
                                        <td className="ps-2">{user ? user.email : "N/A"}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="text-center">
                                <button className={styles.btn} onClick={() => navigate("/logout")}>
                                    Log-out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
