"use client";

import React from "react";
import "@google/model-viewer";

interface GoogleModelViewerProps {
  url: string;
  poster?: string;
  width?: string;
  height?: string;
}

export default function GoogleModelViewer({ url, poster, width = "100%", height = "100%" }: GoogleModelViewerProps) {
  // Casting to any avoids global JSX namespace augmentation issues in Next.js
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ModelViewerElement = "model-viewer" as any;

  return (
    <div style={{ width, height, position: "relative" }}>
      <ModelViewerElement
        src={url}
        poster={poster}
        auto-rotate="true"
        camera-controls="true"
        shadow-intensity="1.5"
        exposure="1"
        camera-orbit="45deg 75deg 105%"
        min-camera-orbit="auto auto auto"
        max-camera-orbit="auto auto 150%"
        style={{ width: "100%", height: "100%", outline: "none", backgroundColor: "transparent" }}
        environment-image="neutral"
      ></ModelViewerElement>
    </div>
  );
}
