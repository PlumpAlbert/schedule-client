import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useMemo,
	useReducer,
	useState
} from "react";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import {SelectChangeEvent} from "@mui/material/Select";
import ScheduleAPI from "../../API";
import {Course, FACULTY, IGroup, ISpecialty} from "../../types";

type Action = {type: string; payload: any};
type IState = Omit<IGroup, "faculty"> & {faculty: string};

const groupReducer: React.Reducer<IState, Action> = (state, action) => {
	switch (action.type) {
		case "SET-ID":
		case "SET-FACULTY":
		case "SET-SPECIALTY":
		case "SET-YEAR": {
			const key = action.type.split("SET-")[1].toLowerCase();
			return {...state, [key]: action.payload};
		}
		case "SET-STATE": {
			return action.payload;
		}
		case "COMBINED": {
			const updatedState = (action.payload as Action[]).reduce<IState>((s, a) => {
				const newState = groupReducer(s, a);
				return {
					...s,
					...newState
				};
			}, state);
			return updatedState;
		}
	}
	return state;
};

export interface IGroupSelect {
	getState: () => IGroup;
}

const GroupSelect = forwardRef(({isError}: {isError: boolean}, ref) => {
	const [group, dispatch] = useReducer<typeof groupReducer>(groupReducer, {
		id: 0,
		faculty: "",
		specialty: "",
		year: 0
	});
	const [specialties, setSpecialties] = useState<ISpecialty[]>([]);
	useImperativeHandle<any, IGroupSelect>(
		ref,
		() => ({
			getState: () => ({...group, faculty: group.faculty as FACULTY})
		}),
		[group]
	);

	const facultyOptions = useMemo(
		() =>
			Object.values(FACULTY).map(faculty => (
				<MenuItem key={faculty} value={faculty}>
					{faculty}
				</MenuItem>
			)),
		[]
	);

	const groupOptions = useMemo(
		() =>
			specialties.reduce<JSX.Element[]>((options, specialty) => {
				let shortName = specialty.title
					.split(" ")
					.reduce((s, w) => (s += w[0].toUpperCase()), "");
				const date = new Date();
				const newOptions = Object.keys(specialty.courses).map<JSX.Element>(courseNumber => {
					let year = date.getFullYear() - Number(courseNumber);
					if (date.getMonth() >= 9) year += 1;
					const item = {
						name: `${shortName}-${year.toString().slice(-2)}`,
						value: specialty.courses[Number(courseNumber) as Course]
					};
					return (
						<MenuItem
							key={item.name}
							itemProp={specialty.title}
							placeholder={year.toString()}
							value={item.value}
						>
							{item.name}
						</MenuItem>
					);
				});
				return options.concat(newOptions);
			}, []),
		[specialties]
	);

	useEffect(() => {
		if (!group.faculty) return;
		const abortController = new AbortController();
		try {
			ScheduleAPI.fetchSpecialties(group.faculty, abortController).then(specialties => {
				if (!specialties) return;
				setSpecialties(specialties);
			});
		} catch (err) {
			if (!abortController.signal.aborted) {
				console.error(err);
			}
		} finally {
			return () => {
				abortController.abort();
			};
		}
	}, [group.faculty, setSpecialties]);

	const handleSelectChange = useCallback<(e: SelectChangeEvent<unknown>, node: any) => void>(
		({target}, node) => {
			let action: Action = {type: "", payload: target.value};
			switch (target.name) {
				case "group_faculty":
					action.type = "SET-FACULTY";
					break;
				case "group_name": {
					const {placeholder: year, itemProp: specialty} = node.props;
					action.type = "COMBINED";
					action.payload = [
						{type: "SET-SPECIALTY", payload: specialty},
						{type: "SET-ID", payload: target.value},
						{type: "SET-YEAR", payload: year}
					];
					break;
				}
				default:
					return;
			}
			dispatch(action);
		},
		[dispatch]
	);

	return (
		<>
			<TextField
				select
				error={isError && !group.faculty}
				className="form-control"
				variant="standard"
				id="group_faculty"
				name="group_faculty"
				label="Факультет:"
				helperText="Выберите факультет, в котором Вы обучаетесь"
				SelectProps={{
					className: "form-control__input",
					onChange: handleSelectChange,
					value: group.faculty
				}}
				InputLabelProps={{
					className: "form-control__label",
					htmlFor: "group_faculty"
				}}
				FormHelperTextProps={{
					className: "form-control__helper-text"
				}}
			>
				{facultyOptions}
			</TextField>
			<TextField
				select
				error={isError && !group.id}
				className="form-control"
				variant="standard"
				id="group_name"
				name="group_name"
				label="Группа:"
				helperText="Выберите группу, в которой Вы обучаетесь"
				disabled={groupOptions.length === 0}
				SelectProps={{
					className: "form-control__input",
					onChange: handleSelectChange,
					value: group.id !== 0 ? group.id : ""
				}}
				InputLabelProps={{
					className: "form-control__label",
					htmlFor: "group_name"
				}}
				FormHelperTextProps={{
					className: "form-control__helper-text"
				}}
			>
				{groupOptions}
			</TextField>
		</>
	);
});

export default GroupSelect;
