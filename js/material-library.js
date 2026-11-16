import { svgUrl } from "./materials.js";
import { CARD_KINDS, cardName } from "./note-type.js";

export const LIBRARY_STYLES = [
  ["all", "全部风格"], ["vintage", "旧纸收藏"], ["gothic", "哥特暗室"],
  ["rococo", "洛可可厅"], ["victorian", "维多利亚"], ["nouveau", "新艺术"],
  ["curio", "珍奇柜"], ["baroque", "巴洛克"], ["surreal", "悬疑寓言"],
  ["modern", "现代平面"], ["arcana", "英伦秘法"], ["dimensional", "立体古物"],
];

const palettes = [
  { id: "gothic", style: "gothic", name: "哥特", bg: "#332d2a", ink: "#e0d3b8", accent: "#7f3a3d", gold: "#b28f56", pale: "#8a765f" },
  { id: "rococo", style: "rococo", name: "洛可可", bg: "#f1e6d2", ink: "#67503f", accent: "#b98a86", gold: "#c09a60", pale: "#dfcdb3" },
  { id: "victorian", style: "victorian", name: "维多利亚", bg: "#e4d8bc", ink: "#4c4230", accent: "#6b775c", gold: "#a68a52", pale: "#cdbd9c" },
  { id: "nouveau", style: "nouveau", name: "新艺术", bg: "#dfe1cf", ink: "#41483a", accent: "#8a6c44", gold: "#9d8b5b", pale: "#c8ccb1" },
  { id: "curio", style: "curio", name: "珍奇柜", bg: "#dcd4c4", ink: "#3e3b32", accent: "#5b6d68", gold: "#9a8054", pale: "#c6baa4" },
  { id: "baroque", style: "baroque", name: "巴洛克", bg: "#d9d5c8", ink: "#34393c", accent: "#6a5140", gold: "#8f8359", pale: "#c2bbaa" },
];

const defs = `<defs>
<linearGradient id="lg" x2=".8" y2="1"><stop stop-color="#f6e6bc"/><stop offset=".38" stop-color="#c8a468"/><stop offset=".7" stop-color="#93713f"/><stop offset="1" stop-color="#ead39c"/></linearGradient>
<radialGradient id="rg"><stop stop-color="#f3dfae"/><stop offset=".5" stop-color="#b9955c"/><stop offset="1" stop-color="#765630"/></radialGradient>
<linearGradient id="pg" x2=".4" y2="1"><stop stop-color="#f5ecd9"/><stop offset="1" stop-color="#cfc0a2"/></linearGradient>
</defs>`;
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const label = (s, x, y, size, fill, extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Georgia,serif" font-size="${size}" fill="${fill}" ${extra}>${esc(s)}</text>`;
const star = (cx, cy, r, fill) => {
  let d = "";
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI) / 4, rr = i % 2 ? r * 0.42 : r;
    d += `${i ? "L" : "M"}${(cx + Math.sin(a) * rr).toFixed(1)} ${(cy - Math.cos(a) * rr).toFixed(1)}`;
  }
  return `<path d="${d}Z" fill="${fill}"/>`;
};
const flourish = (x, y, s, color) => `<path d="M${x} ${y}q${s * 0.5} ${-s * 0.6} ${s} 0q${-s * 0.2} ${s * 0.45} ${-s * 0.55} ${s * 0.2}q${-s * 0.3} ${-s * 0.2} ${s * 0.15} ${-s * 0.3}" fill="none" stroke="${color}" stroke-width="${Math.max(1, s * 0.06)}"/>`;

