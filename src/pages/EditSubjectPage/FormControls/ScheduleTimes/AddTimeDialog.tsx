import React, {useCallback, useMemo, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {IAttendTime, WEEKDAY, WEEK_TYPE} from "../../../../types";

import "./AddTimeDialog.scss";
import {renderTime} from "../../../../Helpers";

interface IProps {
	open: boolean;
	value?: IAttendTime;
	weekType: WEEK_TYPE;
	onClose: (timeData?: Omit<IAttendTime, "id">) => void;
}

function shortWeekdayName(day: WEEKDAY) {
	let date = new Date();
	date.setDate(date.getDate() - (date.getDay() - day));
	// const locale = navigator.language || "ru";
	return date.toLocaleString("ru", {weekday: "short"});
}

const times = ["08:00", "09:40", "11:20", "13:20", "15:00", "16:40"];
const timeOptions = times.map(time => {
	const startTime = new Date("1970-01-01T" + time).getTime();
	return (
		<MenuItem key={`menu-item-${startTime}`} value={startTime}>
			{renderTime(startTime)}
		</MenuItem>
	);
});

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
				<ToggleButton
					className="toggle-button"
					classes={{selected: "toggle-button--selected"}}
					value={i}
				>
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
			weekType,
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

	const handleTimeChange = useCallback(
		({target}) => void setTime(target.value),
		[setTime]
	);

	return (
		<Dialog className="add-time-dialog" open={open} onClose={handleCancelClick}>
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
						select
						className="field-input"
						type="select"
						variant="standard"
						InputLabelProps={{className: "field-label"}}
						label="Время проведения"
						InputProps={{className: "field-input__root"}}
						placeholder="Выберите время проведения занятия"
						value={time}
						onChange={handleTimeChange}
					>
						{timeOptions}
					</TextField>
				</div>
				<div className="add-time-dialog__field">
					<label htmlFor="" className="field-label">
						Аудитория
					</label>
					<TextField className="field-input" placeholder="Номер аудитории" />
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
