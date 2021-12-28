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
	SubjectStateAttendTime,
} from "../../store/schedule/subject";
import {useSelector, useDispatch} from "../../store";
import {actions as scheduleActions} from "../../store/schedule";
import {WEEK_TYPE} from "../../types";
import ScheduleAPI from "../../API";
import {DisplaySubject} from "../ScheduleView/SubjectView";

import "../../styles/EditSubjectPage.scss";

function updateSubject(
	oldSubject: SubjectState,
	newSubject: SubjectState,
	dispach: ReturnType<typeof useDispatch>
) {
	let changedProperties: Partial<DisplaySubject> = {};
	// Look for updated property. Skip `times` for now
	(Object.keys(newSubject) as Array<keyof typeof newSubject>).forEach(key => {
		if (key === "times" || newSubject[key] === oldSubject[key]) return;
		scheduleActions.updateSubject({
			teacher: oldSubject.teacher.id,
			type: oldSubject.type,
			title: oldSubject.title,
			action: subjectActions.updateProperty({
				property: key,
				value: newSubject[key],
			}),
		});
	});
	newSubject.times.map(newTime => {
		const oldTime = oldSubject.times.find(({id}) => id === newTime.id);
		if (typeof oldTime === "undefined") {
		} else {
			(Object.keys(newTime) as Array<keyof SubjectStateAttendTime>).forEach(
				key => {
					if (
						key === "id" ||
						key === "isCreated" ||
						oldTime[key] === newTime[key]
					) {
						return;
					}
					(changedProperties[key] as SubjectStateAttendTime[typeof key]) =
						newTime[key];
				}
			);
			ScheduleAPI.updateSubject({id: oldTime.id, ...changedProperties}).then(
				() => {
					dispatch(scheduleActions.updateSubject({}));
				}
			);
		}
	});

	ScheduleAPI.updateSubject({
		id: initTime.id,
		...changedProperties,
	}).then(
		success => void console.log("# Updating", changedProperties, success)
	);
	return subjectActions.updateAttendTime({
		id: initTime.id,
		...changedProperties,
	});
}

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

	const initState = useSelector<SubjectState>(({schedule}) => {
		if (!attendTimeId) return {...initialState};
		const subject = schedule.subjects.find(s => {
			return !!s.times.find(t => t.id === attendTimeId);
		});
		if (!subject) return {...initialState};
		return subject;
	});

	const {current: initialStateRef} = useRef(
		initState.title ? initState : undefined
	);
	const [{times, ...subjectState}, dispatch] = useReducer(reducer, initState);

	useEffect(() => {
		if (!shouldSave) return;
		// if subject existed
		if (initialStateRef) {
			// update properties of attend times
			times.map(time => {
				// If attend time was changed
				if (!time.isCreated) {
					const initialTime = initialStateRef.times.find(
						({id}) => time.id === id
					);
					if (typeof initialTime === "undefined") {
						throw new Error("initialTime is undefined");
					}
					reduxDispatch(
						scheduleActions.updateSubject({
							type: subjectState.type,
							title: subjectState.title,
							teacher: subjectState.teacher.id,
							action: saveTime(initialTime, time),
						})
					);
				}
				// If attend time was created from scratch
				else {
					ScheduleAPI.createAttendTime(subjectState, time).then(id => {
						if (!id) {
							throw {message: "Error during creation of attend time", time};
						}
						reduxDispatch(
							scheduleActions.updateSubject({
								type: initialStateRef.type,
								title: initialStateRef.title,
								teacher: initialStateRef.teacher.id,
								action: subjectActions.addAttendTime({
									isCreated: false,
									time: {...time, id},
								}),
							})
						);
					});
				}
			});
			// update properties of subject
			(Object.keys(subjectState) as Array<keyof typeof subjectState>).forEach(
				key => {
					if (subjectState[key] === initialStateRef[key]) return;
					reduxDispatch(
						scheduleActions.updateSubject({
							teacher: initialStateRef.teacher.id,
							type: initialStateRef.type,
							title: initialStateRef.title,
							action: subjectActions.updateProperty({
								property: key,
								value: subjectState[key],
							}),
						})
					);
				}
			);
		}
		// if subject was created from scratch
		reduxDispatch(
			scheduleActions.addSubject({
				type: subjectState.type,
				teacher: subjectState.teacher,
				times: times,
				title: subjectState.title,
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
				<TitleControl dispatch={dispatch} value={subjectState.title} />
				<TypeControl dispatch={dispatch} value={subjectState.type} />
				<TeacherControl dispatch={dispatch} value={subjectState.teacher} />
				<ScheduleTimes dispatch={dispatch} value={times} />
			</form>
		</div>
	);
}

export default EditSubjectPage;