const motifs = {
  moth: (cx, cy, s, p) => `<path d="M${cx} ${cy - s * 0.28}q-${s * 1.15}-${s * 0.85}-${s * 1.1} ${s * 0.1}q${s * 0.08} ${s * 0.42} ${s * 0.78} ${s * 0.3}q-${s * 0.68} ${s * 0.4}-${s * 0.4} ${s * 0.72}q${s * 0.4} ${s * 0.22} ${s * 0.72}-${s * 0.36}q${s * 0.3} ${s * 0.58} ${s * 0.72} ${s * 0.36}q${s * 0.28}-${s * 0.32}-${s * 0.4}-${s * 0.72}q${s * 0.7} ${s * 0.12} ${s * 0.78}-${s * 0.3}q${s * 0.05}-${s * 0.95}-${s * 1.1}-${s * 0.1}Z" fill="${p.pale}" stroke="${p.ink}" stroke-width="${s * 0.06}"/><circle cx="${cx - s * 0.42}" cy="${cy - s * 0.05}" r="${s * 0.13}" fill="${p.ink}"/><circle cx="${cx + s * 0.42}" cy="${cy - s * 0.05}" r="${s * 0.13}" fill="${p.ink}"/><path d="M${cx} ${cy - s * 0.3}v${s * 1.15}" stroke="${p.ink}" stroke-width="${s * 0.09}"/>`,
  key: (cx, cy, s, p) => `<g fill="none" stroke="${p.gold}" stroke-width="${s * 0.14}"><ellipse cx="${cx}" cy="${cy - s * 0.5}" rx="${s * 0.34}" ry="${s * 0.42}"/><path d="M${cx} ${cy - s * 0.1}v${s * 0.95}m0-${s * 0.18}h${s * 0.3}m-${s * 0.3} ${s * 0.28}h${s * 0.22}"/></g><path d="M${cx} ${cy - s * 0.62}q-${s * 0.16} ${s * 0.12} 0 ${s * 0.24}q${s * 0.16}-${s * 0.12} 0-${s * 0.24}Z" fill="${p.accent}"/>`,
  eye: (cx, cy, s, p) => `<path d="M${cx - s} ${cy}q${s} -${s * 0.62} ${s * 2} 0q-${s} ${s * 0.62}-${s * 2} 0Z" fill="${p.bg}" stroke="${p.ink}" stroke-width="${s * 0.07}"/><circle cx="${cx}" cy="${cy}" r="${s * 0.36}" fill="${p.accent}"/><circle cx="${cx}" cy="${cy}" r="${s * 0.16}" fill="${p.ink}"/><path d="M${cx - s} ${cy}q${s}-${s * 0.55} ${s * 2} 0M${cx} ${cy}s${s * 0.3} ${s * 0.9} 0" stroke="${p.ink}" stroke-width="${s * 0.04}" fill="none"/>`,
  mushroom: (cx, cy, s, p) => `<path d="M${cx - s * 0.24} ${cy + s * 0.2}q-${s * 0.1} ${s * 0.4} ${s * 0.05} ${s * 0.7}h${s * 0.38}q${s * 0.16}-${s * 0.3} ${s * 0.06}-${s * 0.7}Z" fill="${p.pale}" stroke="${p.ink}" stroke-width="${s * 0.05}"/><path d="M${cx - s * 0.7} ${cy + s * 0.2}q${s * 0.1}-${s * 0.95} ${s * 1.4} 0Z" fill="${p.accent}" stroke="${p.ink}" stroke-width="${s * 0.06}"/><circle cx="${cx - s * 0.24}" cy="${cy - s * 0.12}" r="${s * 0.08}" fill="${p.bg}"/><circle cx="${cx + s * 0.24}" cy="${cy - s * 0.28}" r="${s * 0.06}" fill="${p.bg}"/>`,
  raven: (cx, cy, s, p) => `<path d="M${cx - s * 0.9} ${cy + s * 0.42}q${s * 0.6}-${s * 0.2} ${s * 1.5} 0q${s * 0.62}-${s * 0.4} ${s * 0.38}-${s * 0.92}q-${s * 0.3}-${s * 0.5}-${s * 0.7}-${s * 0.16}q-${s * 0.5}-${s * 0.42}-${s * 0.85} ${s * 0.08}q-${s * 0.36} ${s * 0.3}-${s * 0.32} ${s * 1}Z" fill="${p.ink}" stroke="${p.ink}"/><path d="M${cx + s * 0.5} ${cy - s * 0.22}l${s * 0.42} ${s * 0.08}-${s * 0.38} ${s * 0.15}" fill="${p.gold}"/><circle cx="${cx + s * 0.36}" cy="${cy - s * 0.3}" r="${s * 0.05}" fill="${p.gold}"/><path d="M${cx - s * 0.9} ${cy + s * 0.42}h${s * 1.5}" stroke="${p.ink}" stroke-width="${s * 0.06}"/>`,
  hand: (cx, cy, s, p) => `<path d="M${cx - s * 0.5} ${cy + s * 0.7}q-${s * 0.1}-${s * 0.7} ${s * 0.12}-${s * 0.86}q0-${s * 0.5} ${s * 0.3}-${s * 0.32}l${s * 0.06} ${s * 0.42}q${s * 0.04}-${s * 0.72} ${s * 0.34}-${s * 0.66}l${s * 0.05} ${s * 0.66}q${s * 0.04}-${s * 0.62} ${s * 0.34}-${s * 0.56}l${s * 0.04} ${s * 0.64}q${s * 0.06}-${s * 0.38} ${s * 0.28}-${s * 0.3}q${s * 0.18} ${s * 0.1} ${s * 0.04} ${s * 0.62}q-${s * 0.14} ${s * 0.58}-${s * 0.6} ${s * 0.76}Z" fill="${p.pale}" stroke="${p.ink}" stroke-width="${s * 0.05}"/><path d="M${cx - s * 0.36} ${cy + s * 0.72}q${s * 0.3} ${s * 0.2} ${s * 0.9} 0" stroke="${p.accent}" stroke-width="${s * 0.08}" fill="none"/>`,
  rose: (cx, cy, s, p) => `<g fill="none" stroke="${p.accent}" stroke-width="${s * 0.08}"><circle cx="${cx}" cy="${cy}" r="${s * 0.5}"/><path d="M${cx} ${cy - s * 0.42}q${s * 0.4} ${s * 0.16} ${s * 0.14} ${s * 0.42}q-${s * 0.24} ${s * 0.24}-${s * 0.44}-${s * 0.04}q-${s * 0.16}-${s * 0.28} ${s * 0.3}-${s * 0.38}Zm${s * 0.28} ${s * 0.3}q${s * 0.3} ${s * 0.1} ${s * 0.14} ${s * 0.34}q-${s * 0.24} ${s * 0.2}-${s * 0.4}-${s * 0.04}"/></g><path d="M${cx - s * 0.5} ${cy + s * 0.52}q${s * 0.4} ${s * 0.4} ${s} ${s * 0.06}" stroke="${p.ink}" stroke-width="${s * 0.08}" fill="none"/>`,
  moon: (cx, cy, s, p) => `<path d="M${cx + s * 0.18} ${cy - s * 0.62}a${s * 0.62} ${s * 0.62} 0 1 0-${s * 0.14} ${s * 1.2}a${s * 0.46} ${s * 0.5} 0 0 1 ${s * 0.14}-${s * 1.2}Z" fill="${p.pale}" stroke="${p.ink}" stroke-width="${s * 0.05}"/>${star(cx + s * 0.58, cy - s * 0.3, s * 0.13, p.gold)}${star(cx + s * 0.72, cy + s * 0.34, s * 0.09, p.gold)}`,
  bottle: (cx, cy, s, p) => `<path d="M${cx - s * 0.16} ${cy - s * 0.72}h${s * 0.32}v${s * 0.24}q${s * 0.25} ${s * 0.24} ${s * 0.26} ${s * 0.7}v${s * 0.5}h-${s * 0.68}v-${s * 0.5}q0-${s * 0.46} ${s * 0.26}-${s * 0.7}Z" fill="${p.pale}" stroke="${p.ink}" stroke-width="${s * 0.06}"/><rect x="${cx - s * 0.28}" y="${cy + s * 0.04}" width="${s * 0.56}" height="${s * 0.32}" fill="${p.accent}" opacity=".7"/><path d="M${cx - s * 0.12} ${cy - s * 0.72}v-${s * 0.1}h${s * 0.24}v${s * 0.1}" fill="${p.gold}"/>`,
  frame: (cx, cy, s, p) => `<ellipse cx="${cx}" cy="${cy}" rx="${s * 0.56}" ry="${s * 0.7}" fill="${p.pale}" stroke="${p.gold}" stroke-width="${s * 0.1}"/><ellipse cx="${cx}" cy="${cy}" rx="${s * 0.4}" ry="${s * 0.55}" fill="${p.bg}" stroke="${p.ink}" stroke-width="${s * 0.04}"/><path d="M${cx - s * 0.26} ${cy + s * 0.4}q${s * 0.26}-${s * 0.5} ${s * 0.52} 0" stroke="${p.accent}" stroke-width="${s * 0.16}" fill="none"/>`,
};

function buildMaterial(id, name, category, w, h, width, style, body, extra = {}) {
  const material = { id, name, category, w, h, width, style, ...extra };
  let src;
  Object.defineProperty(material, "src", {
    enumerable: true,
    get() { return src ?? (src = svgUrl(defs + body, w, h)); },
  });
  return material;
}

const generated = [];
function add(id, name, category, w, h, width, palette, body, extra) {
  generated.push(buildMaterial(id, name, category, w, h, width, palette.style, body, extra));
}

function motifsFor(index) {
  return [motifs.moth, motifs.key, motifs.eye, motifs.mushroom, motifs.raven][index % 5];
}

