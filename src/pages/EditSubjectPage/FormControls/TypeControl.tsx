import React, {useCallback} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Select, {SelectChangeEvent} from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import {IProps, propTypes} from ".";
import {SUBJECT_TYPE} from "../../../types";
import {ACTIONS} from "../reducer";
import {GetSubjectTypeAsString} from "../../../Helpers";

function TypeControl({dispatch, value}: IProps<SUBJECT_TYPE>) {
	const handleTypeChanged = useCallback<
		(event: SelectChangeEvent<number>) => void
	>(
		({target}) => {
			dispatch({
				type: ACTIONS.setType,
				payload: target.value as number
			});
		},
		[dispatch]
	);
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
						<span
							className={`select__selected-item__type ${SUBJECT_TYPE[
								value
							].toLowerCase()}`}
						/>
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
