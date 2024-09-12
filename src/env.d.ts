/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface Window {
	isReady?: boolean;
	magnification?: number;
	threshold?: number;
	silentImageArrayBuffer?: ArrayBuffer;
	soundImageArrayBuffer?: ArrayBuffer;
	dataLayer?: any;
	referrer?: string;
}