const stickerShapes = [
  {
    key: "plaque", name: "雕花铭牌", w: 300, h: 330,
    wrap: (p, m) => `<path d="M30 24h240l22 26-14 238-22 22H58l-28-26 8-232Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="3"/><path d="M42 38h215l14 18-12 216-16 16H66l-18-18 6-215Z" fill="none" stroke="${p.pale}" stroke-width="1.4"/>${m(150, 150, 62, p)}${label("CURIOSITY", 150, 258, 15, p.ink, 'letter-spacing="3"')}${flourish(94, 283, 34, p.gold)}`,
  },
  {
    key: "shield", name: "哥特徽盾", w: 300, h: 350,
    wrap: (p, m) => `<path d="M150 18 272 58v134q-8 88-122 140Q36 280 28 192V58Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="4"/><path d="M150 34 256 70v120q-7 76-106 124Q44 266 44 190V70Z" fill="none" stroke="${p.pale}" stroke-width="1.4"/>${m(150, 140, 56, p)}${label("KEEP", 150, 272, 16, p.ink, 'letter-spacing="4"')}${star(150, 292, 10, p.gold)}`,
  },
  {
    key: "seal", name: "火漆圆章", w: 300, h: 300,
    wrap: (p, m) => `<circle cx="150" cy="150" r="128" fill="${p.accent}" opacity=".88"/><circle cx="150" cy="150" r="128" fill="none" stroke="${p.gold}" stroke-width="3"/><circle cx="150" cy="150" r="112" fill="none" stroke="${p.pale}" stroke-width="1.2" stroke-dasharray="3 4"/>${m(150, 145, 46, p)}${label("SECRET", 150, 238, 13, p.pale, 'letter-spacing="2"')}`,
  },
  {
    key: "cartouche", name: "洛可可涡卷", w: 330, h: 300,
    wrap: (p, m) => `<path d="M30 84q36-58 120-58t120 58q28 70-14 128-52 52-106 52T44 212q-42-58-14-128Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="3"/>${flourish(48, 62, 52, p.gold)}${flourish(232, 62, 52, p.gold)}${m(165, 140, 48, p)}${label("SOUVENIR", 165, 232, 14, p.ink, 'letter-spacing="3"')}`,
  },
  {
    key: "cabinet", name: "珍奇标本卡", w: 300, h: 340,
    wrap: (p, m) => `<rect x="18" y="18" width="264" height="304" fill="${p.bg}" stroke="${p.gold}" stroke-width="2"/><rect x="30" y="30" width="240" height="280" fill="none" stroke="${p.pale}" stroke-width="1"/><path d="M30 76h240" stroke="${p.pale}"/>${label("CABINET OF CURIOSITIES", 150, 60, 9, p.ink, 'letter-spacing="1"')}${m(150, 160, 50, p)}${label("SPECIMEN No. " + String(1 + (p.name.length % 9)), 150, 278, 10, p.ink, 'letter-spacing="1"')}${star(150, 294, 6, p.gold)}`,
  },
];

for (const shape of stickerShapes) {
  palettes.forEach((palette, pi) => {
    const motif = motifsFor(pi + stickerShapes.indexOf(shape));
    add(`vx-sticker-${shape.key}-${palette.id}`, `${palette.name} · ${shape.name}`, "sticker", shape.w, shape.h, 40, palette, shape.wrap(palette, motif));
  });
}

const bookmarkStyles = ["尖角", "燕尾", "圆头", "流苏", "双联"];
for (const palette of palettes) {
  bookmarkStyles.forEach((style, si) => {
    const p = palette, w = 150, h = 320;
    const caps = [
      `<path d="M20 12h110v290l-55-30-55 30Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="2"/>`,
      `<path d="M20 12h110v290l-55-26-55 26V60l14-22-14-22Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="2"/>`,
      `<path d="M20 12h110v276q-55 34-110 0Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="2"/>`,
      `<path d="M27 12h96v272l-48-24-48 24Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="2"/><path d="M75 260v46m-13-16 13 18 13-18" stroke="${p.gold}" stroke-width="3" fill="none"/>`,
      `<path d="M18 12h49v286H18Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="2"/><path d="M83 12h49v286H83Z" fill="${p.bg}" stroke="${p.gold}" stroke-width="2"/><path d="M67 12v286" stroke="${p.pale}" stroke-dasharray="3 3"/>`,
    ][si];
    const motif = [motifs.rose, motifs.key, motifs.moon, motifs.moth, motifs.mushroom][si];
    add(`vx-bookmark-${si}-${palette.id}`, `${p.name} · ${style}书签`, "bookmark", w, h, 22, p,
      `${caps}<rect x="32" y="24" width="86" height="238" fill="none" stroke="${p.pale}" stroke-width="1"/>${motif(si === 4 ? 42 : 75, 120, 26, p)}${label("KEEP", si === 4 ? 42 : 75, 200, 11, p.ink, 'letter-spacing="2"')}${label("THIS", si === 4 ? 42 : 75, 216, 11, p.ink, 'letter-spacing="2"')}${star(si === 4 ? 42 : 75, 246, 6, p.gold)}`);
  });
}

