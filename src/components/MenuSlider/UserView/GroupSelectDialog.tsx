import React, {useCallback, useMemo, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Autocomplete, {
	AutocompleteInputChangeReason
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import useSpecialties from "../../../hooks/useSpecialties";
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
	onClose
}: IProps) {
	//#region Group state
	const [id, setId] = useState(defaultId);
	const [course, setCourse] = useState<Course>(() => {
		const date = new Date();
		let number = date.getFullYear() - defaultYear;
		if (date.getMonth() > 9) {
			number += 1;
		}
		return number.toString() as Course;
	});
	const [specialty, setSpecialty] = useState(defaultSpecialty);
	const [faculty, setFaculty] = useState<FACULTY>(defaultFaculty);
	//#endregion

	//#region Component's state
	const [error, setError] = useState(false);
	const [specialtyInput, setSpecialtyInput] = useState("");
	const [specialties, setSpecialties] = useSpecialties(faculty);

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
		() => specialties.map(({title}) => title),
		[specialties]
	);

	const courseButtons = useMemo(() => {
		let buttons: React.ReactNode[] = [];
		for (let i = 1; i < 5; ++i) {
			buttons.push(
				<ToggleButton
					key={`course-toggle-button-${i}`}
					value={i}
					className={`course-toggle-button course-${i}`}
					classes={{
						selected: "course-toggle-button--selected"
					}}
				>
					{i}
				</ToggleButton>
			);
		}
		return buttons;
	}, []);
	//#endregion

	//#region CALLBACKS
	const handleSaveChangesClick = useCallback(() => {
		const date = new Date();
		let year = date.getFullYear() - Number(course);
		if (date.getMonth() > 9) year += 1;
		onClose({id, specialty, faculty, year});
	}, [onClose, id, course, specialty, faculty]);

	const handleDialogClose = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleSelectChange = useCallback(
		(dispatch: React.Dispatch<React.SetStateAction<any>>) =>
			(
				_: React.SyntheticEvent,
				value: string,
				reason: AutocompleteInputChangeReason
			) => {
				switch (reason) {
					case "input":
					case "reset":
						dispatch(value);
						break;
					case "clear":
						dispatch("");
						break;
				}
			},
		[]
	);

	const handleCourseChange = useCallback((_, newCourses) => {
		setCourse(newCourses[newCourses.length - 1]);
	}, []);
	//#endregion

	return (
		<Dialog
			open={open}
			onClose={handleDialogClose}
			className="group-select-dialog-wrapper"
			classes={{
				paper: "group-select-dialog"
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
				SelectProps={{
					className: "field__input",
					onChange: ({target}) => {
						setFaculty(target.value as FACULTY);
					},
					value: faculty
				}}
				InputLabelProps={{
					className: "field__label",
					htmlFor: "group_faculty"
				}}
				FormHelperTextProps={{
					className: "field__helper-text"
				}}
			>
				{facultyOptions}
			</TextField>

			<Autocomplete
				className="group-select-dialog__field"
				options={specialtyOptions}
				noOptionsText={`Создать ${specialtyInput}`}
				value={specialty}
				onInputChange={handleSelectChange(setSpecialtyInput)}
				renderInput={props => (
					<TextField
						{...props}
						error={error && !specialty}
						variant="standard"
						id="group_specialty"
						name="group_specialty"
						label="Специальность:"
						onKeyPress={e => {
							if (
								e.key === "Enter" &&
								specialtyOptions.every(
									s => s !== specialtyInput
								)
							) {
								setSpecialties([
									...specialties,
									{title: specialtyInput, courses: {}}
								]);
							}
						}}
						InputLabelProps={{
							className: "field__label",
							htmlFor: "group_specialty"
						}}
					/>
				)}
			/>

			<ToggleButtonGroup
				className="group-select-dialog__course-buttons"
				onChange={handleCourseChange}
				value={[course]}
			>
				{courseButtons}
			</ToggleButtonGroup>

			<Button className="group-select-dialog__button" variant="contained">
				Сохранить
			</Button>
		</Dialog>
	);
}

export default GroupSelectDialog;
