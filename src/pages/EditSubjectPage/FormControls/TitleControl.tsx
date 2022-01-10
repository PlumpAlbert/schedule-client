import React, {useCallback} from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import {IProps, propTypes} from ".";
import {actions} from "../../../store/schedule/subject";

function TitleControl({dispatch, value}: IProps<string>) {
	const handleTitleChanged = useCallback<
		React.FocusEventHandler<HTMLTextAreaElement>
	>(
		({target}) => {
			dispatch(
				actions.updateProperty({property: "title", value: target.value})
			);
		},
		[dispatch]
	);
	return (
		<FormControl fullWidth className="form-group form-group-vertical">
			<label id="form-title" htmlFor="title" className="form__label">
				Название
			</label>
			<TextareaAutosize
				className="form__title-textarea"
				minRows={6}
				maxRows={10}
				aria-label="Название"
				placeholder="Введите название предмета"
				defaultValue={value}
				onBlur={handleTitleChanged}
			/>
		</FormControl>
	);
}

TitleControl.propTypes = propTypes(PropTypes.string.isRequired);

export default TitleControl;
