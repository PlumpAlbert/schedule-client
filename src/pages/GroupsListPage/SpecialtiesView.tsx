import React, {useCallback, useMemo, useState} from "react";
import PropTypes from "prop-types";
import FAB from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import {FACULTY, IGroup} from "../../types";
import useSpecialties from "../../hooks/useSpecialties";
import SpecialtyAccordion from "../../components/SpecialtyAccordion";
import CreateDialog from "./CreateDialog";
import {calculateCourse} from "../../Helpers";

interface IProps {
	faculty: FACULTY;
}
function SpecialtiesView({faculty}: IProps) {
	const [specialties, setSpecialties, isLoading] = useSpecialties(
		faculty as FACULTY
	);
	const [showDialog, setShowDialog] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const specialtyElements = useMemo(
		() => specialties.map(s => <SpecialtyAccordion key={s.title} {...s} />),
		[specialties]
	);

	const handleAddClick = useCallback(() => {
		setShowDialog(true);
	}, [setShowDialog]);

	const handleDialogClose = useCallback<(group?: IGroup | undefined) => void>(
		group => {
			if (!group) return setShowDialog(false);
			let index = specialties.findIndex(({title}) => title === group.specialty);
			const course = calculateCourse(group.year);
			if (index !== -1) {
				const specialty = specialties[index];
				specialty.courses[course] = group.id;
				setSpecialties([
					...specialties.slice(0, index),
					specialty,
					...specialties.slice(index),
				]);
				setShowAlert(true);
			} else {
				const specialty = {
					title: group.specialty,
					courses: {[course]: group.id},
				};
				setSpecialties([...specialties, specialty]);
				setShowAlert(true);
			}
		},
		[setShowAlert, setShowDialog, setSpecialties, specialties]
	);

	return (
		<div className="specialties-wrapper">
			<Snackbar
				className="specialties-wrapper-snackbar"
				open={showAlert}
				autoHideDuration={2000}
				onClose={() => void setShowAlert(false)}
			>
				<Alert
					className="specialties-wrapper-snackbar__alert"
					severity="success"
					variant="outlined"
				>
					Группа успешно добавлена
				</Alert>
			</Snackbar>
			<CreateDialog
				faculty={faculty}
				open={showDialog}
				onClose={handleDialogClose}
			/>
			<FAB
				className="specialties-wrapper__fab"
				size="large"
				variant="circular"
				color="primary"
				onClick={handleAddClick}
			>
				<AddIcon className="fab-icon" />
			</FAB>
			{specialtyElements.length
				? specialtyElements
				: !isLoading && (
						<div className="specialties-wrapper__no-items">
							<h3 className="no-items__header">Упс, ничего не найдено!</h3>
						</div>
				  )}
		</div>
	);
}

SpecialtiesView.propTypes = {
	faculty: PropTypes.string.isRequired,
};

export default SpecialtiesView;
