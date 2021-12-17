import React, {useState, useEffect, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import List from "@mui/material/List";
import ScheduleAPI from "../../API";
import {ISubject} from "../../types";
import SubjectView from "./SubjectView";
import {WEEK_TYPE} from "../../types";

interface IProps {
	groupId?: number;
	weekday: number;
	weekType: WEEK_TYPE;
}
enum WeekDay {
	Monday = 1,
	Tuesday,
	Wednesday,
	Thursday,
	Friday,
	Saturday,
	Sunday
}

function SchedulePresenter({groupId, weekday, weekType}: IProps) {
	const [subjects, setSubjects] = useState<Array<ISubject[]>>([]);
	const [isLoading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		const abortController = new AbortController();
		try {
			ScheduleAPI.fetchSchedule(groupId || 1, abortController).then(
				schedule => {
					let newSchedule: Array<ISubject[]> = [];
					for (let i = WeekDay.Monday; i <= WeekDay.Sunday; i++) {
						newSchedule[i - 1] = schedule.filter(
							v => v.weekday === i
						);
					}
					setSubjects(newSchedule);
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
			navigate("/subject?id=" + subject.id, {
				state: {subject},
				replace: false
			});
		},
		[navigate]
	);

	const handleSubjectDelete = useCallback<(s: Partial<ISubject>) => void>(
		subject => {
			if (subject.weekday) {
				const index = subject.weekday - 1;
				setSubjects([
					...subjects.slice(0, index),
					subjects[index].filter(s => s.id !== subject.id),
					...subjects.slice(index + 1)
				]);
			}
		},
		[setSubjects, subjects]
	);

	return (
		<List className="schedule-view-page__schedule">
			{isLoading ? (
				<>
					<SubjectView key="subject-view-0" loading type={0} />
					<SubjectView key="subject-view-1" loading type={2} />
					<SubjectView key="subject-view-2" loading type={1} />
					<SubjectView key="subject-view-3" loading type={2} />
					<SubjectView key="subject-view-4" loading type={0} />
				</>
			) : (
				subjects[weekday - 1].map(
					(s, i) =>
						s.weekType === weekType && (
							<SubjectView
								key={`subject-view-${i}`}
								onClick={handleSubjectClick}
								onDelete={handleSubjectDelete}
								id={s.id}
								type={s.type}
								weekType={s.weekType}
								weekday={s.weekday}
								audience={s.audience}
								teacher={s.teacher}
								time={s.time}
								title={s.title}
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
