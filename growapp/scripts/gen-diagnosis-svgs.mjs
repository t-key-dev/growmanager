#!/usr/bin/env node
// Generates SVG icon images for new diagnosis entries
// Each SVG is 320x240, dark theme, with a stylized illustration + label
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "diagnosis");

// Helper: build a leaf shape (cannabis-style 7-blade)
const leaf = (cx, cy, scale = 1, fill = "#3a7a4a", stroke = "#1f3d27") => `
  <g transform="translate(${cx} ${cy}) scale(${scale})">
    <path d="M 0 -40 Q -25 -35 -35 -10 Q -28 -25 -10 -28 Q -20 -15 -22 0 Q -30 -10 -38 5 Q -28 -5 -16 -2 Q -28 8 -28 22 Q -16 12 -8 8 Q -10 22 -2 30 Q 0 18 0 5 Q 0 18 2 30 Q 10 22 8 8 Q 16 12 28 22 Q 28 8 16 -2 Q 28 -5 38 5 Q 30 -10 22 0 Q 20 -15 10 -28 Q 28 -25 35 -10 Q 25 -35 0 -40 Z"
      fill="${fill}" stroke="${stroke}" stroke-width="1.5" stroke-linejoin="round"/>
    <line x1="0" y1="30" x2="0" y2="42" stroke="${stroke}" stroke-width="2"/>
  </g>
`;

const darkBg = "#1c2023";
const panelBg = "#262b2e";
const border = "#3a4a3d";

