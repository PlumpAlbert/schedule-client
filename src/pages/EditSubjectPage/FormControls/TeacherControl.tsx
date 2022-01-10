import React, {useCallback, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {IProps, propTypes} from ".";
import {IUser} from "../../../types";
import {actions} from "../../../store/schedule/subject";
import ScheduleAPI from "../../../API";

function TeacherControl({dispatch, value}: IProps<IUser>) {
	const [teachers, setTeachers] = useState<IUser[]>([]);

	useEffect(() => {
		const abortController = new AbortController();
		ScheduleAPI.getTeachers(abortController)
			.then(teachers => {
				if (!teachers) return;
				setTeachers(teachers);
			})
			.catch(err => {
				if (!abortController.signal.aborted && process.env.NODE_ENV === "development") {
					console.error(err);
				}
			});
		return () => {
			abortController.abort();
		};
	}, []);

	const handleTeacherChanged = useCallback<(event: SelectChangeEvent<number>) => void>(
		({target}) => {
			const teacherId = target.value;
			const teacher = teachers.find(t => t.id === teacherId);
			if (!teacher) return;
			dispatch(actions.updateProperty({property: "teacher", value: teacher}));
		},
		[dispatch, teachers],
	);

	const selectItems = useMemo(
		() =>
			teachers.map(({id, name}) => (
				<MenuItem key={`teacher-select-item-${id}`} value={id}>
					{name}
				</MenuItem>
			)),
		[teachers.length],
	);

	return (
		<FormControl fullWidth className="form-group form-group-horizontal">
			<label htmlFor="teacher" className="form__label">
				Преподаватель:
			</label>
			<Select
				labelId="form__type"
				className="form__textfield form__type-select"
				defaultValue={value.id}
				onChange={handleTeacherChanged}
			>
				{selectItems}
			</Select>
		</FormControl>
	);
}

TeacherControl.propTypes = propTypes(
	PropTypes.shape({
		id: PropTypes.number.isRequired,
		name: PropTypes.string.isRequired,
	}),
);

export default TeacherControl;
