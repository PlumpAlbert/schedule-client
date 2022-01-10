import {useEffect, useReducer} from "react";
import {useLocation, useNavigate} from "react-router";
import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import TeacherControl from "./FormControls/TeacherControl";
import ScheduleTimes from "./FormControls/ScheduleTimes";
import reducer, {IEditSubjectPageStore} from "./reducer";
import {useSelector, useDispatch} from "../../store";
import {actions as ScheduleActions} from "../../store/schedule";
import {initialState, actions as SubjectActions, ACTION_TYPES} from "../../store/schedule/subject";
import ScheduleAPI from "../../API";

import "../../styles/EditSubjectPage.scss";

function EditSubjectPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const {editMode, shouldSave, group} = useSelector(({application, schedule}) => ({
		editMode: schedule.editMode,
		shouldSave: application.header.save,
		group: schedule.currentGroup,
	}));
	const reduxDispatch = useDispatch();

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
		history.forEach(action => {
			switch (action.type) {
				case ACTION_TYPES.addAttendTime: {
					const {type, teacher, title, time, weekday, weekType, audience} =
						action.payload;
					ScheduleAPI.createAttendTime(
						{type, teacher, title},
						{time, weekday, audience, weekType},
						group,
					).then(createdSubject => {
						if (!createdSubject) return;
						reduxDispatch(
							ScheduleActions.updateSubject({
								title: initState.state.title,
								type: initState.state.type,
								teacher: initState.state.teacher.id,
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
								teacher: initState.state.teacher.id,
								action: SubjectActions.update(createdSubject),
							})
						);
					});
					break;
				}
				case ACTION_TYPES.deleteAttendTime: {
					ScheduleAPI.deleteSubject(action.payload).then(success => {
						if (!success) return;
						reduxDispatch(
							ScheduleActions.updateSubject({
								title: initState.state.title,
								type: initState.state.type,
								teacher: initState.state.teacher.id,
								action: SubjectActions.deleteAttendTime(action.payload),
							})
						);
					});
					break;
				}
				case ACTION_TYPES.updateAttendTime: {
					ScheduleAPI.updateSubject(action.payload).then(success => {
						if (!success) return;
						reduxDispatch(
							ScheduleActions.updateSubject({
								title: initState.state.title,
								type: initState.state.type,
								teacher: initState.state.teacher.id,
								action: SubjectActions.update(action.payload),
							})
						);
					});
				}
			}
		});
	}, [shouldSave, history, reduxDispatch]);

	if (editMode !== "create" && !attendTimeId) {
		navigate("/schedule", {replace: true});
		return null;
	}

	return (
		<div className="page edit-subject-page">
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
