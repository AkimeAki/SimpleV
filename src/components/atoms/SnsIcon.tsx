/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";

interface Props {
	file: string;
	name: string;
	href: string;
}
export default function ({ file, name, href }: Props) {
	return (
		<a
			href={href}
			target="_blank"
			css={css`
				display: block;
				width: 40px;
				aspect-ratio: 1/1;
				font-size: 0;
				border-radius: 50%;
				overflow: hidden;
			`}
		>
			<img
				src={`/icon/circle/${file}.png`}
				alt={`${name}アイコン`}
				css={css`
					width: 100%;
					height: 100%;
				`}
			/>
		</a>
	);
}
