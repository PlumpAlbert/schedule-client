import React, {useCallback, useMemo, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import {Course} from "../../types";

import "./CreateDialog.scss";
import ScheduleAPI from "../../API";

interface IProps {
	faculty: string;
	open: boolean;
	onClose: () => void;
}

interface IFieldsState {
	name: string;
	course: Course;
}

const CreateDialog = ({faculty, open, onClose}: IProps) => {
	const [fields, setFields] = useState<IFieldsState>({
		name: "",
		course: "1"
	});

	const handleFieldChange = useCallback<
		React.ChangeEventHandler<HTMLInputElement>
	>(
		({target}) => {
			const {name, value} = target;
			setFields({...fields, [name]: value});
		},
		[setFields, fields]
	);

	const courseOptions = useMemo(() => {
		let bachelor = 4;
		let magistrary = 2;
		let options = [];
		options.push(
			<ListSubheader
				key="create-specialty-dialog__select-bachelor"
				className="create-specialty-dialog__select-subheader"
			>
				Бакалавриат
			</ListSubheader>
		);
		for (let i = 0; i < bachelor; ++i) {
			options.push(
				<MenuItem
					key={`create-specialty-dialog__select-bachelor-${i}`}
					className="create-specialty-dialog__select-option"
					value={(i + 1).toString()}
				>
					{i + 1} курс
				</MenuItem>
			);
		}
		options.push(
			<ListSubheader
				key="create-specialty-dialog__select-magistrary"
				className="create-specialty-dialog__select-subheader"
			>
				Магистратура
			</ListSubheader>
		);
		for (let i = 0; i < magistrary; ++i) {
			options.push(
				<MenuItem
					key={`create-specialty-dialog__select-magistrary-${i}`}
					className="create-specialty-dialog__select-option"
					value={(bachelor + i + 1).toString()}
				>
					{i + 1} курс
				</MenuItem>
			);
		}
		return options;
	}, []);

	const handleCreateClick = useCallback(() => {
		const abortController = new AbortController();
		ScheduleAPI.createGroup(
			faculty,
			fields.name,
			fields.course,
			abortController
		)
			.then(() => {
				onClose();
			})
			.catch(err => {
				if (!abortController.signal.aborted) {
					console.log(err);
				}
			});
		onClose();
	}, [faculty]);

	return (
		<Dialog
			className="create-specialty-dialog-wrapper"
			classes={{
				paper: "create-specialty-dialog"
			}}
			open={open}
			onClose={onClose}
		>
			<DialogTitle className="create-specialty-dialog__title">
				Создание группы
			</DialogTitle>
			<TextField
				required
				className="create-specialty-dialog__field"
				variant="standard"
				multiline
				maxRows={4}
				label="Специальность"
				placeholder="Название специальности"
				name="name"
				value={fields.name}
				onChange={handleFieldChange}
				InputLabelProps={{
					className: "field-label"
				}}
				inputProps={{
					className: "field-input"
				}}
			/>
			<TextField
				required
				select
				className="create-specialty-dialog__field"
				variant="standard"
				label="Курс"
				name="course"
				value={fields.course}
				onChange={handleFieldChange}
				InputLabelProps={{
					className: "field-label"
				}}
				InputProps={{
					startAdornment: (
						<InputAdornment
							position="start"
							className="field-input__adornment"
						>
							{fields.course > "4" ? "М" : "Б"}
						</InputAdornment>
					)
				}}
				inputProps={{
					className: "field-input"
				}}
			>
				{courseOptions}
			</TextField>
			<Button
				className="create-specialty-dialog__btn"
				variant="contained"
				onClick={handleCreateClick}
			>
				Создать
			</Button>
		</Dialog>
	);
};

export default CreateDialog;
