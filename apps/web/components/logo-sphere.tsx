"use client";

import { shaderMaterial } from "@react-three/drei";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3 } from "three";

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uClickTime;
  uniform vec3  uClickOrigin;
  varying float vDisplace;

  void main() {
    vec3 norm = normalize(position);

    // Three wandering origin points
    vec3 o1 = normalize(vec3(sin(uTime * 0.31), cos(uTime * 0.19), sin(uTime * 0.23)));
    vec3 o2 = normalize(vec3(cos(uTime * 0.17), sin(uTime * 0.37), cos(uTime * 0.29)));
    vec3 o3 = normalize(vec3(sin(uTime * 0.41), cos(uTime * 0.13), cos(uTime * 0.22)));

    float d1 = acos(clamp(dot(norm, o1), -1.0, 1.0));
    float d2 = acos(clamp(dot(norm, o2), -1.0, 1.0));
    float d3 = acos(clamp(dot(norm, o3), -1.0, 1.0));

    float w1 = sin(d1 * 5.0 - uTime * 1.1) * 0.04;
    float w2 = sin(d2 * 4.0 - uTime * 0.9) * 0.035;
    float w3 = sin(d3 * 5.5 - uTime * 1.2) * 0.03;

    // Click ripple: expanding ring that fades over 2 seconds
    float clickRipple = 0.0;
    float age = uTime - uClickTime;
    if (age >= 0.0 && age < 2.0) {
      float dc = acos(clamp(dot(norm, uClickOrigin), -1.0, 1.0));
      float front = age * 2.2;
      float envelope = exp(-age * 1.8) * exp(-pow(dc - front, 2.0) * 18.0);
      clickRipple = sin(dc * 12.0 - age * 10.0) * 0.32 * envelope;
    }

    float displacement = w1 + w2 + w3 + clickRipple;
    vDisplace = displacement;

    vec3 displaced = position + norm * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  varying float vDisplace;

  void main() {
    float t = clamp(vDisplace / 0.105 * 0.5 + 0.5, 0.0, 1.0);

    vec3 dark   = vec3(0.02, 0.18, 0.01);
    vec3 mid    = vec3(0.18, 0.75, 0.08);
    vec3 bright = vec3(0.55, 1.00, 0.35);

    vec3 color = t < 0.5
      ? mix(dark, mid, t * 2.0)
      : mix(mid, bright, (t - 0.5) * 2.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

type MatUniforms = { uTime: number; uClickTime: number; uClickOrigin: Vector3 };

const RippleMaterial = shaderMaterial(
	{ uTime: 0, uClickTime: -1000, uClickOrigin: new Vector3(0, 1, 0) },
	vertexShader,
	fragmentShader
);
extend({ RippleMaterial });

function RippleSphere() {
	const mat = useMemo(
		() =>
			new RippleMaterial() as InstanceType<typeof RippleMaterial> & MatUniforms,
		[]
	);
	const timeRef = useRef(0);

	useFrame((_, delta) => {
		timeRef.current += delta;
		mat.uTime = timeRef.current;
	});

	return (
		// biome-ignore lint/a11y/noStaticElementInteractions: Three.js mesh, not a DOM element
		<mesh
			material={mat}
			onClick={(e) => {
				e.stopPropagation();
				mat.uClickOrigin = e.point.clone().normalize();
				mat.uClickTime = timeRef.current;
			}}
		>
			<sphereGeometry args={[1, 64, 64]} />
		</mesh>
	);
}

export function LogoSphere() {
	return (
		<div className="size-14">
			<Canvas camera={{ position: [0, 0, 3.2] }} gl={{ alpha: true }}>
				<RippleSphere />
			</Canvas>
		</div>
	);
}
