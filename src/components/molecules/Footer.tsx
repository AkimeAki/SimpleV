/** @jsxImportSource @emotion/react */

import SnsIcon from "@/components/atoms/SnsIcon";
import { css } from "@emotion/react";

export default function () {
	return (
		<footer
			css={css`
				text-align: center;
				padding: 60px 0;
				background-color: #5b4942;
			`}
		>
			<span
				css={css`
					display: inline-block;
					font-weight: 300;
					color: white;
				`}
			>
				Created by{" "}
				<a
					href="https://aki.wtf/"
					target="_blank"
					css={css`
						color: rgb(187, 243, 253);
						font-weight: bold;
					`}
				>
					彩季
				</a>
			</span>
			<div
				css={css`
					display: flex;
					justify-content: center;
					padding: 20px 10px;
					gap: 20px;
				`}
			>
				<SnsIcon
					file="youtube"
					name="YouTube"
					href="https://www.youtube.com/channel/UCHV3Taosn76pn9_ip1u7Zkg"
				/>
				<SnsIcon file="x" name="X" href="https://x.com/Akime_Aki" />
				<SnsIcon file="github" name="GitHub" href="https://github.com/AkimeAki/SimpleV" />
			</div>
		</footer>
	);
}
