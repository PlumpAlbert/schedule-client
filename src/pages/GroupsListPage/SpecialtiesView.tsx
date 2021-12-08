import React, {useCallback, useMemo} from "react";
import PropTypes from "prop-types";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {useNavigate} from "react-router-dom";

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
	const navigate = useNavigate();
	const handleCourseClick = useCallback(
		course => () => {
			navigate("/schedule?group=");
		},
		[navigate]
	);
	const courseElements = useMemo(
		() =>
			courses.map(c => (
				<p onClick={handleCourseClick(c)} className="specialty-course">
					{c}
				</p>
			)),
		[courses]
	);
	const specialtyElements = useMemo(
		() =>
			specialties.map(s => (
				<Accordion
					disableGutters
					className="specialty"
					TransitionProps={{unmountOnExit: true}}
				>
					<AccordionSummary
						className="specialty-summary"
						expandIcon={<ChevronDownIcon sx={{fontSize: "1rem"}} />}
					>
						{s}
					</AccordionSummary>
					<AccordionDetails className="specialty-details">
						{courseElements}
					</AccordionDetails>
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
