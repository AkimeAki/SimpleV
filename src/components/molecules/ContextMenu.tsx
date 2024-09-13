/** @jsxImportSource @emotion/react */

import { css } from "@emotion/react";
import { useEffect, useState } from "react";

interface Props {
	children: React.ReactNode;
}

export default function ({ children }: Props) {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [menuX, setMenuX] = useState<number>(0);
	const [menuY, setMenuY] = useState<number>(0);

	useEffect(() => {
		const bodyClick = () => {
			setIsOpen(false);
		};

		const openMenu = (e: MouseEvent) => {
			setMenuX(e.pageX);
			setMenuY(e.pageY);
			setIsOpen(true);
		};

		document.body.addEventListener("click", bodyClick);
		document.body.addEventListener("contextmenu", openMenu);

		return () => {
			document.body.removeEventListener("click", bodyClick);
			document.body.removeEventListener("contextmenu", openMenu);
		};
	}, []);

	useEffect(() => {
		document.body.setAttribute("oncontextmenu", "return false;");

		return () => {
			document.body.removeAttribute("oncontextmenu");
		};
	}, []);

	return (
		<div
			css={css`
				position: fixed;
				top: ${menuY}px;
				left: ${menuX}px;
				z-index: calc(infinity);
				display: flex;
				opacity: 0;
				user-select: none;
				pointer-events: none;
				flex-direction: column;
				background-color: #5b4942;
				box-shadow: 0px 5px 15px 0px rgba(0, 0, 0, 0.35);
				border-radius: 10px;
				overflow: hidden;
				padding: 10px 0;
				transition-duration: 200ms;
				transition-property: opacity;

				${isOpen &&
				css`
					opacity: 1;
					pointer-events: all;
				`}
			`}
		>
			{children}
		</div>
	);
}
