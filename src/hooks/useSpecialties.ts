import React, {useState, useEffect} from "react";
import ScheduleAPI from "../API";
import {FACULTY, ISpecialty} from "../types";
/**
 * Hook for using specialties for specified `faculty`
 * @param {FACULTY} faculty Faculty to use for fetching specialties
 */
function useSpecialties(
	faculty: FACULTY
): [ISpecialty[], React.Dispatch<React.SetStateAction<ISpecialty[]>>] {
	const [specialties, setSpecialties] = useState<ISpecialty[]>([]);

	useEffect(() => {
		if (!faculty) return;
		const abortController = new AbortController();
		try {
			ScheduleAPI.fetchSpecialties(faculty, abortController).then(
				specialties => {
					if (!specialties) {
						setSpecialties([]);
					} else {
						setSpecialties(specialties);
					}
				}
			);
		} catch (err) {
			if (!abortController.signal.aborted) {
				console.error(err);
			}
		} finally {
			return () => {
				abortController.abort();
			};
		}
	}, [faculty, setSpecialties]);

	return [specialties, setSpecialties];
}

export default useSpecialties;
