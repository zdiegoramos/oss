"use client";

import type p5 from "p5";
import { useEffect, useRef } from "react";

export function P5Canvas({
	draw,
	setup,
	disableResize,
	...props
}: React.ComponentProps<"div"> & {
	draw: (p: p5) => void;
	setup?: (p: p5, height: number, width: number) => void;
	disableResize?: boolean;
}) {
	const p5CanvasRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const p5Current = p5CanvasRef.current;

		if (p5Current === null) {
			return;
		}

		// Dynamically import p5 only on the client side
		import("p5").then((p5Module) => {
			const p5Instance = new p5Module.default((p: p5) => {
				p.setup = () => {
					const width = p5Current.getBoundingClientRect().width;
					const height = p5Current.getBoundingClientRect().height;
					if (!setup) {
						p.createCanvas(width, height);
						return;
					}

					setup(p, height, width);
				};

				if (disableResize !== true) {
					p.windowResized = () => {
						const width = p5Current.getBoundingClientRect().width;
						const height = p5Current.getBoundingClientRect().height;
						p.resizeCanvas(width, height);
					};
				}

				p.draw = () => draw(p);
			}, p5Current);

			return () => {
				p5Instance.remove();
			};
		});
	}, [draw, setup, disableResize]);

	return (
		<div
			ref={p5CanvasRef}
			style={{ width: "100%", height: "100%" }}
			{...props}
		/>
	);
}
