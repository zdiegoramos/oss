import { execSync } from "node:child_process";
import { mkdirSync, rmSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { chromium } from "playwright";

const BASE_URL = "https://web.localhost";
const OUTPUT_DIR = resolve(process.cwd(), "public/og");
const FRAMES_DIR = resolve(OUTPUT_DIR, "_frames");

type OgWindow = {
	__ogCapture?: boolean;
	__setOgRotation?: (n: number) => void;
};

type RouteConfig = {
	path: string;
	output: string;
	width: number;
	height: number;
	fps: number;
	durationSec: number;
	warmupMs: number;
	strategy: "rotation" | "freerun";
};

const ROUTES: Record<string, RouteConfig> = {
	text: {
		path: "/text",
		output: "text",
		width: 600,
		height: 600,
		fps: 30,
		durationSec: 3,
		warmupMs: 2500,
		strategy: "rotation",
	},
	dither: {
		path: "/dither",
		output: "dither",
		width: 1200,
		height: 630,
		fps: 16,
		durationSec: 2.5,
		warmupMs: 2500,
		strategy: "freerun",
	},
};

async function captureRotation(
	page: Awaited<
		ReturnType<Awaited<ReturnType<typeof chromium.launch>>["newPage"]>
	>,
	config: RouteConfig
) {
	const totalFrames = config.fps * config.durationSec;

	await page.evaluate(() => {
		(window as unknown as OgWindow).__ogCapture = true;
	});

	for (let i = 0; i < totalFrames; i++) {
		const angle = (i / totalFrames) * Math.PI * 2;

		await page.evaluate((a) => {
			(window as unknown as OgWindow).__setOgRotation?.(a);
			return new Promise<void>((r) => {
				requestAnimationFrame(() =>
					requestAnimationFrame(() => requestAnimationFrame(() => r()))
				);
			});
		}, angle);

		await saveFrame(page, i, config);
		if (i % 15 === 0) {
			console.log(`  ${i}/${totalFrames}`);
		}
	}
}

async function captureFreerun(
	page: Awaited<
		ReturnType<Awaited<ReturnType<typeof chromium.launch>>["newPage"]>
	>,
	config: RouteConfig
) {
	const totalFrames = config.fps * config.durationSec;
	const intervalMs = (config.durationSec * 1000) / totalFrames;

	for (let i = 0; i < totalFrames; i++) {
		await page.evaluate(() => {
			return new Promise<void>((r) => {
				requestAnimationFrame(() => requestAnimationFrame(() => r()));
			});
		});
		await saveFrame(page, i, config);
		await page.waitForTimeout(intervalMs);
		if (i % 15 === 0) {
			console.log(`  ${i}/${totalFrames}`);
		}
	}
}

async function saveFrame(
	page: Awaited<
		ReturnType<Awaited<ReturnType<typeof chromium.launch>>["newPage"]>
	>,
	index: number,
	config: RouteConfig
) {
	await page.screenshot({
		path: resolve(FRAMES_DIR, `frame-${String(index).padStart(4, "0")}.png`),
		clip: { x: 0, y: 0, width: config.width, height: config.height },
	});
}

async function main() {
	const routeName = process.argv[2];

	if (!(routeName && ROUTES[routeName])) {
		console.error("Usage: bun run scripts/capture-og.ts <route>");
		console.error(`Available routes: ${Object.keys(ROUTES).join(", ")}`);
		process.exit(1);
	}

	const config = ROUTES[routeName];
	const totalFrames = config.fps * config.durationSec;
	const outputMp4 = resolve(OUTPUT_DIR, `${config.output}.mp4`);

	mkdirSync(FRAMES_DIR, { recursive: true });

	const browser = await chromium.launch();
	const context = await browser.newContext({
		viewport: { width: config.width, height: config.height },
		ignoreHTTPSErrors: true,
	});
	const page = await context.newPage();

	await page.goto(`${BASE_URL}${config.path}`, { waitUntil: "networkidle" });
	await page.waitForSelector("canvas");
	await page.addStyleTag({
		content: "nextjs-portal { display: none !important; }",
	});
	await page.waitForTimeout(config.warmupMs);

	console.log(`Capturing ${totalFrames} frames for "${routeName}"...`);

	if (config.strategy === "rotation") {
		await captureRotation(page, config);
	} else {
		await captureFreerun(page, config);
	}

	await browser.close();

	console.log("Encoding MP4...");
	execSync(
		`ffmpeg -y -framerate ${config.fps} -i "${FRAMES_DIR}/frame-%04d.png" -c:v libx264 -pix_fmt yuv420p -crf 28 -preset fast -vf "scale=${config.width}:${config.height}" "${outputMp4}"`,
		{ stdio: "inherit" }
	);

	rmSync(FRAMES_DIR, { recursive: true });

	const { size } = statSync(outputMp4);
	console.log(`Done: ${outputMp4} (${(size / 1024).toFixed(1)} KB)`);
}

main().catch((err) => {
	console.error(err);
	process.exit(1);
});
