import React, {useState, useEffect, useCallback, useMemo} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ScheduleAPI from "../../API";
import {ISubject, SUBJECT_TYPE, WEEKDAY} from "../../types";
import SubjectView from "./SubjectView";
import {WEEK_TYPE} from "../../types";

import {actions as scheduleActions} from "../../store/schedule";
import {useDispatch, useSelector} from "../../store";
import {selectUser} from "../../store/app";

interface IProps {
	isEditing?: boolean;
	weekday: number;
	weekType: WEEK_TYPE;
}

function SchedulePresenter({isEditing, weekday, weekType}: IProps) {
	const [isLoading, setLoading] = useState(true);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const subjects = useSelector(state => {
		let newSchedule: Array<ISubject[]> = [];
		for (let i = WEEKDAY.MONDAY; i <= WEEKDAY.SUNDAY; i++) {
			newSchedule[i - 1] = state.schedule.subjects.filter(
				v => v.weekday === i
			);
		}
		return newSchedule;
	});
	const user = useSelector(selectUser);

	const groupId = useMemo(() => {
		const query = new URLSearchParams(location.search);
		const groupId = query.get("group");
		if (groupId) return Number(groupId);
		if (user) return user.group?.id;
	}, [location.search]);

	useEffect(() => {
		const abortController = new AbortController();
		try {
			ScheduleAPI.fetchSchedule(groupId || 1, abortController).then(
				schedule => {
					dispatch(scheduleActions.setSchedule(schedule));
					setLoading(false);
				}
			);
		} catch (err) {
			if (!abortController.signal.aborted) {
				setLoading(false);
			}
		} finally {
			return () => {
				abortController.abort();
			};
		}
	}, [groupId]);

	const handleSubjectClick = useCallback<(s: ISubject) => void>(
		subject => {
			navigate("/subject?id=" + subject.id);
		},
		[navigate]
	);

	const handleSubjectDelete = useCallback<(s: ISubject) => void>(
		subject => {
			dispatch(scheduleActions.deleteSubject(subject));
		},
		[dispatch]
	);

	return (
		<List className="schedule-view-page__schedule">
			{isLoading ? (
				<>
					<SubjectView
						key="subject-view-0"
						loading
						type={SUBJECT_TYPE.ЛЕКЦИЯ}
					/>
					<SubjectView
						key="subject-view-1"
						loading
						type={SUBJECT_TYPE.ЛАБОРАТОРНАЯ}
					/>
					<SubjectView
						key="subject-view-2"
						loading
						type={SUBJECT_TYPE.ПРАКТИКА}
					/>
					<SubjectView
						key="subject-view-3"
						loading
						type={SUBJECT_TYPE.ЛАБОРАТОРНАЯ}
					/>
					<SubjectView
						key="subject-view-4"
						loading
						type={SUBJECT_TYPE.ЛЕКЦИЯ}
					/>
				</>
			) : (
				subjects[weekday - 1].map(
					(s, i) =>
						s.weekType === weekType && (
							<SubjectView
								key={`subject-view-${i}`}
								onClick={handleSubjectClick}
								onDelete={handleSubjectDelete}
								isEditable={isEditing}
								value={s}
							/>
						)
				)
			)}
		</List>
	);
}

SchedulePresenter.propTypes = {
	groupId: PropTypes.number
};

export default SchedulePresenter;
