import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { AxiosConfig } from '../components/axios_config/AxiosConfig';
import { Loader } from '../components/ui_components/Loader';
import { AppContext } from '../App';
import { Theme } from '../components/ui_components/Theme';
import styles from "./ViewSingleBuilding.module.css";

export const WaterBillHistory = () => {

    const { theme } = useContext(AppContext);
    const { doorNo } = useParams();
    const [loading, setLoading] = useState(true);
    const [histories, setHistories] = useState([]);
    const years = [2024, 2025];
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const getWaterBillHistory = async () => {
            try {
                setLoading(false);
                const response = await AxiosConfig().get(`admin/history/${doorNo}`);
                setHistories(response.data.history);
                setLoading(true);
            } catch (err) {
                const msg = err.response?.data?.error || err.response?.data?.message || "Something went wrong";
                toast.error(msg);
                console.log(err.message);
                setLoading(true);
            }
        }
        getWaterBillHistory();
    }, []);

    return (
        <div className={`${theme ? "light-theme" : "dark-theme"} min-vh-100`}>
            <div className="container">
                <div className="row">
                    {!loading && <Loader />}
                    <div className="text-center pt-5">
                        {loading && years.map(year => (
                            <div key={year}>
                                <h1 className={`${theme ? "" : "text-alice"} mt-4`}>Payment Details of <span className={theme ? "text-danger" : "text-warning"}>{doorNo}</span> for the year {year}</h1>
                                <table className={`text-center table-bordered mb-5 pb-5 table-transparent w-100`} >
                                    <thead>
                                        <tr className={`${theme ? styles.tableHeadLight : styles.tableHeadDark}`}>
                                            <th className='py-3 px-4'>Moths</th>
                                            <th className='py-3 px-4'>Paid Date</th>
                                            <th className='py-3 px-4'>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {months.map((month, i) => {
                                            const record = histories.find(record => (record.year == year && record.month == month));
                                            return <tr key={i}>
                                                <th className={`${theme ? "" : "text-alice"} py-3 px-4`}>{month}</th>
                                                <td className={theme ? "" : "text-alice"}>
                                                    {record ? record.paymentDate?.slice(0, 10) : "NILL"}
                                                </td>
                                                <td className={record ? "text-success" : ""}>{record ? "✔" : "❌"}</td>
                                            </tr>
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Theme position={true} />
        </div>
    );
}
