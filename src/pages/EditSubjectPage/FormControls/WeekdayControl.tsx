import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { IProps, propTypes } from ".";
import { GetWeekdayName } from "../../../Helpers";
import { ACTIONS } from "../reducer";

function WeekdayControl({ dispatch, value }: IProps<number>) {
    const options = useMemo(() => {
        let options = [];
        for (let i = 1; i <= 7; ++i) {
            options.push(
                <MenuItem className="weekday-control__option" value={i}>
                    {GetWeekdayName(i)}
                </MenuItem>
            );
        }
        return options;
    }, []);
    const handleWeekdayChange = useCallback<
        (e: SelectChangeEvent<number>) => void
    >(
        ({ target }) => {
            dispatch({
                type: ACTIONS.setWeekDay,
                payload: target.value as number
            });
        },
        [dispatch]
    );

    return (
        <FormControl fullWidth className="form-group form-group-horizontal">
            <label htmlFor="weekday" id="form__weekday" className="form__label">
                День недели:
            </label>
            <Select
                labelId="form__weekday"
                className="form__textfield"
				classes={{select: "form__weekday-select"}}
                value={value}
                onChange={handleWeekdayChange}
            >
                {options}
            </Select>
        </FormControl>
    );
}

WeekdayControl.propTypes = propTypes(PropTypes.number.isRequired);

export default WeekdayControl;
