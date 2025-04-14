import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { useLocation, useNavigate } from 'react-router-dom';
import { Theme } from '../components/ui_components/Theme';
import styles from "./ViewSingleBuilding.module.css";
import { HousesTable } from '../components/layout_components/HousesTable';
import { toast } from 'sonner';
import { AxiosConfig } from '../components/axios_config/AxiosConfig';
import { HousesCard } from '../components/layout_components/HousesCard';
import { Loader } from '../components/ui_components/Loader';

export const ViewSingleBuilding = () => {

    const { theme } = useContext(AppContext);
    const { building, houses } = useLocation().state || {};
    const navigate = useNavigate();
    const width = useScreenWidth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return () => window.scrollTo(0, 0);
    }, [building]);

    function useScreenWidth() {
        const [screenWidth, setScreenWidth] = useState(() =>
            typeof window !== "undefined" ? window.innerWidth : 0
        );

        useEffect(() => {
            const handleResize = () => setScreenWidth(window.innerWidth);
            window.addEventListener("resize", handleResize);
            handleResize();

            return () => window.removeEventListener("resize", handleResize);
        }, []);

        return screenWidth;
    }

    const handleNextPage = async () => {
        try {
            let nextBuilding = String.fromCharCode(building.charCodeAt(0) + 1);
            if (nextBuilding == "I") {
                nextBuilding = "J";
            }
            setLoading(false);
            const response = await AxiosConfig().get(`/building/${nextBuilding}`);
            const houses = response.data.buildingDetails?.houses;
            setLoading(true);
            navigate("/view-single-building", { state: { building: nextBuilding, houses } });
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
            setLoading(true);
        }
    };

    const handlePreviousPage = async () => {
        try {
            let previousBuilding = String.fromCharCode(building.charCodeAt(0) - 1);
            if (previousBuilding == "I") {
                previousBuilding = "H";
            }
            setLoading(false);
            const response = await AxiosConfig().get(`/building/${previousBuilding}`);
            const houses = response.data.buildingDetails?.houses;
            setLoading(true);
            navigate("/view-single-building", { state: { building: previousBuilding, houses } });
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
            setLoading(true);
        }
    };

    if(!loading) {
        return <Loader />
    }

    return (
        <>
            <div className={`${theme ? "light-theme" : "dark-theme"} min-vh-100`}>
                <div className={`cursor-pointer`}>
                    <i className={`${theme ? "" : "text-alice"} fa-solid fa-arrow-left fs-5 ps-3 pt-4`} onClick={() => navigate("/")} />
                </div>
                <div className="d-flex justify-content-center py-3">
                    <h1 className={`${theme ? "text-black" : "text-alice"} fw-bold ${styles.blockName}`}>{building}-Block</h1>
                </div>
                <div className="mx-lg-5 pb-5">
                    <div className="row mx-3 pb-5">
                        {width > 700 ? (<table className="text-center table-bordered">
                            <thead>
                                <tr className={`${theme ? styles.tableHeadLight : styles.tableHeadDark}`}>
                                    <th className="py-3">Door No</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>E-mail</th>
                                    <th>Last Water Bill</th>
                                    <th>Paid Date</th>
                                    <th>History</th>
                                </tr>
                            </thead>
                            <tbody>
                                {houses?.length > 0 && houses?.map(house => (
                                    <HousesTable
                                        key={house.doorNo}
                                        house={house}
                                    />
                                ))}
                            </tbody>
                        </table>) : (
                            houses?.length > 0 && houses?.map(house => (
                                <HousesCard
                                    key={house.doorNo}
                                    house={house}
                                />
                            ))
                        )}
                    </div>
                    <div className="text-center">
                        {building != "A" && <button className={`${theme ? styles.tableHeadLight : styles.tableHeadDark} ${styles.btn}`} onClick={handlePreviousPage} >Previous</button>}
                        {building != "R" && <button className={`${theme ? styles.tableHeadLight : styles.tableHeadDark} ${styles.btn}`} onClick={handleNextPage} >Next</button>}
                    </div>
                </div>
                <Theme position={true} />
            </div>
        </>
    );
}
