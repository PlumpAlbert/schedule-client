import React, {useCallback} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {IProps, propTypes} from ".";
import {ACTIONS} from "../reducer";

function AudienceControl({dispatch, value}: IProps<string>) {
	const handleAudienceChange = useCallback<
		React.FocusEventHandler<HTMLInputElement>
	>(
		({target}) => {
			dispatch({type: ACTIONS.setAudience, payload: target.value});
		},
		[dispatch]
	);

	return (
		<FormControl fullWidth className="form-group form-group-horizontal">
			<label htmlFor="audience" className="form__label">
				Аудитория:
			</label>
			<TextField
				className="form__textfield"
				aria-label="Аудитория"
				placeholder="Укажите номер аудитории"
				defaultValue={value}
				onBlur={handleAudienceChange}
			/>
		</FormControl>
	);
}

AudienceControl.propTypes = propTypes(PropTypes.string.isRequired);

export default AudienceControl;
