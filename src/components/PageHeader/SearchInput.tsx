import React, {useCallback, useRef} from "react";
import {useNavigate} from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import IconWrapper from "@mui/material/Icon";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Collapse from "@mui/material/Collapse";
import {SearchDisplay, actions as headerActions} from "../../store/app/header";
import {useSelector, useDispatch} from "../../store";

const SearchInput = () => {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const {variant, value} = useSelector(state => ({
		variant: state.application.header.searchDisplay,
		value: state.application.header.searchValue,
	}));

	//#region ACTION CREATORS
	const setSearchDisplayType = useCallback(
		(type: SearchDisplay) => {
			dispatch(headerActions.setSearchDisplay(type));
		},
		[dispatch]
	);

	const setSearchValue = useCallback(
		(value: string) => {
			dispatch(headerActions.setSearchValue(value));
		},
		[dispatch]
	);
	//#endregion

	//#region CALLBACKS
	const handleEnterPress = useCallback(
		e => {
			if (e.key && e.key !== "Enter") {
				return;
			}
			navigate(`/search?q=${value}`);
		},
		[value]
	);

	const handleSearchValueChanged = useCallback<
		React.ChangeEventHandler<HTMLInputElement>
	>(
		({target}) => {
			setSearchValue(target.value);
		},
		[setSearchValue]
	);

	const handleSearchIconClick = useCallback(() => {
		if (searchInputRef.current) {
			searchInputRef.current.focus();
		}
		setSearchDisplayType(SearchDisplay.FULL);
	}, [setSearchDisplayType]);

	const handleSearchInputBlur = useCallback(
		e => {
			if (!e.target.value) {
				setSearchDisplayType(SearchDisplay.ICON);
			}
		},
		[setSearchDisplayType]
	);

	const handleCollapseEntered = useCallback(() => {
		searchInputRef.current?.focus();
	}, []);
	//#endregion

	return (
		<FormControl
			className="page-header__search-input-wrapper"
			variant="standard"
		>
			<IconWrapper className="page-header__search-input-search-wrapper">
				<SearchIcon
					className="page-header__search-input-search"
					onClick={handleSearchIconClick}
				/>
			</IconWrapper>
			<Collapse
				orientation="horizontal"
				in={variant === SearchDisplay.FULL}
				className="page-header__search-input-collapse"
				onEntered={handleCollapseEntered}
			>
				<Input
					inputRef={searchInputRef}
					className="page-header__search-input"
					onBlur={handleSearchInputBlur}
					placeholder="Введите название группы"
					value={value}
					onChange={handleSearchValueChanged}
					onKeyPress={handleEnterPress}
					endAdornment={
						<InputAdornment
							position="end"
							className="page-header__search-input-enter"
						>
							<ArrowRightIcon onClick={handleEnterPress} />
						</InputAdornment>
					}
				/>
			</Collapse>
		</FormControl>
	);
};

export default SearchInput;
