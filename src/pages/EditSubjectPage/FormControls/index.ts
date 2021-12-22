import React from "react";
import {AnyAction} from "@reduxjs/toolkit";
import PropTypes from "prop-types";

export function propTypes<T>(validator: T) {
	return {
		id: PropTypes.number.isRequired,
		dispatch: PropTypes.func.isRequired,
		value: validator
	};
}

export interface IProps<T> {
	id: number;
	dispatch: React.Dispatch<AnyAction>;
	value: T;
}
