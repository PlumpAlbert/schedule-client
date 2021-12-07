import React from "react";
import PropTypes from "prop-types";

interface IProps {
	title: string;
}

const Faculty = ({title}: IProps) => {
	return (
		<div className="faculty">
			<div className="faculty-background"></div>
			<h3 className="faculty-title">{title}</h3>
		</div>
	);
};

Faculty.propTypes = {
	title: PropTypes.string.isRequired
};

export default Faculty;
