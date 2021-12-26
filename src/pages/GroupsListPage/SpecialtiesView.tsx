import React, {useCallback, useMemo, useState} from "react";
import PropTypes from "prop-types";
import FAB from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import {FACULTY} from "../../types";
import useSpecialties from "../../hooks/useSpecialties";
import SpecialtyAccordion from "../../components/SpecialtyAccordion";
import CreateDialog from "./CreateDialog";

interface IProps {
	faculty: string;
}
function SpecialtiesView({faculty}: IProps) {
	const [specialties, _, isLoading] = useSpecialties(faculty as FACULTY);
	const [showDialog, setShowDialog] = useState(false);

	const specialtyElements = useMemo(
		() => specialties.map(s => <SpecialtyAccordion key={s.title} {...s} />),
		[specialties]
	);

	const handleAddClick = useCallback(() => {
		setShowDialog(true);
	}, [setShowDialog]);

	return (
		<div className="specialties-wrapper">
			<CreateDialog
				open={showDialog}
				onClose={() => void setShowDialog(false)}
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
