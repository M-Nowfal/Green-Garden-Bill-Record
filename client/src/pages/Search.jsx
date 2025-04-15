import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../App';
import { AxiosConfig } from '../components/axios_config/AxiosConfig';
import { toast } from 'sonner';
import { Loader } from '../components/ui_components/Loader';
import styles from "./ViewSingleBuilding.module.css";
import { HousesCard } from '../components/layout_components/HousesCard';
import { HousesTable } from '../components/layout_components/HousesTable';

export const Search = () => {

    const { theme, setCurrentActiveIcon } = useContext(AppContext);
    const [buildings, setBuildings] = useState([]);
    const [filteredBuilding, setFilteredBuilding] = useState([]);
    const [isBuildingFetched, setIsBuildingFetched] = useState(true);
    const [top, setTop] = useState(false);

    useEffect(() => {
        setIsBuildingFetched(false);
        const getAllBuildings = async () => {
            try {
                const response = await AxiosConfig().get("/building/get-all-buildings");
                setBuildings(response.data.buildings);
                setFilteredBuilding(response.data.buildings);
                setIsBuildingFetched(true);
            } catch (err) {
                const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
                toast.error(msg);
                console.log(err.message);
                setIsBuildingFetched(true);
            }
        }
        getAllBuildings();
    }, []);

    useEffect(() => {
        return () => window.scrollTo(0, 0);
    }, [top]);

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
    };

    function handleSearch(e) {

        let input = e.target.value.trim().toUpperCase();
        if (input.length === 0) {
            setFilteredBuilding(buildings);
            return;
        };
        input = input.replace("-", "");
        input = input.replace(" ", "");
        if (input.length == 1) {
            setFilteredBuilding(buildings.filter(building => (
                building.name == input[0]
            )));
            return;
        } else {
            let block, houses, home;
            block = buildings.filter(b => (
                b.name == input[0]
            ));
            houses = block[0]?.houses;
            home = houses?.filter(h => (
                h.doorNo == `${input[0]}-${input.slice(1)}`
            ));
            const fBuilding = [{
                name: input[0],
                houses: home,
            }];
            setFilteredBuilding(fBuilding);
            return;
        }
    }

    const width = useScreenWidth();

    if (!isBuildingFetched) {
        return (
            <Loader />
        );
    }

    return (
        <div className={`${theme ? "light-theme" : "dark-theme"} min-vh-100`}>
            <div className={`cursor-pointer`}>
                <i className={`${theme ? "" : "text-alice"} fa-solid fa-arrow-left fs-5 ps-3 pt-4`} onClick={() => setCurrentActiveIcon("home")} />
            </div>
            <div className="text-center">
                <input
                    type="search"
                    className="w-75 rounded p-2 fs-4"
                    name="search"
                    onChange={handleSearch}
                    maxLength={4}
                    placeholder="Enter the Door No: G-20"
                />
            </div>
            <div className={`cursor-pointer position-fixed`} style={{ right: "20px", bottom: "80px" }}>
                <i className={`${theme ? "" : "text-alice"} fs-4 fa-solid fa-arrow-up`} onClick={() => setTop(!top)} />
            </div>
            {filteredBuilding.map((building, i) => (
                <div key={i} className="me-md-5 pe-md-5">
                    <div className="d-flex justify-content-center py-3">
                        <h1 className={`${theme ? "text-black" : "text-alice"} fw-bold ${styles.blockName}`}>{building.name}-Block</h1>
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
                                        <th>Payment Date</th>
                                        <th>History</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {building.houses?.length > 0 && building.houses?.map(house => (
                                        <HousesTable
                                            key={house.doorNo}
                                            house={house}
                                        />
                                    ))}
                                </tbody>
                            </table>) : (
                                building.houses?.length > 0 && building.houses?.map(house => (
                                    <HousesCard
                                        key={house.doorNo}
                                        house={house}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}