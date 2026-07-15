#!/usr/bin/env node
// Generates clean, consistent SVG diagnosis icons
import { writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "public", "diagnosis");

const W = 320, H = 240;
const bg = "#1c2023";
const card = "#23282b";
const cardBorder = "#333a3d";
const text = "#a7b0a8";

// Base template
function base(content) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${bg}"/>
  <rect x="28" y="28" width="264" height="184" rx="18" fill="${card}" stroke="${cardBorder}" stroke-width="2"/>
  ${content}
</svg>`;
}

// Reusable leaf
const leaf = (x, y, scale=1, color="#3a7a52", stroke="#1c3a27") => `
  <g transform="translate(${x} ${y}) scale(${scale})" opacity="0.95">
    <path d="M 0 -48 Q -30 -42 -40 -15 Q -30 -30 -12 -32 Q -24 -18 -26 0 Q -34 -12 -44 5 Q -30 -6 -18 -3 Q -30 8 -30 26 Q -18 16 -8 10 Q -10 26 -2 34 Q 0 22 0 8 Q 0 22 2 34 Q 10 26 8 10 Q 18 16 30 26 Q 30 8 18 -3 Q 30 -6 44 5 Q 34 -12 26 0 Q 24 -18 12 -32 Q 30 -30 40 -15 Q 30 -42 0 -48 Z" fill="${color}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>
    <line x1="0" y1="34" x2="0" y2="50" stroke="${stroke}" stroke-width="2.2"/>
  </g>`;

const entries = [
  { id: "ca-deficiency", label: "Ca-Mangel", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.1, "#4a7a5a")}
      <circle cx="-25" cy="-12" r="6" fill="#7a4a3a" opacity="0.9"/>
      <circle cx="35" cy="5" r="8" fill="#7a4a3a" opacity="0.9"/>
      <circle cx="-5" cy="25" r="5" fill="#7a4a3a" opacity="0.9"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Ca-Mangel</text>
    </g>`)},
  { id: "s-deficiency", label: "S-Mangel", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.1, "#a8b870")}
      <line x1="0" y1="0" x2="-35" y2="-18" stroke="#1c3a27" stroke-width="2" opacity="0.6"/>
      <line x1="0" y1="0" x2="35" y2="-18" stroke="#1c3a27" stroke-width="2" opacity="0.6"/>
      <line x1="0" y1="0" x2="-30" y2="12" stroke="#1c3a27" stroke-width="2" opacity="0.6"/>
      <line x1="0" y1="0" x2="30" y2="12" stroke="#1c3a27" stroke-width="2" opacity="0.6"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">S-Mangel</text>
    </g>`)},
  { id: "zn-deficiency", label: "Zn-Mangel", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-25" stroke="#4a7a5a" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="-12" cy="-22" rx="7" ry="18" fill="#4a7a5a" stroke="#1c3a27" stroke-width="1.2"/>
      <ellipse cx="12" cy="-22" rx="7" ry="18" fill="#4a7a5a" stroke="#1c3a27" stroke-width="1.2"/>
      <ellipse cx="-9" cy="-5" rx="5" ry="12" fill="#4a7a5a" stroke="#1c3a27" stroke-width="1.2"/>
      <ellipse cx="9" cy="-5" rx="5" ry="12" fill="#4a7a5a" stroke="#1c3a27" stroke-width="1.2"/>
      <ellipse cx="0" cy="12" rx="4" ry="9" fill="#4a7a5a" stroke="#1c3a27" stroke-width="1.2"/>
      <ellipse cx="-6" cy="-38" rx="3" ry="8" fill="#4a7a5a" stroke="#1c3a27" stroke-width="1.2"/>
      <ellipse cx="6" cy="-38" rx="3" ry="8" fill="#4a7a5a" stroke="#1c3a27" stroke-width="1.2"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Zn-Mangel</text>
    </g>`)},
  { id: "mn-deficiency", label: "Mn-Mangel", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(-30, 0, 0.75, "#b8c060")}
      ${leaf(30, 0, 0.65, "#c0a040")}
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Mn-Mangel</text>
    </g>`)},
  { id: "b-deficiency", label: "B-Mangel", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-30" stroke="#5a8a64" stroke-width="6" stroke-linecap="round"/>
      <circle cx="0" cy="-35" r="8" fill="#7a4a3a"/>
      <circle cx="-8" cy="-18" r="4" fill="#7a4a3a"/>
      <circle cx="10" cy="-8" r="5" fill="#7a4a3a"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">B-Mangel</text>
    </g>`)},
  { id: "cu-deficiency", label: "Cu-Mangel", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-30" stroke="#3a5a8a" stroke-width="5" stroke-linecap="round"/>
      <path d="M -20 -30 L -30 -15 L -15 -10 L -22 0" stroke="#3a5a8a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <path d="M 20 -30 L 30 -15 L 15 -10 L 22 0" stroke="#3a5a8a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Cu-Mangel</text>
    </g>`)},
  { id: "light-burn", label: "Lichtbrand", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="-60" y1="-60" x2="-40" y2="-45" stroke="#f0c850" stroke-width="4" stroke-linecap="round"/>
      <line x1="-30" y1="-60" x2="-10" y2="-45" stroke="#f0c850" stroke-width="4" stroke-linecap="round"/>
      <line x1="0" y1="-60" x2="20" y2="-45" stroke="#f0c850" stroke-width="4" stroke-linecap="round"/>
      <line x1="30" y1="-60" x2="50" y2="-45" stroke="#f0c850" stroke-width="4" stroke-linecap="round"/>
      <line x1="-50" y1="-45" x2="-30" y2="-30" stroke="#f0c850" stroke-width="3" stroke-linecap="round"/>
      <line x1="-20" y1="-45" x2="0" y2="-30" stroke="#f0c850" stroke-width="3" stroke-linecap="round"/>
      <line x1="10" y1="-45" x2="30" y2="-30" stroke="#f0c850" stroke-width="3" stroke-linecap="round"/>
      <line x1="40" y1="-45" x2="60" y2="-30" stroke="#f0c850" stroke-width="3" stroke-linecap="round"/>
      ${leaf(0, 10, 0.85, "#c8a040")}
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Lichtbrand</text>
    </g>`)},
  { id: "overwatering", label: "Überwässerung", draw: () => base(`
    <g transform="translate(160,120)">
      <ellipse cx="0" cy="55" rx="80" ry="8" fill="#3a4a3d"/>
      ${leaf(0, 0, 0.85, "#3a7a52")}
      <ellipse cx="-25" cy="15" rx="9" ry="16" fill="#5a9a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(20 -25 15)"/>
      <ellipse cx="25" cy="15" rx="9" ry="16" fill="#5a9a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(-20 25 15)"/>
      <path d="M 45 25 Q 50 32 45 38" stroke="#5a8aaa" stroke-width="3" fill="none"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Überwässerung</text>
    </g>`)},
  { id: "underwatering", label: "Unterwässerung", draw: () => base(`
    <g transform="translate(160,120)">
      <ellipse cx="0" cy="55" rx="80" ry="6" fill="#3a3a3a"/>
      <line x1="0" y1="55" x2="0" y2="-20" stroke="#5a8a64" stroke-width="3"/>
      <path d="M 0 -20 L -35 -40" stroke="#5a8a64" stroke-width="2" stroke-linecap="round"/>
      <path d="M 0 -20 L 35 -40" stroke="#5a8a64" stroke-width="2" stroke-linecap="round"/>
      <path d="M 0 -20 L -20 -60" stroke="#5a8a64" stroke-width="2" stroke-linecap="round"/>
      <path d="M 0 -20 L 20 -60" stroke="#5a8a64" stroke-width="2" stroke-linecap="round"/>
      <text x="-30" y="-35" fill="#7a8a4a" font-size="12">🥀</text>
      <text x="25" y="-35" fill="#7a8a4a" font-size="12">🥀</text>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Unterwässerung</text>
    </g>`)},
  { id: "damping-off", label: "Umfallkrankheit", draw: () => base(`
    <g transform="translate(160,120)">
      <ellipse cx="0" cy="55" rx="80" ry="8" fill="#3a3a3a"/>
      <line x1="-40" y1="55" x2="-30" y2="20" stroke="#5a3a2a" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="-30" cy="15" rx="5" ry="10" fill="#7a5a4a" stroke="#1c3a27" stroke-width="1"/>
      <line x1="10" y1="55" x2="5" y2="20" stroke="#5a3a2a" stroke-width="3" stroke-linecap="round" transform="rotate(15 10 55)"/>
      <ellipse cx="8" cy="18" rx="5" ry="10" fill="#7a5a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(15 8 18)"/>
      <line x1="50" y1="55" x2="45" y2="15" stroke="#5a3a2a" stroke-width="3" stroke-linecap="round"/>
      <ellipse cx="45" cy="10" rx="5" ry="10" fill="#7a5a4a" stroke="#1c3a27" stroke-width="1"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Umfallkrankheit</text>
    </g>`)},
  { id: "fusarium", label: "Fusarium", draw: () => base(`
    <g transform="translate(160,120)">
      <ellipse cx="0" cy="55" rx="80" ry="8" fill="#3a3a3a"/>
      <line x1="0" y1="55" x2="-25" y2="-10" stroke="#5a3a2a" stroke-width="4" stroke-linecap="round"/>
      <line x1="0" y1="55" x2="25" y2="-10" stroke="#5a3a2a" stroke-width="4" stroke-linecap="round"/>
      <ellipse cx="-25" cy="-15" rx="11" ry="20" fill="#7a3a3a" stroke="#1c3a27" stroke-width="1" transform="rotate(20 -25 -15)"/>
      <ellipse cx="25" cy="-15" rx="11" ry="20" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(-20 25 -15)"/>
      <line x1="0" y1="55" x2="0" y2="35" stroke="#3a1a1a" stroke-width="2"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Fusarium</text>
    </g>`)},
  { id: "septoria", label: "Septoria", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.05, "#4a7a5a")}
      <circle cx="-25" cy="-10" r="4" fill="#5a2a1a"/>
      <circle cx="-15" cy="8" r="3" fill="#5a2a1a"/>
      <circle cx="10" cy="-5" r="4" fill="#5a2a1a"/>
      <circle cx="20" cy="12" r="2.5" fill="#5a2a1a"/>
      <circle cx="30" cy="-8" r="3" fill="#5a2a1a"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Septoria</text>
    </g>`)},
  { id: "rust", label: "Rostpilz", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.05, "#4a7a5a")}
      <circle cx="-20" cy="5" r="4" fill="#c8621a"/>
      <circle cx="-5" cy="-10" r="4" fill="#c8621a"/>
      <circle cx="15" cy="10" r="4" fill="#c8621a"/>
      <circle cx="25" cy="-5" r="4" fill="#c8621a"/>
      <circle cx="-30" cy="-5" r="4" fill="#c8621a"/>
      <circle cx="5" cy="20" r="2.5" fill="#c8621a"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Rostpilz</text>
    </g>`)},
  { id: "bud-rot", label: "Bud Rot", draw: () => base(`
    <g transform="translate(160,120)">
      <ellipse cx="-15" cy="-10" rx="24" ry="22" fill="#4a7a5a" stroke="#1c3a27" stroke-width="1.5"/>
      <ellipse cx="15" cy="-5" rx="20" ry="18" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1.5"/>
      <ellipse cx="0" cy="12" rx="22" ry="20" fill="#3a2a2a" stroke="#1c3a27" stroke-width="1.5"/>
      <text x="30" y="0" fill="#7a5a3a" font-size="16">🦠</text>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Bud Rot</text>
    </g>`)},
  { id: "thrips", label: "Thripse", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 0.95, "#9aa888")}
      <ellipse cx="-20" cy="-10" rx="2.5" ry="0.8" fill="#1a1a1a" transform="rotate(15 -20 -10)"/>
      <ellipse cx="10" cy="0" rx="2.5" ry="0.8" fill="#1a1a1a" transform="rotate(-10 10 0)"/>
      <ellipse cx="25" cy="-5" rx="2.5" ry="0.8" fill="#1a1a1a" transform="rotate(20 25 -5)"/>
      <ellipse cx="-5" cy="15" rx="2.5" ry="0.8" fill="#1a1a1a" transform="rotate(5 -5 15)"/>
      <ellipse cx="-30" cy="5" rx="2.5" ry="0.8" fill="#1a1a1a" transform="rotate(-25 -30 5)"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Thripse</text>
    </g>`)},
  { id: "aphids", label: "Blattläuse", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-20" stroke="#5a8a4a" stroke-width="4"/>
      <ellipse cx="-15" cy="-25" rx="13" ry="9" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(-30 -15 -25)"/>
      <ellipse cx="15" cy="-25" rx="13" ry="9" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(30 15 -25)"/>
      <circle cx="-12" cy="-15" r="2.5" fill="#6ab060"/>
      <circle cx="-8" cy="-10" r="2.5" fill="#3a1a3a"/>
      <circle cx="-18" cy="-8" r="2.5" fill="#6ab060"/>
      <circle cx="5" cy="-15" r="2.5" fill="#6ab060"/>
      <circle cx="10" cy="-10" r="2.5" fill="#3a1a3a"/>
      <circle cx="18" cy="-8" r="2.5" fill="#6ab060"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Blattläuse</text>
    </g>`)},
  { id: "whiteflies", label: "Weiße Fliege", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 0.95, "#5a8a4a")}
      <g transform="translate(-30, 5)">
        <ellipse cx="0" cy="0" rx="4.5" ry="2" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5"/>
        <ellipse cx="-6" cy="-2" rx="4.5" ry="2" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5" transform="rotate(-30)"/>
        <ellipse cx="6" cy="-2" rx="4.5" ry="2" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5" transform="rotate(30)"/>
      </g>
      <g transform="translate(20, 15)">
        <ellipse cx="0" cy="0" rx="4.5" ry="2" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5"/>
        <ellipse cx="-6" cy="-2" rx="4.5" ry="2" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5" transform="rotate(-30)"/>
        <ellipse cx="6" cy="-2" rx="4.5" ry="2" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5" transform="rotate(30)"/>
      </g>
      <g transform="translate(5, -10)">
        <ellipse cx="0" cy="0" rx="3.5" ry="1.5" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5"/>
        <ellipse cx="-5" cy="-1" rx="3.5" ry="1.5" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5" transform="rotate(-30)"/>
        <ellipse cx="5" cy="-1" rx="3.5" ry="1.5" fill="#e0e0e0" stroke="#aaa" stroke-width="0.5" transform="rotate(30)"/>
      </g>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Weiße Fliege</text>
    </g>`)},
  { id: "mealybugs", label: "Wollläuse", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-25" stroke="#5a8a4a" stroke-width="4"/>
      <ellipse cx="-15" cy="-15" rx="11" ry="8" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(-30 -15 -15)"/>
      <ellipse cx="15" cy="-15" rx="11" ry="8" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(30 15 -15)"/>
      <g transform="translate(0, 5)">
        <ellipse cx="0" cy="0" rx="6" ry="4" fill="#f0f0f0" stroke="#aaa" stroke-width="0.5"/>
        <circle cx="-3" cy="-2" r="0.8" fill="#fff"/><circle cx="3" cy="-2" r="0.8" fill="#fff"/><circle cx="0" cy="0" r="0.8" fill="#fff"/><circle cx="-2" cy="2" r="0.8" fill="#fff"/><circle cx="2" cy="2" r="0.8" fill="#fff"/>
      </g>
      <g transform="translate(-25, -5)">
        <ellipse cx="0" cy="0" rx="5" ry="3" fill="#f0f0f0" stroke="#aaa" stroke-width="0.5"/>
        <circle cx="-2" cy="-1" r="0.7" fill="#fff"/><circle cx="2" cy="-1" r="0.7" fill="#fff"/><circle cx="0" cy="1" r="0.7" fill="#fff"/>
      </g>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Wollläuse</text>
    </g>`)},
  { id: "scale", label: "Schildläuse", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-25" stroke="#5a8a4a" stroke-width="5"/>
      <ellipse cx="-8" cy="-5" rx="7" ry="5" fill="#6a4a2a" stroke="#1c3a27" stroke-width="1"/>
      <ellipse cx="10" cy="5" rx="6" ry="4" fill="#6a4a2a" stroke="#1c3a27" stroke-width="1"/>
      <ellipse cx="-5" cy="15" rx="5" ry="3.5" fill="#6a4a2a" stroke="#1c3a27" stroke-width="1"/>
      <ellipse cx="15" cy="15" rx="6" ry="4" fill="#6a4a2a" stroke="#1c3a27" stroke-width="1"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Schildläuse</text>
    </g>`)},
  { id: "caterpillars", label: "Raupen", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 0.95, "#4a7a5a")}
      <path d="M -55 -10 Q -35 -22 -15 -15" stroke="#3a3a1a" stroke-width="7" fill="none" stroke-linecap="round"/>
      <circle cx="-10" cy="-13" r="3.5" fill="#3a3a1a"/>
      <line x1="-7" y1="-15" x2="-3" y2="-22" stroke="#3a3a1a" stroke-width="1.2"/>
      <line x1="-5" y1="-14" x2="-1" y2="-21" stroke="#3a3a1a" stroke-width="1.2"/>
      <circle cx="20" cy="8" r="1.8" fill="#1a1a1a"/>
      <circle cx="30" cy="13" r="1.3" fill="#1a1a1a"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Raupen</text>
    </g>`)},
  { id: "leaf-miners", label: "Minierfliegen", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.05, "#4a7a5a")}
      <path d="M -30 15 Q -15 -5 10 5 Q 25 -15 15 -20 Q -5 -10 -20 5 Q -25 15 -30 15 Z" fill="none" stroke="#e0d8a0" stroke-width="3" stroke-linecap="round"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Minierfliegen</text>
    </g>`)},
  { id: "springtails", label: "Springschwänze", draw: () => base(`
    <g transform="translate(160,120)">
      <ellipse cx="0" cy="55" rx="80" ry="8" fill="#3a4a3d"/>
      <ellipse cx="-30" cy="50" rx="3.5" ry="1.6" fill="#e0e0e0"/>
      <ellipse cx="-10" cy="53" rx="3.5" ry="1.6" fill="#e0e0e0"/>
      <ellipse cx="15" cy="49" rx="3.5" ry="1.6" fill="#e0e0e0"/>
      <ellipse cx="35" cy="52" rx="3.5" ry="1.6" fill="#e0e0e0"/>
      <g transform="translate(-30, 40)">
        <line x1="0" y1="0" x2="-2" y2="-7" stroke="#e0e0e0" stroke-width="1"/>
        <ellipse cx="-2" cy="-9" rx="2" ry="1" fill="#e0e0e0"/>
      </g>
      <g transform="translate(15, 38)">
        <line x1="0" y1="0" x2="2" y2="-7" stroke="#e0e0e0" stroke-width="1"/>
        <ellipse cx="2" cy="-9" rx="2" ry="1" fill="#e0e0e0"/>
      </g>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Springschwänze</text>
    </g>`)},
  { id: "heat-stress", label: "Hitzestress", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-25" stroke="#5a8a4a" stroke-width="3"/>
      <ellipse cx="-15" cy="-25" rx="11" ry="8" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(-30 -15 -25)"/>
      <ellipse cx="15" cy="-25" rx="11" ry="8" fill="#e08030" opacity="0.7" stroke="#1c3a27" stroke-width="1" transform="rotate(30 15 -25)"/>
      <text x="35" y="-20" fill="#e08030" font-size="24">🌡️</text>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Hitzestress</text>
    </g>`)},
  { id: "cold-stress", label: "Kältestress", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.0, "#6a4a8a")}
      <text x="35" y="-20" fill="#8aaeea" font-size="24">❄️</text>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Kältestress</text>
    </g>`)},
  { id: "low-humidity", label: "RH zu niedrig", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.0, "#a88040")}
      <text x="35" y="-15" fill="#e0c060" font-size="22">💧</text>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">RH zu niedrig</text>
    </g>`)},
  { id: "high-humidity", label: "RH zu hoch", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.0, "#4a7a5a")}
      <text x="35" y="-15" fill="#5aaaca" font-size="22">💦</text>
      <circle cx="-30" cy="5" r="2.2" fill="#5aaaca"/>
      <circle cx="-15" cy="15" r="2.2" fill="#5aaaca"/>
      <circle cx="20" cy="0" r="2.2" fill="#5aaaca"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">RH zu hoch</text>
    </g>`)},
  { id: "ph-drift", label: "pH-Drift", draw: () => base(`
    <g transform="translate(160,120)">
      <g transform="translate(-25, -10)">
        <circle cx="0" cy="0" r="24" fill="#262b2e" stroke="#3a4a3d" stroke-width="2"/>
        <text x="0" y="6" text-anchor="middle" fill="#e0e0e0" font-size="16" font-family="sans-serif">⚖️</text>
      </g>
      <text x="35" y="-5" fill="#a080e0" font-size="14" font-family="monospace">pH 6.2</text>
      <line x1="0" y1="0" x2="0" y2="0" stroke="none"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">pH-Drift</text>
    </g>`)},
  { id: "rootbound", label: "Topf zu klein", draw: () => base(`
    <g transform="translate(160,120)">
      <path d="M -30 35 L -25 -15 L 25 -15 L 30 35 Z" fill="#5a4a3a" stroke="#1c3a27" stroke-width="1.5"/>
      <ellipse cx="0" cy="-15" rx="25" ry="5" fill="#3a2a1a" stroke="#1c3a27" stroke-width="1.5"/>
      <path d="M -25 30 Q -40 35 -35 43" stroke="#3a2a1a" stroke-width="2" fill="none"/>
      <path d="M 25 30 Q 40 35 35 43" stroke="#3a2a1a" stroke-width="2" fill="none"/>
      <path d="M -15 25 Q -25 32 -20 43" stroke="#3a2a1a" stroke-width="2" fill="none"/>
      <path d="M 15 25 Q 25 32 20 43" stroke="#3a2a1a" stroke-width="2" fill="none"/>
      <line x1="0" y1="-15" x2="0" y2="-35" stroke="#5a8a4a" stroke-width="3"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Topf zu klein</text>
    </g>`)},
  { id: "light-stress", label: "Lichtstress", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="-30" y1="-55" x2="30" y2="-55" stroke="#f0c850" stroke-width="4"/>
      <line x1="-25" y1="-48" x2="25" y2="-48" stroke="#f0c850" stroke-width="2"/>
      ${leaf(0, 5, 0.75, "#c0a050")}
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Lichtstress</text>
    </g>`)},
  { id: "leggy-seedling", label: "Langer Sämling", draw: () => base(`
    <g transform="translate(160,120)">
      <ellipse cx="0" cy="55" rx="60" ry="5" fill="#3a3a3a"/>
      <line x1="0" y1="55" x2="8" y2="-40" stroke="#5a8a4a" stroke-width="2"/>
      <ellipse cx="8" cy="-45" rx="8" ry="5" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1"/>
      <ellipse cx="5" cy="-30" rx="6" ry="3" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1"/>
      <ellipse cx="12" cy="-22" rx="5" ry="3" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1"/>
      <text x="-40" y="-30" fill="#f0c850" font-size="20">☀️</text>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Langer Sämling</text>
    </g>`)},
  { id: "hermaphrodite", label: "Hermaphrodit", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-25" stroke="#5a8a4a" stroke-width="3"/>
      <ellipse cx="-15" cy="-25" rx="11" ry="8" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(-30 -15 -25)"/>
      <ellipse cx="15" cy="-25" rx="11" ry="8" fill="#5a8a4a" stroke="#1c3a27" stroke-width="1" transform="rotate(30 15 -25)"/>
      <ellipse cx="-5" cy="-5" rx="2.5" ry="4" fill="#e0c850"/>
      <ellipse cx="5" cy="-10" rx="2.5" ry="4" fill="#e0c850"/>
      <ellipse cx="-2" cy="5" rx="2.5" ry="4" fill="#e0c850"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Hermaphrodit</text>
    </g>`)},
  { id: "nutrient-lockout", label: "Nährstoff-Lockout", draw: () => base(`
    <g transform="translate(160,120)">
      <rect x="-50" y="15" width="100" height="20" rx="2" fill="#3a2a1a" stroke="#1c3a27" stroke-width="1"/>
      <ellipse cx="-30" cy="25" rx="3" ry="2" fill="#5a8a4a"/>
      <ellipse cx="30" cy="25" rx="3" ry="2" fill="#5a8a4a"/>
      <line x1="0" y1="15" x2="0" y2="-15" stroke="#5a8a4a" stroke-width="2"/>
      <path d="M -20 -15 L -25 -30 L -15 -25 L -22 -40" stroke="#5a8a4a" stroke-width="2" fill="none"/>
      <path d="M 20 -15 L 25 -30 L 15 -25 L 22 -40" stroke="#5a8a4a" stroke-width="2" fill="none"/>
      <line x1="-25" y1="-25" x2="-15" y2="-15" stroke="#e08030" stroke-width="3" opacity="0.7"/>
      <line x1="15" y1="-15" x2="25" y2="-25" stroke="#e08030" stroke-width="3" opacity="0.7"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">Nährstoff-Lockout</text>
    </g>`)},
  { id: "k-deficiency", label: "K-Mangel", draw: () => base(`
    <g transform="translate(160,120)">
      ${leaf(0, 0, 1.05, "#4a7a5a")}
      <path d="M 35 -35 L 55 -15 L 65 -25 L 75 -10" stroke="#5a2a1a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M 40 -10 L 60 5 L 70 -5" stroke="#5a2a1a" stroke-width="3" fill="none" stroke-linecap="round"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">K-Mangel</text>
    </g>`)},
  { id: "p-deficiency", label: "P-Mangel", draw: () => base(`
    <g transform="translate(160,120)">
      <line x1="0" y1="55" x2="0" y2="-25" stroke="#4a2a5a" stroke-width="4"/>
      ${leaf(0, -25, 0.75, "#6a4a8a")}
      <line x1="-12" y1="-5" x2="-32" y2="-20" stroke="#6a3a8a" stroke-width="2"/>
      <line x1="12" y1="-5" x2="32" y2="-20" stroke="#6a3a8a" stroke-width="2"/>
      <line x1="-10" y1="10" x2="-35" y2="5" stroke="#6a3a8a" stroke-width="2"/>
      <line x1="10" y1="10" x2="35" y2="5" stroke="#6a3a8a" stroke-width="2"/>
      <text x="0" y="82" text-anchor="middle" fill="${text}" font-size="15" font-family="sans-serif">P-Mangel</text>
    </g>`)},
];

for (const e of entries) {
  const svg = e.draw();
  writeFileSync(join(OUT, e.id + ".svg"), svg);
  console.log("Created:", e.id + ".svg");
}

console.log(`\n${entries.length} SVG icons regenerated.`);
