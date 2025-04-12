import React, { useContext } from 'react';
import { Link } from "react-router-dom";
import { AppContext } from '../App';

export const PageNotFound = () => {

    const { theme } = useContext(AppContext);
    const light = { background: "linear-gradient(130deg, rgb(122, 193, 255), rgb(203, 231, 255))" };
    const dark = { background: "linear-gradient(120deg, rgb(0, 0, 0), rgba(0, 0, 26, 0.904))" };

    return (
        <div style={theme ? light : dark}>
            <div className="d-flex justify-content-center align-items-center vh-100">
                <div className="row text-center">
                    <div className="col-12">
                        <h1 className={!theme ? "text-alice" : ""}>Page Not Found</h1>
                    </div>
                    <div className="col-12">
                        <Link to="/" className="btn btn-primary">Home</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
