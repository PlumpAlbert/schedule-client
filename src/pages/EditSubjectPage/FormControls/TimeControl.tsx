import React, {useCallback} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import {IProps, propTypes} from ".";
import {ACTIONS} from "../reducer";

function TimeControl({dispatch, value}: IProps<Date>) {
	const handleTimeChange = useCallback<
		React.FocusEventHandler<HTMLInputElement>
	>(
		({target}) => {
			dispatch({
				type: ACTIONS.setTime,
				payload: new Date("2000-01-01T" + target.value)
			});
		},
		[dispatch]
	);
	return (
		<FormControl fullWidth className="form-group form-group-horizontal">
			<label htmlFor="time" className="form__label">
				Время:
			</label>
			<TextField
				className="form__textfield"
				type="time"
				aria-label="Время"
				placeholder="Укажите номер аудитории"
				defaultValue={value.toLocaleTimeString("ru")}
				onBlur={handleTimeChange}
			/>
		</FormControl>
	);
}

TimeControl.propTypes = propTypes(PropTypes.instanceOf(Date).isRequired);

export default TimeControl;
