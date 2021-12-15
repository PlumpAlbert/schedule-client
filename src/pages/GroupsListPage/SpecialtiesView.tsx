import React, {useMemo} from "react";
import PropTypes from "prop-types";
import {FACULTY} from "../../types";
import useSpecialties from "../../hooks/useSpecialties";
import SpecialtyAccordion from "../../components/SpecialtyAccordion";

interface IProps {
	faculty: string;
}
function SpecialtiesView({faculty}: IProps) {
	const [specialties, _, isLoading] = useSpecialties(faculty as FACULTY);

	const specialtyElements = useMemo(
		() => specialties.map(s => <SpecialtyAccordion key={s.title} {...s} />),
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
