import React from "react";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import '../styles/PageHeader.scss';

function PageHeader() {
    return (
        <div className="page-header">
            <MenuIcon classes={{ root: "page-header__menu-icon" }} />
            <CalendarTodayIcon
                classes={{ root: "page-header__calendar-icon" }}
            />
        </div>
    );
}

export default PageHeader;