const entries = [
  // ID, title, fg-color, icon-drawer
  { id: "ca-deficiency", title: "Ca-Mangel", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <g transform="translate(${s.cx-60} ${s.cy})">
        <path d="M 0 0 Q -50 -5 -65 -25 Q -45 -20 -25 -25 Q -45 -35 -50 -55 Q -25 -40 -10 -45 Q -20 -55 -10 -65 Q 0 -50 0 -30 Q 0 -50 10 -65 Q 20 -55 10 -45 Q 25 -40 50 -55 Q 45 -35 25 -25 Q 45 -20 65 -25 Q 50 -5 0 0 Z"
          fill="#5a8a64" stroke="#1f3d27" stroke-width="1.2"/>
      </g>
      <circle cx="${s.cx+30}" cy="${s.cy-20}" r="4" fill="#5a3a2a"/>
      <circle cx="${s.cx+45}" cy="${s.cy-5}" r="5" fill="#5a3a2a"/>
      <circle cx="${s.cx+35}" cy="${s.cy+10}" r="3" fill="#5a3a2a"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">braune Flecken, neue Blätter</text>
    ` },
  { id: "s-deficiency", title: "S-Mangel", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <g transform="translate(${s.cx} ${s.cy})">
        <path d="M 0 0 Q -50 -5 -65 -25 Q -45 -20 -25 -25 Q -45 -35 -50 -55 Q -25 -40 -10 -45 Q -20 -55 -10 -65 Q 0 -50 0 -30 Q 0 -50 10 -65 Q 20 -55 10 -45 Q 25 -40 50 -55 Q 45 -35 25 -25 Q 45 -20 65 -25 Q 50 -5 0 0 Z"
          fill="#a8b870" stroke="#1f3d27" stroke-width="1.2"/>
        <line x1="0" y1="0" x2="-30" y2="-15" stroke="#1f3d27" stroke-width="1" opacity="0.5"/>
        <line x1="0" y1="0" x2="30" y2="-15" stroke="#1f3d27" stroke-width="1" opacity="0.5"/>
        <line x1="0" y1="0" x2="-25" y2="10" stroke="#1f3d27" stroke-width="1" opacity="0.5"/>
        <line x1="0" y1="0" x2="25" y2="10" stroke="#1f3d27" stroke-width="1" opacity="0.5"/>
      </g>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">hellgrün bis gelb</text>
    ` },
  { id: "zn-deficiency", title: "Zn-Mangel", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <g transform="translate(${s.cx} ${s.cy})">
        <path d="M 0 -45 L 0 0" stroke="#1f3d27" stroke-width="3"/>
        <ellipse cx="-12" cy="-20" rx="6" ry="14" fill="#4a7a52" stroke="#1f3d27" stroke-width="1"/>
        <ellipse cx="12" cy="-20" rx="6" ry="14" fill="#4a7a52" stroke="#1f3d27" stroke-width="1"/>
        <ellipse cx="-9" cy="-5" rx="5" ry="10" fill="#4a7a52" stroke="#1f3d27" stroke-width="1"/>
        <ellipse cx="9" cy="-5" rx="5" ry="10" fill="#4a7a52" stroke="#1f3d27" stroke-width="1"/>
        <ellipse cx="0" cy="10" rx="4" ry="8" fill="#4a7a52" stroke="#1f3d27" stroke-width="1"/>
        <ellipse cx="-6" cy="-35" rx="3" ry="7" fill="#4a7a52" stroke="#1f3d27" stroke-width="1"/>
        <ellipse cx="6" cy="-35" rx="3" ry="7" fill="#4a7a52" stroke="#1f3d27" stroke-width="1"/>
      </g>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">kleine schmale Blätter</text>
    ` },
  { id: "mn-deficiency", title: "Mn-Mangel", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx-30, s.cy, 0.6, "#b8c060", "#1f3d27")}
      ${leaf(s.cx+30, s.cy, 0.5, "#c0a040", "#1f3d27")}
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">gelb mit grünen Adern</text>
    ` },
  { id: "b-deficiency", title: "B-Mangel", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy-30}" stroke="#5a8a64" stroke-width="6" stroke-linecap="round"/>
      <circle cx="${s.cx}" cy="${s.cy-35}" r="6" fill="#7a3a3a"/>
      <circle cx="${s.cx-8}" cy="${s.cy-20}" r="3" fill="#7a3a3a"/>
      <circle cx="${s.cx+8}" cy="${s.cy-15}" r="3" fill="#7a3a3a"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">brüchige, hohle Triebe</text>
    ` },
  { id: "cu-deficiency", title: "Cu-Mangel", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy-30}" stroke="#3a5a8a" stroke-width="4" stroke-linecap="round"/>
      <path d="M ${s.cx-20} ${s.cy-30} L ${s.cx-30} ${s.cy-20} L ${s.cx-15} ${s.cy-15} L ${s.cx-22} ${s.cy-5}" stroke="#3a5a8a" stroke-width="2" fill="none"/>
      <path d="M ${s.cx+20} ${s.cy-30} L ${s.cx+30} ${s.cy-20} L ${s.cx+15} ${s.cy-15} L ${s.cx+22} ${s.cy-5}" stroke="#3a5a8a" stroke-width="2" fill="none"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">welkende Triebe, blau-grün</text>
    ` },
  { id: "light-burn", title: "Lichtbrand", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx-60}" y1="${s.cy-40}" x2="${s.cx-40}" y2="${s.cy-30}" stroke="#f0c850" stroke-width="3"/>
      <line x1="${s.cx-30}" y1="${s.cy-40}" x2="${s.cx-10}" y2="${s.cy-30}" stroke="#f0c850" stroke-width="3"/>
      <line x1="${s.cx+0}" y1="${s.cy-40}" x2="${s.cx+20}" y2="${s.cy-30}" stroke="#f0c850" stroke-width="3"/>
      <line x1="${s.cx+30}" y1="${s.cy-40}" x2="${s.cx+50}" y2="${s.cy-30}" stroke="#f0c850" stroke-width="3"/>
      <line x1="${s.cx-50}" y1="${s.cy-25}" x2="${s.cx-30}" y2="${s.cy-15}" stroke="#f0c850" stroke-width="3"/>
      <line x1="${s.cx-20}" y1="${s.cy-25}" x2="${s.cx+0}" y2="${s.cy-15}" stroke="#f0c850" stroke-width="3"/>
      <line x1="${s.cx+10}" y1="${s.cy-25}" x2="${s.cx+30}" y2="${s.cy-15}" stroke="#f0c850" stroke-width="3"/>
      <line x1="${s.cx+40}" y1="${s.cy-25}" x2="${s.cx+60}" y2="${s.cy-15}" stroke="#f0c850" stroke-width="3"/>
      ${leaf(s.cx, s.cy+5, 0.7, "#c8a040", "#1f3d27")}
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">obere Blätter ausgebleicht</text>
    ` },
  { id: "overwatering", title: "Überwässerung", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <ellipse cx="${s.cx}" cy="${s.cy+30}" rx="80" ry="10" fill="#3a4a3d"/>
      ${leaf(s.cx, s.cy-10, 0.7, "#3a7a4a", "#1f3d27")}
      <g transform="rotate(20 ${s.cx-30} ${s.cy+5})">
        <path d="M ${s.cx-30} ${s.cy+5} Q ${s.cx-50} ${s.cy+20} ${s.cx-30} ${s.cy+30}" stroke="#4a8a9a" stroke-width="2" fill="none"/>
        <ellipse cx="${s.cx-30}" cy="${s.cy+10}" rx="8" ry="14" fill="#5a9a4a" stroke="#1f3d27" stroke-width="1"/>
      </g>
      <g transform="rotate(-20 ${s.cx+30} ${s.cy+5})">
        <path d="M ${s.cx+30} ${s.cy+5} Q ${s.cx+50} ${s.cy+20} ${s.cx+30} ${s.cy+30}" stroke="#4a8a9a" stroke-width="2" fill="none"/>
        <ellipse cx="${s.cx+30}" cy="${s.cy+10}" rx="8" ry="14" fill="#5a9a4a" stroke="#1f3d27" stroke-width="1"/>
      </g>
      <path d="M ${s.cx+50} ${s.cy+15} Q ${s.cx+55} ${s.cy+20} ${s.cx+50} ${s.cy+25}" stroke="#5a8aaa" stroke-width="2" fill="none"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">schlaffe Blätter, nasse Erde</text>
    ` },
  { id: "underwatering", title: "Unterwässerung", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <ellipse cx="${s.cx}" cy="${s.cy+30}" rx="80" ry="6" fill="#3a3a3a"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy-10}" stroke="#1f3d27" stroke-width="3"/>
      <path d="M ${s.cx} ${s.cy-10} L ${s.cx-30} ${s.cy-25}" stroke="#1f3d27" stroke-width="2" stroke-linecap="round"/>
      <path d="M ${s.cx} ${s.cy-10} L ${s.cx+30} ${s.cy-25}" stroke="#1f3d27" stroke-width="2" stroke-linecap="round"/>
      <path d="M ${s.cx} ${s.cy-10} L ${s.cx-20} ${s.cy-40}" stroke="#1f3d27" stroke-width="2" stroke-linecap="round"/>
      <path d="M ${s.cx} ${s.cy-10} L ${s.cx+20} ${s.cy-40}" stroke="#1f3d27" stroke-width="2" stroke-linecap="round"/>
      <text x="${s.cx-30}" y="${s.cy-25}" fill="#7a8a4a" font-size="11" font-family="sans-serif">🥀</text>
      <text x="${s.cx+25}" y="${s.cy-25}" fill="#7a8a4a" font-size="11" font-family="sans-serif">🥀</text>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">schlaff, trockener Topf</text>
    ` },
  { id: "damping-off", title: "Umfallkrankheit", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <ellipse cx="${s.cx}" cy="${s.cy+30}" rx="80" ry="8" fill="#3a3a3a"/>
      <line x1="${s.cx-40}" y1="${s.cy+25}" x2="${s.cx-30}" y2="${s.cy+10}" stroke="#5a3a2a" stroke-width="3"/>
      <ellipse cx="${s.cx-30}" cy="${s.cy+5}" rx="5" ry="8" fill="#7a5a4a" stroke="#1f3d27" stroke-width="1"/>
      <ellipse cx="${s.cx+10}" y1="${s.cy+25}" x2="${s.cx+20}" y2="${s.cy+10}" stroke="#5a3a2a" stroke-width="3" transform="rotate(45)"/>
      <ellipse cx="${s.cx+10}" cy="${s.cy+25}" rx="5" ry="8" fill="#7a5a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(45)"/>
      <line x1="${s.cx+50}" y1="${s.cy+25}" x2="${s.cx+45}" y2="${s.cy+5}" stroke="#5a3a2a" stroke-width="3"/>
      <ellipse cx="${s.cx+45}" cy="${s.cy+0}" rx="5" ry="8" fill="#7a5a4a" stroke="#1f3d27" stroke-width="1"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">Sämlinge kippen um</text>
    ` },
  { id: "fusarium", title: "Fusarium-Welke", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <ellipse cx="${s.cx}" cy="${s.cy+30}" rx="80" ry="8" fill="#3a3a3a"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx-25}" y2="${s.cy-15}" stroke="#5a3a2a" stroke-width="3"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx+25}" y2="${s.cy-15}" stroke="#5a3a2a" stroke-width="3"/>
      <ellipse cx="${s.cx-25}" cy="${s.cy-20}" rx="10" ry="18" fill="#7a3a3a" stroke="#1f3d27" stroke-width="1" transform="rotate(20 ${s.cx-25} ${s.cy-20})"/>
      <ellipse cx="${s.cx+25}" cy="${s.cy-20}" rx="10" ry="18" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(-20 ${s.cx+25} ${s.cy-20})"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy+10}" stroke="#3a1a1a" stroke-width="2"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">einseitig welkend, Stängel braun</text>
    ` },
  { id: "septoria", title: "Septoria", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.9, "#4a7a4a", "#1f3d27")}
      <circle cx="${s.cx-25}" cy="${s.cy-15}" r="3" fill="#3a1a1a"/>
      <circle cx="${s.cx-15}" cy="${s.cy+5}" r="2.5" fill="#3a1a1a"/>
      <circle cx="${s.cx+10}" cy="${s.cy-5}" r="3" fill="#3a1a1a"/>
      <circle cx="${s.cx+20}" cy="${s.cy+15}" r="2" fill="#3a1a1a"/>
      <circle cx="${s.cx+30}" cy="${s.cy-10}" r="2.5" fill="#3a1a1a"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">kleine braune Flecken</text>
    ` },
  { id: "rust", title: "Rostpilz", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.85, "#4a7a4a", "#1f3d27")}
      <circle cx="${s.cx-20}" cy="${s.cy+5}" r="3" fill="#c8621a"/>
      <circle cx="${s.cx-5}" cy="${s.cy-10}" r="3" fill="#c8621a"/>
      <circle cx="${s.cx+15}" cy="${s.cy+10}" r="3" fill="#c8621a"/>
      <circle cx="${s.cx+25}" cy="${s.cy-5}" r="3" fill="#c8621a"/>
      <circle cx="${s.cx-30}" cy="${s.cy-5}" r="3" fill="#c8621a"/>
      <circle cx="${s.cx+5}" cy="${s.cy+20}" r="2" fill="#c8621a"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">orange Pusteln</text>
    ` },
  { id: "bud-rot", title: "Bud Rot", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <ellipse cx="${s.cx-15}" cy="${s.cy-15}" rx="22" ry="20" fill="#4a7a4a" stroke="#1f3d27" stroke-width="1.5"/>
      <ellipse cx="${s.cx+15}" cy="${s.cy-10}" rx="18" ry="16" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1.5"/>
      <ellipse cx="${s.cx}" cy="${s.cy+10}" rx="20" ry="18" fill="#3a2a2a" stroke="#1f3d27" stroke-width="1.5"/>
      <text x="${s.cx+25}" y="${s.cy+5}" fill="#7a5a3a" font-size="14">🦠</text>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">braune Buds von innen</text>
    ` },
  { id: "thrips", title: "Thripse", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.8, "#9aa888", "#1f3d27")}
      <ellipse cx="${s.cx-20}" cy="${s.cy-10}" rx="2" ry="0.7" fill="#1a1a1a"/>
      <ellipse cx="${s.cx+10}" cy="${s.cy+0}" rx="2" ry="0.7" fill="#1a1a1a"/>
      <ellipse cx="${s.cx+25}" cy="${s.cy-5}" rx="2" ry="0.7" fill="#1a1a1a"/>
      <ellipse cx="${s.cx-5}" cy="${s.cy+15}" rx="2" ry="0.7" fill="#1a1a1a"/>
      <ellipse cx="${s.cx-30}" cy="${s.cy+5}" rx="2" ry="0.7" fill="#1a1a1a"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">silbrige Sprenkel + schwarze Punkte</text>
    ` },
  { id: "aphids", title: "Blattläuse", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy-20}" stroke="#5a8a4a" stroke-width="3"/>
      <ellipse cx="${s.cx-15}" cy="${s.cy-25}" rx="12" ry="8" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(-30 ${s.cx-15} ${s.cy-25})"/>
      <ellipse cx="${s.cx+15}" cy="${s.cy-25}" rx="12" ry="8" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(30 ${s.cx+15} ${s.cy-25})"/>
      <circle cx="${s.cx-12}" cy="${s.cy-15}" r="2" fill="#5aa05a"/>
      <circle cx="${s.cx-8}" cy="${s.cy-10}" r="2" fill="#3a1a3a"/>
      <circle cx="${s.cx-18}" cy="${s.cy-8}" r="2" fill="#5aa05a"/>
      <circle cx="${s.cx+5}" cy="${s.cy-15}" r="2" fill="#5aa05a"/>
      <circle cx="${s.cx+10}" cy="${s.cy-10}" r="2" fill="#3a1a3a"/>
      <circle cx="${s.cx+18}" cy="${s.cy-8}" r="2" fill="#5aa05a"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">kleine grüne Insekten</text>
    ` },
  { id: "whiteflies", title: "Weiße Fliege", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.8, "#5a8a4a", "#1f3d27")}
      <g transform="translate(${s.cx-30} ${s.cy+5})">
        <ellipse cx="0" cy="0" rx="4" ry="2" fill="#e0e0e0"/>
        <ellipse cx="-5" cy="-2" rx="4" ry="2" fill="#e0e0e0" transform="rotate(-30)"/>
        <ellipse cx="5" cy="-2" rx="4" ry="2" fill="#e0e0e0" transform="rotate(30)"/>
        <ellipse cx="0" cy="0" rx="1" ry="1.5" fill="#3a3a3a"/>
      </g>
      <g transform="translate(${s.cx+20} ${s.cy+15})">
        <ellipse cx="0" cy="0" rx="4" ry="2" fill="#e0e0e0"/>
        <ellipse cx="-5" cy="-2" rx="4" ry="2" fill="#e0e0e0" transform="rotate(-30)"/>
        <ellipse cx="5" cy="-2" rx="4" ry="2" fill="#e0e0e0" transform="rotate(30)"/>
        <ellipse cx="0" cy="0" rx="1" ry="1.5" fill="#3a3a3a"/>
      </g>
      <g transform="translate(${s.cx+5} ${s.cy-10})">
        <ellipse cx="0" cy="0" rx="3" ry="1.5" fill="#e0e0e0"/>
        <ellipse cx="-4" cy="-1" rx="3" ry="1.5" fill="#e0e0e0" transform="rotate(-30)"/>
        <ellipse cx="4" cy="-1" rx="3" ry="1.5" fill="#e0e0e0" transform="rotate(30)"/>
      </g>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">weiße Fliegen</text>
    ` },
  { id: "mealybugs", title: "Wollläuse", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy-25}" stroke="#5a8a4a" stroke-width="4"/>
      <ellipse cx="${s.cx-15}" cy="${s.cy-15}" rx="10" ry="7" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(-30 ${s.cx-15} ${s.cy-15})"/>
      <ellipse cx="${s.cx+15}" cy="${s.cy-15}" rx="10" ry="7" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(30 ${s.cx+15} ${s.cy-15})"/>
      <g transform="translate(${s.cx} ${s.cy+5})">
        <ellipse cx="0" cy="0" rx="5" ry="3" fill="#f0f0f0" stroke="#aaa"/>
        <circle cx="-3" cy="-2" r="0.8" fill="#fff"/>
        <circle cx="3" cy="-2" r="0.8" fill="#fff"/>
        <circle cx="0" cy="0" r="0.8" fill="#fff"/>
        <circle cx="-2" cy="2" r="0.8" fill="#fff"/>
        <circle cx="2" cy="2" r="0.8" fill="#fff"/>
      </g>
      <g transform="translate(${s.cx-25} ${s.cy-5})">
        <ellipse cx="0" cy="0" rx="4" ry="2.5" fill="#f0f0f0" stroke="#aaa"/>
        <circle cx="-2" cy="-1" r="0.6" fill="#fff"/>
        <circle cx="2" cy="-1" r="0.6" fill="#fff"/>
        <circle cx="0" cy="1" r="0.6" fill="#fff"/>
      </g>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">weiße watteartige Beläge</text>
    ` },
  { id: "scale", title: "Schildläuse", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy-25}" stroke="#5a8a4a" stroke-width="5"/>
      <ellipse cx="${s.cx-8}" cy="${s.cy-5}" rx="6" ry="4" fill="#6a4a2a" stroke="#1f3d27" stroke-width="1"/>
      <ellipse cx="${s.cx+10}" cy="${s.cy+5}" rx="5" ry="3" fill="#6a4a2a" stroke="#1f3d27" stroke-width="1"/>
      <ellipse cx="${s.cx-5}" cy="${s.cy+15}" rx="4" ry="3" fill="#6a4a2a" stroke="#1f3d27" stroke-width="1"/>
      <ellipse cx="${s.cx+15}" cy="${s.cy+15}" rx="5" ry="3" fill="#6a4a2a" stroke="#1f3d27" stroke-width="1"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">bräunliche Höcker</text>
    ` },
  { id: "caterpillars", title: "Raupen", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.85, "#4a7a4a", "#1f3d27")}
      <path d="M ${s.cx-60} ${s.cy-15} Q ${s.cx-40} ${s.cy-25} ${s.cx-20} ${s.cy-20}" stroke="#3a3a1a" stroke-width="6" fill="none" stroke-linecap="round"/>
      <circle cx="${s.cx-15}" cy="${s.cy-18}" r="3" fill="#3a3a1a"/>
      <line x1="${s.cx-12}" y1="${s.cy-19}" x2="${s.cx-8}" y2="${s.cy-25}" stroke="#3a3a1a" stroke-width="1"/>
      <line x1="${s.cx-10}" y1="${s.cy-19}" x2="${s.cx-6}" y2="${s.cy-25}" stroke="#3a3a1a" stroke-width="1"/>
      <circle cx="${s.cx+20}" cy="${s.cy+10}" r="2" fill="#1a1a1a"/>
      <circle cx="${s.cx+30}" cy="${s.cy+15}" r="1.5" fill="#1a1a1a"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">angefressene Blätter</text>
    ` },
  { id: "leaf-miners", title: "Minierfliegen", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.9, "#4a7a4a", "#1f3d27")}
      <path d="M ${s.cx-30} ${s.cy+15} Q ${s.cx-15} ${s.cy-5} ${s.cx+10} ${s.cy+5} Q ${s.cx+25} ${s.cy-15} ${s.cx+15} ${s.cy-20} Q ${s.cx-5} ${s.cy-10} ${s.cx-20} ${s.cy+5} Q ${s.cx-25} ${s.cy+15} ${s.cx-30} ${s.cy+15} Z"
        fill="none" stroke="#e0d8a0" stroke-width="2.5"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">geschlängelte Gänge im Blatt</text>
    ` },
  { id: "springtails", title: "Springschwänze", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <ellipse cx="${s.cx}" cy="${s.cy+30}" rx="80" ry="8" fill="#3a4a3d"/>
      <ellipse cx="${s.cx-30}" cy="${s.cy+25}" rx="3" ry="1.5" fill="#e0e0e0"/>
      <ellipse cx="${s.cx-10}" cy="${s.cy+28}" rx="3" ry="1.5" fill="#e0e0e0"/>
      <ellipse cx="${s.cx+15}" cy="${s.cy+24}" rx="3" ry="1.5" fill="#e0e0e0"/>
      <ellipse cx="${s.cx+35}" cy="${s.cy+27}" rx="3" ry="1.5" fill="#e0e0e0"/>
      <g transform="translate(${s.cx-30} ${s.cy+15})">
        <line x1="0" y1="0" x2="-2" y2="-6" stroke="#e0e0e0" stroke-width="1"/>
        <ellipse cx="-2" cy="-8" rx="2" ry="1" fill="#e0e0e0"/>
      </g>
      <g transform="translate(${s.cx+15} ${s.cy+14})">
        <line x1="0" y1="0" x2="2" y2="-6" stroke="#e0e0e0" stroke-width="1"/>
        <ellipse cx="2" cy="-8" rx="2" ry="1" fill="#e0e0e0"/>
      </g>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">kleine weiße Tierchen</text>
    ` },
  { id: "heat-stress", title: "Hitzestress", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy-25}" stroke="#5a8a4a" stroke-width="3"/>
      <ellipse cx="${s.cx-15}" cy="${s.cy-25}" rx="10" ry="7" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(-30 ${s.cx-15} ${s.cy-25})"/>
      <ellipse cx="${s.cx+15}" cy="${s.cy-25}" rx="10" ry="7" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(30 ${s.cx+15} ${s.cy-25})"/>
      <ellipse cx="${s.cx-15}" cy="${s.cy-25}" rx="10" ry="7" fill="#e08030" opacity="0.5" transform="rotate(-30 ${s.cx-15} ${s.cy-25})"/>
      <ellipse cx="${s.cx+15}" cy="${s.cy-25}" rx="10" ry="7" fill="#e08030" opacity="0.5" transform="rotate(30 ${s.cx+15} ${s.cy-25})"/>
      <text x="${s.cx+30}" y="${s.cy-20}" fill="#e08030" font-size="22">🌡️</text>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">Bonnet, hohe Temp.</text>
    ` },
  { id: "cold-stress", title: "Kältestress", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.85, "#6a4a8a", "#1f3d27")}
      <text x="${s.cx+30}" y="${s.cy-20}" fill="#8aaeea" font-size="22">❄️</text>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">lila Verfärbung, langsames Wachstum</text>
    ` },
  { id: "low-humidity", title: "RH zu niedrig", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.85, "#a88040", "#1f3d27")}
      <text x="${s.cx+30}" y="${s.cy-15}" fill="#e0c060" font-size="22">💧</text>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">braune Ränder, eingerollt</text>
    ` },
  { id: "high-humidity", title: "RH zu hoch", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.85, "#4a7a4a", "#1f3d27")}
      <text x="${s.cx+30}" y="${s.cy-15}" fill="#5aaaca" font-size="22">💦</text>
      <circle cx="${s.cx-30}" cy="${s.cy+5}" r="2" fill="#5aaaca"/>
      <circle cx="${s.cx-15}" cy="${s.cy+15}" r="2" fill="#5aaaca"/>
      <circle cx="${s.cx+20}" cy="${s.cy+0}" r="2" fill="#5aaaca"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">Kondenswasser, Schimmel</text>
    ` },
  { id: "ph-drift", title: "pH-Drift", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      ${leaf(s.cx, s.cy, 0.6, "#5a8a4a", "#1f3d27")}
      <text x="${s.cx-25}" y="${s.cy+0}" fill="#e0e0e0" font-size="28" font-family="serif">⚖️</text>
      <text x="${s.cx+25}" y="${s.cy+0}" fill="#a080e0" font-size="13" font-family="monospace">pH 6.2</text>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">Mini-Mängel überall</text>
    ` },
  { id: "rootbound", title: "Topf zu klein", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <path d="M ${s.cx-30} ${s.cy+30} L ${s.cx-25} ${s.cy-15} L ${s.cx+25} ${s.cy-15} L ${s.cx+30} ${s.cy+30} Z" fill="#5a4a3a" stroke="#1f3d27" stroke-width="1.5"/>
      <ellipse cx="${s.cx}" cy="${s.cy-15}" rx="25" ry="5" fill="#3a2a1a" stroke="#1f3d27" stroke-width="1.5"/>
      <path d="M ${s.cx-25} ${s.cy+25} Q ${s.cx-40} ${s.cy+30} ${s.cx-35} ${s.cy+38}" stroke="#3a2a1a" stroke-width="2" fill="none"/>
      <path d="M ${s.cx+25} ${s.cy+25} Q ${s.cx+40} ${s.cy+30} ${s.cx+35} ${s.cy+38}" stroke="#3a2a1a" stroke-width="2" fill="none"/>
      <path d="M ${s.cx-15} ${s.cy+20} Q ${s.cx-25} ${s.cy+30} ${s.cx-20} ${s.cy+38}" stroke="#3a2a1a" stroke-width="2" fill="none"/>
      <path d="M ${s.cx+15} ${s.cy+20} Q ${s.cx+25} ${s.cy+30} ${s.cx+20} ${s.cy+38}" stroke="#3a2a1a" stroke-width="2" fill="none"/>
      <line x1="${s.cx}" y1="${s.cy-15}" x2="${s.cx}" y2="${s.cy-30}" stroke="#5a8a4a" stroke-width="3"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">Wurzeln wachsen heraus</text>
    ` },
  { id: "light-stress", title: "Lichtstress", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx-30}" y1="${s.cy-35}" x2="${s.cx+30}" y2="${s.cy-35}" stroke="#f0c850" stroke-width="4"/>
      <line x1="${s.cx-25}" y1="${s.cy-30}" x2="${s.cx+25}" y2="${s.cy-30}" stroke="#f0c850" stroke-width="2"/>
      ${leaf(s.cx, s.cy+5, 0.7, "#c0a050", "#1f3d27")}
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">obere Blätter bleichen aus</text>
    ` },
  { id: "leggy-seedling", title: "Langer Sämling", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <ellipse cx="${s.cx}" cy="${s.cy+30}" rx="60" ry="5" fill="#3a3a3a"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx+10}" y2="${s.cy-35}" stroke="#5a8a4a" stroke-width="2"/>
      <ellipse cx="${s.cx+10}" cy="${s.cy-40}" rx="8" ry="5" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1"/>
      <ellipse cx="${s.cx+5}" cy="${s.cy-25}" rx="6" ry="3" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1"/>
      <ellipse cx="${s.cx+12}" cy="${s.cy-15}" rx="5" ry="3" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1"/>
      <text x="${s.cx-40}" y="${s.cy-30}" fill="#f0c850" font-size="20">☀️</text>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">Sämling wächst lang & dünn</text>
    ` },
  { id: "hermaphrodite", title: "Hermaphrodit", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <line x1="${s.cx}" y1="${s.cy+30}" x2="${s.cx}" y2="${s.cy-20}" stroke="#5a8a4a" stroke-width="3"/>
      <ellipse cx="${s.cx-15}" cy="${s.cy-20}" rx="10" ry="7" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(-30 ${s.cx-15} ${s.cy-20})"/>
      <ellipse cx="${s.cx+15}" cy="${s.cy-20}" rx="10" ry="7" fill="#5a8a4a" stroke="#1f3d27" stroke-width="1" transform="rotate(30 ${s.cx+15} ${s.cy-20})"/>
      <ellipse cx="${s.cx-5}" cy="${s.cy-5}" rx="2" ry="3" fill="#e0c850"/>
      <ellipse cx="${s.cx+5}" cy="${s.cy-10}" rx="2" ry="3" fill="#e0c850"/>
      <ellipse cx="${s.cx-2}" cy="${s.cy+5}" rx="2" ry="3" fill="#e0c850"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">Pollen-Säcke (Bananen)</text>
    ` },
  { id: "nutrient-lockout", title: "Nährstoff-Lockout", draw: (s) => `
      <rect x="${s.cx-100}" y="${s.cy-50}" width="200" height="100" rx="12" fill="${panelBg}" stroke="${border}"/>
      <rect x="${s.cx-50}" y="${s.cy+15}" width="100" height="20" rx="2" fill="#3a2a1a" stroke="#1f3d27"/>
      <ellipse cx="${s.cx-30}" cy="${s.cy+25}" rx="3" ry="2" fill="#5a8a4a"/>
      <ellipse cx="${s.cx+30}" cy="${s.cy+25}" rx="3" ry="2" fill="#5a8a4a"/>
      <line x1="${s.cx}" y1="${s.cy+15}" x2="${s.cx}" y2="${s.cy-15}" stroke="#5a8a4a" stroke-width="2"/>
      <path d="M ${s.cx-20} ${s.cy-15} L ${s.cx-25} ${s.cy-30} L ${s.cx-15} ${s.cy-25} L ${s.cx-22} ${s.cy-38}" stroke="#5a8a4a" stroke-width="2" fill="none"/>
      <path d="M ${s.cx+20} ${s.cy-15} L ${s.cx+25} ${s.cy-30} L ${s.cx+15} ${s.cy-25} L ${s.cx+22} ${s.cy-38}" stroke="#5a8a4a" stroke-width="2" fill="none"/>
      <line x1="${s.cx-25}" y1="${s.cy-25}" x2="${s.cx-15}" y2="${s.cy-15}" stroke="#e08030" stroke-width="3" opacity="0.7"/>
      <line x1="${s.cx+15}" y1="${s.cy-15}" x2="${s.cx+25}" y2="${s.cy-25}" stroke="#e08030" stroke-width="3" opacity="0.7"/>
      <text x="${s.cx}" y="${s.cy+65}" text-anchor="middle" fill="#a0a8a2" font-size="14" font-family="sans-serif">Mängel trotz Düngen</text>
    ` },
];

const W = 320, H = 240;

for (const e of entries) {
  const inner = e.draw({ cx: W/2, cy: H/2 - 10 });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${darkBg}"/>
  ${inner}
  <text x="${W/2}" y="${H-8}" text-anchor="middle" fill="#7a8a82" font-size="11" font-family="sans-serif" font-style="italic">GrowManager Diagnose</text>
</svg>`;
  writeFileSync(join(OUT, e.id + ".svg"), svg);
  console.log("Created:", e.id + ".svg");
}

console.log(`\n${entries.length} SVG images generated.`);
