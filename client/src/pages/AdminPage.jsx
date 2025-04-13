import React, { useContext } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../components/ui_components/Theme';

export const AdminPage = () => {

    const { theme } = useContext(AppContext);
    const navigate = useNavigate();

    const options = [
        { title: "Register new User", to: "/register" },
        { title: "Edit existing User", to: "/edit-user" },
        { title: "Remove User", to: "/remove-user" },
        { title: "Record Water Bill Payment", to: "/recordwaterbill" },
    ];

    return (
        <div className={`vh-100 ${theme ? "light-theme" : "dark-theme"}`}>
            <div className={`cursor-pointer`} onClick={() => navigate("/admin")}>
                <i className={`${theme ? "" : "text-alice"} fa-solid fa-arrow-left fs-5 ps-3 pt-4`} />
            </div>
            <div className="row m-0">
                <div className="col-12 col-lg-11">
                    <div>
                        <h1 className={`${theme ? "" : "text-success"} text-center`} >Admin Page</h1>
                        <hr className={theme ? "" : "text-white"} />
                        {options.map(option => (
                            <div key={option.title}>
                                <div className="position-relative mt-4 ms-5">
                                    <h4
                                        className={` cursor-pointer ${theme ? "" : "text-alice"}`}
                                        onClick={() => navigate(option.to, { state: { admin: true } })} >
                                        {option.title}
                                    </h4>
                                </div>
                                <hr className={theme ? "" : "text-white"} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Theme position={true} />
        </div>
    );
}
