import React, { useContext, useState } from 'react';
import styles from "./Toggler.module.css";
import { AppContext } from '../../App';

export const Toggler = ({ toggle }) => {

    const [isToggled, setIsToggled] = useState(toggle || false);
    const { theme } = useContext(AppContext);

    const toggler = () => {
        setIsToggled(prev => !prev);
    }

    return (
        <div className="position-relative">
            <div className={styles.togglerContainer}>
                <div className="d-flex">
                    <div className="cursor-pointer" role="button" onClick={toggler}>
                        <div className={isToggled ? `${styles.togglerCircleOn} bg-light` : (theme ? styles.togglerCircleOffLight : styles.togglerCircleOffDark)}></div>
                        <div className={isToggled ? styles.toggleOn : (theme ? styles.toggleOffLight : styles.toggleOffDark)} />
                    </div>
                </div>
            </div>
        </div>
    );
}
