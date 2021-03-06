import React, {useCallback, useMemo} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {IProps, propTypes} from ".";
import {SUBJECT_TYPE} from "../../../types";
import {actions} from "../../../store/schedule/subject";
import {GetSubjectTypeAsString} from "../../../Helpers";

function TypeControl({dispatch, value}: IProps<SUBJECT_TYPE>) {
	const handleTypeChanged = useCallback<
		(event: SelectChangeEvent<number>) => void
	>(
		({target}) => {
			dispatch(actions.updateProperty({property: "type", value: target.value}));
		},
		[dispatch]
	);

	const typeClass = useMemo(() => {
		switch (value) {
			case SUBJECT_TYPE.ЛЕКЦИЯ:
				return "lecture";
			case SUBJECT_TYPE.ПРАКТИКА:
				return "practice";
			case SUBJECT_TYPE.ЛАБОРАТОРНАЯ:
				return "lab";
		}
	}, [value]);

	return (
		<FormControl fullWidth className="form-group form-group-horizontal">
			<label htmlFor="type" id="form__type" className="form__label">
				Тип занятия:
			</label>
			<Select
				labelId="form__type"
				className="form__textfield form__type-select"
				value={value}
				onChange={handleTypeChanged}
				renderValue={value => (
					<p className="form__select__selected-item">
						{GetSubjectTypeAsString(value)}
						<span className={`select__selected-item__type ${typeClass}`} />
					</p>
				)}
			>
				<MenuItem value={SUBJECT_TYPE.ЛЕКЦИЯ}>Лекция</MenuItem>
				<MenuItem value={SUBJECT_TYPE.ПРАКТИКА}>Практика</MenuItem>
				<MenuItem value={SUBJECT_TYPE.ЛАБОРАТОРНАЯ}>Лабораторная</MenuItem>
			</Select>
		</FormControl>
	);
}

TypeControl.propTypes = propTypes(PropTypes.number.isRequired);

export default TypeControl;
