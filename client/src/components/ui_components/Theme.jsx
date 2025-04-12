import React, { useContext } from 'react';
import { AppContext } from '../../App';
import styles from "./Theme.module.css";

export const Theme = ({ position }) => {

    const { theme, setTheme } = useContext(AppContext);

    const changeTheme = () => setTheme(prev => !prev);

    return (
        <div className={position && styles.themeContainer}>
            <i
                role="button"
                className={`${theme ? "bi bi-moon-fill fs-1" : "bi bi-brightness-high-fill text-alice fs-2"} cursor-pointer`}
                onClick={changeTheme}
            />
        </div>
    );
}