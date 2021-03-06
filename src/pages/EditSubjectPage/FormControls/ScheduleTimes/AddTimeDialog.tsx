import React, {useCallback, useEffect, useMemo, useState} from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import {IAttendTime, WEEK_TYPE, WEEKDAY} from "../../../../types";

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

const times = ["08:00", "09:40", "11:20", "13:20", "15:00", "16:40", "18:35"];
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

	useEffect(() => {
		if (value?.weekday) setWeekday(value.weekday);
		if (value?.time) setTime(value.time);
		if (value?.audience) setAudience(value.audience);
	}, [value]);

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
	}, [onClose, time, audience, weekday, weekType]);

	const handleCancelClick = useCallback(() => {
		onClose();
	}, [onClose]);

	const handleWeekdayChange = useCallback(
		(_, values) => {
			if (values.length < 2) return;
			setWeekday(values[1]);
		},
		[setWeekday]
	);

	const handleAudienceChange = useCallback(
		({target}) => void setAudience(target.value),
		[setAudience]
	);

	const handleTimeChange = useCallback(
		({target}) => void setTime(target.value),
		[setTime]
	);

	return (
		<Dialog
			className="add-time-dialog-wrapper"
			classes={{paper: "add-time-dialog"}}
			open={open}
			onClose={handleCancelClick}
		>
			<DialogTitle className="add-time-dialog__title">
				?????????? ????????????????????
			</DialogTitle>
			<div className="add-time-dialog__body">
				<div className="add-time-dialog__field">
					<label className="field-label">???????? ????????????</label>
					<ToggleButtonGroup
						className="field-input toggle-button-group"
						onChange={handleWeekdayChange}
						value={[weekday]}
					>
						{weekdayButtons}
					</ToggleButtonGroup>
				</div>
				<div className="add-time-dialog__field">
					<TextField
						select
						className="field-input"
						type="select"
						variant="standard"
						InputLabelProps={{className: "field-label"}}
						label="?????????? ????????????????????"
						InputProps={{className: "field-input__root"}}
						placeholder="???????????????? ?????????? ???????????????????? ??????????????"
						value={time}
						onChange={handleTimeChange}
					>
						{timeOptions}
					</TextField>
				</div>
				<div className="add-time-dialog__field">
					<TextField
						className="field-input"
						onChange={handleAudienceChange}
						InputLabelProps={{className: "field-label"}}
						label="??????????????????"
						InputProps={{className: "field-input__root"}}
						variant="standard"
						placeholder="?????????? ??????????????????"
						value={audience}
					/>
				</div>
			</div>
			<div className="add-time-dialog__footer">
				<Button
					className="add-time-dialog__btn cancel-btn"
					onClick={handleCancelClick}
				>
					????????????
				</Button>
				<Button
					className="add-time-dialog__btn save-btn"
					onClick={handleSaveClick}
				>
					??????????????????
				</Button>
			</div>
		</Dialog>
	);
};

export default AddTimeDialog;
