import React from "react";
import Link from "@mui/material/Link";
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
				<Link
					className="page-footer__link"
					href="https://github.com/PlumpAlbert"
				>
					<GithubIcon className="github-icon page-footer__icon" />
				</Link>
				<Link
					className="page-footer__link"
					href="mailto:plumpalbert@gmail.com"
				>
					<GmailIcon className="mail-icon page-footer__icon" />
				</Link>
				<Link
					className="page-footer__link"
					href="https://t.me/plump_albert"
				>
					<TelegramIcon className="telegram-icon page-footer__icon" />
				</Link>
			</div>
		</footer>
	);
}
