import React, { useCallback } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import "../styles/PageHeader.scss";

interface IProps {
    onMenuClick: React.MouseEventHandler;
    onTodayClick: React.MouseEventHandler;
}

function PageHeader(props: IProps) {
    const onMenuClick = useCallback(
        e => {
            props.onMenuClick(e);
        },
        [props.onMenuClick]
    );
    const onTodayClick = useCallback(
        e => {
            props.onTodayClick(e);
        },
        [props.onTodayClick]
    );
    return (
        <div className="page-header">
            <MenuIcon
                onClick={onMenuClick}
                classes={{ root: "page-header__menu-icon" }}
            />
            <CalendarTodayIcon
                classes={{ root: "page-header__calendar-icon" }}
                onClick={onTodayClick}
            />
        </div>
    );
}

export default PageHeader;
