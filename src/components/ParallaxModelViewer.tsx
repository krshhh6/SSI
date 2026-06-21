"use client";

import { useEffect, useRef, useState } from "react";

// Register the custom element
if (typeof window !== "undefined") {
  import("@google/model-viewer").catch(console.error);
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          poster?: string;
          alt?: string;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
          "camera-orbit"?: string;
          "camera-target"?: string;
          "environment-image"?: string;
          exposure?: string;
          "shadow-intensity"?: string;
          "shadow-softness"?: string;
          "interaction-prompt"?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "min-field-of-view"?: string;
          "max-field-of-view"?: string;
          "field-of-view"?: string;
          "disable-zoom"?: boolean;
          style?: React.CSSProperties;
          ref?: React.RefObject<any>;
        },
        HTMLElement
      >;
    }
  }
}

interface ParallaxModelViewerProps {
  url: string;
  width?: string;
  height?: string;
  poster?: string;
  autoRotate?: boolean;
  cameraOrbit?: string;
  enableParallax?: boolean;
}

export default function ParallaxModelViewer({
  url,
  width = "100%",
  height = "100%",
  poster,
  autoRotate = true,
  cameraOrbit = "0deg 75deg 105%",
  enableParallax = true,
}: ParallaxModelViewerProps) {
  const modelRef = useRef<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!enableParallax || !modelRef.current) return;

    // Parse initial orbit values
    // Example: "0deg 75deg 105%"
    const parts = cameraOrbit.split(" ");
    let baseTheta = 0; // horizontal (deg)
    let basePhi = 75; // vertical (deg)
    let radius = "auto";

    if (parts.length === 3) {
      baseTheta = parseFloat(parts[0]) || 0;
      basePhi = parseFloat(parts[1]) || 75;
      radius = parts[2] === "105%" ? "auto" : parts[2]; // Fallback to auto if it's the old default
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!modelRef.current) return;
      
      // Calculate normalized mouse coordinates (-1 to +1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;

      // Calculate parallax offset (adjust multiplier for intensity)
      const thetaOffset = x * 15; // Max 15 degrees horizontal tilt
      const phiOffset = y * 10;   // Max 10 degrees vertical tilt

      const newTheta = baseTheta + thetaOffset;
      const newPhi = basePhi + phiOffset;

      // Update camera-orbit attribute
      modelRef.current.cameraOrbit = `${newTheta}deg ${newPhi}deg ${radius}`;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [enableParallax, cameraOrbit]);

  if (!mounted) return null;

  return (
    <div style={{ width, height, position: "relative" }}>
      <model-viewer
        ref={modelRef}
        src={url}
        poster={poster}
        alt="A 3D model of a car"
        auto-rotate={autoRotate ? true : undefined}
        camera-controls={false} // Disable manual touch/drag to keep the premium feel
        camera-orbit={cameraOrbit}
        environment-image="neutral"
        exposure="1"
        shadow-intensity="1"
        shadow-softness="0.5"
        interaction-prompt="none"
        disable-zoom
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
