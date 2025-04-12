import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const Admin = () => {

    const { theme } = useContext(AppContext);
    const [adminPass, setAdminPass] = useState("");
    const navigate = useNavigate();

    function handleAdmin(e) {
        e.preventDefault();
        if (adminPass === import.meta.env.VITE_ADMIN_PASS) {
            toast.success("Welcome to Admin Page");
            navigate("/adminpage", { state: { admin: true } });
        } else {
            toast.error(`Password ${adminPass} is Incorrect `);
        }
    }

    return (
        <div className={`${theme ? "light-theme" : "dark-theme"} min-vh-100`}>
            <div className={`cursor-pointer`}>
                <i className={`${theme ? "" : "text-alice"} fa-solid fa-arrow-left fs-5 ps-3 pt-4`} onClick={() => navigate("/")} />
            </div>
            <div className="text-center mx-2 mx-md-5" >
                <form onSubmit={handleAdmin} style={{
                    marginTop: "150px",
                    border: theme ? "1px solid black" : "1px solid white",
                    borderRadius: "10px",
                    padding: "10px 20px",
                    width: "100%",
                    boxShadow: theme ? "0px 0px 10px black" : "0px 0px 10px aliceblue"
                }}>
                    <label htmlFor="admin-password" className={`mb-4 fs-1 fw-bold ${theme ? "" : "text-alice"}`}>Admin Password</label><br />
                    <input
                        type="text"
                        name="adminPwd"
                        id="admin-password"
                        style={{
                            width: "65%",
                            padding: "15px",
                            background: theme ? "linear-gradient(130deg, rgb(122, 193, 255), rgb(203, 231, 255))" : "linear-gradient(120deg, rgb(0, 0, 0), rgba(0, 0, 26, 0.904))",
                            color: theme ? "black" : "white",
                            border: "none",
                            outline: theme ? "1px solid black" : "1px solid aliceblue",
                            borderRadius: "10px"
                        }}
                        onChange={(e) => setAdminPass(e.target.value)}
                    /><br />
                    <input type="submit" className="btn btn-success w-25 mt-5 btn-lg" />
                </form>
            </div>
        </div>
    );
}
