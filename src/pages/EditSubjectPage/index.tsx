import {useEffect, useReducer, useState} from "react";
import {useLocation, useNavigate} from "react-router";
// MUI
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import Icon from "@mui/material/Icon";
import CheckIcon from "@mui/icons-material/Check";

import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import TeacherControl from "./FormControls/TeacherControl";
import ScheduleTimes from "./FormControls/ScheduleTimes";
import reducer, {IEditSubjectPageStore} from "./reducer";
import {useDispatch, useSelector} from "../../store";
import {actions as ScheduleActions} from "../../store/schedule";
import {
	ACTION_TYPES,
	actions as SubjectActions,
	initialState,
} from "../../store/schedule/subject";
import {actions as HeaderActions} from "../../store/app/header";
import ScheduleAPI from "../../API";

import "../../styles/EditSubjectPage.scss";

function EditSubjectPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const reduxDispatch = useDispatch();
	const [saved, setSaved] = useState(false);
	const {editMode, shouldSave, group} = useSelector(
		({application, schedule}) => ({
			editMode: schedule.editMode,
			shouldSave: application.header.save,
			group: schedule.currentGroup,
		})
	);

	let attendTimeId: number | undefined;
	if (location.search) {
		const params = new URLSearchParams(location.search);
		attendTimeId = Number(params.get("id"));
	}

	const initState = useSelector<IEditSubjectPageStore>(({schedule}) => {
		if (!attendTimeId) return {state: initialState, history: []};
		const subject = schedule.subjects.find(s => {
			return !!s.times.find(t => t.id === attendTimeId);
		});
		if (!subject) return {state: initialState, history: []};
		return {history: [], state: subject};
	});
	const [{history, state}, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		if (!shouldSave) return;
		const promises = history.map(action => {
			switch (action.type) {
				case ACTION_TYPES.addAttendTime: {
					const {type, teacher, title, time, weekday, weekType, audience} =
						action.payload;
					return ScheduleAPI.createAttendTime(
						{type, teacher, title},
						{time, weekday, audience, weekType},
						group
					).then(createdSubject => {
						if (!createdSubject) return;
						reduxDispatch(
							ScheduleActions.updateSubject({
								title: initState.state.title,
								type: initState.state.type,
								teacher: initState.state.teacher,
								action: SubjectActions.addAttendTime({
									isCreated: false,
									time: createdSubject,
								}),
							})
						);
						reduxDispatch(
							ScheduleActions.updateSubject({
								title: initState.state.title,
								type: initState.state.type,
								teacher: initState.state.teacher,
								action: SubjectActions.update(createdSubject),
							})
						);
					});
				}
				case ACTION_TYPES.deleteAttendTime: {
					return ScheduleAPI.deleteSubject(action.payload).then(success => {
						if (!success) return;
						reduxDispatch(
							ScheduleActions.updateSubject({
								title: initState.state.title,
								type: initState.state.type,
								teacher: initState.state.teacher,
								action: SubjectActions.deleteAttendTime(action.payload),
							})
						);
					});
				}
				case ACTION_TYPES.updateAttendTime: {
					return ScheduleAPI.updateSubject(action.payload).then(success => {
						if (!success) return;
						reduxDispatch(
							ScheduleActions.updateSubject({
								title: initState.state.title,
								type: initState.state.type,
								teacher: initState.state.teacher,
								action: SubjectActions.update(action.payload),
							})
						);
					});
				}
			}
		});
		Promise.all(promises).then(() => {
			setSaved(true);
			setTimeout(() => {
				reduxDispatch(HeaderActions.setSave(false));
				navigate(`/schedule?group=${group}`, {replace: true});
			}, 1000);
		});
	}, [shouldSave, history, reduxDispatch]);

	if (editMode !== "create" && !attendTimeId) {
		navigate("/schedule", {replace: true});
		return null;
	}

	return (
		<div className="page edit-subject-page">
			<Dialog
				className="edit-subject-page__save-dialog-container"
				classes={{
					paper: "edit-subject-page__save-dialog",
				}}
				open={shouldSave}
			>
				<CircularProgress
					id="save-dialog__progress"
					className={`save-dialog__progress ${
						saved ? "save-dialog__progress--saved" : ""
					}`}
					disableShrink
					color={saved ? "success" : "primary"}
					variant={saved ? "determinate" : "indeterminate"}
					value={saved ? 100 : undefined}
				/>
				{saved && (
					<Icon className="save-dialog__icon">
						<CheckIcon />
					</Icon>
				)}
				<label htmlFor="save-dialog__progress" className="save-dialog__label">
					{saved ? "Сохранено" : "Сохранение"}
				</label>
			</Dialog>
			<form className="edit-subject-form">
				<TitleControl dispatch={dispatch} value={state.title} />
				<TypeControl dispatch={dispatch} value={state.type} />
				<TeacherControl dispatch={dispatch} value={state.teacher} />
				<ScheduleTimes dispatch={dispatch} value={state.times} />
			</form>
		</div>
	);
}

export default EditSubjectPage;
