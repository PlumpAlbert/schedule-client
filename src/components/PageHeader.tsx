import React, { useCallback } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import "../styles/PageHeader.scss";

interface IProps {
    onMenuClick: React.MouseEventHandler;
}

function PageHeader({ onMenuClick }: IProps) {
    const onClick = useCallback(
        e => {
            onMenuClick(e);
        },
        [onMenuClick]
    );
    return (
        <div className="page-header">
            <MenuIcon
                onClick={onClick}
                classes={{ root: "page-header__menu-icon" }}
            />
            <CalendarTodayIcon
                classes={{ root: "page-header__calendar-icon" }}
            />
        </div>
    );
}

export default PageHeader;
