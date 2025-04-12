import React, { useContext } from 'react';
import { AppContext } from '../../App';
import styles from "./HouseTable.module.css";

export const HousesTable = ({ house }) => {

    const { theme } = useContext(AppContext);

    return (
        <>
            <tr className={`${theme ? "text-black" : "text-alice"}`}>
                <td className={`py-3 fw-bold ${theme ? styles.doorNoLight : styles.doorNoDark}`}>{house.doorNo}</td>
                <td>{house.owner?.name || "Not Registered"}</td>
                <td>{house.owner?.phone || "N/A"}</td>
                <td title={house.owner?.email || "N/A"}>{house.owner?.email || "N/A"}</td>
                <td>{house.owner?.lastPaidOn || "N/A"}</td>
            </tr>
        </>
    );
}
