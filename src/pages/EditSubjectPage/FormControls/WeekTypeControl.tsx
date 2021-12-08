import React, {useCallback, useMemo} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Switch from "@mui/material/Switch";
import {IProps, propTypes} from ".";
import {WEEK_TYPE} from "../../../types";
import {ACTIONS} from "../reducer";

function WeekTypeControl({dispatch, value}: IProps<WEEK_TYPE>) {
	const text = useMemo(() => {
		switch (value) {
			case WEEK_TYPE.GREEN:
				return "Зеленая неделя";
			case WEEK_TYPE.WHITE:
				return "Белая неделя";
		}
	}, [value]);
	const handleSwitchChanged = useCallback<
		React.ChangeEventHandler<HTMLInputElement>
	>(
		({target}) => {
			dispatch({
				type: ACTIONS.setWeekType,
				payload: target.checked ? WEEK_TYPE.GREEN : WEEK_TYPE.WHITE
			});
		},
		[dispatch]
	);

	return (
		<FormControl fullWidth className="form-group form-group-horizontal">
			<label
				htmlFor="weekType"
				id="form__week-type"
				className="form__label"
			>
				Тип занятия:
			</label>
			<div className="form__textfield">
				<Switch
					classes={{checked: "form__week-type--checked"}}
					name="weekType"
					value={value}
					checked={!!value}
					onChange={handleSwitchChanged}
				/>
				<span className="form__textfield-text">{text}</span>
			</div>
		</FormControl>
	);
}

WeekTypeControl.propTypes = propTypes(PropTypes.number.isRequired);

export default WeekTypeControl;
