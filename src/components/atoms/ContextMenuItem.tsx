/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

interface Props {
	href?: string;
	children: React.ReactNode;
	onClick?: () => void;
}

export default function ({ href, onClick, children }: Props) {
	const style = css`
		background-color: #5b4942;
		color: white;
		padding: 10px 20px 7px;
		cursor: pointer;
		white-space: nowrap;
		text-decoration: none;
		user-select: none;
		display: flex;
		gap: 10px;
		align-items: center;

		@media (hover: hover) {
			&:hover {
				background-color: #80675d;
			}
		}
	`;

	const click = () => {
		if (onClick !== undefined) {
			onClick();
		}

		window.dataLayer.push({
			event: "clickButton"
		});
	};

	return (
		<>
			{href === undefined ? (
				<button css={style} data-gtm-click="contextmenu" onClick={click}>
					{children}
				</button>
			) : (
				<a css={style} data-gtm-click="contextmenu" onClick={click}>
					{children}
				</a>
			)}
		</>
	);
}
