import { Action } from "../reducer";
import PropTypes from "prop-types";

export function propTypes<T>(validator: T) {
    return {
        dispatch: PropTypes.func.isRequired,
        value: validator
    };
}

export interface IProps<T> {
    dispatch: React.Dispatch<Action<T>>;
    value: T;
}
