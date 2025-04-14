import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { Navbar } from '../components/layout_components/Navbar';
import { AxiosConfig } from '../components/axios_config/AxiosConfig';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { HousingBoard } from '../components/layout_components/HousingBoard';
import { Search } from "./Search";
import { Settings } from "./Settings";
import { User } from './User';
import { Loader } from '../components/ui_components/Loader';

export const Home = () => {

    const { theme, currentActiveIcon, setCurrentActiveIcon } = useContext(AppContext);
    const navigate = useNavigate();
    const [page, setPage] = useState(null);
    const storedUser = localStorage.getItem("userToken");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUserToken = async () => {
            try {
                setLoading(false);
                const response = await AxiosConfig().post(`/auth/validate`, { user: storedUser }, { withCredentials: true });
                if (!response.data.verified) {
                    toast.error("Your Session has expired Login again");
                    setLoading(true);
                    navigate("/login");
                } else {
                    setLoading(true);
                }
            } catch (err) {
                const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
                toast.error(msg);
                console.log(err.message);
                setLoading(true);
                navigate("/login");
            }
        }
        !storedUser && getUserToken();
    }, []);

    useEffect(() => {
        if (currentActiveIcon == "home") {
            setPage(<HousingBoard />);
        } else if (currentActiveIcon == "search") {
            setPage(<Search />);
        } else if (currentActiveIcon == "settings") {
            setPage(<Settings />);
        } else {
            setPage(<User />);
        }
    }, [currentActiveIcon]);

    if(!loading) {
        return <Loader />
    }

    return (
        <div className={`${theme ? "light-theme" : "dark-theme"} min-vh-100`}>
            {page}
            <div className="col-1">
                <Navbar
                    currentActiveIcon={currentActiveIcon}
                    setCurrentActiveIcon={setCurrentActiveIcon}
                />
            </div>
        </div>
    );
}
