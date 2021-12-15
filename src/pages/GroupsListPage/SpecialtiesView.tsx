import React, {useCallback, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {Course, FACULTY, ISpecialty} from "../../types";
import useSpecialties from "../../hooks/useSpecialties";

interface ISpecialtyProps extends ISpecialty {}
const Specialty = ({title, courses}: ISpecialtyProps) => {
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
		const keys = Object.keys(courses) as Course[];
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

interface IProps {
	faculty: string;
}
function SpecialtiesView({faculty}: IProps) {
	const [specialties, _, isLoading] = useSpecialties(faculty as FACULTY);

	const specialtyElements = useMemo(
		() => specialties.map(s => <Specialty key={s.title} {...s} />),
		[specialties]
	);
	return (
		<div className="specialties-wrapper">
			{specialtyElements.length
				? specialtyElements
				: !isLoading && (
						<div className="specialties-wrapper__no-items">
							<h3 className="no-items__header">
								Упс, ничего не найдено!
							</h3>
						</div>
				  )}
		</div>
	);
}

SpecialtiesView.propTypes = {
	faculty: PropTypes.string.isRequired
};

export default SpecialtiesView;
