import React, {useMemo} from "react";
import PropTypes from "prop-types";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";

interface IProps {
	faculty: string;
}
const courses = ["1 курс", "2 курс", "3 курс", "4 курс"];

function SpecialtiesView({faculty}: IProps) {
	const specialties = [
		"Программная инженерия",
		"Автоматизированные системы обработки информации и управления",
		"Администрирование информационных систем"
	];
	const courseElements = useMemo(
		() => courses.map(c => <p className="specialty-cource">{c}</p>),
		[courses]
	);
	const specialtyElements = useMemo(
		() =>
			specialties.map(s => (
				<Accordion>
					<AccordionSummary>{s}</AccordionSummary>
					<AccordionDetails>{courseElements}</AccordionDetails>
				</Accordion>
			)),
		[courseElements, specialties]
	);
	return <div className="specialties-wrapper">{specialtyElements}</div>;
}

SpecialtiesView.propTypes = {
	faculty: PropTypes.string.isRequired
};

export default SpecialtiesView;
