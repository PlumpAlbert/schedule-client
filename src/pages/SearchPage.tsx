import React, {useEffect, useMemo, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import ScheduleAPI from "../API";
import FacultyAccordion from "../components/FacultyAccordion";
import {FACULTY, ISpecialty} from "../types";

function SearchPage() {
	const [results, setResults] = useState<Partial<Record<FACULTY, ISpecialty[]>>>({});
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const query = new URLSearchParams(location.search);
		const searchString = query.get("q");
		if (searchString) {
			ScheduleAPI.searchGroup(searchString)
				.then(body => {
					setResults(body || {});
				})
				.catch(err => {
					if (process.env.NODE_ENV === "development") {
						console.error(err);
						setResults({});
					}
				});
		}
	}, [location.search]);

	const facultyElements = useMemo(
		() =>
			Object.keys(results).map(faculty => (
				<FacultyAccordion
					key={faculty}
					title={faculty as FACULTY}
					specialties={results[faculty as FACULTY]}
				/>
			)),
		[results],
	);

	return <div className="page search-page">{facultyElements}</div>;
}

export default SearchPage;
