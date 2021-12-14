import React, {useCallback, useRef} from "react";
import SearchIcon from "@mui/icons-material/Search";
import IconWrapper from "@mui/material/Icon";
import ArrowRightIcon from "@mui/icons-material/ArrowForward";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import Collapse from "@mui/material/Collapse";

interface IProps {
	variant: SearchDisplayType;
	value: string;
	dispatch: React.Dispatch<import(".").Action<any>>;
}
export enum SearchDisplayType {
	NONE = 0,
	FULL,
	ICON
}

const SearchInput = ({value, variant, dispatch}: IProps) => {
	const searchInputRef = useRef<HTMLInputElement>(null);

	//#region ACTION CREATORS
	const setSearchDisplayType = useCallback(
		(type: SearchDisplayType) => {
			dispatch({
				type: "SET-SEARCH_DISPLAY_TYPE",
				payload: type
			});
		},
		[dispatch]
	);

	const setSearchValue = useCallback((value: string) => {
		dispatch({
			type: "SET-SEARCH_VALUE",
			payload: value
		});
	}, []);
	//#endregion

	//#region CALLBACKS
	const handleEnterPress = useCallback(e => {
		if (e.key && e.key === "Enter") {
			alert("Should implement this feature");
		}
	}, []);

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
		setSearchDisplayType(SearchDisplayType.FULL);
	}, [setSearchDisplayType]);

	const handleSearchInputBlur = useCallback(
		e => {
			if (!e.target.value) {
				setSearchDisplayType(SearchDisplayType.ICON);
			}
		},
		[setSearchDisplayType]
	);
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
				in={variant === SearchDisplayType.FULL}
				className="page-header__search-input-collapse"
				onEntered={() => {
					searchInputRef.current?.focus();
				}}
			>
				<Input
					inputRef={searchInputRef}
					className="page-header__search-input"
					onBlur={handleSearchInputBlur}
					onFocus={() => {
						console.log("got focus");
					}}
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
