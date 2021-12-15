import React, {useState, useEffect} from "react";
import ScheduleAPI from "../API";
import {FACULTY, ISpecialty} from "../types";
/**
 * Hook for using specialties for specified `faculty`
 * @param {FACULTY} faculty Faculty to use for fetching specialties
 */
function useSpecialties(
	faculty: FACULTY
): [ISpecialty[], React.Dispatch<React.SetStateAction<ISpecialty[]>>, boolean] {
	const [specialties, setSpecialties] = useState<ISpecialty[]>([]);
	const [isLoading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (!faculty) return;
		const abortController = new AbortController();
		setLoading(true);
		ScheduleAPI.fetchSpecialties(faculty, abortController)
			.then(specialties => {
				if (!specialties) {
					setSpecialties([]);
				} else {
					setSpecialties(specialties);
				}
				setLoading(false);
			})
			.catch(err => {
				if (!abortController.signal.aborted) {
					console.error(err);
				}
				setLoading(false);
			});
		return () => {
			abortController.abort();
		};
	}, [faculty, setSpecialties]);

	return [specialties, setSpecialties, isLoading];
}

export default useSpecialties;
