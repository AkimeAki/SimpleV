/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

interface Props {
	children: React.ReactNode;
}

export default function ({ children }: Props) {
	return (
		<h2
			css={css`
				font-size: 20px;
				font-weight: bold;
			`}
		>
			{children}
		</h2>
	);
}
