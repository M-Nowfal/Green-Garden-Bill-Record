import React, { useContext, useRef } from 'react';
import styles from "./Navbar.module.css";
import { AppContext } from '../../App';
import { Theme } from '../ui_components/Theme';
import { toast } from 'sonner';

export const Navbar = ({currentActiveIcon, setCurrentActiveIcon}) => {
    const { theme } = useContext(AppContext);
    const activeIcon = useRef("home");

    const icons = [
        { name: "home", class: "bi bi-house-door-fill", size: "fs-2" },
        { name: "search", class: "bi bi-search", size: "fs-2" },
        { name: "settings", class: "bi bi-gear", size: "fs-2" },
        { name: "user", class: "fa-solid fa-user", size: "fs-1 pt-1" },
    ];

    return (
        <div className={`${styles.navbarContainer} ${theme ? styles.navbarContainerLight : styles.navbarContainerDark}`}>
            <div className={`d-flex justify-content-between align-items-center ${styles.navbarIconContainer}`}>
                {icons.map(icon => (
                    <div
                        key={icon.name}
                        className={currentActiveIcon === icon.name
                            ? (theme ? styles.activeNavbarIconLight : styles.activeNavbarIconDark)
                            : styles.iconBG
                        }
                    >
                        <i
                            className={`${icon.class} ${theme ? "" : "text-alice"} ${icon.size} cursor-pointer`}
                            onClick={() => {
                                activeIcon.current = icon.name;
                                setCurrentActiveIcon(icon.name);
                            }}
                        />
                    </div>
                ))}
                <Theme />
            </div>
        </div>
    );
};
