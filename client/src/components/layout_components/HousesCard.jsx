import React, { useContext } from 'react'
import styles from "./HouseCard.module.css";
import { AppContext } from '../../App';

export const HousesCard = ({ house }) => {

    const { theme } = useContext(AppContext);

    return (
        <div className="col-12 col-sm-6">
            <div className="d-flex justify-content-center">
                <div className={theme ? styles.housesCardContainerLight : styles.housesCardContainerDark}>
                    <table>
                        <tbody>
                            <tr>
                                <th>Door No</th>
                                <th className="ps-3">:</th>
                                <td className={`${theme ? styles.doorNoLight : styles.doorNoDark} ps-2 fw-bold`}>{house.doorNo}</td>
                            </tr>
                            <tr><td><hr className="p-1 m-1" /></td></tr>
                            <tr>
                                <th>Name</th>
                                <th className="ps-3">:</th>
                                <td className="ps-2">{house.owner?.name || "Not Registered"}</td>
                            </tr>
                            <tr><td><hr className="p-1 m-1" /></td></tr>
                            <tr>
                                <th>Phone</th>
                                <th className="ps-3">:</th>
                                <td className="ps-2">{house.owner?.phone || "N/A"}</td>
                            </tr>
                            <tr><td><hr className="p-1 m-1" /></td></tr>
                            <tr>
                                <th>E-mail</th>
                                <th className="ps-3">:</th>
                                <td className="ps-2">
                                    <div className={`${styles.emailText}`} title={house.owner?.email || "N/A"}>
                                        {house.owner?.email || "N/A"}
                                    </div>
                                </td>
                            </tr>
                            <tr><td><hr className="p-1 m-1" /></td></tr>
                            <tr>
                                <th>Last Bill</th>
                                <th className="ps-3">:</th>
                                <td className="ps-2">{house.lastPaidOn || "JN/A"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
