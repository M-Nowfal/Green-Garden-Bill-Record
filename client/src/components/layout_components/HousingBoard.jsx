import React, { useContext } from 'react';
import { Buildings } from './Buildings';
import { AppContext } from '../../App';

export const HousingBoard = () => {

    const { theme } = useContext(AppContext);
    const buildings = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R'];

    return (
        <>
            <div className={`position-fixed text-center py-2 w-100 z-1 ${theme ? "bg-alice" : "bg-black"}`}>
                <h1 className={`${!theme && "text-white"}`}>Buildings</h1>
            </div>
            <div className="container pt-5 pt-sm-0">
                <div className="row">
                    <div className="col-11 ms-3">
                        <div className="d-flex justify-content-center align-items-center vh-100">
                            <div className="container">
                                <div className="row mb-5">
                                    {buildings.map(building => <Buildings key={building} building={building} />)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
