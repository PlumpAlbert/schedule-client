import React, {useMemo} from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SpecialtyAccordion from "./SpecialtyAccordion";
import {FACULTY, ISpecialty} from "../types";

import "../styles/FacultyAccordion.scss";

interface IProps {
	title: FACULTY;
	specialties?: ISpecialty[];
}

const FacultyAccordion = ({title, specialties}: IProps) => {
	const specialtyElements = useMemo(
		() => specialties?.map(specialty => <SpecialtyAccordion {...specialty} />),
		[specialties],
	);

	return (
		<Accordion
			disableGutters
			className="faculty-accordion"
			TransitionProps={{unmountOnExit: true}}
			elevation={0}
		>
			<AccordionSummary
				className="faculty-accordion-summary"
				expandIcon={<ChevronDownIcon sx={{fontSize: "1rem"}} />}
			>
				{title}
			</AccordionSummary>
			<AccordionDetails className="faculty-accordion-details">
				{specialtyElements}
			</AccordionDetails>
		</Accordion>
	);
};

export default FacultyAccordion;
