"use client";
import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  sidePanel?: ReactNode;
  hasCategoryNav?: boolean;
  className?: string;
}

/**
 * PageLayout - Proper two-column layout that prevents overlap
 * 
 * FEATURES:
 * - Adds correct padding-top to account for sticky navbars
 * - Side panel sits BESIDE content, never overlaps
 * - Responsive: side panel collapses on mobile
 * - Side panel has independent scroll with proper max-height
 */
export default function PageLayout({ 
  children, 
  sidePanel, 
  hasCategoryNav = false,
  className = "" 
}: PageLayoutProps) {
  // Calculate top padding based on which navbars are present
  const paddingTop = hasCategoryNav 
    ? "var(--total-navbar-height)" 
    : "var(--topbar-height)";

  return (
    <div
      style={{
        paddingTop,
        minHeight: "100vh",
        background: "var(--bg)",
      }}
      className={className}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "24px",
        }}
      >
        {sidePanel ? (
          // Two-column layout with side panel
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 280px",
              gap: 24,
            }}
            className="page-layout-grid"
          >
            {/* Main Content Column */}
            <div
              style={{
                minWidth: 0, // Prevents flex/grid overflow
              }}
            >
              {children}
            </div>

            {/* Side Panel Column */}
            <aside
              style={{
                position: "sticky",
                top: hasCategoryNav 
                  ? "calc(var(--total-navbar-height) + 24px)" 
                  : "calc(var(--topbar-height) + 24px)",
                alignSelf: "start",
                maxHeight: hasCategoryNav
                  ? "calc(100vh - var(--total-navbar-height) - 48px)"
                  : "calc(100vh - var(--topbar-height) - 48px)",
                overflowY: "auto",
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                padding: 20,
                boxShadow: "var(--shadow-card)",
              }}
              className="page-side-panel"
            >
              {sidePanel}
            </aside>
          </div>
        ) : (
          // Single column layout (no side panel)
          <div>{children}</div>
        )}
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          .page-layout-grid {
            grid-template-columns: 1fr !important;
          }
          
          .page-side-panel {
            position: relative !important;
            top: 0 !important;
            max-height: none !important;
            margin-top: 24px;
          }
        }
      `}</style>
    </div>
  );
}
