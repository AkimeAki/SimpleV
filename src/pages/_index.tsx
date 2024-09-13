/** @jsxImportSource @emotion/react */

import Button from "@/components/atoms/Button";
import ContextMenuItem from "@/components/atoms/ContextMenuItem";
import Title from "@/components/atoms/Title";
import ColumnBox from "@/components/molecules/ColumnBox";
import ContextMenu from "@/components/molecules/ContextMenu";
import Footer from "@/components/molecules/Footer";
import { css } from "@emotion/react";
import { useEffect, useRef, useState } from "react";

export default function () {
	const [magnification, setMagnification] = useState<number>(1);
	const [threshold, setThreshold] = useState<number>(73);
	const [isVoiceReady, setIsVoiceReady] = useState<boolean>(false);
	const gainElement = useRef<HTMLDivElement>(null);
	const gainWrapElement = useRef<HTMLDivElement>(null);
	const installButtonElement = useRef<HTMLButtonElement>(null);
	const [isPossibleInstall, setIsPossibleInstall] = useState<boolean>(false);
	const [isViewMode, setIsViewMode] = useState<boolean>(false);
	const [isViewReady, setIsViewReady] = useState<boolean>(false);
	const [bgColor, setBgColor] = useState<string>("#00FF00");
	const [silentImageArrayBuffer, setSilentImageArrayBuffer] = useState<ArrayBuffer | null>(null);
	const [soundImageArrayBuffer, setSoundImageArrayBuffer] = useState<ArrayBuffer | null>(null);
	const [silentImageUrl, setSilentImageUrl] = useState<string>("");
	const [soundImageUrl, setSoundImageUrl] = useState<string>("");
	const [isDotMode, setIsDotMode] = useState<boolean>(false);
	const [isTalking, setIsTalking] = useState<boolean>(false);
	const selectSilentImageInputElement = useRef<HTMLInputElement>(null);
	const selectSoundImageInputElement = useRef<HTMLInputElement>(null);

	useEffect(() => {
		const eventCustom = (event: Event) => {
			event.preventDefault();

			if (installButtonElement.current !== null) {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				installButtonElement.current.promptEvent = event;
				setIsPossibleInstall(true);
			}
		};

		window.addEventListener("beforeinstallprompt", eventCustom);

		return () => {
			window.removeEventListener("beforeinstallprompt", eventCustom);
		};
	}, []);

	useEffect(() => {
		const url = window.URL;

		if (silentImageArrayBuffer !== null) {
			setSilentImageUrl(url.createObjectURL(new Blob([silentImageArrayBuffer])));
		}

		if (soundImageArrayBuffer !== null) {
			setSoundImageUrl(url.createObjectURL(new Blob([soundImageArrayBuffer])));
		}

		if (silentImageArrayBuffer !== null && soundImageArrayBuffer !== null) {
			setIsViewReady(true);
		}
	}, [silentImageArrayBuffer, soundImageArrayBuffer]);

	useEffect(() => {
		window.magnification = magnification;
	}, [magnification]);

	useEffect(() => {
		window.threshold = threshold;
	}, [threshold]);

	return (
		<>
			{isViewMode ? (
				<>
					<ContextMenu>
						<ContextMenuItem
							onClick={() => {
								setIsViewMode(false);
							}}
						>
							設定画面に戻る
						</ContextMenuItem>
						<ContextMenuItem>
							背景色選択
							<input
								type="color"
								value={bgColor}
								onChange={(e) => {
									setBgColor(e.target.value);
								}}
							/>
						</ContextMenuItem>
						<ContextMenuItem>
							ドット絵モード
							<input
								type="checkbox"
								onChange={(e) => {
									setIsDotMode(e.target.checked);
								}}
							/>
						</ContextMenuItem>
					</ContextMenu>

					<div
						css={css`
							position: relative;
							width: 100%;
							height: 100%;
							background-color: ${bgColor};
						`}
					>
						<img
							css={css`
								display: block;
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								width: calc(100% - 30px);
								height: calc(100% - 30px);
								object-fit: contain;
								image-rendering: crisp-edges;

								${isDotMode &&
								css`
									image-rendering: pixelated;
								`}

								${isTalking &&
								css`
									display: none;
								`}
							`}
							src={silentImageUrl}
						/>
						<img
							css={css`
								display: none;
								position: absolute;
								top: 50%;
								left: 50%;
								transform: translate(-50%, -50%);
								width: calc(100% - 30px);
								height: calc(100% - 30px);
								object-fit: contain;
								image-rendering: crisp-edges;

								${isDotMode &&
								css`
									image-rendering: pixelated;
								`}

								${isTalking &&
								css`
									display: block;
								`}
							`}
							src={soundImageUrl}
						/>
					</div>
				</>
			) : (
				<>
					<main
						css={css`
							padding: 20px;
						`}
					>
						<div
							css={css`
								display: flex;
								flex-direction: column;
								align-items: flex-start;
								gap: 50px;
							`}
						>
							<ColumnBox>
								<Title>はじめにこちらのボタンを押して、音声入力の許可をしてください</Title>
								<Button
									onClick={() => {
										void (async () => {
											try {
												const audioCtx = new AudioContext();

												// マイクから音声を取得する
												const stream = await navigator.mediaDevices.getUserMedia({
													audio: true
												});
												const source = audioCtx.createMediaStreamSource(stream);

												const analyser = audioCtx.createAnalyser();
												analyser.fftSize = 256;
												source.connect(analyser);

												const dataArray = new Uint8Array(analyser.frequencyBinCount);

												// ゲインの表示関数
												const getDb = () => {
													// 周波数データを取得
													analyser.getByteFrequencyData(dataArray);

													const maxLevel = Math.max(...dataArray);
													const db = (maxLevel / 255) * 100;

													const gain = db * (window.magnification ?? 1);

													if (gainElement.current !== null) {
														gainElement.current.style.backgroundColor = "";

														if (gain >= 100) {
															gainElement.current.style.backgroundColor = "#b35757";
														}

														gainElement.current.style.width = `${gain}%`;
													}

													if ((window.threshold ?? 0) < gain) {
														setIsTalking(true);
													} else {
														setIsTalking(false);
													}

													// 繰り返し実行
													requestAnimationFrame(getDb);
												};

												// ゲイン表示を開始
												getDb();
												setIsVoiceReady(true);
											} catch (e) {
												/* empty */
											}
										})();
									}}
								>
									音声を入力の許可をする
								</Button>
							</ColumnBox>
							<ColumnBox>
								<Title>使用する画像を選択</Title>
								<p>同じサイズの画像を選択することをおすすめします。</p>
								<div>
									<input
										type="file"
										accept=".jpg,.jpeg,.png,.gif"
										css={css`
											display: none;
										`}
										ref={selectSoundImageInputElement}
										onChange={(e) => {
											void (async () => {
												const files = e.target.files;

												if (files !== null) {
													const file = files[0];
													if (file !== undefined) {
														const arrayBuffer = await file.arrayBuffer();
														setSoundImageArrayBuffer(arrayBuffer);
													}
												}
											})();
										}}
									/>
									<input
										type="file"
										accept=".jpg,.jpeg,.png,.gif"
										css={css`
											display: none;
										`}
										ref={selectSilentImageInputElement}
										onChange={(e) => {
											void (async () => {
												const files = e.target.files;

												if (files !== null) {
													const file = files[0];
													if (file !== undefined) {
														const arrayBuffer = await file.arrayBuffer();
														setSilentImageArrayBuffer(arrayBuffer);
													}
												}
											})();
										}}
									/>
									<div
										css={css`
											display: flex;
											flex-wrap: wrap;
											gap: 10px;
										`}
									>
										<Button
											disabled={!isVoiceReady}
											onClick={() => {
												if (selectSilentImageInputElement.current !== null) {
													selectSilentImageInputElement.current.click();
												}
											}}
										>
											音声入力が無い場合に表示する画像を選択
										</Button>
										<Button
											disabled={!isVoiceReady}
											onClick={() => {
												if (selectSoundImageInputElement.current !== null) {
													selectSoundImageInputElement.current.click();
												}
											}}
										>
											音声入力中に表示する画像を選択
										</Button>
									</div>
								</div>
							</ColumnBox>
							<ColumnBox>
								<Title>入力音量を調整</Title>
								<div>
									<input
										type="number"
										min="0"
										value={magnification}
										step="0.01"
										css={css`
											text-align: right;
										`}
										onChange={(e) => {
											setMagnification(Number(e.target.value));
										}}
									/>
									<span>倍</span>
								</div>
							</ColumnBox>
							<ColumnBox>
								<Title>表示タイミングを調節</Title>
								<p>青いバーをつまんで調節できます。音量が青いバーを超えると喋ってる判定になります。</p>
								<div>
									<div
										ref={gainWrapElement}
										css={css`
											position: relative;
											width: 300px;
											height: 40px;
										`}
									>
										<div
											css={css`
												position: absolute;
												top: 0;
												left: ${threshold > 100 ? 100 : threshold < 0 ? 0 : threshold}%;
												width: 7px;
												height: 100%;
												width: 15px;
												height: 100%;
												z-index: 2;
												cursor: col-resize;
												touch-action: none;
												transform: translateX(-10px);

												&:after {
													display: block;
													content: "";
													position: absolute;
													top: 50%;
													left: 50%;
													transform: translate(-50%, -50%);
													width: 5px;
													height: 100%;
													background-color: #5d57b3;
													border: 2px solid white;
													border-radius: 5px;
												}
											`}
											onPointerMove={(e) => {
												if (e.buttons === 1 && gainWrapElement.current !== null) {
													const target = e.target as HTMLDivElement;
													const position = target.offsetLeft + e.movementX;
													let viewPosition = position;

													if (position >= gainWrapElement.current.offsetWidth - 1) {
														viewPosition = gainWrapElement.current.offsetWidth;
													}

													if (position <= 0) {
														viewPosition = 0;
													}

													setThreshold(
														(viewPosition / gainWrapElement.current.offsetWidth) * 100
													);
													target.draggable = false;
													target.setPointerCapture(e.pointerId);
												}
											}}
										/>
										<div
											css={css`
												position: absolute;
												top: 50%;
												left: 50%;
												transform: translate(-50%, -50%);
												width: 100%;
												height: 10px;
												overflow: hidden;
												border-radius: 5px;

												&:before {
													content: "";
													display: block;
													position: absolute;
													top: 0;
													left: 0;
													width: 100%;
													height: 100%;
													background-color: #485b42;
												}
											`}
										>
											<div
												ref={gainElement}
												css={css`
													position: absolute;
													top: 0;
													left: 0;
													height: 100%;
													background-color: #6cb357;
												`}
											/>
										</div>
									</div>
								</div>
							</ColumnBox>
							<ColumnBox>
								<Title>準備が完了したら、SimpleVを起動してください</Title>
								<p>
									SimpleVを起動するとUIがすべてなくなります。右クリックもしくは、スマホなどのタッチ操作の場合は画面長押しから「設定画面に戻る」を押すと今の設定の画面に戻れます。
								</p>
								<Button
									disabled={!isViewReady}
									onClick={() => {
										setIsViewMode(true);
									}}
								>
									SimpleVを起動
								</Button>
							</ColumnBox>
							<ColumnBox>
								<p>今後実装予定です。</p>
								<div
									css={css`
										display: flex;
										flex-wrap: wrap;
										gap: 10px;
									`}
								>
									<Button disabled>保存した設定を読み込む</Button>
									<Button disabled>設定を保存</Button>
								</div>
							</ColumnBox>
							<div
								css={css`
									display: none;

									${isPossibleInstall &&
									css`
										display: block;
									`}
								`}
							>
								<ColumnBox>
									<p>アプリ化することでOBSなどで取り込んだ際に便利です。</p>
									<Button
										onClick={() => {
											if (installButtonElement.current != null) {
												// eslint-disable-next-line @typescript-eslint/ban-ts-comment
												// @ts-expect-error
												installButtonElement.current.promptEvent.prompt();

												// eslint-disable-next-line @typescript-eslint/ban-ts-comment
												// @ts-expect-error
												installButtonElement.current.promptEvent.userChoice.then(() => {
													// eslint-disable-next-line @typescript-eslint/ban-ts-comment
													// @ts-expect-error
													installButtonElement.current.promptEvent = null;
												});
											}
										}}
									>
										アプリ化する
									</Button>
								</ColumnBox>
							</div>
						</div>
					</main>
					<Footer />
				</>
			)}
		</>
	);
}
