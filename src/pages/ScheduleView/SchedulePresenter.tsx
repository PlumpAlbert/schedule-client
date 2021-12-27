import React, {useState, useEffect, useCallback, useMemo} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ScheduleAPI from "../../API";
import {SUBJECT_TYPE} from "../../types";
import SubjectView, {DisplaySubject} from "./SubjectView";
import {WEEK_TYPE} from "../../types";
import {actions as scheduleActions, EditMode} from "../../store/schedule";
import {useDispatch, useSelector} from "../../store";
import {selectUser} from "../../store/app";

interface IProps {
	editMode: EditMode;
	weekday: number;
	weekType: WEEK_TYPE;
}

const subjectPlaceholders = [
	<SubjectView key="subject-view-0" loading type={SUBJECT_TYPE.ЛЕКЦИЯ} />,
	<SubjectView key="subject-view-1" loading type={SUBJECT_TYPE.ЛАБОРАТОРНАЯ} />,
	<SubjectView key="subject-view-2" loading type={SUBJECT_TYPE.ПРАКТИКА} />,
	<SubjectView key="subject-view-3" loading type={SUBJECT_TYPE.ЛАБОРАТОРНАЯ} />,
	<SubjectView key="subject-view-4" loading type={SUBJECT_TYPE.ЛЕКЦИЯ} />,
];

function SchedulePresenter({editMode, weekday, weekType}: IProps) {
	const [isLoading, setLoading] = useState(true);
	const location = useLocation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector(selectUser);

	const subjects = useSelector<DisplaySubject[]>(({schedule}) => {
		return schedule.subjects.reduce<DisplaySubject[]>(
			(displayList, {times, ...subject}) => {
				return displayList.concat(
					times.map<DisplaySubject>(time => ({
						...time,
						...subject,
					}))
				);
			},
			[]
		);
	});

	const groupId = useMemo(() => {
		const query = new URLSearchParams(location.search);
		const groupId = query.get("group");
		if (groupId) return Number(groupId);
		if (user) return user.group?.id;
	}, [location.search]);

	useEffect(() => {
		if (subjects.length > 0) {
			setLoading(false);
			return;
		}
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

	const handleSubjectClick = useCallback<(s: DisplaySubject) => void>(
		subject => {
			navigate("/subject?id=" + subject.id);
		},
		[navigate]
	);

	const handleSubjectDelete = useCallback<(s: DisplaySubject) => void>(
		subject => {
			dispatch(
				scheduleActions.deleteSubject({
					title: subject.title,
					type: subject.type,
					teacher: subject.teacher.id,
				})
			);
		},
		[dispatch]
	);

	return (
		<List className="schedule-view-page__schedule">
			{isLoading
				? subjectPlaceholders
				: subjects.map(
						(s, i) =>
							s.weekday === weekday &&
							s.weekType === weekType && (
								<SubjectView
									key={`subject-view-${i}`}
									onClick={handleSubjectClick}
									onDelete={handleSubjectDelete}
									isEditable={!!editMode}
									value={s}
								/>
							)
				  )}
		</List>
	);
}

SchedulePresenter.propTypes = {
	groupId: PropTypes.number,
};

export default SchedulePresenter;
