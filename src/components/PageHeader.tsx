import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react";
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
    const [searchValue, setSearchValue] = useState("");
    const [showSearchInput, setShowSearchInput] = useState<
        "full" | "icon" | "none"
    >(!!searchValue ? "full" : "none");
    const location = useLocation();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleMenuClick = useCallback(e => onMenuClick(e), [onMenuClick]);
    const handleTodayClick = useCallback(e => onTodayClick(e), [onTodayClick]);
    const handleSearchIconClick = useCallback(() => {
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
        setShowSearchInput("full");
    }, [setShowSearchInput]);
    const handleSearchInputBlur = useCallback(
        e => {
            if (!e.target.value) {
                setShowSearchInput("icon");
            }
        },
        [setShowSearchInput]
    );
    const handleEnterClick = useCallback(() => {
        alert("Should implement this feature");
    }, []);
    const handleSearchValueChanged = useCallback<
        React.ChangeEventHandler<HTMLInputElement>
    >(
        ({ target }) => {
            setSearchValue(target.value);
        },
        [setSearchValue]
    );

    useEffect(() => {
        switch (location.pathname) {
            case "/":
                setShowSearchInput("icon");
                break;
            default:
                setShowSearchInput("none");
                break;
        }
    }, [location.pathname]);
    useEffect(() => {
        if (!menuIsShown) setShowSearchInput("none");
        else if (searchValue) setShowSearchInput("full");
    }, [menuIsShown]);

    const rightSideIcon = useMemo(() => {
        if (
            showSearchInput === "full" ||
            showSearchInput === "icon" ||
            menuIsShown
        ) {
            return (
                <TextField
                    className="page-header__search-input-wrapper"
                    variant="standard"
                    onBlur={handleSearchInputBlur}
                    placeholder="Введите название группы"
                    value={searchValue}
                    onChange={handleSearchValueChanged}
                    InputProps={{
                        inputRef: searchInputRef,
                        classes: {
                            root: `page-header__search-input${
                                showSearchInput === "full"
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
            );
        }
        if (location.pathname === "/schedule" && !menuIsShown) {
            return (
                <CalendarTodayIcon
                    classes={{ root: "page-header__calendar-icon" }}
                    onClick={handleTodayClick}
                />
            );
        }
    }, [
        showSearchInput,
        menuIsShown,
        location.pathname,
        handleSearchValueChanged,
        searchValue
    ]);

    return (
        <div className="page-header">
            <MenuIcon
                onClick={handleMenuClick}
                classes={{ root: "page-header__menu-icon" }}
            />
            {rightSideIcon}
        </div>
    );
}

export default PageHeader;
