import React, { useContext } from 'react';
import { AppContext } from '../../App';
import styles from "./HouseTable.module.css";
import { useNavigate } from 'react-router-dom';

export const HousesTable = ({ house }) => {

    const { theme } = useContext(AppContext);
    const navigate = useNavigate();

    const lastBill = house.waterBills[house.waterBills.length - 1];

    return (
        <>
            <tr className={`${theme ? "text-black" : "text-alice"}`}>
                <td className={`py-3 fw-bold ${theme ? styles.doorNoLight : styles.doorNoDark}`}>{house.doorNo}</td>
                <td>{house.owner?.name || "Not Registered"}</td>
                <td>{house.owner?.phone || "N/A"}</td>
                <td title={house.owner?.email || "N/A"}>{house.owner?.email || "N/A"}</td>
                <td>{`${lastBill?.month || "N/A" }-${lastBill?.year || "N/A"}`}</td>
                <td>{lastBill?.paymentDate.slice(0,10) || "N/A"}</td>
                <th><button className={`btn btn-outline-primary btn-sm`} onClick={() => navigate(`/history/${house.doorNo}`)}>View History</button></th>
            </tr>
        </>
    );
}