const plants = [
  (p) => `<path d="M150 330q-4-108 10-186" stroke="${p.accent}" stroke-width="3" fill="none"/><g fill="${p.pale}" stroke="${p.ink}" stroke-width="1">${[0, 1, 2, 3].map(i => `<ellipse cx="${128 - i * 5}" cy="${250 - i * 46}" rx="34" ry="16" transform="rotate(-24 ${128 - i * 5} ${250 - i * 46})"/><ellipse cx="${172 + i * 5}" cy="${228 - i * 46}" rx="34" ry="16" transform="rotate(24 ${172 + i * 5} ${228 - i * 46})"/>`).join("")}</g><circle cx="159" cy="128" r="15" fill="${p.accent}"/>`,
  (p) => `<path d="M150 332V114m-32 60-32-42m64 24 36-38m-68 96-26-24m62 6 34-22" stroke="${p.accent}" stroke-width="2" fill="none"/>${[0, 1, 2, 3, 4].map(i => `<g fill="${p.pale}" stroke="${p.ink}" stroke-width=".8"><ellipse cx="${118 - (i % 2) * 6}" cy="${172 + i * 26}" rx="26" ry="9" transform="rotate(${i % 2 ? 22 : -18} ${118} ${172 + i * 26})"/><ellipse cx="${182 + (i % 2) * 6}" cy="${158 + i * 26}" rx="26" ry="9" transform="rotate(${i % 2 ? -22 : 18} ${182} ${158 + i * 26})"/></g>`).join("")}`,
  (p) => `<path d="M150 330V150" stroke="${p.accent}" stroke-width="3"/><g fill="${p.pale}" stroke="${p.ink}" stroke-width="1"><path d="M150 160q-70-10-64-64q58 2 64 64Z"/><path d="M150 160q70-10 64-64q-58 2-64 64Z"/><path d="M150 218q-58-4-52-52q48 4 52 52Z"/><path d="M150 218q58-4 52-52q-48 4-52 52Z"/></g><circle cx="150" cy="92" r="18" fill="${p.accent}"/><circle cx="150" cy="92" r="8" fill="${p.gold}"/>`,
  (p) => `<g fill="${p.pale}" stroke="${p.ink}" stroke-width=".9">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${150 + Math.sin(i * 1.05) * 44}" cy="${120 + i * 30}" r="${28 - i * 2.2}"/><circle cx="${150 + Math.cos(i * 1.05) * 44}" cy="${130 + i * 30}" r="${26 - i * 2}"/>`).join("")}</g><path d="M150 330V130" stroke="${p.accent}" stroke-width="2"/>`,
  (p) => `<path d="M110 330q-10-120 40-180q50 60 40 180" stroke="${p.accent}" stroke-width="2" fill="none"/>${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${126 + (i % 3) * 24}" cy="${170 + i * 24}" r="13" fill="${p.accent}" opacity="${0.4 + i * 0.1}"/>`).join("")}<path d="M150 150q-30-30-12-54q26 12 12 54Zm0 0q30-30 12-54q-26 12-12 54Z" fill="${p.pale}" stroke="${p.ink}"/>`,
];
palettes.forEach((palette) => {
  plants.forEach((plant, vi) => {
    add(`vx-botanical-${vi}-${palette.id}`, `${palette.name} · ${["蕨叶标本", "羽状枝叶", "月桂心叶", "尤加利串", "浆果枝"][vi]}`, "botanical", 300, 360, 35, palette,
      `<rect x="10" y="10" width="280" height="340" fill="${palette.bg}" stroke="${palette.gold}"/><rect x="20" y="20" width="260" height="320" fill="none" stroke="${palette.pale}"/>${plant(palette)}${label("HERBARIUM", 150, 44, 12, palette.ink, 'letter-spacing="4"')}${label(`PL. ${vi + 1} · ${palette.name}`, 150, 324, 9, palette.ink, 'letter-spacing="1"')}`);
  });
});

const stampEmblems = [motifs.moth, motifs.rose, motifs.raven, motifs.key, motifs.moon];
palettes.forEach((palette, pi) => {
  stampEmblems.forEach((emblem, ei) => {
    const p = palette, w = 260, h = 320;
    let holes = "";
    for (let i = 0; i < 12; i++) {
      holes += `<circle cx="${16 + i * 19}" cy="10" r="7"/><circle cx="${16 + i * 19}" cy="${h - 10}" r="7"/>`;
      holes += `<circle cx="10" cy="${16 + i * 24}" r="7"/><circle cx="${w - 10}" cy="${16 + i * 24}" r="7"/>`;
    }
    add(`vx-stamp-${ei}-${palette.id}`, `${p.name} · ${["蛾邮", "玫瑰邮", "渡鸦邮", "钥匙邮", "月相邮"][ei]}`, "stamp", w, h, 34, p,
      `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="${p.bg}"/><g fill="${p.pale}">${holes}</g><rect x="24" y="24" width="${w - 48}" height="${h - 48}" fill="none" stroke="${p.gold}" stroke-width="2"/><rect x="36" y="36" width="${w - 72}" height="${h - 150}" fill="none" stroke="${p.ink}"/>${emblem(w / 2, 118, 38, p)}${label(`${p.name.toUpperCase()} POST`, w / 2, 216, 11, p.ink, 'letter-spacing="2"')}${label("1893", w / 2, 254, 20, p.accent)}${label("2d", w - 48, 286, 18, p.accent)}`);
  });
});

const medalRibbons = ["双垂带", "燕尾绶", "圆环扣", "缎面结", "长流苏"];
palettes.forEach((palette) => {
  medalRibbons.forEach((ribbon, mi) => {
    const p = palette, w = 300, h = 340;
    const ribbons = [
      `<path d="M112 20h34l-6 96-28-10Z" fill="${p.accent}"/><path d="M188 20h-34l6 96 28-10Z" fill="${p.pale}"/>`,
      `<path d="M104 22h44l-8 104-14-16-10 18Z" fill="${p.accent}"/><path d="M196 22h-44l8 104 14-16 10 18Z" fill="${p.pale}"/>`,
      `<circle cx="150" cy="52" r="30" fill="none" stroke="${p.gold}" stroke-width="7"/><path d="M150 82v48" stroke="${p.gold}" stroke-width="7"/>`,
      `<path d="M150 88q-50-40-74-8 0 36 42 26 20 24 32 8 12 16 32-8 42 10 42-26-24-32-74 8Z" fill="${p.accent}"/>`,
      `<path d="M122 26h56l-10 100h-36Z" fill="${p.accent}"/><path d="M124 126v58m52-58v58" stroke="${p.gold}" stroke-width="3"/>`,
    ][mi];
    add(`vx-medal-${mi}-${palette.id}`, `${p.name} · ${ribbon}勋章`, "medal", w, h, 30, p,
      `${ribbons}<circle cx="150" cy="204" r="104" fill="url(#rg)" stroke="${p.ink}" stroke-width="2"/><circle cx="150" cy="204" r="92" fill="${p.bg}"/><circle cx="150" cy="204" r="88" fill="none" stroke="${p.gold}" stroke-width="2"/><circle cx="150" cy="204" r="78" fill="none" stroke="${p.pale}" stroke-width="1"/>${motifsFor(mi)(150, 194, 40, p)}${label("KEEPSAKE", 150, 272, 10, p.ink, 'letter-spacing="2"')}${label("MCM", 150, 292, 9, p.accent, 'letter-spacing="3"')}`);
  });
});

