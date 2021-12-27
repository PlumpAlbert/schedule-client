import React, {useCallback, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Course, ISpecialty} from "../types";

import "../styles/SpecialtyAccordion.scss";

const SpecialtyAccordion = ({title, courses}: ISpecialty) => {
	const navigate = useNavigate();
	//#region CALLBACKS
	const handleCourseClick = useCallback<
		React.MouseEventHandler<HTMLParagraphElement>
	>(
		({currentTarget}) => {
			const elementId = currentTarget.id;
			const id = parseInt(elementId.split("course-")[1]);
			navigate(`/schedule?group=${id}`);
		},
		[navigate]
	);
	//#endregion
	//#region MEMO
	const courseElements = useMemo(() => {
		const keys = Object.keys(courses).map(c => Number(c)) as Course[];
		return keys.sort().map(courseNumber => (
			<p
				key={`course-${courseNumber}-${courses[courseNumber]}`}
				id={`course-${courses[courseNumber]}`}
				onClick={handleCourseClick}
				className="specialty-course"
			>
				{courseNumber} курс
			</p>
		));
	}, [courses, handleCourseClick]);
	//#endregion
	return (
		<Accordion
			disableGutters
			className="specialty"
			TransitionProps={{unmountOnExit: true}}
			elevation={0}
		>
			<AccordionSummary
				className="specialty-summary"
				expandIcon={<ChevronDownIcon sx={{fontSize: "1rem"}} />}
			>
				{title}
			</AccordionSummary>
			<AccordionDetails className="specialty-details">
				{courseElements}
			</AccordionDetails>
		</Accordion>
	);
};

export default SpecialtyAccordion;
