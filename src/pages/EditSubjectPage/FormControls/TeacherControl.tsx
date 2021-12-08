import React, {useCallback} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {ACTIONS} from "../reducer";
import {IProps, propTypes} from ".";

interface ITeacher {
	id: number;
	name: string;
}

function TeacherControl({dispatch, value}: IProps<ITeacher>) {
	const handleTeacherChanged = useCallback<
		(event: SelectChangeEvent<number>) => void
	>(
		({target}) => {
			const teacherId = target.value;
			// dispatch({
			//     type: ACTIONS.setType,
			//     // payload: target.value
			// });
		},
		[dispatch]
	);
	return (
		<FormControl fullWidth className="form-group form-group-horizontal">
			<label htmlFor="teacher" className="form__label">
				Преподаватель:
			</label>
			<Select
				labelId="form__type"
				className="form__textfield form__type-select"
				defaultValue={0}
				onChange={handleTeacherChanged}
			>
				<MenuItem value={0}>Kurgasik</MenuItem>
			</Select>
		</FormControl>
	);
}

TeacherControl.propTypes = propTypes(
	PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired
	})
);

export default TeacherControl;
