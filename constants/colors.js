/**
 * Single source of truth for all theme colors.
 * Used by tailwind.config.js (via require) and by components for inline styles.
 *
 * Usage in components:
 *   import Colors from '../constants/colors';
 *   style={{ color: Colors.muted.DEFAULT }}
 *
 * Usage in tailwind.config.js:
 *   const Colors = require('./constants/colors');
 *   theme: { extend: { colors: Colors } }
 */
const Colors = {
  primary: {
    DEFAULT: "#050D1A",
    100: "#0C1929", // main screen background
    200: "#132040", // card / skeleton background
    300: "#1A3060", // borders, dividers, accent areas
  },

  secondary: {
    DEFAULT: "#4DA6FF", // brand blue – icons, highlights, links
    50:  "rgba(77, 166, 255, 0.06)", // very subtle tint (tech cards, icon badges)
    100: "rgba(77, 166, 255, 0.1)",  // subtle tint (avatar rings, badge bg)
    200: "rgba(77, 166, 255, 0.12)", // medium tint (hero circle, version badge)
    300: "rgba(77, 166, 255, 0.3)",  // border / ring (version badge border)
    400: "rgba(77, 166, 255, 0.35)", // stronger ring (hero circle border)
    700: "rgba(77, 166, 255, 0.7)",  // heavy tint
  },

  highlight: "#1A6EEB", // CTA buttons, owner message bubbles

  // Elevated surfaces: sheets, modals, toasts, menus
  surface: {
    DEFAULT: "#1E2D3D",              // sheet / modal / toast / menu background
    100: "#152030",                  // subtle toast background (comment-added)
    200: "#263545",                  // input field background
    300: "#2a3a4a",                  // avatar placeholder, dividers, menu borders
    400: "#3a4f63",                  // input field border
    card: "rgba(26, 48, 96, 0.18)", // translucent section card overlay
  },

  // Muted / secondary text and icons (blue-gray palette)
  muted: {
    DEFAULT: "#4A6080", // primary muted text, placeholders, subtle icons
    100: "#2A4060",     // very subtle footer / copyright text
    200: "#3A5070",     // faint footer text (about screen)
    300: "#8899AA",     // lighter muted – action icons, secondary labels
  },

  success: "#22C55E",          // success states
  error: "#EF4444",            // error states
  danger: "#FF4D6D",           // destructive actions (delete, unlike)
  skeleton: "#1F3870",         // skeleton pulse block color
  overlay: "rgba(255, 255, 255, 0.85)", // semi-transparent white (video icons, overlays)
  dim: "rgba(0, 0, 0, 0.5)",           // modal / bottom-sheet backdrop

  // Logout / destructive row styling
  "danger-surface": "#1A0A0A", // bg-danger-surface
  "danger-border": "#4A1010",  // border-danger-border
};

module.exports = Colors;
