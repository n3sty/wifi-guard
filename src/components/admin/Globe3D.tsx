"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sphere, Line, Text } from "@react-three/drei";
import { Vector3 } from "three";
import * as THREE from "three";

interface GeographicDataPoint {
  lat: number;
  lng: number;
  city: string;
  country: string;
  count: number;
  events: Array<{
    timestamp: string;
    event: string;
    userId: string;
  }>;
}

interface Globe3DProps {
  data: GeographicDataPoint[];
  className?: string;
}

// Convert lat/lng to 3D coordinates on sphere
function latLngToVector3(lat: number, lng: number, radius = 5): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new Vector3(x, y, z);
}

function DataPoint({
  position,
  count,
  city,
  isAnimating,
}: {
  position: Vector3;
  count: number;
  city: string;
  isAnimating: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y =
        position.y + Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }

    if (pulseRef.current && isAnimating) {
      // Pulse animation for active points
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.3;
      pulseRef.current.scale.setScalar(scale);
      pulseRef.current.material = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: Math.max(0.1, 0.8 - (scale - 1) * 2),
      });
    }
  });

  const pointSize = Math.min(0.3, Math.max(0.1, count * 0.05));
  const color = count > 10 ? "#ff4444" : count > 5 ? "#ffaa00" : "#44ff44";

  return (
    <group position={position}>
      {/* Main data point */}
      <Sphere ref={meshRef} args={[pointSize, 8, 8]}>
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.9}
        />
      </Sphere>

      {/* Pulse effect for active points */}
      {isAnimating && (
        <Sphere ref={pulseRef} args={[pointSize * 2, 8, 8]}>
          <meshBasicMaterial color={color} transparent opacity={0.3} />
        </Sphere>
      )}

      {/* City label */}
      <Text
        position={[0, pointSize + 0.3, 0]}
        fontSize={0.2}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {city}
      </Text>
    </group>
  );
}

function ConnectionLine({
  start,
  end,
  progress,
}: {
  start: Vector3;
  end: Vector3;
  progress: number;
}) {
  const points = useMemo(() => {
    // Create a curved path between two points
    const distance = start.distanceTo(end);
    const midPoint = new Vector3().addVectors(start, end).multiplyScalar(0.5);
    midPoint.normalize().multiplyScalar(5.5 + distance * 0.3); // Arc outward

    const curve = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    return curve.getPoints(50);
  }, [start, end]);

  const visiblePoints = useMemo(() => {
    const numVisible = Math.floor(points.length * progress);
    return points.slice(0, numVisible);
  }, [points, progress]);

  if (visiblePoints.length < 2) return null;

  return (
    <Line
      points={visiblePoints}
      color="#00aaff"
      lineWidth={2}
      transparent
      opacity={0.6}
    />
  );
}

function Globe({ data }: { data: GeographicDataPoint[] }) {
  const globeRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((state) => {
    if (globeRef.current) {
      // Slow rotation
      globeRef.current.rotation.y += 0.002;
    }

    // Camera orbit
    const time = state.clock.elapsedTime * 0.2;
    camera.position.x = Math.cos(time) * 10;
    camera.position.z = Math.sin(time) * 10;
    camera.lookAt(0, 0, 0);
  });

  const dataPoints = useMemo(() => {
    return data.map((point) => ({
      ...point,
      position: latLngToVector3(point.lat, point.lng),
      isAnimating: point.events.some(
        (event) => Date.now() - new Date(event.timestamp).getTime() < 30000 // Active if within 30 seconds
      ),
    }));
  }, [data]);

  return (
    <>
      {/* Main globe */}
      <Sphere ref={globeRef} args={[5, 64, 64]}>
        <meshPhongMaterial
          color="#001133"
          transparent
          opacity={0.8}
          emissive="#002244"
          emissiveIntensity={0.1}
        />
      </Sphere>

      {/* Wireframe overlay */}
      <Sphere args={[5.01, 32, 32]}>
        <meshBasicMaterial
          color="#004488"
          wireframe
          transparent
          opacity={0.3}
        />
      </Sphere>

      {/* Data points */}
      {dataPoints.map((point) => (
        <DataPoint
          key={`${point.city}-${point.country}`}
          position={point.position}
          count={point.count}
          city={point.city}
          isAnimating={point.isAnimating}
        />
      ))}

      {/* Connection lines between major points */}
      {dataPoints.length > 1 &&
        dataPoints.slice(0, 5).map((point, index) => {
          const nextPoint =
            dataPoints[(index + 1) % Math.min(5, dataPoints.length)];
          return (
            <ConnectionLine
              key={`connection-${index}`}
              start={point.position}
              end={nextPoint.position}
              progress={0.8}
            />
          );
        })}

      {/* Ambient and directional lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#0088ff" />
    </>
  );
}

export default function Globe3D({ data, className = "" }: Globe3DProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div
        className={`bg-slate-900 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-slate-400 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-2"></div>
          <div>Loading 3D globe...</div>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div
        className={`bg-slate-900 rounded-lg flex items-center justify-center ${className}`}
      >
        <div className="text-slate-400 text-center">
          <div className="text-2xl mb-2">🌍</div>
          <div>No geographic data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-slate-900 rounded-lg overflow-hidden ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        style={{
          background: "linear-gradient(135deg, #001122 0%, #002244 100%)",
        }}
      >
        <Globe data={data} />
      </Canvas>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur rounded-lg p-3 text-white text-sm">
        <div className="font-semibold mb-2">Global Activity</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span>1-5 scans</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <span>6-10 scans</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span>10+ scans</span>
          </div>
        </div>
      </div>
    </div>
  );
}
