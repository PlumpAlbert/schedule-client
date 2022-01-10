import React, {useCallback, useMemo, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {SelectChangeEvent} from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useSpecialties from "../../../hooks/useSpecialties";
import {calculateCourse} from "../../../Helpers";
import {Course, FACULTY, IGroup} from "../../../types";

import "./GroupSelectDialog.scss";

interface IProps extends IGroup {
	open: boolean;
	onClose: (group?: IGroup) => void;
}

function GroupSelectDialog({
	faculty: defaultFaculty,
	specialty: defaultSpecialty,
	year: defaultYear,
	id: defaultId,
	open,
	onClose,
}: IProps) {
	//#region Group state
	const [course, setCourse] = useState<Course>(calculateCourse(defaultYear));
	const [specialty, setSpecialty] = useState(defaultSpecialty);
	const [faculty, setFaculty] = useState<FACULTY>(defaultFaculty);
	//#endregion

	//#region Component's state
	const [error, setError] = useState(false);
	const [specialties] = useSpecialties(faculty);

	const facultyOptions = useMemo(
		() =>
			Object.values(FACULTY).map(faculty => (
				<MenuItem key={faculty} value={faculty}>
					{faculty}
				</MenuItem>
			)),
		[]
	);
	const specialtyOptions = useMemo(
		() =>
			specialties.map(({title}) => (
				<MenuItem key={title} value={title}>
					{title}
				</MenuItem>
			)),
		[specialties]
	);

	const courseButtons = useMemo(() => {
		let buttons: React.ReactNode[] = [];
		const courses = Object.keys(
			specialties.find(s => s.title === specialty)?.courses || []
		);
		for (let i = 1; i < 5; ++i) {
			const disabled = !courses.find(c => c === i.toString());
			buttons.push(
				<ToggleButton
					key={`course-toggle-button-${i}`}
					disabled={disabled}
					selected={!disabled && i === course}
					value={i.toString()}
					className={`course-toggle-button course-${i}`}
					classes={{
						selected: "course-toggle-button--selected",
					}}
				>
					{i}
				</ToggleButton>
			);
		}
		return buttons;
	}, [specialties, specialty, course]);
	//#endregion

	//#region CALLBACKS
	const resetState = useCallback(() => {
		setCourse(calculateCourse(defaultYear));
		setSpecialty(defaultSpecialty);
		setFaculty(defaultFaculty);
	}, [defaultFaculty, defaultSpecialty, defaultYear, defaultId]);

	const handleSaveChangesClick = useCallback(() => {
		const id = specialties.find(s => s.title === specialty)?.courses[course];
		if (!specialty || !id) {
			setError(true);
			return;
		}
		const date = new Date();
		let year = date.getFullYear() - Number(course);
		if (date.getMonth() > 9) year += 1;
		onClose({id, specialty, faculty, year});
	}, [onClose, setError, course, specialty, faculty, specialties]);

	const handleDialogClose = useCallback(() => {
		resetState();
		onClose();
	}, [onClose, resetState]);

	const handleCourseChange = useCallback(
		(_, newCourses: Course[]) => {
			if (newCourses.length === 0) {
				return;
			}
			const newCourse = newCourses[newCourses.length - 1];
			setCourse(newCourse);
			setError(true);
		},
		[specialties, specialty]
	);

	const handleSelectChange = useCallback<
		(e: SelectChangeEvent<unknown>) => void
	>(
		({target}) => {
			switch (target.name) {
				case "group_faculty":
					setFaculty(target.value as FACULTY);
					setSpecialty("");
					break;
				case "group_specialty":
					setSpecialty(target.value as string);
					break;
			}
		},
		[setFaculty, setSpecialty]
	);
	//#endregion

	return (
		<Dialog
			open={open}
			onClose={handleDialogClose}
			className="group-select-dialog-wrapper"
			classes={{
				paper: "group-select-dialog",
			}}
		>
			<DialogTitle className="group-select-dialog__title">
				Изменение группы
			</DialogTitle>

			<TextField
				select
				error={error && !faculty}
				className="group-select-dialog__field"
				variant="standard"
				id="group_faculty"
				name="group_faculty"
				label="Факультет:"
				helperText={error && !faculty ? "Укажите свой факультет" : undefined}
				SelectProps={{
					className: "field__input",
					onChange: handleSelectChange,
					value: faculty,
				}}
				InputLabelProps={{
					className: "field__label",
					htmlFor: "group_faculty",
				}}
				FormHelperTextProps={{
					className: "field__helper-text",
				}}
			>
				{facultyOptions}
			</TextField>

			<TextField
				select
				error={error && !specialty}
				className="group-select-dialog__field"
				variant="standard"
				id="group_specialty"
				name="group_specialty"
				label="Специальность:"
				helperText={
					error && !specialty ? "Укажите свою специальность" : undefined
				}
				SelectProps={{
					className: "field__input",
					onChange: handleSelectChange,
					value: specialty,
				}}
				InputLabelProps={{
					className: "field__label",
					htmlFor: "group_specialty",
				}}
				FormHelperTextProps={{
					className: "field__helper-text",
				}}
			>
				{specialtyOptions}
			</TextField>

			<ToggleButtonGroup
				className="group-select-dialog__course-buttons"
				onChange={handleCourseChange}
			>
				{courseButtons}
			</ToggleButtonGroup>

			<Button
				className="group-select-dialog__button"
				variant="contained"
				onClick={handleSaveChangesClick}
			>
				Сохранить
			</Button>
		</Dialog>
	);
}

export default GroupSelectDialog;
