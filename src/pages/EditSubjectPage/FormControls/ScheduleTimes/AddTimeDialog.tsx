import React, {useCallback, useMemo, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import {WEEKDAY, WEEK_TYPE} from "../../../../types";
import {ISubjectTime} from "../../reducer";

interface IProps {
	open: boolean;
	value?: ISubjectTime;
	weekType: WEEK_TYPE;
	onClose: (timeData?: Omit<ISubjectTime, "id">) => void;
}

function shortWeekdayName(day: WEEKDAY) {
	let date = new Date();
	date.setDate(date.getDate() - (date.getDay() - day));
	const locale = navigator.language || "ru";
	return date.toLocaleString(locale, {weekday: "short"});
}

const AddTimeDialog = ({open, value, weekType, onClose}: IProps) => {
	const [weekday, setWeekday] = useState<WEEKDAY>(
		value?.weekday || WEEKDAY.MONDAY
	);
	const [time, setTime] = useState<number>(value?.time || -1);
	const [audience, setAudience] = useState<string>(value?.audience || "");

	const weekdayButtons = useMemo(() => {
		let buttons = [];
		for (let i = WEEKDAY.MONDAY; i <= WEEKDAY.SUNDAY; ++i) {
			buttons.push(
				<ToggleButton className="toggle-button" value={i}>
					{shortWeekdayName(i)}
				</ToggleButton>
			);
		}
		return buttons;
	}, []);

	const handleSaveClick = useCallback(() => {
		onClose({
			audience,
			time,
			weekday,
			weekType
		});
	}, [onClose]);

	const handleCancelClick = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleWeekdayChange = useCallback(
		(_, value) => {
			debugger;
			setWeekday(value);
		},
		[setWeekday]
	);

	return (
		<Dialog
			className="add-time-dialog"
			open={open}
			onClose={handleCancelClick}
		>
			<DialogTitle className="add-time-dialog__title">
				Добавить время проведения
			</DialogTitle>
			<div className="add-time-dialog__body">
				<div className="add-time-dialog__field">
					<label htmlFor="" className="field-label">
						День недели
					</label>
					<ToggleButtonGroup
						className="field-input"
						onChange={handleWeekdayChange}
					>
						{weekdayButtons}
					</ToggleButtonGroup>
				</div>
				<div className="add-time-dialog__field">
					<label htmlFor="" className="field-label">
						Время проведения
					</label>
					<TextField
						className="field-input"
						type="select"
						placeholder="Выберите время проведения занятия"
					/>
				</div>
				<div className="add-time-dialog__field">
					<label htmlFor="" className="field-label">
						Аудитория
					</label>
					<TextField
						className="field-input"
						placeholder="Номер аудитории"
					/>
				</div>
			</div>
			<div className="add-time-dialog__footer">
				<Button
					className="add-time-dialog__btn cancel-btn"
					onClick={handleCancelClick}
				>
					Отмена
				</Button>
				<Button
					className="add-time-dialog__btn save-btn"
					onClick={handleSaveClick}
				>
					Сохранить
				</Button>
			</div>
		</Dialog>
	);
};

export default AddTimeDialog;
