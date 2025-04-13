import React, { useContext } from 'react'
import styles from "./HouseCard.module.css";
import { AppContext } from '../../App';

export const HousesCard = ({ house }) => {

    const { theme } = useContext(AppContext);
    const lastBill = house.waterBills[house.waterBills.length - 1];

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
                                <th>Last Water Bill</th>
                                <th className="ps-3">:</th>
                                <td className="ps-2">{`${lastBill?.month || "N/A" }-${lastBill?.year || "N/A"}`}</td>
                            </tr>
                            <tr><td><hr className="p-1 m-1" /></td></tr>
                            <tr>
                                <th>Payment Date</th>
                                <th className="ps-3">:</th>
                                <td className="ps-2">{lastBill?.paymentDate.slice(0, 10) || "N/A"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
