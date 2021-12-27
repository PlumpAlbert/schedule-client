import React, {useEffect, useReducer, useRef} from "react";
import {useLocation, useNavigate} from "react-router";
import TitleControl from "./FormControls/TitleControl";
import TypeControl from "./FormControls/TypeControl";
import TeacherControl from "./FormControls/TeacherControl";
import ScheduleTimes from "./FormControls/ScheduleTimes";
import reducer, {
	actions as subjectActions,
	SubjectState,
	initialState,
} from "../../store/schedule/subject";
import {useSelector, useDispatch} from "../../store";
import {actions as scheduleActions} from "../../store/schedule";
import {WEEK_TYPE} from "../../types";

import "../../styles/EditSubjectPage.scss";

function EditSubjectPage() {
	const location = useLocation();
	const navigate = useNavigate();
	const {editMode, shouldSave} = useSelector(({application, schedule}) => ({
		editMode: schedule.editMode,
		shouldSave: application.header.save,
		initState: schedule.subjects,
	}));
	const reduxDispatch = useDispatch();

	let attendTimeId: number | undefined;
	if (location.search) {
		const params = new URLSearchParams(location.search);
		attendTimeId = Number(params.get("id"));
	}

	const initState = useSelector<SubjectState & {weekType: WEEK_TYPE}>(
		({schedule}) => {
			if (!attendTimeId) return {...initialState, weekType: WEEK_TYPE.WHITE};
			const subject = schedule.subjects.find(s => {
				return !!s.times.find(t => t.id === attendTimeId);
			});
			if (!subject) return {...initialState, weekType: WEEK_TYPE.WHITE};
			return {
				...subject,
				weekType: WEEK_TYPE.WHITE,
			};
		}
	);

	const {current: initialStateRef} = useRef(
		initState.title ? initState : undefined
	);
	const [state, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		if (!shouldSave) return;
		// if subject existed
		if (initialStateRef) {
			// update properties of attend times
			state.times.map(time => {
				// If attend time was changed
				if (!time.isCreated) {
					(Object.keys(time) as Array<keyof typeof time>).map(key => {
						if (key === "id" || key === "isCreated") return;
						reduxDispatch(
							scheduleActions.updateSubject({
								type: initialStateRef.type,
								title: initialStateRef.title,
								teacher: initialStateRef.teacher.id,
								action: subjectActions.updateAttendTime({
									id: time.id,
									property: key,
									value: time[key],
								}),
							})
						);
					});
				}
				// If attend time was created from scratch
				else {
					reduxDispatch(
						scheduleActions.updateSubject({
							type: initialStateRef.type,
							title: initialStateRef.title,
							teacher: initialStateRef.teacher.id,
							action: subjectActions.addAttendTime({
								weekType: time.weekType,
								weekday: time.weekday,
								time: time.time,
								audience: time.audience,
							}),
						})
					);
				}
			});
			// update properties of subject
			(Object.keys(state) as Array<keyof SubjectState>).forEach(key => {
				if (key === "times") return;
				if (state[key] === initialStateRef[key]) return;
				reduxDispatch(
					scheduleActions.updateSubject({
						teacher: initialStateRef.teacher.id,
						type: initialStateRef.type,
						title: initialStateRef.title,
						action: subjectActions.updateProperty({
							property: key,
							value: state[key],
						}),
					})
				);
			});
		}
		// if subject was created from scratch
		reduxDispatch(
			scheduleActions.addSubject({
				type: state.type,
				teacher: state.teacher,
				times: state.times,
				title: state.title,
			})
		);
	}, [shouldSave]);

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
