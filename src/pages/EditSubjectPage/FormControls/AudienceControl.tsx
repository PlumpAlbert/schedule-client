import React, {useCallback} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {IProps, propTypes} from ".";
import {actions} from "../../../store/schedule";

function AudienceControl({id, dispatch, value}: IProps<string>) {
	const handleAudienceChange = useCallback<
		React.FocusEventHandler<HTMLInputElement>
	>(
		({target}) => {
			dispatch(
				actions.updateSubject({
					id,
					property: "audience",
					value: target.value
				})
			);
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
