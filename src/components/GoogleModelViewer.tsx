"use client";

import React from "react";
import "@google/model-viewer";

// eslint-disable-next-line @typescript-eslint/no-namespace
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          poster?: string;
          "auto-rotate"?: boolean;
          "camera-controls"?: boolean;
          "shadow-intensity"?: string;
          "environment-image"?: string;
          exposure?: string;
          "camera-orbit"?: string;
          "min-camera-orbit"?: string;
          "max-camera-orbit"?: string;
          "disable-zoom"?: boolean;
        },
        HTMLElement
      >;
    }
  }
}

interface GoogleModelViewerProps {
  url: string;
  poster?: string;
  width?: string;
  height?: string;
}

export default function GoogleModelViewer({ url, poster, width = "100%", height = "100%" }: GoogleModelViewerProps) {
  return (
    <div style={{ width, height, position: "relative" }}>
      <model-viewer
        src={url}
        poster={poster}
        auto-rotate
        camera-controls
        shadow-intensity="1.5"
        exposure="1"
        camera-orbit="45deg 75deg 105%"
        min-camera-orbit="auto auto auto"
        max-camera-orbit="auto auto 150%"
        style={{ width: "100%", height: "100%", outline: "none", backgroundColor: "transparent" }}
        // Neutral environment for shiny car reflections without external downloads
        environment-image="neutral"
      ></model-viewer>
    </div>
  );
}
