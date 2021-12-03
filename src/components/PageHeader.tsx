import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import SearchIcon from "@mui/icons-material/Search";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import "../styles/PageHeader.scss";

interface IProps {
    onMenuClick: React.MouseEventHandler;
    onTodayClick: React.MouseEventHandler;
    menuIsShown: boolean;
}

function PageHeader({ onMenuClick, onTodayClick, menuIsShown }: IProps) {
    const [showSearchInput, setShowSearchInput] = useState(false);
    const location = useLocation();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleMenuClick = useCallback(e => onMenuClick(e), [onMenuClick]);
    const handleTodayClick = useCallback(e => onTodayClick(e), [onTodayClick]);
    const handleSearchIconClick = useCallback(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
        setShowSearchInput(true);
    }, [setShowSearchInput]);
    const handleEnterClick = useCallback(() => {
        alert("Should implement this feature");
    }, []);

    useEffect(() => {
        switch (location.pathname) {
            case "/":
                setShowSearchInput(true);
                break;
            default:
                break;
        }
    }, [location.pathname]);

    return (
        <div className="page-header">
            <MenuIcon
                onClick={handleMenuClick}
                classes={{ root: "page-header__menu-icon" }}
            />
            {showSearchInput || menuIsShown ? (
                <TextField
                    className="page-header__search-input-wrapper"
                    variant="standard"
                    onBlur={e => {
                        if (!e.target.value) {
                            console.log("setShowSearchInput - false");
                            setShowSearchInput(false);
                        }
                    }}
                    placeholder="Введите название группы"
                    InputProps={{
                        inputRef: searchInputRef,
                        classes: {
                            root: `page-header__search-input${
                                showSearchInput
                                    ? " page-header__search-input--display"
                                    : ""
                            }`
                        },
                        startAdornment: (
                            <InputAdornment
                                position="start"
                                onClick={handleSearchIconClick}
                            >
                                <SearchIcon className="page-header__search-input-icon" />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment
                                className="page-header__search-input-enter"
                                position="end"
                                onClick={handleEnterClick}
                            >
                                <ArrowRightIcon />
                            </InputAdornment>
                        )
                    }}
                />
            ) : (
                <CalendarTodayIcon
                    classes={{ root: "page-header__calendar-icon" }}
                    onClick={handleTodayClick}
                />
            )}
        </div>
    );
}

export default PageHeader;
