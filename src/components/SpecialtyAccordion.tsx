import React, {useCallback, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ChevronDownIcon from "@mui/icons-material/KeyboardArrowDown";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListSubheader from "@mui/material/ListSubheader";
import {BACHELOR_MAX, Course, ISpecialty} from "../types";

import "../styles/SpecialtyAccordion.scss";

const SpecialtyAccordion = ({title, courses}: ISpecialty) => {
	const navigate = useNavigate();
	//#region CALLBACKS
	const handleCourseClick = useCallback<React.MouseEventHandler>(
		({currentTarget}) => {
			const elementId = currentTarget.id;
			const id = parseInt(elementId.split("course-")[1]);
			navigate(`/schedule?group=${id}`);
		},
		[navigate]
	);
	//#endregion
	//#region MEMO
	const [bachelorGroups, magistracyGroups] = useMemo(() => {
		const keys = Object.keys(courses).map(c => Number(c)) as Course[];
		let bachelor: JSX.Element[] = [];
		let magistracy: JSX.Element[] = [];
		keys.sort().forEach(courseNumber => {
			if (courseNumber > BACHELOR_MAX) {
				magistracy.push(
					<ListItem
						key={`course-magistracy-${courseNumber}-${courses[courseNumber]}`}
						id={`course-${courses[courseNumber]}`}
						onClick={handleCourseClick}
						className="specialty-course"
					>
						{courseNumber - BACHELOR_MAX} курс
					</ListItem>
				);
			} else {
				bachelor.push(
					<ListItem
						key={`course-bachelor-${courseNumber}-${courses[courseNumber]}`}
						id={`course-${courses[courseNumber]}`}
						onClick={handleCourseClick}
						className="specialty-course"
					>
						{courseNumber} курс
					</ListItem>
				);
			}
			return;
		});
		return [bachelor, magistracy];
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
				<List className="specialty-details-list">
					{!!bachelorGroups.length && (
						<>
							<ListSubheader className="specialty-details-list__subheader specialty-course">
								Бакалавриат
							</ListSubheader>
							{bachelorGroups}
						</>
					)}
					{!!magistracyGroups.length && (
						<>
							<ListSubheader className="specialty-details-list__subheader specialty-course">
								Магистратура
							</ListSubheader>
							{magistracyGroups}
						</>
					)}
				</List>
			</AccordionDetails>
		</Accordion>
	);
};

export default SpecialtyAccordion;
