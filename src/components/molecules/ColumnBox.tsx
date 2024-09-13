/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

interface Props {
	children: React.ReactNode;
	gap?: number;
}

export default function ({ children, gap = 10 }: Props) {
	return (
		<div
			css={css`
				display: flex;
				flex-direction: column;
				gap: ${gap}px;
				align-items: flex-start;
			`}
		>
			{children}
		</div>
	);
}