const bows = [
  (p) => `<path d="M150 160q-96-84-124-28-8 58 76 62-84 4-76 62 28 56 124-28 96 84 124 28 8-58-76-62 84-4 76-62-28-56-124 28Z" fill="${p.accent}" stroke="${p.ink}" stroke-width="2"/><rect x="134" y="130" width="32" height="62" rx="8" fill="${p.gold}"/>`,
  (p) => `<path d="M150 160q-80-66-112-14 6 48 76 48-70 6-60 58 44 40 96-10 52 50 96 10 10-52-60-58 70 0 76-48-32-52-112 14Z" fill="${p.accent}"/>`,
  (p) => `<path d="M20 90h260v60H20Z" fill="${p.accent}"/><path d="M150 150l-24 96 24-22 24 22Z" fill="${p.accent}"/><path d="M34 100h232M34 140h232" stroke="${p.pale}" opacity=".6"/>`,
  (p) => `<path d="M150 160q-70-60-96-18 0 40 52 48-30 20 4 42 32 20 40-8 8 28 40 8 34-22 4-42 52-8 52-48-26-42-96 18Z" fill="${p.accent}" stroke="${p.gold}" stroke-width="2"/><circle cx="150" cy="160" r="14" fill="${p.gold}"/>`,
  (p) => `<path d="M20 80q130-40 260 0v60q-130-40-260 0Z" fill="${p.accent}"/><path d="M40 140q110-30 220 0v26q-110-30-220 0Z" fill="${p.pale}"/>${label("SOUVENIR", 150, 100, 18, p.bg, 'letter-spacing="4"')}`,
];
palettes.forEach((palette) => {
  bows.forEach((bow, bi) => {
    add(`vx-ribbon-${bi}-${palette.id}`, `${palette.name} · ${["缎带结", "蝶形结", "束带", "丝绒玫瑰结", "双叠缎带"][bi]}`, "ribbon", 320, 260, 49, palette,
      `${bow(palette)}<path d="M30 236q52-16 120 0" stroke="${palette.gold}" stroke-width="1.4" fill="none"/>`);
  });
});

