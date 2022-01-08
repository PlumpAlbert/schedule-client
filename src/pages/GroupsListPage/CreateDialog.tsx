import React, {useCallback, useMemo, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {BACHELOR_MAX, Course, FACULTY, IGroup, MAGISTRACY_MAX} from "../../types";

import "./CreateDialog.scss";
import ScheduleAPI from "../../API";
import {calculateYear} from "../../Helpers";

interface IProps {
	faculty: FACULTY;
	open: boolean;
	onClose: (group?: IGroup) => void;
}

interface IFieldsState {
	name: string;
	course: Course;
}

const CreateDialog = ({faculty, open, onClose}: IProps) => {
	const [fields, setFields] = useState<IFieldsState>({
		name: "",
		course: 1
	});
	const [isCreating, setCreating] = useState(false);
	const [error, setError] = useState<string>();

	const handleFieldChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
		({target}) => {
			const {name, value} = target;
			setFields({...fields, [name]: value});
		},
		[setFields, fields]
	);

	const handleDialogClose = useCallback(() => {
		if (isCreating) return;
		onClose();
	}, [isCreating]);

	const courseOptions = useMemo(() => {
		let options = [];
		options.push(
			<ListSubheader
				key="create-specialty-dialog__select-bachelor"
				className="create-specialty-dialog__select-subheader"
			>
				Бакалавриат
			</ListSubheader>
		);
		for (let i = 0; i < BACHELOR_MAX; ++i) {
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
		for (let i = 0; i < MAGISTRACY_MAX; ++i) {
			options.push(
				<MenuItem
					key={`create-specialty-dialog__select-magistrary-${i}`}
					className="create-specialty-dialog__select-option"
					value={(BACHELOR_MAX + i + 1).toString()}
				>
					{i + 1} курс
				</MenuItem>
			);
		}
		return options;
	}, []);

	const handleCreateClick = useCallback(() => {
		setCreating(true);
		const abortController = new AbortController();
		const group: Omit<IGroup, "id"> = {
			faculty,
			year: calculateYear(fields.course),
			specialty: fields.name
		};
		ScheduleAPI.createGroup(group, abortController)
			.then(id => {
				if (!id) {
					setError("Группа уже существует");
					setCreating(false);
					return;
				}
				setCreating(false);
				onClose({...group, id});
			})
			.catch(err => {
				if (!abortController.signal.aborted) {
					console.error(err);
				}
				onClose();
			});
		return () => {
			abortController.abort();
		};
	}, [faculty, fields]);

	return (
		<Dialog
			className="create-specialty-dialog-wrapper"
			classes={{
				paper: "create-specialty-dialog"
			}}
			open={open}
			onClose={handleDialogClose}
		>
			<Snackbar
				open={!!error}
				autoHideDuration={3000}
				onClose={() => void setError(undefined)}
				className="create-specialty-dialog__snackbar"
				anchorOrigin={{vertical: "bottom", horizontal: "center"}}
			>
				<Alert className="snackbar-alert" variant="filled" severity="error">
					{error}
				</Alert>
			</Snackbar>
			<DialogTitle className="create-specialty-dialog__title">Создание группы</DialogTitle>
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
						<InputAdornment position="start" className="field-input__adornment">
							{fields.course > BACHELOR_MAX ? "М" : "Б"}
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
				{isCreating ? <CircularProgress color="inherit" /> : "Создать"}
			</Button>
		</Dialog>
	);
};

export default CreateDialog;
