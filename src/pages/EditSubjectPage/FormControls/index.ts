import React from "react";
import PropTypes from "prop-types";
import {ActionType} from "../reducer";

export function propTypes<T>(validator: T) {
	return {
		dispatch: PropTypes.func.isRequired,
		value: validator
	};
}

export interface IProps<T> {
	dispatch: React.Dispatch<ActionType>;
	value: T;
}