const scenes = ["山湖", "花园", "旧城", "海岸", "雪夜"];
palettes.forEach((palette) => {
  scenes.forEach((scene, si) => {
    const p = palette, w = 340, h = 220;
    const art = [
      `<path d="M0 138 70 70l56 54 42-40 64 62 108-46v92H0Z" fill="${p.pale}"/><path d="M0 164q86-16 170 0t170 0v56H0Z" fill="${p.accent}" opacity=".55"/>`,
      `<path d="M0 176q60-42 130-12t210-16v72H0Z" fill="${p.pale}"/><path d="M24 176v-46m0 16q-18-16-28 0m28-14q16-18 28 0" stroke="${p.accent}" stroke-width="4" fill="none"/>`,
      `<path d="M20 172h300v48H20Z" fill="${p.pale}"/><path d="M40 172V96h50v76m30 0V70h62v102m30 0V108h58v64" fill="none" stroke="${p.ink}" stroke-width="3"/>`,
      `<path d="M0 154h340v66H0Z" fill="${p.accent}" opacity=".6"/><path d="M84 154V92h36v62m-18-62v62m0-30h-40" stroke="${p.ink}" stroke-width="3"/><path d="M0 154q34-12 60 0m220 0q30-12 60 0" stroke="${p.pale}" stroke-width="2" fill="none"/>`,
      `<path d="M0 168h340v52H0Z" fill="${p.pale}"/><g fill="${p.bg}">${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${30 + i * 56}" cy="${40 + (i % 3) * 30}" r="17"/>`).join("")}</g><path d="M24 166V96h44v70m206 0V96h42v70" stroke="${p.ink}" stroke-width="3" fill="none"/>`,
    ][si];
    add(`vx-postcard-${si}-${palette.id}`, `${p.name} · ${scene}明信片`, "postcard", w, h, 62, p,
      `<rect x="4" y="4" width="${w - 8}" height="${h - 8}" fill="${p.bg}" stroke="${p.gold}" stroke-width="2"/><g>${art}</g><rect x="18" y="18" width="${w - 36}" height="${h - 36}" fill="none" stroke="${p.pale}"/><path d="M18 152h306" stroke="${p.pale}"/>${label(`SOUVENIR · ${scene}`, w / 2, 178, 12, p.ink, 'letter-spacing="2"')}${label("CARTE POSTALE", w / 2, 198, 9, p.accent, 'letter-spacing="3"')}`);
  });
});

const plates = [
  (p) => `<g fill="${p.pale}" stroke="${p.ink}" stroke-width="1">${[0, 1, 2, 3, 4].map(i => `<circle cx="${150}" cy="${200 + i * 30}" r="${34 - i * 3}"/>`).join("")}</g><path d="M150 100v300" stroke="${p.accent}" stroke-width="1"/>`,
  (p) => `<circle cx="150" cy="185" r="110" fill="none" stroke="${p.gold}" stroke-width="2"/><g fill="${p.pale}" stroke="${p.ink}"><ellipse cx="150" cy="185" rx="30" ry="64"/><ellipse cx="150" cy="120" rx="30" ry="26"/></g><path d="M120 140q-40-30-52-70m112 70q40-30 52-70" stroke="${p.accent}" stroke-width="2" fill="none"/>`,
  (p) => `<path d="M150 330V110" stroke="${p.accent}" stroke-width="3"/><g fill="${p.pale}" stroke="${p.ink}"><path d="M150 150q-60-8-58-56 52 0 58 56Z"/><path d="M150 150q60-8 58-56-52 0-58 56Z"/><path d="M150 220q-48-4-44-44 40 4 44 44Z"/><path d="M150 220q48-4 44-44-40 4-44 44Z"/></g><circle cx="150" cy="94" r="16" fill="${p.accent}"/>`,
  (p) => `<path d="M150 300q-60-40-70-90 40-50 70-60 30 10 70 60-10 50-70 90Z" fill="${p.pale}" stroke="${p.ink}" stroke-width="2"/><path d="M150 300V150m0 40-32-24m32 52 34-26" stroke="${p.accent}" stroke-width="2" fill="none"/>`,
  (p) => `<circle cx="150" cy="190" r="92" fill="none" stroke="${p.gold}" stroke-width="3"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => `<path d="M${150 + Math.sin(i * Math.PI / 6) * 82} ${190 - Math.cos(i * Math.PI / 6) * 82}l${-Math.sin(i * Math.PI / 6) * 10} ${Math.cos(i * Math.PI / 6) * 10}" stroke="${p.ink}" stroke-width="2"/>`).join("")}<path d="M150 190l-30-50m30 50 48-16" stroke="${p.accent}" stroke-width="3"/>`,
];
palettes.forEach((palette) => {
  plates.forEach((plate, pi) => {
    add(`vx-illustration-${pi}-${palette.id}`, `${palette.name} · ${["月相图版", "蝶类图谱", "植物图版", "解剖心图", "钟表图版"][pi]}`, "illustration", 300, 380, 46, palette,
      `<rect x="8" y="8" width="284" height="364" fill="${palette.bg}" stroke="${palette.gold}"/><rect x="18" y="18" width="264" height="344" fill="none" stroke="${palette.pale}"/>${label("PLATE", 150, 46, 10, palette.ink, 'letter-spacing="3"')}${plate(palette)}${label("FROM THE PRIVATE COLLECTION", 150, 348, 7.5, palette.ink, 'letter-spacing="1"')}`);
  });
});

const tapePatterns = [
  (p) => `${label("· KEEP · THIS · MOMENT ·", 180, 42, 16, p.ink, 'letter-spacing="2"')}`,
  (p) => `${[0, 1, 2, 3, 4, 5, 6, 7].map(i => star(24 + i * 44, 36, 9, p.gold)).join("")}`,
  (p) => `${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<ellipse cx="${22 + i * 40}" cy="36" rx="11" ry="18" fill="none" stroke="${p.accent}" stroke-width="1.6"/>`).join("")}`,
  (p) => `${[0, 1, 2, 3, 4, 5].map(i => `<circle cx="${36 + i * 58}" cy="36" r="20" fill="none" stroke="${p.pale}" stroke-width="2"/><circle cx="${36 + i * 58}" cy="36" r="8" fill="${p.accent}"/>`).join("")}`,
  (p) => `<path d="M0 18h360M0 54h360" stroke="${p.gold}" stroke-width="1"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => `<path d="M${12 + i * 36} 18q9 18 18 0" stroke="${p.accent}" stroke-width="1.4" fill="none"/>`).join("")}`,
];
palettes.forEach((palette) => {
  tapePatterns.forEach((tape, ti) => {
    add(`vx-tape-${ti}-${palette.id}`, `${palette.name} · ${["铅字胶带", "星芒胶带", "羽纹胶带", "蕾丝胶带", "弧线胶带"][ti]}`, "tape", 360, 72, 55, palette,
      `<rect width="360" height="72" fill="${palette.bg}" opacity=".92"/>${tape(palette)}<path d="M4 4h352" stroke="${palette.pale}" stroke-width="1"/>`);
  });
});

const objects = [
  (p) => `<circle cx="150" cy="190" r="104" fill="url(#rg)" stroke="#5c472a" stroke-width="3"/><circle cx="150" cy="190" r="90" fill="${p.bg}"/><circle cx="150" cy="190" r="84" fill="none" stroke="${p.gold}"/><path d="M150 130v60l40 22" stroke="${p.ink}" stroke-width="5" stroke-linecap="round"/><circle cx="150" cy="190" r="7" fill="${p.gold}"/><rect x="136" y="44" width="28" height="26" rx="5" fill="url(#lg)"/><path d="M150 20v18" stroke="${p.gold}" stroke-width="8"/>`,
  (p) => `<ellipse cx="150" cy="200" rx="86" ry="106" fill="url(#lg)" stroke="#6a4f2a" stroke-width="3"/><ellipse cx="150" cy="200" rx="70" ry="90" fill="${p.bg}"/><ellipse cx="150" cy="200" rx="62" ry="82" fill="none" stroke="${p.pale}"/><path d="M150 120v72l30 26" stroke="${p.ink}" stroke-width="4"/><circle cx="150" cy="122" r="9" fill="${p.gold}"/><path d="M150 60q-30-30-8-48 26 14 8 48Z" fill="${p.accent}"/>`,
  (p) => `<g transform="rotate(-24 150 200)" fill="none" stroke="${p.gold}" stroke-width="14"><ellipse cx="150" cy="120" rx="44" ry="54"/><path d="M150 174v150m0-40h54m-40 0v40m-40-40H74"/></g><circle cx="150" cy="120" r="17" fill="${p.bg}" stroke="${p.ink}" stroke-width="3"/>`,
  (p) => `<path d="M120 96h60v34q38 34 40 100v70H80v-70q2-66 40-100Z" fill="${p.pale}" stroke="${p.ink}" stroke-width="3"/><rect x="94" y="218" width="112" height="52" fill="${p.accent}" opacity=".8"/><path d="M120 96V70h60v26" fill="none" stroke="${p.gold}" stroke-width="8"/><path d="M100 148q50-16 100 0" stroke="${p.pale}" stroke-width="2" fill="none"/>`,
  (p) => `<ellipse cx="150" cy="200" rx="88" ry="112" fill="url(#lg)" stroke="#6a4f2a" stroke-width="3"/><ellipse cx="150" cy="200" rx="74" ry="98" fill="${p.bg}" stroke="${p.pale}"/><path d="M150 116v168M96 200h108" stroke="${p.gold}" stroke-width="1.6" opacity=".7"/><path d="M150 260q-30-30-4-46 24 16 4 46Z" fill="${p.accent}" opacity=".65"/><rect x="142" y="74" width="16" height="24" fill="${p.gold}"/>`,
];
palettes.forEach((palette) => {
  objects.forEach((object, oi) => {
    add(`vx-object-${oi}-${palette.id}`, `${palette.name} · ${["怀表", "浮雕挂坠", "黄铜钥匙", "药剂瓶", "手镜"][oi]}`, "decoration", 300, 340, 32, palette,
      `${object(palette)}<ellipse cx="150" cy="316" rx="76" ry="12" fill="#3a2c1c" opacity=".12"/>`);
  });
});

const arcanaPalette = { style: "arcana" };
const arcanaStars = Array.from({ length: 34 }, (_, i) => {
  const x = 57 + (i * 83) % 186, y = 102 + (i * 127) % 208;
  return i % 6 ? `<circle cx="${x}" cy="${y}" r="${i % 4 ? .75 : 1.35}" fill="#f7e5bc" opacity=".85"/>` : star(x, y, 3, "#f6e8ca");
}).join("");
function arcanaScene(kind, trim) {
  const spires = (fill, y) => `<path d="M47 309V${y + 25}h14v-34l10-24 10 24v34h16v-53l12-29 12 29v53h20v-70l13-32 13 32v70h15v-43l10-22 10 22v43h17v-28h18v100Z" fill="${fill}"/><path d="M71 ${y-9}v-22m83-7v-22m45 38v-18" stroke="${trim}" stroke-width="1.1"/><g fill="${trim}" opacity=".65"><path d="M66 ${y+54}h8v17h-8Zm40 7h8v14h-8Zm46 15h8v17h-8Zm43-9h8v14h-8Z"/></g>`;
  if (kind === "academy") return `${spires("#273250", 224)}<path d="M47 299q50-20 97 2 52-20 108 4v52H47Z" fill="#1d2841"/><path d="M146 274q-18-19-35-2m81-5q-15-13-26 0" fill="none" stroke="${trim}" stroke-width="1" opacity=".7"/>`;
  if (kind === "moonlake") return `<circle cx="150" cy="186" r="47" fill="#f7e9cf" opacity=".92"/><path d="M47 267q38-48 80-29 38-35 81-11 22-8 44 17v90H47Z" fill="#32445e"/><path d="M47 289q34-11 65 0 45-13 82 1 30-8 58-2M56 302q48 8 88 0t95 2m-160 15q32-9 61 0m38 2q23-11 52 0" fill="none" stroke="${trim}" opacity=".5" stroke-width="1.4"/><path d="M176 272q11-16 22-11m-20 12 8 10" fill="none" stroke="#e8d9c1" stroke-width="1.4"/>`;
  if (kind === "kingdom") return `${spires("#596e91", 230)}<path d="M47 315q40-24 88-4 52-14 117 5v33H47Z" fill="#a3a6bc"/><path d="M67 285Q92 258 117 287m50-12q24-29 51 2" fill="none" stroke="#e3c7bd" stroke-width="3" opacity=".8"/>`;
  if (kind === "botanical") return `<path d="M150 134q-70 55 0 151 69-99 0-151Z" fill="#997a93" stroke="${trim}" stroke-width="2"/><path d="M150 157q-48 51 0 105 47-55 0-105Z" fill="#e9b1c0"/><path d="M151 183v115M151 233q-41-60-63-52m63 77q39-65 63-73" fill="none" stroke="#e9dfb9" stroke-width="2"/><path d="M89 181q31 13 43 45-35-1-43-45Zm123 3q-28 16-41 44 32-1 41-44ZM99 249q35 2 40 26-26 7-40-26Zm104 0q-31 4-37 26 28 6 37-26Z" fill="#a6b797" stroke="#ead9ad" stroke-width="1"/><g fill="#f7e7cd">${[0,1,2,3,4].map(i => `<circle cx="${122 + i*14}" cy="${202 + (i%2)*11}" r="2"/>`).join("")}</g>`;
  if (kind === "astronomy") return `<circle cx="150" cy="220" r="70" fill="none" stroke="${trim}" stroke-width="1.7"/><circle cx="150" cy="220" r="55" fill="none" stroke="${trim}" opacity=".8"/><ellipse cx="150" cy="220" rx="94" ry="25" transform="rotate(-25 150 220)" fill="none" stroke="${trim}" stroke-width="1.6"/><circle cx="150" cy="220" r="34" fill="#d3b1a4"/><path d="M126 225q28-36 51-13" fill="none" stroke="#f2ddbd" stroke-width="2"/><circle cx="77" cy="242" r="9" fill="#f6ddb1"/><circle cx="221" cy="188" r="7" fill="#a5a9cf"/>${star(150, 126, 14, trim)}${star(151, 315, 10, trim)}`;
  return `<path d="M57 292q17-86 93-91 77 4 93 91Z" fill="#364767" stroke="${trim}" stroke-width="1.5"/><path d="M73 294q19-62 77-67 60 5 78 67M150 225v83m-61-66 40 70m83-70-42 70" fill="none" stroke="${trim}" stroke-width="1.4"/><circle cx="150" cy="170" r="34" fill="#f4d5b8" opacity=".88"/><path d="M83 276q25-9 48 0m39 0q22-9 48 0" fill="none" stroke="#e9cfa8" stroke-width="2"/>`;
}
function arcanaCover({ title, sub, kind, bg, sky, accent, ink = "#e9d5af" }) {
  const ornaments = [[20,20,1,1],[280,20,-1,1],[20,410,1,-1],[280,410,-1,-1]].map(([x,y,sx,sy]) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" fill="none" stroke="${ink}" stroke-width="1.45"><path d="M0 53Q0 0 53 0M5 43Q11 24 26 27Q31 36 14 34m7-26q18 2 13 17Q20 29 21 8"/><circle cx="5" cy="5" r="2" fill="${ink}"/></g>`).join("");
  return `<defs><linearGradient id="arcSky" x2=".35" y2="1"><stop stop-color="${sky}"/><stop offset=".58" stop-color="${accent}"/><stop offset="1" stop-color="${bg}"/></linearGradient><clipPath id="arcWindow"><path d="M47 337V153Q47 88 150 83Q253 88 253 153V337Z"/></clipPath></defs><rect x="8" y="5" width="284" height="420" rx="3" fill="${bg}" stroke="${ink}" stroke-width="1.7"/><rect x="15" y="12" width="270" height="406" fill="none" stroke="${ink}" opacity=".9" stroke-width="1.4"/><rect x="24" y="21" width="252" height="388" fill="none" stroke="${ink}" opacity=".55" stroke-width=".8"/>${ornaments}<path d="M50 339V151Q50 91 150 86Q250 91 250 151V339Z" fill="url(#arcSky)" stroke="${ink}" stroke-width="2"/><g clip-path="url(#arcWindow)">${arcanaStars}${arcanaScene(kind, ink)}</g><path d="M43 341h214m-205 4h196M47 338V153Q47 88 150 83Q253 88 253 153V338" fill="none" stroke="${ink}" stroke-width="2"/><path d="M62 154q8-55 88-60 81 5 88 60" fill="none" stroke="${ink}" stroke-width=".8" opacity=".8"/><circle cx="150" cy="74" r="9" fill="${bg}" stroke="${ink}"/>${star(150,74,6,ink)}<rect x="38" y="350" width="224" height="46" fill="${bg}" stroke="${ink}" stroke-width="1.1"/>${label(title,150,372,kind === "astronomy" ? 13 : 15,ink,'letter-spacing="1.5"')}${label(sub,150,389,7,ink,'letter-spacing="2"')}${star(47,373,5,ink)}${star(253,373,5,ink)}<path d="M109 403h82" stroke="${ink}" opacity=".75"/><circle cx="150" cy="403" r="2" fill="${ink}"/>`;
}
const arcanaCovers = [
  { id: "academy", name: "午夜学院封面", title: "THE MIDNIGHT ACADEMY", sub: "A STORY OF STARS & SECRETS", kind: "academy", bg: "#243150", sky: "#405b88", accent: "#ab7f99", category: "sticker" },
  { id: "moonlake", name: "月湖夜歌封面", title: "SONGS OF THE MOON", sub: "A MIDNIGHT TALE", kind: "moonlake", bg: "#353453", sky: "#555b91", accent: "#a987a4", category: "sticker" },
  { id: "kingdom", name: "云端古城封面", title: "THE WANDERING KINGDOM", sub: "VOL. I · BEYOND THE CLOUDS", kind: "kingdom", bg: "#36446a", sky: "#546fa5", accent: "#cf9dba", category: "sticker" },
  { id: "botanical", name: "玫瑰秘境封面", title: "THE ENCHANTED GARDEN", sub: "BOTANICAL CHRONICLES", kind: "botanical", bg: "#493e59", sky: "#795e82", accent: "#d79faf", category: "illustration" },
  { id: "astronomy", name: "星辰观测手册", title: "THE CELESTIAL ATLAS", sub: "FIELD NOTES · MMXXIV", kind: "astronomy", bg: "#253b59", sky: "#355780", accent: "#827c9d", category: "illustration" },
  { id: "tower", name: "钟楼月光寓言", title: "THE CLOCKTOWER TALES", sub: "AN EVENING IN LONDON", kind: "tower", bg: "#334660", sky: "#425d87", accent: "#b9899c", category: "sticker" },
];
for (const cover of arcanaCovers) add(`arcana-cover-${cover.id}`, cover.name, cover.category, 300, 430, 43, arcanaPalette, arcanaCover(cover));

const arcanaMini = [
  ["moon-ticket", "月光列车票", `<rect x="14" y="37" width="272" height="186" rx="5" fill="#eadbc1" stroke="#aa8555" stroke-width="2"/><rect x="23" y="47" width="254" height="166" rx="4" fill="none" stroke="#977749" stroke-width="1" stroke-dasharray="3 3"/><rect x="34" y="57" width="232" height="38" fill="#354f72"/>${label("THE MOONLIGHT EXPRESS",150,83,14,"#f2dfb7",'letter-spacing="1"')}<path d="M63 147h174m-175 44h175" stroke="#987b55" stroke-width="1"/>${label("LONDON  ·  AFTER DARK",150,131,10,"#655540",'letter-spacing="1"')}${label("PLATFORM  IX  ·  ONE WAY",150,181,10,"#655540",'letter-spacing="1"')}<circle cx="150" cy="151" r="9" fill="#b89060"/>`, 300, 260],
  ["wax-moon", "月相火漆徽章", `<circle cx="150" cy="148" r="111" fill="#704657" stroke="#e2bd8b" stroke-width="4"/><circle cx="150" cy="148" r="96" fill="none" stroke="#d7af80" stroke-width="2"/><circle cx="150" cy="148" r="82" fill="none" stroke="#d7af80" stroke-width="1" stroke-dasharray="3 5"/><circle cx="142" cy="143" r="44" fill="#efcf9e"/><circle cx="162" cy="132" r="39" fill="#704657"/>${[75,112,187,224].map(x=>star(x,146,8,"#efce9a")).join("")}${label("THE NIGHT SOCIETY",150,236,10,"#e7c69b",'letter-spacing="2"')}`, 300, 300],
  ["owl-note", "猫头鹰信使", `<path d="M53 280Q32 151 82 92l24 23Q150 72 194 115l24-23q50 59 29 188Q212 315 150 312Q88 315 53 280Z" fill="#dbceb4" stroke="#786e60" stroke-width="3"/><path d="M75 189Q52 232 54 277q37-2 61-47M225 189q23 43 21 88-37-2-61-47" fill="#b19e84" stroke="#776951" stroke-width="2"/><circle cx="112" cy="162" r="30" fill="#f1e4ca"/><circle cx="188" cy="162" r="30" fill="#f1e4ca"/><circle cx="113" cy="162" r="13" fill="#6b665d"/><circle cx="187" cy="162" r="13" fill="#6b665d"/><circle cx="116" cy="158" r="4" fill="#fff"/><circle cx="190" cy="158" r="4" fill="#fff"/><path d="m150 174-10 19 10 12 10-12Z" fill="#bb8958"/><path d="M107 241q43 31 86 0" fill="none" stroke="#907d6a" stroke-width="3"/><path d="M100 296l-6 38m106-38 7 38" stroke="#826942" stroke-width="5"/>`, 300, 360],
  ["key", "古金星辰钥匙", `<g fill="none" stroke="#a7804a" stroke-width="10" stroke-linejoin="round"><circle cx="149" cy="104" r="47"/><path d="M149 151v180h46v-24h-25v-22h25v-24h-25"/></g><circle cx="149" cy="104" r="32" fill="none" stroke="#e0c693" stroke-width="4"/>${star(149,104,20,"#c7a569")}<path d="M144 166v154" stroke="#e7cfa0" stroke-width="2"/>`, 300, 380],
  ["glass-vial", "星尘药剂瓶", `<defs><linearGradient id="arcPotion" x2="1" y2="1"><stop stop-color="#e4afc9"/><stop offset="1" stop-color="#5b6896"/></linearGradient></defs><rect x="130" y="35" width="40" height="43" rx="6" fill="#9f7750" stroke="#614a37" stroke-width="2"/><path d="M120 76h60v29q-8 12 12 27 32 26 30 102v75q-8 35-72 37-64-2-72-37v-75q-2-76 30-102 20-15 12-27Z" fill="#ecdece" stroke="#937c71" stroke-width="4"/><path d="M88 232q62 22 124 0v71q-4 32-62 33-58-1-62-33Z" fill="url(#arcPotion)"/><path d="M101 148q31-28 31-35m-29 90v75" fill="none" stroke="#fff" stroke-width="5" opacity=".5"/>${[114,138,168,192].map((x,i)=>star(x,278-i*16,8,"#fce8c1")).join("")}<rect x="94" y="260" width="112" height="43" rx="3" fill="#f2e5cb" stroke="#ae9069"/>${label("STARDUST",150,286,14,"#584866",'letter-spacing="1"')}`, 300, 380],
  ["constellation", "星象珐琅徽章", `<circle cx="150" cy="150" r="117" fill="#314768" stroke="#d0aa6d" stroke-width="6"/><circle cx="150" cy="150" r="101" fill="none" stroke="#d0aa6d"/><circle cx="150" cy="150" r="89" fill="none" stroke="#d0aa6d" stroke-dasharray="2 5"/>${[0,1,2,3,4,5].map(i=>{const a=i*Math.PI/3;return star(150+Math.cos(a)*64,150+Math.sin(a)*64,9,"#e5c391")}).join("")}<path d="M91 150l47-44 46 41-36 59-57-56Z" fill="none" stroke="#e7c99b" stroke-width="2"/>${star(150,150,20,"#f4dbac")}<circle cx="150" cy="150" r="5" fill="#415473"/>`, 300, 300],
];
for (const [id, name, body, w, h] of arcanaMini) add(`arcana-${id}`, name, "sticker", w, h, w === 300 && h > 300 ? 29 : 34, arcanaPalette, body);

const cards = [];
for (const kind of ["date", "diary"]) {
  const meta = CARD_KINDS[kind];
  for (let i = 0; i < meta.count; i++) {
    const palette = palettes[i % palettes.length];
    cards.push({
      id: `vx-${kind}-${i}`,
      name: cardName(kind, i),
      category: kind,
      w: meta.w,
      h: meta.h,
      width: kind === "date" ? 52 : 48,
      style: palette.style,
      cardKind: kind,
      cardStyle: i,
      placeholder: meta.placeholder,
      max: meta.max,
    });
  }
}

export const GENERATED_MATERIALS = [...generated, ...cards];
export const CARD_MATERIALS = cards;
