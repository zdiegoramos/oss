"use client";

import { useEffect, useRef } from "react";
import {
	AmbientLight,
	CylinderGeometry,
	DirectionalLight,
	Group,
	Mesh,
	MeshBasicMaterial,
	MeshPhongMaterial,
	PerspectiveCamera,
	PointLight,
	Scene,
	SphereGeometry,
	WebGLRenderer,
} from "three";

export default function FlowerBackground() {
	const mountRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!mountRef.current) {
			return;
		}

		// Scene setup
		const scene = new Scene();
		const camera = new PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new WebGLRenderer({ alpha: true, antialias: true });

		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setClearColor(0x00_00_00, 0); // Transparent background
		mountRef.current.appendChild(renderer.domElement);

		// Create flower geometry
		const createPetal = () => {
			const petalGeometry = new SphereGeometry(0.6, 32, 16);
			petalGeometry.scale(1.2, 0.2, 2.5); // Flatten and elongate to make petal shape
			return petalGeometry;
		};

		// Flower materials with gradient-like colors that match the site theme
		const petalMaterials = [
			new MeshPhongMaterial({
				color: 0xff_69_b4,
				transparent: true,
				opacity: 0.9,
			}), // Hot pink
			new MeshPhongMaterial({
				color: 0xff_14_93,
				transparent: true,
				opacity: 0.9,
			}), // Deep pink
			new MeshPhongMaterial({
				color: 0xdc_14_3c,
				transparent: true,
				opacity: 0.9,
			}), // Crimson
			new MeshPhongMaterial({
				color: 0xb2_22_22,
				transparent: true,
				opacity: 0.9,
			}), // Fire brick
			new MeshPhongMaterial({
				color: 0x8b_00_00,
				transparent: true,
				opacity: 0.9,
			}), // Dark red
			new MeshPhongMaterial({
				color: 0xff_00_40,
				transparent: true,
				opacity: 0.9,
			}), // Bright red
		];

		// Create flower
		const flower = new Group();

		// Create center of flower
		const centerGeometry = new SphereGeometry(0.3, 16, 16);
		const centerMaterial = new MeshPhongMaterial({
			color: 0x51_04_24, // Brighter gold/yellow
			// emissive: 0x444400, // Add emission for glow effect
			// shininess: 100, // Make it more reflective
		});
		const center = new Mesh(centerGeometry, centerMaterial);
		flower.add(center);

		// Create petals in a circular pattern
		const petalCount = 12;
		const petalGeometry = createPetal();

		for (let i = 0; i < petalCount; i++) {
			const petal = new Mesh(
				petalGeometry,
				petalMaterials[i % petalMaterials.length]
			);
			const angle = (i / petalCount) * Math.PI * 1;

			petal.position.set(
				Math.cos(angle) * 1.5,
				Math.sin(angle) * 0.3,
				Math.sin(angle) * 1.5
			);

			// Rotate petal to face outward
			petal.rotation.z = angle;
			petal.rotation.x = Math.PI / 6; // Slight tilt for more natural look

			flower.add(petal);
		}

		// Add multiple layers of petals for fullness
		for (let layer = 0; layer < 2; layer++) {
			const layerOffset = layer * 0.3;
			const layerScale = 1 - layer * 0.2;

			for (let i = 0; i < petalCount; i++) {
				const petal = new Mesh(
					petalGeometry,
					petalMaterials[(i + layer * 2) % petalMaterials.length]
				);
				const angle = ((i + 0.5) / petalCount) * Math.PI * 2; // Offset for layering

				petal.position.set(
					Math.cos(angle) * (1.2 - layerOffset),
					Math.sin(angle) * (0.2 - layerOffset * 0.1),
					Math.sin(angle) * (1.2 - layerOffset)
				);

				petal.rotation.z = angle + Math.PI / 8; // Slight rotation offset
				petal.rotation.x = Math.PI / 6;
				petal.scale.setScalar(layerScale);

				flower.add(petal);
			}
		}

		// Rotate the flower to face the camera (center facing screen)
		flower.rotation.x = Math.PI / 20;
		flower.rotation.y = Math.PI; // Face the camera
		flower.rotation.z = Math.PI / 20;

		camera.position.set(0, 2, 6);
		camera.lookAt(0, 0.7, 3);

		scene.add(flower);

		// Add floating particles around the flower
		const particleCount = 50;
		const particles = new Group();
		const particleGeometry = new SphereGeometry(0.02, 8, 8);
		const particleMaterial = new MeshBasicMaterial({
			color: 0xff_00_00,
			transparent: true,
			opacity: 0.6,
		});

		for (let i = 0; i < particleCount; i++) {
			const particle = new Mesh(particleGeometry, particleMaterial);
			particle.position.set(
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 10,
				(Math.random() - 0.5) * 10
			);
			particles.add(particle);
		}
		scene.add(particles);

		// Create stem
		const stemGeometry = new CylinderGeometry(0.1, 0.15, 6, 32);
		const stemMaterial = new MeshPhongMaterial({ color: 0x22_8b_22 }); // Forest green
		const stem = new Mesh(stemGeometry, stemMaterial);
		stem.position.set(0, -3, 0);
		scene.add(stem);

		// Create leaves
		const leafGeometry = new SphereGeometry(0.4, 32, 16);
		leafGeometry.scale(2, 0.1, 1);
		const leafMaterial = new MeshPhongMaterial({
			color: 0x32_cd_32,
			transparent: true,
			opacity: 0.8,
		});

		for (let i = 0; i < 4; i++) {
			const leaf = new Mesh(leafGeometry, leafMaterial);
			const leafAngle = (i / 4) * Math.PI * 2;
			leaf.position.set(
				Math.cos(leafAngle) * 0.8,
				-1.5 + i * 0.3,
				Math.sin(leafAngle) * 0.8
			);
			leaf.rotation.z = leafAngle;
			leaf.rotation.x = Math.PI / 3;
			scene.add(leaf);
		}

		// Lighting
		const ambientLight = new AmbientLight(0xff_ff_ff, 1);
		scene.add(ambientLight);

		const directionalLight = new DirectionalLight(0xff_ff_ff, 1);
		directionalLight.position.set(1, 1, 1);
		scene.add(directionalLight);

		const pointLight = new PointLight(0xff_ff_ff, 0.5, 100);
		pointLight.position.set(-1, -1, 2);
		scene.add(pointLight);

		// Position camera
		camera.position.setZ(5);

		// Animation variables
		let time = 0;

		// Animation loop
		const animate = () => {
			requestAnimationFrame(animate);

			time += 0.01;

			// Gentle rocking motion
			flower.rotation.z = Math.sin(time * 0.5) * 0.1; // Slow rock back and forth
			flower.rotation.x = Math.cos(time * 0.3) * 0.05; // Slight forward/back tilt
			flower.position.y = Math.sin(time * 0.7) * 0.1; // Gentle up/down float

			// Individual petal movement for organic feel
			flower.children.forEach(
				(child: { rotation: { x: number } }, index: number) => {
					if (index > 0) {
						// Skip the center
						child.rotation.x = Math.PI / 6 + Math.sin(time + index) * 0.02;
					}
				}
			);

			// Animate particles
			particles.children.forEach(
				(
					particle: {
						position: { y: number; x: number };
						rotation: { z: number };
					},
					index: number
				) => {
					particle.position.y += Math.sin(time * 2 + index) * 0.002;
					particle.position.x += Math.cos(time * 1.5 + index) * 0.001;
					particle.rotation.z += 0.01;

					// Reset particle position if it goes too far
					if (particle.position.y > 5) {
						particle.position.y = -5;
					}
				}
			);

			renderer.render(scene, camera);
		};

		animate();

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener("resize", handleResize);

		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
			mountRef.current?.removeChild(renderer.domElement);
			renderer.dispose();
		};
	}, []);

	return (
		<div
			className="fixed inset-0 z-0"
			ref={mountRef}
			style={{ pointerEvents: "none" }}
		/>
	);
}
