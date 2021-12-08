import React, {useCallback, useMemo} from "react";
import {useNavigate} from "react-router-dom";
import PropTypes from "prop-types";

interface IFacultyProps {
	title: string;
}

const Faculty = ({title}: IFacultyProps) => {
	const navigate = useNavigate();
	const handleClick = useCallback(() => {
		navigate(`/groups/${title}`);
	}, [title]);
	return (
		<div className="faculty" onClick={handleClick}>
			<div className="faculty-background"></div>
			<h3 className="faculty-title">{title}</h3>
		</div>
	);
};
Faculty.propTypes = {
	title: PropTypes.string.isRequired
};

const FacultiesView = () => {
	const faculties = ["ФАИ", "ИСФ", "ФГСНиП", "ИМ", "ЭФ", "МИ", "ФТФ"];
	const facultyElements = useMemo(
		() => faculties.map(f => <Faculty title={f} />),
		[faculties]
	);
	return <div className="faculties-wrapper">{facultyElements}</div>;
};
FacultiesView.propTypes = {
	onFacultyClick: PropTypes.func
};

export default FacultiesView;
