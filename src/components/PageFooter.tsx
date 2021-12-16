import React from "react";
import IconButton from "@mui/material/IconButton";
import TelegramIcon from "@mui/icons-material/Telegram";
import GithubIcon from "@mui/icons-material/GitHub";
import GmailIcon from "@mui/icons-material/Mail";
import "../styles/PageFooter.scss";

export default function PageFooter() {
	return (
		<footer className="page-footer">
			<p className="page-footer__copyright">
				© {new Date().getFullYear()} Plump Albert
			</p>
			<div className="page-footer__links">
				<IconButton className="page-footer__link">
					<GithubIcon className="github-icon page-footer__icon" />
				</IconButton>
				<IconButton className="page-footer__link">
					<GmailIcon className="mail-icon page-footer__icon" />
				</IconButton>
				<IconButton className="page-footer__link">
					<TelegramIcon className="telegram-icon page-footer__icon" />
				</IconButton>
			</div>
		</footer>
	);
}
