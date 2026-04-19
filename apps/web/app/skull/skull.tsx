"use client";

import { OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState } from "react";
import type { Group, Mesh, MeshStandardMaterial } from "three";

const marbleMaterial = {
	color: "#f0ece4" as const,
	roughness: 0.4,
	metalness: 0.1,
};

function ProceduralSkull() {
	const groupRef = useRef<Group>(null);

	useFrame((_, delta) => {
		if (groupRef.current) {
			groupRef.current.rotation.y += delta * 0.4;
		}
	});

	return (
		<group ref={groupRef}>
			{/* Cranium */}
			<mesh position={[0, 0.1, 0]}>
				<sphereGeometry args={[1, 64, 64]} />
				<meshStandardMaterial {...marbleMaterial} />
			</mesh>

			{/* Forehead flattening - squash cranium front */}
			<mesh position={[0, 0.3, 0.7]} scale={[0.85, 0.6, 0.3]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial {...marbleMaterial} />
			</mesh>

			{/* Cheekbones */}
			<mesh position={[0.75, -0.3, 0.55]} scale={[0.4, 0.25, 0.35]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial {...marbleMaterial} />
			</mesh>
			<mesh position={[-0.75, -0.3, 0.55]} scale={[0.4, 0.25, 0.35]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial {...marbleMaterial} />
			</mesh>

			{/* Nose bridge */}
			<mesh position={[0, -0.15, 0.95]} scale={[0.2, 0.35, 0.15]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial {...marbleMaterial} />
			</mesh>

			{/* Upper jaw / maxilla */}
			<mesh position={[0, -0.65, 0.5]} scale={[0.7, 0.3, 0.55]}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial {...marbleMaterial} />
			</mesh>

			{/* Lower jaw */}
			<mesh position={[0, -1.0, 0.3]} scale={[0.65, 0.25, 0.5]}>
				<boxGeometry args={[1, 1, 1]} />
				<meshStandardMaterial {...marbleMaterial} />
			</mesh>

			{/* Teeth row (upper) */}
			{[-0.25, -0.1, 0.05, 0.2].map((x) => (
				<mesh key={x} position={[x, -0.72, 0.85]} scale={[0.08, 0.1, 0.08]}>
					<boxGeometry args={[1, 1, 1]} />
					<meshStandardMaterial
						color="#f8f5ee"
						metalness={0.05}
						roughness={0.3}
					/>
				</mesh>
			))}

			{/* Eye sockets (dark recesses) */}
			<mesh position={[0.38, 0.05, 0.88]} scale={[0.28, 0.22, 0.1]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial color="#1a1a1a" metalness={0} roughness={1} />
			</mesh>
			<mesh position={[-0.38, 0.05, 0.88]} scale={[0.28, 0.22, 0.1]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial color="#1a1a1a" metalness={0} roughness={1} />
			</mesh>

			{/* Nasal cavity */}
			<mesh position={[0, -0.22, 0.97]} scale={[0.15, 0.18, 0.08]}>
				<sphereGeometry args={[1, 32, 32]} />
				<meshStandardMaterial color="#1a1a1a" metalness={0} roughness={1} />
			</mesh>
		</group>
	);
}

function GLBSkull() {
	const groupRef = useRef<Group>(null);
	const { scene } = useGLTF("/models/skull.glb");

	useFrame((_, delta) => {
		if (groupRef.current) {
			groupRef.current.rotation.y += delta * 0.4;
		}
	});

	scene.traverse((child) => {
		if ((child as Mesh).isMesh) {
			const mat = (child as Mesh).material as MeshStandardMaterial;
			mat.color?.setStyle(marbleMaterial.color);
			mat.roughness = marbleMaterial.roughness;
			mat.metalness = marbleMaterial.metalness;
		}
	});

	return (
		<group ref={groupRef}>
			<primitive object={scene} />
		</group>
	);
}

function MuseumLighting() {
	return (
		<>
			<ambientLight color="#fff8f0" intensity={0.15} />
			<directionalLight color="#fff8ee" intensity={4} position={[3, 6, 2]} />
			<directionalLight
				color="#c8d8ff"
				intensity={0.5}
				position={[-4, 2, -3]}
			/>
		</>
	);
}

type Mode = "procedural" | "glb";

export function Skull() {
	const [mode, setMode] = useState<Mode>("procedural");

	return (
		<div className="relative h-screen w-full bg-neutral-950">
			<div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 gap-2">
				<button
					className={`rounded-full px-4 py-1.5 font-medium text-sm transition-colors ${
						mode === "procedural"
							? "bg-white text-black"
							: "bg-white/10 text-white hover:bg-white/20"
					}`}
					onClick={() => setMode("procedural")}
					type="button"
				>
					Procedural
				</button>
				<button
					className={`rounded-full px-4 py-1.5 font-medium text-sm transition-colors ${
						mode === "glb"
							? "bg-white text-black"
							: "bg-white/10 text-white hover:bg-white/20"
					}`}
					onClick={() => setMode("glb")}
					type="button"
				>
					GLB Model
				</button>
			</div>

			<Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
				<MuseumLighting />
				<OrbitControls enablePan={false} maxDistance={8} minDistance={2} />
				<Suspense fallback={null}>
					{mode === "procedural" ? <ProceduralSkull /> : <GLBSkull />}
				</Suspense>
			</Canvas>
		</div>
	);
}
