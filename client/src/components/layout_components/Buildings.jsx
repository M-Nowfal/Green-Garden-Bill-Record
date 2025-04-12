import React, { useContext } from 'react';
import styles from "./Buildings.module.css";
import { AppContext } from '../../App';
import { toast } from 'sonner';
import { AxiosConfig } from '../axios_config/AxiosConfig';
import { useNavigate } from 'react-router-dom';

export const Buildings = ({ building }) => {

    const { theme } = useContext(AppContext);
    const navigate = useNavigate();

    const getBuilding = async () => {
        try {
            const response = await AxiosConfig().get(`/building/${building}`);
            // toast.success(response.data.message);
            const houses = response.data.buildingDetails.houses;
            navigate("/view-single-building", { state: { building, houses } });
        } catch (err) {
            const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
            toast.error(msg);
            console.log(err.message);
        }
    };

    return (
        <div className="col-6 col-sm-4 col-md-3 col-lg-2">
            <div
                role="button"
                className={theme ? styles.buildingCardLight : styles.buildingCardDark}
                onClick={getBuilding}
            >
                <h1>{building}</h1>
            </div>
        </div>
    );
}
