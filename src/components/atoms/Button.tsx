/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

interface Props {
	href?: string;
	disabled?: boolean;
	children: React.ReactNode;
	onClick?: () => void;
}

export default function ({ href, disabled = false, children, onClick }: Props) {
	const style = css`
		display: inline-block;
		cursor: pointer;
		padding: 15px 20px 13px;
		background-color: #5b4942;
		color: white;
		box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.35);
		border-radius: 10px;
		text-decoration: none;
		user-select: none;

		@media (hover: hover) {
			&:hover {
				background-color: #80675d;
			}
		}

		${disabled &&
		css`
			background-color: #8f8f8f;
			cursor: not-allowed;

			&:hover {
				background-color: #8f8f8f;
			}
		`}
	`;

	return (
		<>
			{href === undefined ? (
				<button
					disabled={disabled}
					css={style}
					onClick={() => {
						if (onClick !== undefined && !disabled) {
							onClick();
						}
					}}
				>
					{children}
				</button>
			) : (
				<a
					href={disabled ? href : undefined}
					css={style}
					onClick={() => {
						if (onClick !== undefined && !disabled) {
							onClick();
						}
					}}
				>
					{children}
				</a>
			)}
		</>
	);
}
