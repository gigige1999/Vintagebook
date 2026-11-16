const defs = `<defs><filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="3" stitchTiles="stitch" result="noise"/><feColorMatrix in="noise" type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope=".09"/></feComponentTransfer><feBlend in="SourceGraphic" mode="multiply"/></filter><filter id="ink"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="2" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale=".6"/></filter><linearGradient id="gold" x2=".85" y2="1"><stop stop-color="#dfc88b"/><stop offset=".4" stop-color="#b4975e"/><stop offset=".6" stop-color="#e0cb97"/><stop offset="1" stop-color="#8c703e"/></linearGradient><linearGradient id="silk" x2="0" y2="1"><stop stop-color="#b09a92"/><stop offset=".35" stop-color="#d5bfb3"/><stop offset=".6" stop-color="#b99e94"/><stop offset="1" stop-color="#967870"/></linearGradient><linearGradient id="petal" x2="1" y2="1"><stop stop-color="#c7a19b"/><stop offset=".55" stop-color="#b28581"/><stop offset="1" stop-color="#855955"/></linearGradient><linearGradient id="green" x2="1" y2="1"><stop stop-color="#9c9e76"/><stop offset="1" stop-color="#646d4d"/></linearGradient><radialGradient id="waxg"><stop stop-color="#a4594a"/><stop offset=".7" stop-color="#813d34"/><stop offset="1" stop-color="#a35a4b"/></radialGradient></defs>`;
export function escape(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
}
export function svgUrl(body, w = 300, h = 400) {
  const clean = body.replace(/\sfilter="url\(#(?:paper|ink)\)"/g, '');
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w * 4}" height="${h * 4}" viewBox="0 0 ${w} ${h}">${defs}${clean}</svg>`
  );
}
const text = (s, x, y, size = 12, color = "#695944", style = "") =>
  `<text x="${x}" y="${y}" font-family="Georgia,Songti SC,serif" font-size="${size}" fill="${color}" ${style}>${escape(s)}</text>`;
const leaf = (x, y, angle = 0, size = 1, color = "url(#green)") =>
  `<g transform="translate(${x} ${y}) rotate(${angle}) scale(${size})"><path d="M0 0C-34-17-40-52-12-83C18-65 27-28 0 0Z" fill="${color}" stroke="#616c4a" stroke-width=".7"/><path d="M0 0-12-73M-4-24l-18-19m17 8 15-13m-18-3-14-11m12 1 13-12" fill="none" stroke="#d4d0a2" stroke-width=".7" opacity=".65"/></g>`;
function rose() {
  return `<g filter="url(#ink)"><path d="M150 350C138 283 158 233 143 159" stroke="#6c7755" stroke-width="5" fill="none"/>${leaf(148, 278, -51, 0.75)}${leaf(148, 236, 68, 0.65)}${leaf(146, 205, -55, 0.43)}<g transform="translate(145 130)"><path d="m-8 40-24 23 21-5 17 7 3-24" fill="#727653"/><path d="M-3-57C-50-65-70-34-58-6C-74 14-51 47-24 45C-3 64 34 53 38 30C67 21 61-20 40-30C29-56 14-64-3-57Z" fill="url(#petal)" stroke="#926a65"/><path d="M-42-28C-28-39-9-45 4-22C20-44 40-29 41-12C26-21 5-6 5 8C-16-10-31 1-42-28Z" fill="#c9a3a0" stroke="#9f7771"/><path d="M-51 1C-33-9-15 7-9 27C-9 3 2-9 20-6C37-4 41 15 34 28C13 21 9 34-7 40C-26 44-43 26-51 1Z" fill="#be9690" stroke="#99716a"/><path d="M-3-24C-20-30-29-7-12 8C-8-5 11-10 17-2C18-19 6-29-3-24Z" fill="#ad7d79" stroke="#8e625d"/><path d="M-5-12C-16-9-10 2 0 3C12 1 8-10-5-12Z" fill="#976861"/><path d="M-53 13Q-38 42-21 39M18 41Q45 35 44 15M-29-41Q-7-50 5-39" stroke="#ead0bd" stroke-width="1" fill="none" opacity=".5"/></g></g>`;
}
function fern() {
  let s =
    '<path d="M148 371Q135 177 160 33" stroke="#687044" stroke-width="3" fill="none"/>';
  for (let i = 0; i < 16; i++) {
    let y = 347 - i * 19,
      l = 64 * (1 - i / 19);
    for (let side of [-1, 1]) {
      s += `<g transform="translate(${148 + i * 0.5} ${y})"><path d="M0 0Q${side * l * 0.6} -20 ${side * l} -42Q${side * l * 0.5} -23 0-3Z" fill="${i % 3 ? "#7c8455" : "#909564"}" stroke="#68754b" stroke-width=".6"/>`;
      for (let j = 1; j < 6; j++) {
        const xx = (side * l * j) / 6,
          yy = -j * 6;
        s += `<path d="M${xx} ${yy}l${side * 10} -14 -${side * 6} 17Z" fill="#869064"/>`;
      }
      s += "</g>";
    }
  }
  return `<g filter="url(#ink)">${s}</g>`;
}
function daisy() {
  let s =
    '<path d="M145 363Q181 229 153 120" stroke="#79815a" stroke-width="4" fill="none"/>' +
    leaf(157, 280, -68, 0.58) +
    leaf(162, 232, 65, 0.5);
  for (let i = 0; i < 16; i++) {
    let a = i * 22.5;
    s += `<ellipse cx="150" cy="73" rx="12" ry="48" fill="${i % 2 ? "#e8e0c6" : "#d9d1b7"}" stroke="#b4a58a" stroke-width=".7" transform="rotate(${a} 150 116)"/>`;
  }
  s += '<circle cx="150" cy="116" r="24" fill="#baa164" stroke="#9c834a"/>';
  for (let i = 0; i < 35; i++) {
    let a = i * 2.4,
      r = Math.sqrt(i) * 3.5;
    s += `<circle cx="${150 + Math.cos(a) * r}" cy="${116 + Math.sin(a) * r}" r="1.7" fill="#8b7647" opacity=".6"/>`;
  }
  return s;
}
function lavender() {
  let s = "";
  for (let j = 0; j < 4; j++) {
    let xx = 118 + j * 15;
    s += `<path d="M150 371Q${xx} 250 ${xx + (j - 1) * 8} ${70 + j * 17}" fill="none" stroke="#798065" stroke-width="2"/>`;
    for (let i = 0; i < 13; i++) {
      let y = 85 + i * 9 + j * 12,
        x = xx + (j - 1) * 8 * (1 - i / 15);
      s += `<ellipse cx="${x - 5}" cy="${y}" rx="5" ry="8" transform="rotate(-30 ${x - 5} ${y})" fill="${i % 2 ? "#898097" : "#a197a7"}" stroke="#77697f" stroke-width=".5"/><ellipse cx="${x + 4}" cy="${y - 3}" rx="4" ry="7" transform="rotate(25 ${x + 4} ${y - 3})" fill="#a39aa9"/>`;
    }
  }
  s +=
    leaf(146, 315, -50, 0.4, "#92977b") + leaf(147, 284, 65, 0.35, "#92977b");
  return s;
}
function butterfly(color = "#a88755", moth = false) {
  let s = `<g filter="url(#ink)"><path d="M148 152C94 56 11 46 23 125C26 158 57 174 110 183C38 160 35 204 64 237C93 275 132 234 150 186C170 236 204 267 236 236C273 199 254 158 190 183C239 167 275 139 270 102C262 47 191 67 152 152Z" fill="${color}" stroke="#564b39" stroke-width="2"/>`;
  for (const flip of [false, true]) {
    s += `<g ${flip ? 'transform="translate(300 0) scale(-1 1)"' : ""}><path d="M146 160 53 100M143 171 44 144M146 174 65 184M149 184 79 220M137 170Q87 97 39 104M137 179Q72 146 34 139" stroke="#5f513d" stroke-width="1.3" fill="none" opacity=".7"/><path d="M42 93Q71 61 119 122L130 152Q84 109 51 123Z" fill="#dfce9b" opacity=".5"/><circle cx="83" cy="123" r="21" fill="#574638"/><circle cx="83" cy="123" r="15" fill="${moth ? "#d8c7a0" : "#b89868"}"/><circle cx="83" cy="123" r="7" fill="#4d4537"/><circle cx="80" cy="120" r="3" fill="#d9cfad"/><path d="M63 207Q89 244 124 200" stroke="#d7c191" stroke-width="5" fill="none"/><path d="M31 107 44 125 33 145 58 160 64 178M63 219l17 9 15-9" stroke="#4c4536" stroke-width="5" fill="none"/>`;
    for (let i = 0; i < 6; i++)
      s += `<circle cx="${42 + i * 9}" cy="${83 + i * 3}" r="2.5" fill="#e6d9ba"/>`;
    s += "</g>";
  }
  return (
    s +
    `<path d="M148 143Q141 184 150 218Q159 184 152 143Z" fill="#504534"/><path d="M149 145Q143 122 130 116M153 145q8-27 23-32" fill="none" stroke="#504534" stroke-width="1.5"/></g>`
  );
}
function stamp(label, color, art = "rose", price = "5", wide = false) {
  const w = wide ? 280 : 220,
    h = wide ? 190 : 270;
  let border = "";
  for (let x = 8; x < w; x += 14) {
    border += `<circle cx="${x}" cy="4" r="4" fill="#f0e5cf"/><circle cx="${x}" cy="${h - 4}" r="4" fill="#f0e5cf"/>`;
  }
  for (let y = 8; y < h; y += 14) {
    border += `<circle cx="4" cy="${y}" r="4" fill="#f0e5cf"/><circle cx="${w - 4}" cy="${y}" r="4" fill="#f0e5cf"/>`;
  }
  let motif =
    art === "rose"
      ? `<g transform="translate(55 37) scale(.36)">${rose()}</g>`
      : art === "butterfly"
        ? `<g transform="translate(20 23) scale(.6)">${butterfly("#bfa17a")}</g>`
        : art === "ship"
          ? '<path d="M49 160h124l-25 28H75Z" fill="#d8c4a2"/><path d="M112 73v87M107 82l-44 68h44Zm12 8v59h44Z" fill="#d8c4a2" stroke="#eadabd"/><path d="M37 196q20-15 40 0t40 0t40 0t30 0" stroke="#ddc9a9" fill="none"/>'
          : '<path d="M35 159h148v25H35Zm12-8 7-40h116l6 40ZM76 111V81h68v30ZM86 80l23-41 24 41Z" fill="#dac7a8"/><path d="M37 158h144M109 46v131M59 128h14m15 0h14m17 0h14m15 0h14" stroke="#8e7b62"/>';
  return {
    w,
    h,
    body: `<g filter="url(#paper)"><rect x="3" y="3" width="${w - 6}" height="${h - 6}" fill="#e4d7bd"/>${border}<rect x="16" y="16" width="${w - 32}" height="${h - 32}" fill="${color}"/><rect x="23" y="24" width="${w - 46}" height="${h - 50}" fill="none" stroke="#ead6b3" stroke-width="1"/>${text(label, w / 2, wide ? 41 : 44, 13, "#f0dec0", 'text-anchor="middle" letter-spacing="2"')}${wide ? `<g transform="translate(30 -35)">${motif}</g>` : motif}${text(price, w - 40, h - 29, 27, "#eadabb", 'text-anchor="middle"')}${text("POSTES", w / 2, h - 22, 10, "#ecd9b8", 'text-anchor="middle" letter-spacing="2"')}</g>`,
  };
}
function noteSvg(value = "Les petits bonheurs", variant = 0) {
  const w = 360,
    h = variant === 2 ? 180 : 125;
  const torn =
    "M8 10 38 7 61 11 85 7 118 10 150 6 183 10 217 7 248 10 280 7 315 11 350 8 347 36 351 64 348 89 351 " +
    (h - 9) +
    " 324 " +
    (h - 7) +
    " 291 " +
    (h - 11) +
    " 257 " +
    (h - 8) +
    " 220 " +
    (h - 10) +
    " 188 " +
    (h - 7) +
    " 157 " +
    (h - 10) +
    " 121 " +
    (h - 8) +
    " 87 " +
    (h - 11) +
    " 52 " +
    (h - 8) +
    " 10 " +
    (h - 10) +
    " 12 69 8 42Z";
  let lines = value
    .split("\n")
    .flatMap((line) => {
      let arr = [],
        s = "";
      if (!/[\u4e00-\u9fff]/.test(line) && /\s/.test(line)) {
        for (const word of line.trim().split(/\s+/)) {
          if (s && (s + " " + word).length > 29) {
            arr.push(s);
            s = "";
          }
          s += (s ? " " : "") + word;
        }
        if (s) arr.push(s);
        return arr;
      }
      for (const c of line) {
        s += c;
        if (s.length >= (/[\u4e00-\u9fff]/.test(line) ? 14 : 29)) {
          arr.push(s);
          s = "";
        }
      }
      if (s) arr.push(s);
      return arr;
    })
    .slice(0, variant === 2 ? 5 : 3);
  return svgUrl(
    `<g filter="url(#paper)"><path d="${torn}" fill="${variant === 1 ? "#d7bf91" : "#e5d7b9"}"/><path d="M26 ${h - 26}h307" stroke="#a696771f"/>${lines.map((s, i) => text(s, w / 2, lines.length === 1 ? h / 2 + 8 : 35 + i * 28, variant === 2 ? 19 : 21, "#6c624b", 'text-anchor="middle" font-style="italic"')).join("")}</g>`,
    w,
    h,
  );
}
export function noteImage(value, variant = 0) {
  return noteSvg(value, variant);
}
function postcard(scene = "mountain") {
  let art =
    scene === "mountain"
      ? '<rect x="18" y="18" width="324" height="192" fill="#c2c2ad"/><path d="M18 158 90 48 159 129 229 61 342 174v36H18Z" fill="#868f7c"/><path d="m49 110 41-62 33 42-22-7-10 13-13-11Z" fill="#e4dfc8"/><path d="m179 121 50-60 38 37-19-6-15 9-12-8Z" fill="#e0dac2"/><path d="M18 184q100-23 154-2t170-4v32H18Z" fill="#aab8b0"/><path d="M18 199q87-14 180 0t144-3" stroke="#d4d7c5" stroke-width="1" fill="none"/>'
      : scene === "garden"
        ? '<rect x="18" y="18" width="324" height="192" fill="#b7bd9e"/><path d="M21 162q135-64 318 0v48H21Z" fill="#92967b"/><path d="M165 208q-6-54 10-114h25q-18 64 12 114" fill="#d0bea0"/><path d="M65 188V68m-30 119V85m260 102V65" stroke="#5d6651" stroke-width="7"/><ellipse cx="67" cy="72" rx="46" ry="49" fill="#7d8967"/><ellipse cx="298" cy="81" rx="35" ry="58" fill="#7e8a6b"/><path d="M124 100V76q55-54 111 0v24M123 101h111" stroke="#d8c9a8" stroke-width="5" fill="none"/><path d="M91 173h38v5H91Zm11 0v23m18-23v23" stroke="#5c6653" stroke-width="3"/>'
        : '<rect x="18" y="18" width="324" height="192" fill="#c7bca4"/><path d="M18 168h324v42H18Z" fill="#948473"/><path d="M45 83h48v87H45Zm69-33h61v119h-61Zm84 41h51v77h-51Zm70-39h54v118h-54Z" fill="#aa9580" stroke="#796e60"/><path d="m40 83 31-25 29 25m10-33 35-27 35 27m14 41 29-28 29 28m11-39 32-23 29 23" stroke="#807568" fill="#9e8b75"/><path d="M53 106h9v18h-9Zm19 0h9v18h-9Zm55-37h13v18h-13Zm21 0h13v18h-13Zm-20 30h13v17h-13Zm21 0h13v17h-13Zm60 13h11v17h-11Zm22 0h10v17h-10Zm53-40h11v17h-11Zm20 0h11v17h-11Z" fill="#5f6359"/><path d="M18 190h324" stroke="#d1c0a3" stroke-width="4"/>';
  return svgUrl(
    `<g filter="url(#paper)"><rect x="4" y="4" width="352" height="252" fill="#e3d5b7"/>${art}${text(scene === "mountain" ? "SOUVENIR DES ALPES" : scene === "garden" ? "LE JARDIN DES SOUVENIRS" : "UNE PROMENADE À PARIS", 180, 239, 12, "#766c56", 'text-anchor="middle" letter-spacing="2"')}</g>`,
    360,
    260,
  );
}
export const PHOTO_FRAMES = [
  {
    id: "polaroid",
    name: "奶油拍立得",
    description: "厚厚的留白，写给某个瞬间。",
  },
  {
    id: "ornate",
    name: "古董鎏金",
    description: "层叠金边与卷草，像一幅珍藏肖像。",
  },
  {
    id: "black",
    name: "黑边旧相片",
    description: "哑黑的边框，让回忆安静下来。",
  },
  {
    id: "oval",
    name: "椭圆肖像",
    description: "维多利亚式椭圆相框，适合人物与花。",
  },
  { id: "lace", name: "蕾丝花边", description: "奶油色花边，带着布艺的柔软。" },
  {
    id: "torn",
    name: "手撕旧纸",
    description: "不规则撕边，像从旧册子里取下的一页。",
  },
  {
    id: "botanical",
    name: "植物标本",
    description: "以枝叶装点，留住季节的颜色。",
  },
  {
    id: "postcard",
    name: "旅行明信片",
    description: "把照片变成一张寄给自己的明信片。",
  },
  {
    id: "film",
    name: "胶片记忆",
    description: "齿孔与深色片框，像一格旧电影。",
  },
  { id: "arcana-indigo", name: "午夜星象相框", description: "靛蓝封面、古金星图与私藏照片。" },
  { id: "arcana-rose", name: "玫瑰暮色相框", description: "复古粉紫天空与银金色装饰。" },
  { id: "arcana-ivory", name: "月光手稿相框", description: "奶油色书封与月相烫金花纹。" },
];
const magicFrameColors = {
  "arcana-indigo": { base: "#283754", trim: "#cfb275", glow: "#91a5cf", title: "THE STAR ATLAS" },
  "arcana-rose": { base: "#785873", trim: "#e2c59c", glow: "#e9b7bb", title: "A DUSK MEMORY" },
  "arcana-ivory": { base: "#e9dfc6", trim: "#8a744e", glow: "#c4b79b", title: "MOONLIT NOTES" },
};
function magicFrameDetails(frame) {
  const { base, trim, glow, title } = magicFrameColors[frame];
  const stars = Array.from({ length: 28 }, (_, i) => {
    const x = 21 + ((i * 79) % 258), y = 34 + ((i * 131) % 284);
    return `<circle cx="${x}" cy="${y}" r="${i % 5 ? 1.1 : 2.2}" fill="${trim}" opacity=".76"/>`;
  }).join("");
  const corners = [[26, 26, 1, 1], [274, 26, -1, 1], [26, 324, 1, -1], [274, 324, -1, -1]].map(([x, y, sx, sy]) => `<g transform="translate(${x} ${y}) scale(${sx} ${sy})" fill="none" stroke="${trim}" stroke-width="1.8"><path d="M0 54Q0 0 54 0M5 43Q18 23 35 23Q27 39 12 28M15 8Q32 8 37 20Q20 23 15 8"/><circle cx="5" cy="5" r="2" fill="${trim}"/></g>`).join("");
  return { base, trim, glow, title, stars, corners };
}
export function photoImage(photo = "", frame = "polaroid") {
  const w = 300,
    h = 350;
  if (!PHOTO_FRAMES.some((f) => f.id === frame)) frame = "polaroid";
  let inner =
    magicFrameColors[frame]
      ? 42
      : frame === "ornate"
      ? 30
      : frame === "film"
        ? 38
        : frame === "lace" || frame === "botanical"
          ? 35
          : 20;
  let top = magicFrameColors[frame] ? 93 : frame === "postcard" ? 49 : inner;
  let bottom = magicFrameColors[frame] ? 66 : frame === "polaroid" || frame === "postcard" ? 66 : inner;
  let bw = w - inner * 2,
    bh = h - top - bottom;
  let s = '<g filter="url(#paper)">';
  const border =
    frame === "ornate" || frame === "oval"
      ? "url(#gold)"
      : frame === "black" || frame === "film"
        ? "#423e36"
        : "#e6ddc9";
  if (magicFrameColors[frame]) {
    const { base, trim, glow, stars, corners } = magicFrameDetails(frame);
    s += `<rect x="9" y="7" width="282" height="336" rx="4" fill="${base}" stroke="${trim}" stroke-width="2"/><rect x="16" y="14" width="268" height="322" rx="2" fill="none" stroke="${trim}" opacity=".85"/><rect x="24" y="22" width="252" height="306" fill="none" stroke="${trim}" opacity=".7" stroke-width=".7"/><path d="M119 41Q150 14 181 41" fill="none" stroke="${trim}" stroke-width="1.7"/><circle cx="150" cy="48" r="20" fill="none" stroke="${trim}"/><circle cx="158" cy="44" r="18" fill="${base}"/><path d="M150 72v8m-6-4h12" stroke="${trim}"/><path d="M64 305q86 33 172 0" fill="none" stroke="${trim}" stroke-width="1.2"/>${stars}${corners}<rect x="37" y="88" width="226" height="204" fill="${glow}" opacity=".47" stroke="${trim}" stroke-width="3"/>`;
  } else if (frame === "oval") {
    inner = 48;
    top = 42;
    bw = 204;
    bh = 266;
    s +=
      '<ellipse cx="150" cy="175" rx="134" ry="169" fill="url(#gold)" stroke="#80663c" stroke-width="2"/><ellipse cx="150" cy="175" rx="123" ry="157" fill="none" stroke="#e2cb96" stroke-width="3"/><ellipse cx="150" cy="175" rx="114" ry="147" fill="none" stroke="#7f6438" stroke-width="3"/>';
  } else if (frame === "torn") {
    s +=
      '<path d="M8 15 47 9 69 15 98 8 132 13 158 8 181 16 218 8 247 13 291 8 288 51 293 73 288 101 294 134 287 160 291 190 286 224 293 252 288 286 293 339 261 333 237 341 200 336 174 342 145 335 111 342 79 336 48 343 10 338 15 310 8 277 14 253 7 225 12 196 8 163 14 130 8 102 14 73 8 42Z" fill="#ded0b3"/>';
  } else {
    if (frame === "lace") {
      for (let y = 18; y < h; y += 16)
        s += `<circle cx="16" cy="${y}" r="11" fill="#ede4cf"/><circle cx="284" cy="${y}" r="11" fill="#ede4cf"/>`;
      for (let x = 18; x < w; x += 16)
        s += `<circle cx="${x}" cy="16" r="11" fill="#ede4cf"/><circle cx="${x}" cy="334" r="11" fill="#ede4cf"/>`;
    }
    s += `<rect x="12" y="12" width="276" height="326" rx="${frame === "lace" ? 8 : 1}" fill="${border}"/>`;
  }
  if (frame === "ornate") {
    s +=
      '<rect x="16" y="16" width="268" height="318" fill="none" stroke="#dfc795" stroke-width="3"/><rect x="24" y="24" width="252" height="302" fill="none" stroke="#715b33" stroke-width="3"/>';
    for (const [x, y, a] of [
      [18, 18, 0],
      [282, 18, 90],
      [282, 332, 180],
      [18, 332, 270],
    ])
      s += `<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 36Q0 0 36 0M8 32Q4 6 30 8M12 19q13-15 10-3t-10 3" fill="none" stroke="#ddc591" stroke-width="1.5"/></g>`;
  }
  if (frame === "lace")
    s +=
      '<rect x="25" y="25" width="250" height="300" fill="none" stroke="#b6a687" stroke-width="1" stroke-dasharray="2 3"/>';
  if (frame === "postcard")
    s += text(
      "CARTE POSTALE",
      150,
      34,
      12,
      "#958062",
      'text-anchor="middle" letter-spacing="3"',
    );
  const clip =
    frame === "oval"
      ? '<ellipse cx="150" cy="175" rx="102" ry="133"/>'
      : `<rect x="${inner}" y="${top}" width="${bw}" height="${bh}"/>`;
  s += `<defs><clipPath id="photoclip">${clip}</clipPath></defs><g clip-path="url(#photoclip)"><rect x="${inner}" y="${top}" width="${bw}" height="${bh}" fill="#c9c2af"/>`;
  if (photo)
    s += `<image href="${escape(photo)}" x="${inner}" y="${top}" width="${bw}" height="${bh}" preserveAspectRatio="xMidYMid slice"/>`;
  else
    s += `<path d="M40 226 119 133 176 189 220 151 270 225Z" fill="#9da28e" opacity=".65"/><circle cx="211" cy="98" r="22" fill="#e3d6b9"/>${text("your little memory", 150, 256, 14, "#827b66", 'text-anchor="middle" font-style="italic"')}`;
  s += "</g>";
  if (magicFrameColors[frame]) {
    const { trim, base, title } = magicFrameDetails(frame);
    s += `<rect x="40" y="91" width="220" height="198" fill="none" stroke="${trim}" stroke-width="3"/><rect x="45" y="96" width="210" height="188" fill="none" stroke="${trim}" opacity=".65"/><path d="M96 302h28m52 0h28" stroke="${trim}" stroke-width="1.3"/>${text(title, 150, 312, 12, trim, 'text-anchor="middle" letter-spacing="1.5"')}${text("THE KEEPSAKE SOCIETY · 1897", 150, 328, 6.5, trim, 'text-anchor="middle" letter-spacing="1"')}<circle cx="150" cy="303" r="2" fill="${base}"/>`;
  }
  if (frame === "polaroid" || frame === "postcard")
    s += text(
      frame === "polaroid" ? "a moment to keep" : "a postcard to myself",
      150,
      321,
      15,
      "#9d8e73",
      'text-anchor="middle" font-style="italic"',
    );
  if (frame === "botanical")
    s += `<path d="M21 300Q5 171 25 62m254 236q20-116-4-235" stroke="#879176" stroke-width="1" fill="none"/>${[90, 130, 170, 210, 250].map((y, i) => leaf(23, y, i % 2 ? -45 : 70, 0.24, "#a0a78d") + leaf(279, y, i % 2 ? -70 : 45, 0.24, "#a0a78d")).join("")}${text("HERBARIUM · MEMORIES", 150, 325, 9, "#8b947b", 'text-anchor="middle" letter-spacing="1"')}`;
  if (frame === "film")
    for (let y = 25; y < 325; y += 26)
      s += `<rect x="18" y="${y}" width="10" height="14" rx="2" fill="#d0c7af"/><rect x="272" y="${y}" width="10" height="14" rx="2" fill="#d0c7af"/>`;
  return svgUrl(s + "</g>", w, h);
}
function ribbon(color = "#a27770", bow = false) {
  if (bow)
    return svgUrl(
      `<g filter="url(#paper)"><path d="M143 94Q69 14 20 39Q-4 97 70 128L145 102Q69 165 44 207l44-9 20 20q8-66 48-111q29 65 48 111l18-24 35 11q-35-73-96-105q79 31 128-20q4-67-67-49l-66 62" fill="${color}" stroke="#8f6b61" stroke-width="1.5"/><path d="M136 92Q83 50 41 49M136 100 42 102m117-5 97-42m-98 54 97-18M146 109l-59 80m72-80 60 78" stroke="#e8c8b4" stroke-width="3" opacity=".35" fill="none"/><rect x="136" y="80" width="27" height="34" rx="6" fill="${color}" stroke="#8e6d60"/><path d="M144 83v28" stroke="#dfbdab" opacity=".6"/></g>`,
      300,
      235,
    );
  return svgUrl(
    `<g filter="url(#paper)"><path d="M5 29 33 11h285l35 19-27 19 27 21H32L4 49 28 40Z" fill="${color}"/><path d="M35 14h286M35 66h286" stroke="#dfc7ab" stroke-width="1" opacity=".7"/><path d="M33 12v56m291-56v56" stroke="#735c49" stroke-width="1" opacity=".6"/>${text("souvenirs précieux", 178, 47, 19, "#f0d8b8", 'text-anchor="middle" font-style="italic"')}</g>`,
    360,
    80,
  );
}
function tape(color, pattern = 0) {
  let s = `<path d="M6 10 35 8 41 12 70 8 118 11 157 8 181 12 220 8 271 12 295 8 291 26 296 43 290 61 244 64 201 61 161 65 116 61 77 64 38 61 7 65 11 45 5 28Z" fill="${color}" fill-opacity=".75"/>`;
  if (pattern === 1) {
    for (let i = 15; i < 300; i += 17)
      s += `<path d="M${i} 11v51" stroke="#a59c7c" opacity=".38"/>`;
    for (let i = 17; i < 63; i += 12)
      s += `<path d="M8 ${i}h284" stroke="#a59c7c" opacity=".38"/>`;
  }
  if (pattern === 2)
    for (let i = 24; i < 290; i += 28)
      s += `<g transform="translate(${i} 35) scale(.16)">${leaf(0, 0, 30)}</g>`;
  return svgUrl(`<g filter="url(#paper)">${s}</g>`, 300, 72);
}
function medal(kind = 0) {
  return svgUrl(
    `<g filter="url(#paper)"><path d="M58 30h39l16 109-25-12-19 23Z" fill="${kind ? "#536479" : "#965a57"}"/><path d="M101 30h39l-11 120-21-23-23 12Z" fill="${kind ? "#728494" : "#b67e74"}"/><path d="m67 32 12 105m52-105-11 100" stroke="#d5c298" stroke-width="2"/><circle cx="100" cy="163" r="60" fill="url(#gold)" stroke="#8b733f" stroke-width="2"/><circle cx="100" cy="163" r="49" fill="none" stroke="#ead7a4" stroke-width="2"/><circle cx="100" cy="163" r="44" fill="none" stroke="#8e7645"/><path d="m100 132 8 21 23 1-19 14 6 23-18-13-19 13 6-23-19-14 24-1Z" fill="#b08f50" stroke="#e0c58a" stroke-width="1.5"/>${text(kind ? "1893" : "MERIT", 100, 205, 8, "#816b3d", 'text-anchor="middle" letter-spacing="2"')}</g>`,
    200,
    240,
  );
}
function lace() {
  let s = '<path d="M5 38h350v36H5Z" fill="#ded3b8"/>';
  for (let x = 15; x < 352; x += 21)
    s += `<g><circle cx="${x}" cy="37" r="17" fill="#e8dfc9"/><circle cx="${x}" cy="75" r="17" fill="#e8dfc9"/><circle cx="${x}" cy="37" r="8" fill="none" stroke="#ab9b7c" stroke-width="1"/><circle cx="${x}" cy="75" r="8" fill="none" stroke="#ab9b7c" stroke-width="1"/><path d="m${x} 44-8 12 8 12 8-12Z" fill="none" stroke="#b3a486" stroke-width=".9"/></g>`;
  return svgUrl(
    `<g filter="url(#paper)">${s}<path d="M5 51h350M5 60h350" stroke="#f6eedb" stroke-width="2"/></g>`,
    360,
    110,
  );
}
function clock() {
  return svgUrl(
    `<g filter="url(#paper)"><path d="M137 46V30h26v16" fill="url(#gold)" stroke="#8d7448"/><circle cx="150" cy="25" r="15" fill="none" stroke="#b79a62" stroke-width="7"/><circle cx="150" cy="170" r="120" fill="url(#gold)" stroke="#8e7548" stroke-width="3"/><circle cx="150" cy="170" r="103" fill="#e7ddc3" stroke="#a38b5d" stroke-width="3"/><circle cx="150" cy="170" r="94" fill="none" stroke="#b2a27c"/>${["XII", "III", "VI", "IX"].map((n, i) => text(n, 150 + Math.sin((i * Math.PI) / 2) * 77, 175 - Math.cos((i * Math.PI) / 2) * 76, 16, "#62563f", 'text-anchor="middle"')).join("")}<path d="M150 170 117 115m33 55 60-18" fill="none" stroke="#57503f" stroke-width="4"/><circle cx="150" cy="170" r="5" fill="#8e754b"/></g>`,
    300,
    305,
  );
}
function envelope() {
  return svgUrl(
    `<g filter="url(#paper)"><rect x="7" y="20" width="286" height="182" fill="#d8c7a6" stroke="#ad9872"/><path d="m7 20 143 122L293 20M7 202l107-91m179 91-107-91" stroke="#aa9672" stroke-width="1" fill="none"/><circle cx="150" cy="139" r="29" fill="url(#waxg)"/><circle cx="150" cy="139" r="22" fill="none" stroke="#6e332b"/>${text("S", 150, 151, 32, "#672e28", 'text-anchor="middle" font-style="italic"')}</g>`,
    300,
    220,
  );
}
function ticket() {
  return svgUrl(
    `<g filter="url(#paper)"><path d="M5 10H355v24q-12 9 0 18v22q-12 9 0 18v22H5V92q12-9 0-18V52Q17 43 5 34Z" fill="#c9b493"/><path d="M27 20h306v84H27Z" stroke="#796952" fill="none"/><path d="M263 18v88" stroke="#8d7758" stroke-dasharray="3 3"/>${text("CHEMIN DE FER", 144, 41, 11, "#756349", 'text-anchor="middle" letter-spacing="2"')}${text("PARIS — LYON", 145, 69, 20, "#6f5d45", 'text-anchor="middle"')}${text("UN VOYAGE À GARDER", 144, 94, 8, "#8e795b", 'text-anchor="middle" letter-spacing="2"')}${text("1893", 297, 69, 15, "#7c674b", 'text-anchor="middle"')}</g>`,
    360,
    124,
  );
}
function illustration(type) {
  let body = "";
  if (type === "moon")
    body =
      '<circle cx="150" cy="152" r="112" fill="#beb49a" stroke="#7e7460"/><path d="M180 47q-139 77-38 210q-108-9-99-119q8-78 137-91Z" fill="#e1d4b6"/><path d="M57 112q-10 85 47 116m-28-135 20-20m-35 82 19 12" stroke="#9f9174" fill="none"/>' +
      text(
        "LA LUNE",
        150,
        297,
        12,
        "#786e57",
        'text-anchor="middle" letter-spacing="4"',
      );
  if (type === "bird")
    body =
      '<path d="M36 240q80-33 218-21" stroke="#7b7257" stroke-width="4" fill="none"/><path d="M61 203 33 231 99 212 125 225Q181 242 205 198q32-13 20-46q-17-24-47-2q-31-31-70-10Z" fill="#aaa68a" stroke="#6e6d54"/><path d="m223 165 26 11-23 8" fill="#a3844f"/><circle cx="208" cy="166" r="4" fill="#4a4f40"/><path d="M126 160q-12 21-39 37q39 24 84 9q-7-29-45-46Z" fill="#8b8c72" stroke="#676c56"/><path d="m133 211 6 19m23-19-2 18m-35 3 19-5m8 3 16 3" stroke="#665a3c" stroke-width="2"/><path d="m96 181 55 17m-61-8 39 17" stroke="#c1bca0" fill="none"/>' +
      leaf(251, 219, 65, 0.36) +
      leaf(49, 235, -50, 0.33) +
      text(
        "PASSER DOMESTICUS",
        150,
        295,
        11,
        "#807254",
        'text-anchor="middle" letter-spacing="2"',
      );
  if (type === "mushroom")
    body =
      '<path d="M135 142q7 86-5 127q29 23 58-1q-24-87-12-126" fill="#d4c6a5" stroke="#8c7d5c"/><path d="M39 150q7-101 112-102q98 2 112 102q-120 36-224 0Z" fill="#a07156" stroke="#7b6048"/><path d="M46 152q108-10 208 0" stroke="#d6be95" stroke-width="5"/><path d="M142 157v104m14-105 4 103m10-102 7 102" stroke="#b29d76" stroke-width="1"/><path d="m79 86 13 5m43-29 12 7m44 7 10 6m20 29 12 5m-109-15 13 5m-56 16 14 5m81 1 12 7" stroke="#dbc4a3" stroke-width="6" stroke-linecap="round"/>' +
      text(
        "AGARICUS · PLATE IV",
        150,
        302,
        11,
        "#81714f",
        'text-anchor="middle" letter-spacing="2"',
      );
  return svgUrl(`<g filter="url(#ink)">${body}</g>`, 300, 325);
}
const list = [];
function add(
  id,
  name,
  category,
  src,
  w = 300,
  h = 400,
  width = 38,
  extra = {},
) {
  list.push({ id, name, category, src, w, h, width, ...extra });
}
add("rose", "褪色蔷薇", "botanical", svgUrl(rose()), 300, 400, 37);
add("fern", "蕨叶标本", "botanical", svgUrl(fern()), 300, 400, 39);
add("daisy", "旧日雏菊", "botanical", svgUrl(daisy()), 300, 400, 33);
add("lavender", "一束薰衣草", "botanical", svgUrl(lavender()), 300, 400, 35);
add(
  "olive",
  "橄榄枝",
  "botanical",
  svgUrl(
    `<path d="M146 370Q111 206 171 40" fill="none" stroke="#7e7e55" stroke-width="3"/>${Array.from({ length: 8 }, (_, i) => leaf(146 + i * 2, 337 - i * 37, i % 2 ? 65 : -52, 0.55, "#8b9270")).join("")}`,
  ),
  300,
  400,
  34,
);
add(
  "pressed-leaf",
  "秋日落叶",
  "botanical",
  svgUrl(
    `<g transform="translate(75 250) rotate(20) scale(2)">${leaf(0, 0, 0, 1, "#a49a6b")}</g>`,
    230,
    300,
  ),
  230,
  300,
  30,
);
add(
  "note1",
  "一点小确幸",
  "handwritten",
  noteSvg("Les petits bonheurs"),
  360,
  125,
  67,
  { text: "Les petits bonheurs", variant: 0 },
);
add(
  "note2",
  "记得慢下来",
  "handwritten",
  noteSvg("记得，慢慢生活。", 1),
  360,
  125,
  61,
  { text: "记得，慢慢生活。", variant: 1 },
);
add(
  "note3",
  "写给未来",
  "handwritten",
  noteSvg("Dear future me,\nkeep the little things.", 2),
  360,
  180,
  65,
  { text: "Dear future me,\nkeep the little things.", variant: 2 },
);
add(
  "note4",
  "某个晴天",
  "handwritten",
  noteSvg("A quiet afternoon", 0),
  360,
  125,
  61,
  { text: "A quiet afternoon", variant: 0 },
);
add(
  "note5",
  "自由手写条",
  "handwritten",
  noteSvg("双击，写下你的故事", 2),
  360,
  180,
  66,
  { text: "双击，写下你的故事", variant: 2 },
);
for (const [id, name, color, art, label, price] of [
  ["stamp-rose", "法兰西花邮", "#9b7066", "rose", "FRANCE", "5"],
  ["stamp-blue", "航海纪念", "#607887", "ship", "POSTAGE", "10"],
  ["stamp-green", "蝴蝶邮票", "#778169", "butterfly", "BOTANIQUE", "3"],
  ["stamp-ochre", "远方的城", "#a48e67", "town", "ITALIA", "20"],
  ["stamp-plum", "旧城邮戳", "#83737a", "town", "SOUVENIR", "2"],
]) {
  const s = stamp(label, color, art, price);
  add(id, name, "stamp", svgUrl(s.body, s.w, s.h), s.w, s.h, 31);
}
add(
  "postmark",
  "往日邮戳",
  "stamp",
  svgUrl(
    `<g opacity=".7" transform="rotate(-13 130 130)" stroke="#625943" fill="none"><circle cx="130" cy="130" r="96" stroke-width="2"/><circle cx="130" cy="130" r="88"/><path d="M48 103h164M48 157h164M213 70q35 20 80 0m-80 20q35 20 80 0m-80 20q35 20 80 0m-80 20q35 20 80 0"/>${text("PARIS", 130, 84, 20, "#625943", 'text-anchor="middle"')}${text("16 OCT 1893", 130, 136, 17, "#625943", 'text-anchor="middle"')}${text("SOUVENIR", 130, 184, 13, "#625943", 'text-anchor="middle" letter-spacing="2"')}</g>`,
    310,
    260,
  ),
  310,
  260,
  47,
);
add("medal-rose", "玫瑰荣誉章", "medal", medal(), 200, 240, 32);
add("medal-blue", "蓝绶纪念章", "medal", medal(1), 200, 240, 32);
add(
  "coin",
  "黄铜纪念币",
  "medal",
  svgUrl(
    `<circle cx="150" cy="150" r="118" fill="url(#gold)" stroke="#8d7143" stroke-width="3"/><circle cx="150" cy="150" r="102" stroke="#e8d3a0" stroke-width="3" fill="none"/>${text("A", 150, 178, 90, "#977640", 'text-anchor="middle" font-style="italic"')}${text("ATELIER · 1893", 150, 232, 12, "#886b3e", 'text-anchor="middle" letter-spacing="3"')}`,
    300,
    300,
  ),
  300,
  300,
  29,
  { dimensional: true },
);
add(
  "butterfly",
  "琥珀蝴蝶",
  "sticker",
  svgUrl(butterfly(), 300, 300),
  300,
  300,
  42,
);
add(
  "butterfly-blue",
  "蓝灰蝶翼",
  "sticker",
  svgUrl(butterfly("#86989a"), 300, 300),
  300,
  300,
  40,
);
add(
  "moth",
  "夜的飞蛾",
  "sticker",
  svgUrl(butterfly("#a8a08a", true), 300, 300),
  300,
  300,
  42,
);
add(
  "label",
  "藏书标签",
  "sticker",
  svgUrl(
    `<g filter="url(#paper)"><path d="M18 8h264v17q-10 5 0 15v75q-10 10 0 15v18H18v-18q10-5 0-15V40q10-10 0-15Z" fill="#d9c7a3"/><rect x="30" y="20" width="240" height="115" fill="none" stroke="#9e8a60"/>${text("EX LIBRIS", 150, 60, 24, "#75603d", 'text-anchor="middle" letter-spacing="4"')}${text("a collection of memories", 150, 94, 14, "#8b7855", 'text-anchor="middle" font-style="italic"')}<path d="M69 113h162" stroke="#a4926d"/></g>`,
    300,
    156,
  ),
  300,
  156,
  56,
);
add("ticket", "巴黎火车票", "sticker", ticket(), 360, 124, 65);
add("bow", "旧玫瑰缎带结", "ribbon", ribbon("#b18c81", true), 300, 235, 43, {
  dimensional: true,
});
add(
  "bow-green",
  "鼠尾草蝴蝶结",
  "ribbon",
  ribbon("#8a947d", true),
  300,
  235,
  43,
  { dimensional: true },
);
add("ribbon", "珍藏丝带", "ribbon", ribbon(), 360, 80, 78);
add("ribbon-olive", "橄榄色绸带", "ribbon", ribbon("#7e876d"), 360, 80, 78);
add("lace", "奶油蕾丝", "ribbon", lace(), 360, 110, 83);
add(
  "postcard-alps",
  "阿尔卑斯来信",
  "postcard",
  postcard("mountain"),
  360,
  260,
  68,
);
add(
  "postcard-garden",
  "花园的午后",
  "postcard",
  postcard("garden"),
  360,
  260,
  68,
);
add("postcard-paris", "漫步旧巴黎", "postcard", postcard("town"), 360, 260, 68);
add(
  "postcard-back",
  "空白明信片",
  "postcard",
  svgUrl(
    `<g filter="url(#paper)"><rect x="4" y="4" width="352" height="252" fill="#e0d1b1"/>${text("CARTE POSTALE", 180, 41, 17, "#93805d", 'text-anchor="middle" letter-spacing="4"')}<path d="M180 63v176m20-125h126m-126 31h126m-126 31h126m-126 31h126" stroke="#aa9470" stroke-width=".8"/><rect x="287" y="55" width="42" height="50" fill="none" stroke="#ac9774" stroke-dasharray="2 2"/>${text("Correspondance", 83, 85, 12, "#9d8763", 'text-anchor="middle" font-style="italic"')}</g>`,
    360,
    260,
  ),
  360,
  260,
  66,
);
add("bird", "麻雀自然图谱", "illustration", illustration("bird"), 300, 325, 51);
add("moon", "月亮图鉴", "illustration", illustration("moon"), 300, 325, 45);
add(
  "mushroom",
  "森林菌菇",
  "illustration",
  illustration("mushroom"),
  300,
  325,
  43,
);
add(
  "rose-plate",
  "蔷薇图谱",
  "illustration",
  svgUrl(
    `<g filter="url(#paper)"><rect x="6" y="6" width="288" height="388" fill="#e3d5b7"/><rect x="15" y="15" width="270" height="370" fill="none" stroke="#b3a27d"/>${text("PLATE XII", 150, 40, 10, "#988260", 'text-anchor="middle" letter-spacing="2"')}<g transform="translate(23 35) scale(.84)">${rose()}</g>${text("ROSA CENTIFOLIA", 150, 375, 12, "#7f7151", 'text-anchor="middle" letter-spacing="2"')}</g>`,
  ),
  300,
  400,
  51,
);
add("photo-polaroid", "奶油照片框", "photo", photoImage(), 300, 350, 55, {
  frame: "polaroid",
});
add(
  "photo-ornate",
  "古董金相框",
  "photo",
  photoImage("", "ornate"),
  300,
  350,
  55,
  { frame: "ornate", dimensional: true },
);
add(
  "photo-black",
  "黑边旧相框",
  "photo",
  photoImage("", "black"),
  300,
  350,
  54,
  { frame: "black" },
);
add("tape-plain", "半透明旧胶带", "tape", tape("#d8c493"), 300, 72, 48);
add("tape-grid", "亚麻格纹胶带", "tape", tape("#c5c0a1", 1), 300, 72, 56);
add("tape-rose", "藕粉纸胶带", "tape", tape("#c9a29a"), 300, 72, 51);
add("tape-leaf", "植物纹纸胶带", "tape", tape("#c3c7ad", 2), 300, 72, 58);
add(
  "wax",
  "复古火漆印",
  "decoration",
  svgUrl(
    `<path d="M150 30q20 8 34 0l23 20 29 5 5 24 20 22-7 24 12 28-17 24-1 28-24 11-16 25-29-1-27 12-23-14-31 4-14-23-29-9-2-27-18-23 9-27-6-26 20-20 7-24 27-6 23-21Z" fill="url(#waxg)"/><circle cx="150" cy="142" r="77" fill="none" stroke="#69342c" stroke-width="3"/><circle cx="150" cy="142" r="70" fill="none" stroke="#b86d59"/>${text("M", 150, 172, 80, "#73392e", 'text-anchor="middle" font-style="italic"')}`,
    300,
    280,
  ),
  300,
  280,
  31,
  { dimensional: true },
);
add(
  "key",
  "旧时黄铜钥匙",
  "decoration",
  svgUrl(
    `<g transform="rotate(-20 150 150)"><circle cx="150" cy="68" r="42" fill="none" stroke="url(#gold)" stroke-width="12"/><circle cx="150" cy="68" r="30" fill="none" stroke="#9a7e4a" stroke-width="2"/><path d="M150 109v166m0-19h33v-13m-33-14h24" fill="none" stroke="url(#gold)" stroke-width="13"/></g>`,
    300,
    320,
  ),
  300,
  320,
  27,
  { dimensional: true },
);
add("clock", "黄铜怀表", "decoration", clock(), 300, 305, 38, {
  dimensional: true,
});
add("envelope", "未寄出的信", "decoration", envelope(), 300, 220, 58);
add(
  "paperclip",
  "古铜回形针",
  "decoration",
  svgUrl(
    `<path d="M113 223V59q0-46 40-46q42 0 42 45v164q0 31-29 31q-31 0-31-31V68q0-18 18-18q19 0 19 18v137" stroke="#826b43" stroke-width="10" fill="none"/><path d="M111 223V59q0-46 40-46q42 0 42 45v164q0 31-29 31q-31 0-31-31V68q0-18 18-18q19 0 19 18v137" stroke="url(#gold)" stroke-width="6" fill="none"/>`,
    300,
    270,
  ),
  300,
  270,
  24,
  { dimensional: true },
);
function botanicalExtra(kind) {
  let s =
    '<path d="M150 373Q132 263 152 121" fill="none" stroke="#6f7959" stroke-width="3"/>';
  if (kind === "eucalyptus") {
    s =
      '<path d="M147 376Q124 218 161 34" fill="none" stroke="#7c8067" stroke-width="3"/>';
    for (let i = 0; i < 10; i++)
      for (const side of [-1, 1])
        s += `<ellipse cx="${149 + side * (25 - i)}" cy="${340 - i * 29}" rx="${25 - i * 0.7}" ry="${17 - i * 0.4}" transform="rotate(${side * 28} ${149 + side * 25} ${340 - i * 29})" fill="${i % 2 ? "#9ca995" : "#829a8c"}" stroke="#697e6b" stroke-width=".7"/><path d="M149 ${340 - i * 29}l${side * (38 - i)} -8" stroke="#ced4b7" stroke-width=".6" opacity=".7"/>`;
  } else if (kind === "poppy") {
    s +=
      leaf(151, 278, -62, 0.6, "#929b75") + leaf(150, 235, 68, 0.5, "#8e956e");
    s +=
      '<g transform="translate(150 111)"><path d="M0 13C-108 28-76-72-29-63C0-94 49-65 52-28C101-6 63 53 17 39C-7 59-51 30 0 13Z" fill="#b37765" stroke="#97664f"/><path d="M-47-39Q-8-3 5 19M21-56Q0-17 5 19M52-8Q23 14 5 19M-36 26 5 19" stroke="#d4a091" stroke-width="1" fill="none"/><ellipse cx="5" cy="18" rx="19" ry="14" fill="#5e5843"/><circle cx="5" cy="18" r="8" fill="#988b64"/></g>';
  } else {
    s += leaf(145, 285, -55, 0.8) + leaf(147, 239, 66, 0.7);
    for (let i = 0; i < 38; i++) {
      const a = i * 2.4,
        r = Math.sqrt(i) * 10,
        xx = 148 + Math.cos(a) * r,
        yy = 112 + Math.sin(a) * r;
      for (let k = 0; k < 4; k++)
        s += `<ellipse cx="${xx + Math.cos(k * 1.57) * 5}" cy="${yy + Math.sin(k * 1.57) * 5}" rx="7" ry="5" transform="rotate(${k * 90} ${xx} ${yy})" fill="${i % 3 ? "#a8a7b7" : "#8e91a5"}" stroke="#82879c" stroke-width=".4"/>`;
      s += `<circle cx="${xx}" cy="${yy}" r="2" fill="#c2beac"/>`;
    }
  }
  return svgUrl(`<g filter="url(#ink)">${s}</g>`);
}
function chart() {
  let s =
    '<rect x="6" y="6" width="288" height="338" fill="#d4cbb4"/><rect x="17" y="17" width="266" height="316" fill="none" stroke="#9b8c6d"/>' +
    text(
      "ATLAS CÉLESTE",
      150,
      46,
      15,
      "#716650",
      'text-anchor="middle" letter-spacing="2"',
    ) +
    '<circle cx="150" cy="186" r="107" fill="#777d75" stroke="#666b61"/><circle cx="150" cy="186" r="92" fill="none" stroke="#b9b59a" stroke-width=".7"/><path d="M43 186h214M150 79v214M74 110l152 152M74 262l152-152" stroke="#b9b59a" stroke-width=".5"/>';
  const points = [];
  for (let i = 0; i < 40; i++) {
    const a = i * 2.399,
      r = Math.sqrt(i / 40) * 97,
      x = 150 + Math.cos(a) * r,
      y = 186 + Math.sin(a) * r;
    points.push([x, y]);
    s += `<circle cx="${x}" cy="${y}" r="${i % 7 ? 1.4 : 2.4}" fill="#e2d7b2"/>`;
  }
  for (let i = 3; i < 38; i += 5)
    s += `<path d="M${points[i].join(" ")} ${points[i + 1].join(" ")} ${points[i + 2].join(" ")}" stroke="#c5c0a2" stroke-width=".7" fill="none"/>`;
  return svgUrl(
    `<g filter="url(#paper)">${s}${text("THE QUIET CONSTELLATIONS", 150, 318, 8, "#8c7d61", 'text-anchor="middle" letter-spacing="2"')}</g>`,
    300,
    350,
  );
}
function extraPostcard(kind) {
  let art = "";
  if (kind === "tea")
    art =
      '<rect x="18" y="18" width="324" height="192" fill="#c8b7a3"/><path d="M18 153h324v57H18Z" fill="#b19b83"/><ellipse cx="176" cy="165" rx="68" ry="18" fill="#e6d8bd"/><path d="M131 109h87q-4 60-42 60q-41-3-45-60Z" fill="#e7d7b9" stroke="#a49274"/><path d="M218 116q39-10 28 25q-10 21-34 9" fill="none" stroke="#ddc9a8" stroke-width="8"/><ellipse cx="175" cy="109" rx="44" ry="12" fill="#93714e"/><path d="M166 89q-20-18 0-35m20 40q-14-12 1-31" fill="none" stroke="#e1d1b6" opacity=".6" stroke-width="2"/><path d="M72 154v-56m0 24-18-29m18 10 18-22" stroke="#737c5b" stroke-width="2"/><circle cx="72" cy="86" r="19" fill="#b38d82"/>';
  if (kind === "sea")
    art =
      '<rect x="18" y="18" width="324" height="192" fill="#c6cdc2"/><rect x="18" y="119" width="324" height="91" fill="#8b9f9f"/><path d="M18 183q79-62 150-30t174 2v55H18Z" fill="#c3b99b"/><path d="M88 140V69h26v71M82 68h39L101 42Z" fill="#d9d1b9" stroke="#8f8b75"/><path d="M94 75h15m-15 17h15m-15 17h15" stroke="#a48c72" stroke-width="7"/><path d="M154 134q20-7 39 0m32 8q30-9 61 0m-104-34q18-12 33 0" stroke="#d4d8c8" fill="none"/>';
  if (kind === "library") {
    art =
      '<rect x="18" y="18" width="324" height="192" fill="#b8a389"/><rect x="32" y="31" width="295" height="161" fill="#796b55"/>';
    for (let row = 0; row < 3; row++) {
      for (let i = 0; i < 18; i++)
        art += `<rect x="${40 + i * 15}" y="${42 + row * 46 + (i % 3) * 4}" width="${9 + (i % 3)}" height="${37 - (i % 3) * 4}" fill="${["#ad8b6f", "#8d9480", "#b7a381", "#86817a"][i % 4]}"/><path d="M${43 + i * 15} ${52 + row * 46}v20" stroke="#d1ba90" stroke-width=".5"/>`;
      art += `<path d="M30 ${81 + row * 46}h298" stroke="#b9a080" stroke-width="5"/>`;
    }
  }
  return svgUrl(
    `<g filter="url(#paper)"><rect x="4" y="4" width="352" height="252" fill="#e4d7bb"/>${art}${text(kind === "tea" ? "LE THÉ DE L’APRÈS-MIDI" : kind === "sea" ? "SOUVENIR DE LA MER" : "LA PETITE BIBLIOTHÈQUE", 180, 238, 11, "#7d6b50", 'text-anchor="middle" letter-spacing="2"')}</g>`,
    360,
    260,
  );
}
add("poppy", "暖赭罂粟", "botanical", botanicalExtra("poppy"), 300, 400, 36);
add(
  "hydrangea",
  "灰蓝绣球",
  "botanical",
  botanicalExtra("hydrangea"),
  300,
  400,
  38,
);
add(
  "eucalyptus",
  "尤加利枝叶",
  "botanical",
  botanicalExtra("eucalyptus"),
  300,
  400,
  35,
);
for (const [id, name, value, variant] of [
  ["note6", "心动的一天", "今天，也有值得珍藏的事。", 2],
  ["note7", "一封温柔的信", "With love, always.", 0],
  ["note8", "写给季节", "春去秋来，记得花开。", 1],
])
  add(
    id,
    name,
    "handwritten",
    noteSvg(value, variant),
    360,
    variant === 2 ? 180 : 125,
    65,
    { text: value, variant },
  );
for (const [id, name, label, color, art, price] of [
  ["stamp-lavender", "薰衣草花邮", "PROVENCE", "#8a7c8b", "rose", "15"],
  ["stamp-sea", "海岸纪念邮", "LA MER", "#7c9692", "ship", "8"],
  ["stamp-autumn", "旧秋日花邮", "AUTUMNE", "#a18461", "butterfly", "12"],
]) {
  const s = stamp(label, color, art, price);
  add(id, name, "stamp", svgUrl(s.body, s.w, s.h), s.w, s.h, 30);
}
add(
  "cameo",
  "象牙浮雕胸针",
  "medal",
  svgUrl(
    '<ellipse cx="150" cy="180" rx="95" ry="136" fill="url(#gold)" stroke="#8b7346" stroke-width="3"/><ellipse cx="150" cy="180" rx="80" ry="120" fill="#b19d83" stroke="#dfc68f" stroke-width="3"/><path d="M167 81q-54-5-66 38q-19 49 22 72l-3 40-43 26v19h145v-19l-49-25-7-42q16-6 18-27l21-9-17-18q3-35-21-55Z" fill="#e9ddc3" stroke="#d0bea0"/><path d="M126 90q-19 47 32 60m-38 88 51-2m-25-107q8-7 17-2" fill="none" stroke="#c7b89d" stroke-width="2"/>',
    300,
    350,
  ),
  300,
  350,
  32,
  { dimensional: true },
);
add(
  "star-badge",
  "古铜星芒章",
  "medal",
  svgUrl(
    '<path d="m150 16 17 48 40-28-2 50 49-1-28 40 48 17-48 18 28 41-49-2 2 50-40-28-17 48-18-48-41 28 2-50-50 2 28-41-48-18 48-17-28-40 50 1-2-50 41 28Z" fill="url(#gold)" stroke="#937647"/><circle cx="150" cy="142" r="64" fill="#b59860" stroke="#e2c88e" stroke-width="4"/><circle cx="150" cy="142" r="51" stroke="#856d42" fill="none"/>' +
      text(
        "S",
        150,
        162,
        56,
        "#e5d0a1",
        'text-anchor="middle" font-style="italic"',
      ),
    300,
    290,
  ),
  300,
  290,
  31,
  { dimensional: true },
);
add(
  "laurel-medal",
  "月桂纪念勋章",
  "medal",
  svgUrl(
    '<path d="m97 20 54 111 53-111h-40l-13 49-15-49Z" fill="#7f8872"/><circle cx="150" cy="185" r="93" fill="url(#gold)" stroke="#917345"/><circle cx="150" cy="185" r="80" stroke="#dec28a" stroke-width="3" fill="none"/>' +
      leaf(111, 224, -25, 0.54, "#9d804a") +
      leaf(189, 224, 35, 0.54, "#9d804a") +
      text("1893", 150, 197, 28, "#83683e", 'text-anchor="middle"'),
    300,
    300,
  ),
  300,
  300,
  32,
);
add(
  "seed-packet",
  "花园种子袋",
  "sticker",
  svgUrl(
    '<g filter="url(#paper)"><path d="M32 8h236v354H32Z" fill="#d9c7a1"/><path d="m32 8 28 30h179l29-30M42 47h216v302H42" fill="none" stroke="#a3916a"/>' +
      text(
        "THE GARDEN",
        150,
        71,
        17,
        "#7a7754",
        'text-anchor="middle" letter-spacing="2"',
      ) +
      '<g transform="translate(53 92) scale(.63)">' +
      daisy() +
      "</g>" +
      text(
        "FLOWER SEEDS",
        150,
        324,
        14,
        "#83714e",
        'text-anchor="middle" letter-spacing="2"',
      ) +
      text(
        "A little promise of spring",
        150,
        344,
        10,
        "#9c8761",
        'text-anchor="middle" font-style="italic"',
      ) +
      "</g>",
    300,
    370,
  ),
  300,
  370,
  43,
);
add(
  "label-oval",
  "椭圆藏书签",
  "sticker",
  svgUrl(
    '<g filter="url(#paper)"><ellipse cx="170" cy="85" rx="162" ry="76" fill="#d6c4a0"/><ellipse cx="170" cy="85" rx="147" ry="64" fill="none" stroke="#9b8257"/><ellipse cx="170" cy="85" rx="141" ry="59" fill="none" stroke="#9b8257" stroke-width=".6"/>' +
      text(
        "COLLECTION PRIVÉE",
        170,
        79,
        18,
        "#7c6541",
        'text-anchor="middle" letter-spacing="2"',
      ) +
      text(
        "things that made me smile",
        170,
        110,
        13,
        "#94805c",
        'text-anchor="middle" font-style="italic"',
      ) +
      "</g>",
    340,
    170,
  ),
  340,
  170,
  61,
);
add(
  "ticket-theatre",
  "旧剧院入场券",
  "sticker",
  svgUrl(
    '<g filter="url(#paper)"><path d="M8 10h344v30q-18 22 0 44v42H8V84q18-22 0-44Z" fill="#b99483"/><rect x="27" y="22" width="305" height="92" fill="none" stroke="#80634f"/><path d="M272 23v92" stroke="#80634f" stroke-dasharray="3 3"/>' +
      text(
        "THÉÂTRE DES SOUVENIRS",
        150,
        49,
        12,
        "#715c4b",
        'text-anchor="middle" letter-spacing="1"',
      ) +
      text(
        "UNE SOIRÉE À GARDER",
        150,
        78,
        16,
        "#715c4b",
        'text-anchor="middle"',
      ) +
      text("PARIS · 1893", 150, 101, 10, "#715c4b", 'text-anchor="middle"') +
      text("07", 301, 77, 26, "#715c4b", 'text-anchor="middle"') +
      "</g>",
    360,
    136,
  ),
  360,
  136,
  65,
);
add("bow-blue", "雾蓝丝绒结", "ribbon", ribbon("#83949a", true), 300, 235, 43, {
  dimensional: true,
});
add(
  "bow-russet",
  "焦糖缎带结",
  "ribbon",
  ribbon("#b29173", true),
  300,
  235,
  43,
  { dimensional: true },
);
add(
  "cord",
  "麻绳小结",
  "ribbon",
  svgUrl(
    '<path d="M20 95q49-66 97-22q14 39-21 34q-46-27-1-62q23-12 44 30q44-33 63-15q28 35-28 43q-45-7-35-28q-38 55-70 73m74-66q22 18 44 64M141 82l170 6" fill="none" stroke="#947954" stroke-width="8"/><path d="M20 95q49-66 97-22q14 39-21 34q-46-27-1-62q23-12 44 30q44-33 63-15q28 35-28 43q-45-7-35-28q-38 55-70 73m74-66q22 18 44 64M141 82l170 6" fill="none" stroke="#c4a77e" stroke-width="4" stroke-dasharray="3 3"/>',
    340,
    170,
  ),
  340,
  170,
  76,
  { dimensional: true },
);
for (const [id, name, kind] of [
  ["postcard-tea", "午后红茶", "tea"],
  ["postcard-sea", "海边的灯塔", "sea"],
  ["postcard-library", "旧书店来信", "library"],
])
  add(id, name, "postcard", extraPostcard(kind), 360, 260, 68);
add("stars-chart", "古董星象图", "illustration", chart(), 300, 350, 62);
add(
  "fern-plate",
  "蕨类采集图谱",
  "illustration",
  svgUrl(
    '<g filter="url(#paper)"><rect x="7" y="7" width="286" height="386" fill="#dfd6bb"/><rect x="16" y="16" width="268" height="368" fill="none" stroke="#a39876"/>' +
      text(
        "PLATE VIII · FILICES",
        150,
        38,
        10,
        "#7d7d5d",
        'text-anchor="middle" letter-spacing="2"',
      ) +
      '<g transform="translate(15 34) scale(.85)">' +
      fern() +
      "</g>" +
      text(
        "FROM THE PRIVATE HERBARIUM",
        150,
        372,
        9,
        "#7d7d5d",
        'text-anchor="middle" letter-spacing="1"',
      ) +
      "</g>",
  ),
  300,
  400,
  51,
);
add(
  "shells",
  "海贝自然图鉴",
  "illustration",
  svgUrl(
    '<g filter="url(#ink)"><path d="M148 268Q18 185 46 83q108-70 211 9q11 100-109 176Z" fill="#c2ad8f" stroke="#8c795e"/><path d="M150 266 60 85m90 181L86 62m64 204L114 54m36 212V45m0 221L184 54m-34 212 66-199m-66 199 91-174" stroke="#a58e72" stroke-width="2"/><path d="M56 130q102-79 195 2M74 171q83-56 157 1M102 218q55-32 100 0" fill="none" stroke="#dfcaad" stroke-width="3"/>' +
      text(
        "CONCHA · PLATE XVII",
        150,
        318,
        11,
        "#8d7b5b",
        'text-anchor="middle" letter-spacing="2"',
      ) +
      "</g>",
    300,
    340,
  ),
  300,
  340,
  45,
);
for (const frame of PHOTO_FRAMES.filter(
  (f) => !["polaroid", "ornate", "black"].includes(f.id),
))
  add(
    `photo-${frame.id}`,
    frame.name,
    "photo",
    photoImage("", frame.id),
    300,
    350,
    55,
    { frame: frame.id, dimensional: frame.id === "oval", ...(magicFrameColors[frame.id] ? { style: "arcana" } : {}) },
  );
add("tape-blue", "雾蓝半透明胶带", "tape", tape("#a9b9bd"), 300, 72, 51);
add(
  "tape-lace",
  "蕾丝印纹胶带",
  "tape",
  svgUrl(
    '<g filter="url(#paper)"><path d="M8 8h284v56H8Z" fill="#d9ccb0" fill-opacity=".7"/>' +
      Array.from(
        { length: 18 },
        (_, i) =>
          `<circle cx="${16 + i * 16}" cy="35" r="10" stroke="#9e9175" stroke-width=".8" fill="none"/><circle cx="${16 + i * 16}" cy="35" r="5" stroke="#c1b49a" fill="none"/>`,
      ).join("") +
      "</g>",
    300,
    72,
  ),
  300,
  72,
  56,
);
add(
  "tape-news",
  "铅字纸胶带",
  "tape",
  svgUrl(
    '<g filter="url(#paper)"><path d="M8 7h284v58H8Z" fill="#ccbe9e" fill-opacity=".8"/>' +
      text(
        "the beauty of ordinary days",
        18,
        29,
        14,
        "#817357",
        'font-style="italic"',
      ) +
      text(
        "A SMALL COLLECTION OF MEMORIES · 1893",
        18,
        51,
        8,
        "#8f7e5c",
        'letter-spacing="1"',
      ) +
      "</g>",
    300,
    72,
  ),
  300,
  72,
  60,
);
add(
  "feather",
  "旧信笺羽毛笔",
  "decoration",
  svgUrl(
    '<path d="M58 365Q168 156 218 39" stroke="#9e8e6f" stroke-width="2" fill="none"/><path d="M82 307Q78 109 232 19Q251 177 82 307Z" fill="#d9ceb5" stroke="#a99b7d"/>' +
      Array.from(
        { length: 18 },
        (_, i) =>
          `<path d="M${94 + i * 6} ${288 - i * 13}l${-10 - i * 0.2} -${35 - i * 0.8}m${10 + i * 0.2} ${35 - i * 0.8}l${35 - i * 0.5} -${14 + i * 0.2}" stroke="#b3a68a" stroke-width=".8"/>`,
      ).join(""),
    300,
    400,
  ),
  300,
  400,
  33,
);
add(
  "compass",
  "黄铜指南针",
  "decoration",
  svgUrl(
    '<circle cx="150" cy="154" r="124" fill="url(#gold)" stroke="#8d7044" stroke-width="3"/><circle cx="150" cy="154" r="105" fill="#dad0b5" stroke="#a58b5c" stroke-width="4"/><circle cx="150" cy="154" r="92" fill="none" stroke="#9c8e6f"/>' +
      ["N", "E", "S", "W"]
        .map((s, i) =>
          text(
            s,
            150 + Math.sin(i * 1.57) * 77,
            161 - Math.cos(i * 1.57) * 76,
            15,
            "#736447",
            'text-anchor="middle"',
          ),
        )
        .join("") +
      '<path d="m150 73-19 81 19 81 20-81Z" fill="#8c5c51" stroke="#695c45"/><path d="m150 73 1 81-20 0Z" fill="#e3d3ad"/><circle cx="150" cy="154" r="7" fill="url(#gold)"/>',
    300,
    310,
  ),
  300,
  310,
  36,
  { dimensional: true },
);
add(
  "candle",
  "旧铜烛台",
  "decoration",
  svgUrl(
    '<ellipse cx="150" cy="359" rx="85" ry="17" fill="url(#gold)" stroke="#8a7044"/><path d="M132 237h36v42q-14 21-10 44l42 21H99l43-21q6-20-10-44Z" fill="url(#gold)" stroke="#9a7b44"/><ellipse cx="150" cy="238" rx="52" ry="13" fill="url(#gold)"/><path d="M126 82h47v152h-47Z" fill="#ded2b4" stroke="#b4a784"/><path d="M132 83v50q9 13 12 0V98m13-16v74q9 12 10-2V91" stroke="#e8dec4" stroke-width="5" fill="none"/><path d="M150 81V67" stroke="#756443" stroke-width="2"/><path d="M150 68Q125 49 152 13Q174 51 150 68Z" fill="#c7a263"/><path d="M150 64q-11-17 2-32q13 21-2 32Z" fill="#edd49b"/>',
    300,
    390,
  ),
  300,
  390,
  35,
  { dimensional: true },
);
add(
  "teacup",
  "田园瓷茶杯",
  "decoration",
  svgUrl(
    '<ellipse cx="145" cy="263" rx="124" ry="26" fill="#ded1b5" stroke="#b09b75"/><ellipse cx="145" cy="263" rx="104" ry="17" fill="none" stroke="#bba477"/><path d="M59 132h168q-6 126-82 126q-72-7-86-126Z" fill="#e7dcc3" stroke="#aa9672"/><path d="M222 153q73-13 43 56q-15 28-58 7" stroke="#dfd0ad" stroke-width="13" fill="none"/><path d="M224 155q65-4 35 53q-11 21-48 13" stroke="#ae9468" stroke-width="1.5" fill="none"/><ellipse cx="143" cy="132" rx="84" ry="22" fill="#ab8661" stroke="#ceb98f" stroke-width="4"/>' +
      Array.from(
        { length: 5 },
        (_, i) =>
          `<g transform="translate(${88 + i * 27} ${183 + (i % 2) * 12}) scale(.13)">${rose()}</g>`,
      ).join(""),
    300,
    300,
  ),
  300,
  300,
  43,
  { dimensional: true },
);
add(
  "scissors",
  "古董刺绣剪刀",
  "decoration",
  svgUrl(
    '<g transform="rotate(18 150 170)"><path d="m132 171-16-143 44 120 29-120-11 143" fill="#a89d82" stroke="#736b58"/><path d="M132 171q-12 32-27 49m73-49q15 34 17 49" stroke="url(#gold)" stroke-width="10" fill="none"/><ellipse cx="97" cy="246" rx="33" ry="43" fill="none" stroke="url(#gold)" stroke-width="10"/><ellipse cx="203" cy="246" rx="33" ry="43" fill="none" stroke="url(#gold)" stroke-width="10"/><circle cx="156" cy="166" r="8" fill="url(#gold)"/></g>',
    300,
    320,
  ),
  300,
  320,
  33,
  { dimensional: true },
);
/* ---------- 花与叶补充：松果、果实与小枝 ---------- */
function pinecone() {
  let s = `<path d="M150 34q-6 22 0 44" stroke="#6d7452" stroke-width="5" fill="none"/>${leaf(154, 74, -34, 0.42)}`;
  const rows = 11;
  for (let row = 0; row < rows; row++) {
    const t = row / (rows - 1), y = 84 + t * 252;
    const half = 10 + 62 * Math.sin(Math.PI * (0.14 + t * 0.76));
    const count = Math.max(2, Math.round(half / 11));
    const scale = 0.62 + 0.5 * Math.sin(Math.PI * (0.18 + t * 0.74));
    for (let i = 0; i <= count; i++) {
      const x = 150 - half + (2 * half * i) / count;
      s += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${(14 * scale).toFixed(1)}" ry="${(12 * scale).toFixed(1)}" transform="rotate(${((i / count - 0.5) * 46).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${row % 2 ? "#8a6d49" : "#735838"}" stroke="#57412b" stroke-width="1"/>`;
    }
  }
  return `<g filter="url(#ink)">${s}</g>`;
}
function acorn() {
  const hatch = [0, 1, 2, 3]
    .map((i) => `<path d="M${92 + i * 9} ${134 + i * 6}q58 -16 ${116 - i * 18} 0"/>`)
    .join("");
  return `<g filter="url(#ink)"><path d="M150 120q-56 0-64 42h128q-8-42-64-42Z" fill="#93714a" stroke="#5f472c" stroke-width="2"/><path d="M86 162q2 96 64 132 62-36 64-132Z" fill="#b48d58" stroke="#7e5e39" stroke-width="2"/><path d="M98 176q-4 78 52 114" stroke="#dcbd8f" stroke-width="4" fill="none" opacity=".6"/><path d="M150 122V96" stroke="#6c5a3c" stroke-width="6"/><g fill="none" stroke="#5f472c" stroke-width="1.4" opacity=".5">${hatch}</g></g>`;
}
function mushroom() {
  return `<g filter="url(#ink)"><path d="M132 210q-4 62 6 106q2 12 12 12t12-12q8-46 4-106Z" fill="#e2d6ba" stroke="#b6a684" stroke-width="2"/><path d="M60 208q6-104 90-104t90 104q-14 12-38 12-14-24-30-6-16-22-30 4-16-26-30 2-14-4-16-8Z" fill="#a8876a" stroke="#75604a" stroke-width="2.4"/><g fill="#c8ad8c" opacity=".9"><circle cx="106" cy="160" r="9"/><circle cx="160" cy="140" r="12"/><circle cx="198" cy="176" r="7"/></g><path d="M118 216q32 12 64 0" stroke="#9a8a6c" stroke-width="2" fill="none"/><path d="M132 236h36" stroke="#b6a684" stroke-width="2"/></g>`;
}
function berryBranch() {
  let s = `<path d="M150 380q-8-120 6-236q2-38 22-58" stroke="#6f7550" stroke-width="4" fill="none"/>`;
  s += leaf(146, 300, -50, 0.5) + leaf(158, 250, 62, 0.45) + leaf(150, 196, -44, 0.38);
  const berries = [[176, 120], [196, 148], [160, 108], [206, 112], [182, 84], [144, 138], [212, 168]];
  berries.forEach(([x, y]) => {
    s += `<circle cx="${x}" cy="${y}" r="16" fill="#9d5b52" stroke="#76413c" stroke-width="1.4"/><circle cx="${x - 5}" cy="${y - 6}" r="4" fill="#c99086" opacity=".8"/>`;
  });
  return `<g filter="url(#ink)">${s}</g>`;
}
function clover() {
  let s = `<path d="M150 372q-6-90 0-146" stroke="#727a53" stroke-width="4" fill="none"/>`;
  for (let i = 0; i < 3; i++) {
    const a = i * 120 - 90;
    s += `<g transform="rotate(${a} 150 226)"><path d="M150 226q-40-6-42-42q-2-34 30-34q32 0 30 34q-2 36-18 42Z" fill="#88936a" stroke="#66714c" stroke-width="1.6"/><path d="M150 226v-58" stroke="#c9cfa4" stroke-width="1.4"/></g>`;
  }
  return `<g filter="url(#ink)">${s}<circle cx="150" cy="226" r="7" fill="#76815a"/></g>`;
}
function cotton() {
  let s = "";
  const stems = [[-1, 60], [0, 20], [1, 78]];
  stems.forEach(([dir, h]) => {
    const topY = 330 - h - 120;
    s += `<path d="M150 372q${dir * 28} -120 ${dir * 54} ${-h}" stroke="#8a7a5c" stroke-width="3" fill="none"/>`;
    s += `<g fill="#efe9d9" stroke="#c3b79c" stroke-width="1"><circle cx="${150 + dir * 54}" cy="${topY}" r="26"/><circle cx="${150 + dir * 54 - 18}" cy="${topY + 14}" r="18"/><circle cx="${150 + dir * 54 + 18}" cy="${topY + 12}" r="17"/><circle cx="${150 + dir * 54}" cy="${topY - 20}" r="16"/></g>`;
    s += `<path d="M${144 + dir * 54} ${topY + 30}l${dir * 4} 30" stroke="#8a7a5c" stroke-width="2"/>`;
  });
  return `<g filter="url(#ink)">${s}</g>`;
}
function wheat() {
  let s = `<path d="M150 386q-4-140 2-268" stroke="#8d8259" stroke-width="3" fill="none"/>`;
  for (let i = 0; i < 11; i++) {
    const y = 104 + i * 21, w = 17 - i * 0.5;
    for (const dir of [-1, 1]) {
      const cx = 150 + dir * (w + 3);
      s += `<ellipse cx="${cx}" cy="${y}" rx="${w}" ry="7" transform="rotate(${dir * 30} ${cx} ${y})" fill="${i % 2 ? "#b7a878" : "#a89a6b"}" stroke="#8a7d52" stroke-width=".8"/><path d="M${cx + dir * w} ${y - 3}l${dir * (10 + i)} -${9 + i * 1.2}" stroke="#cbbd90" stroke-width="1.1"/>`;
    }
  }
  s += `<path d="M150 104q-6-26 0-46" stroke="#b7a878" stroke-width="4" fill="none"/>`;
  return `<g filter="url(#ink)">${s}</g>`;
}
function driedBouquet() {
  let s = "";
  const stems = [[-58, 68], [-30, 40], [2, 22], [32, 48], [58, 76]];
  stems.forEach(([dx, h], i) => {
    s += `<path d="M150 372q${dx * 0.4} -120 ${dx} ${-h}" stroke="${i % 2 ? "#94875f" : "#847a55"}" stroke-width="2.6" fill="none"/>`;
    s += `<g transform="translate(${150 + dx} ${372 - h})"><circle r="25" fill="${["#b48c86", "#c2b184", "#a8919f", "#b7a06f", "#9d8f80"][i]}" stroke="#7d6c58" stroke-width="1.2"/>${[0, 1, 2, 3, 4].map((k) => `<ellipse cx="${Math.cos((k * Math.PI * 2) / 5) * 20}" cy="${Math.sin((k * Math.PI * 2) / 5) * 20}" rx="13" ry="8" transform="rotate(${(k * 72)} ${Math.cos((k * Math.PI * 2) / 5) * 20} ${Math.sin((k * Math.PI * 2) / 5) * 20})" fill="${["#cfada4", "#d8c9a0", "#bda9b6", "#cbb588", "#b5a898"][i]}" opacity=".9"/>`).join("")}</g>`;
  });
  s += `<path d="M138 268q12-14 24 0" stroke="#9c7f5f" stroke-width="6" fill="none"/><path d="M136 272q-10 30 14 44q24-14 14-44" fill="none" stroke="#9c7f5f" stroke-width="5"/>`;
  return `<g filter="url(#ink)">${s}</g>`;
}

add("pinecone", "秋日松果", "botanical", svgUrl(pinecone()), 300, 400, 34);
add("acorn", "橡实与帽", "botanical", svgUrl(acorn()), 300, 400, 32);
add("mushroom-dried", "干枯蘑菇", "botanical", svgUrl(mushroom()), 300, 400, 36);
add("berries", "红果小枝", "botanical", svgUrl(berryBranch()), 300, 400, 35);
add("clover", "四叶三叶草", "botanical", svgUrl(clover()), 300, 400, 31);
add("cotton", "一枝棉花", "botanical", svgUrl(cotton()), 300, 400, 38);
add("wheat", "麦穗标本", "botanical", svgUrl(wheat()), 300, 400, 30);
add("dried", "干花小束", "botanical", svgUrl(driedBouquet()), 300, 400, 37);

/* ---------- 自然造物：鱼、贝、小动物与羽毛 ---------- */
function fish() {
  const scales = Array.from({ length: 4 }, (_, row) =>
    Array.from({ length: 6 - row }, (_, i) => {
      const x = 105 + i * 23 + (row % 2) * 11, y = 116 + row * 15;
      return `<path d="M${x} ${y}q9 7 0 14"/>`;
    }).join(""),
  ).join("");
  return `<defs><linearGradient id="koi" x2=".4" y2="1"><stop stop-color="#f6e8cf"/><stop offset=".5" stop-color="#e7cda7"/><stop offset="1" stop-color="#bc9b77"/></linearGradient><linearGradient id="fin" x2="1" y2="1"><stop stop-color="#bd7156" stop-opacity=".85"/><stop offset="1" stop-color="#efd2ad" stop-opacity=".65"/></linearGradient></defs><g transform="rotate(-18 150 145)" stroke-linejoin="round"><path d="M79 148Q53 115 24 106Q40 142 30 152Q18 176 24 204Q56 187 83 162" fill="url(#fin)" stroke="#a8735d" stroke-width="2"/><path d="M75 150Q105 78 185 88Q236 94 271 136Q282 148 269 157Q233 191 180 189Q110 190 75 150Z" fill="url(#koi)" stroke="#99775d" stroke-width="2.5"/><path d="M118 96Q116 70 145 60Q162 72 167 89M172 187Q178 207 201 219Q203 198 194 186" fill="url(#fin)" stroke="#a76d53" stroke-width="2"/><path d="M116 92Q132 109 128 134Q112 141 93 124Q92 107 116 92ZM187 94Q207 99 212 119Q202 133 185 124Q175 110 187 94ZM167 159Q196 159 216 175Q193 188 163 185Q150 174 167 159Z" fill="#b36c52" opacity=".9"/><path d="M105 164Q113 203 139 213Q148 185 135 171" fill="url(#fin)" stroke="#b08065" stroke-width="1.7"/><g fill="none" stroke="#b69877" stroke-width="1.2" opacity=".68">${scales}</g><path d="M77 148Q62 149 47 152M49 129Q59 145 57 166M34 120Q50 145 36 187M111 176Q128 198 136 204" fill="none" stroke="#9a6c55" stroke-width="1.1" opacity=".7"/><circle cx="250" cy="130" r="3.8" fill="#3f3830"/><circle cx="251" cy="129" r="1" fill="#fff7e7"/><path d="M267 152q5 4 0 7m-12-1q10 5 14 11" fill="none" stroke="#826452" stroke-width="1.5" stroke-linecap="round"/></g>`;
}
function spiralShell() {
  let spiral = "";
  for (let i = 0; i <= 100; i++) {
    const t = i / 100 * Math.PI * 3.7, r = 3 + t * 4.1;
    spiral += `${i ? "L" : "M"}${(129 + Math.cos(t) * r).toFixed(1)} ${(166 - Math.sin(t) * r).toFixed(1)}`;
  }
  const ribs = Array.from({ length: 13 }, (_, i) => {
    const y = 200 + i * 9, half = 50 - i * 3.4;
    return `<path d="M${132 - half} ${y}q${half * .8} -15 ${half * 1.9} 2"/>`;
  }).join("");
  return `<defs><linearGradient id="conch" x2="1" y2=".6"><stop stop-color="#a98b70"/><stop offset=".4" stop-color="#f0dfc3"/><stop offset=".72" stop-color="#d1b394"/><stop offset="1" stop-color="#a27d67"/></linearGradient><linearGradient id="lip" x2="1" y2="1"><stop stop-color="#a66f6c"/><stop offset=".55" stop-color="#dfb3a4"/><stop offset="1" stop-color="#f6e0c6"/></linearGradient></defs><g transform="rotate(-14 150 200)" stroke-linejoin="round"><path d="M123 119Q159 117 188 151Q219 182 205 219Q194 248 174 266L149 318Q129 305 110 269Q88 239 79 206Q76 174 95 146Q104 128 123 119Z" fill="url(#conch)" stroke="#9a7d68" stroke-width="2.5"/><path d="M129 130Q173 133 193 168Q205 188 198 208Q181 221 159 216Q146 198 138 195Q107 203 87 193Q87 149 129 130Z" fill="#e3ceb3" stroke="#a98a70" stroke-width="1.5"/><path d="${spiral}" fill="none" stroke="#8b6e59" stroke-width="3" stroke-linecap="round"/><g fill="none" stroke="#a58370" stroke-width="1.5" opacity=".75">${ribs}</g><path d="M137 192Q199 198 201 240Q195 261 174 284Q153 295 147 315Q126 312 115 286Q130 251 116 216Q118 200 137 192Z" fill="url(#lip)" stroke="#a57570" stroke-width="2.5"/><path d="M142 205Q175 209 186 230Q184 258 157 279Q142 283 132 270Q151 238 137 219Z" fill="#6f4f4f" opacity=".65"/><path d="M137 201Q168 201 191 230Q190 254 156 283Q139 298 147 312" fill="none" stroke="#f8e6d4" stroke-width="8" stroke-linecap="round"/><path d="M93 200Q108 211 114 242M102 166q13 15 38 13" fill="none" stroke="#f8e8d2" stroke-width="3" opacity=".65"/></g>`;
}
function scallop() {
  const edge = "M150 298Q104 290 64 260Q51 250 59 233Q47 218 65 202Q58 184 77 170Q76 151 96 139Q102 120 123 118Q133 103 150 105Q166 103 177 118Q199 120 204 139Q225 150 223 170Q244 183 235 202Q254 216 241 233Q249 250 236 260Q196 290 150 298Z";
  const ribs = Array.from({ length: 11 }, (_, i) => {
    const a = Math.PI + i / 10 * Math.PI, x = 150 + Math.cos(a) * 85, y = 263 + Math.sin(a) * 140;
    return `<path d="M150 284Q${((150 + x) / 2).toFixed(1)} ${((y + 284) / 2 - 16).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}"/>`;
  }).join("");
  return `<defs><radialGradient id="shellPearl" cx=".52" cy=".84" r=".84"><stop stop-color="#fff4dc"/><stop offset=".56" stop-color="#e9d6b9"/><stop offset=".84" stop-color="#d4bba5"/><stop offset="1" stop-color="#b69d87"/></radialGradient></defs><path d="M56 257l-14-20 33 7M244 257l14-20-33 7" fill="#c9b196" stroke="#987f65" stroke-width="2"/><path d="${edge}" fill="url(#shellPearl)" stroke="#9e876e" stroke-width="2.8" stroke-linejoin="round"/><g fill="none" stroke="#b39880" stroke-width="2.2" opacity=".82">${ribs}</g><g fill="none" stroke="#fff5e2" stroke-width="2.5" opacity=".9">${Array.from({ length: 9 }, (_, i) => { const a = Math.PI + (i + .5) / 10 * Math.PI; return `<path d="M150 279L${(150 + Math.cos(a) * 79).toFixed(1)} ${(263 + Math.sin(a) * 133).toFixed(1)}"/>`; }).join("")}</g><path d="M105 287Q150 270 195 287Q150 311 105 287Z" fill="#c4a486" stroke="#977b62" stroke-width="2"/><circle cx="150" cy="288" r="4" fill="#e9d3b3"/>`;
}
function starfish() {
  const cx = 150, cy = 170;
  let outline = "";
  for (let i = 0; i <= 200; i++) {
    const a = -Math.PI / 2 + i / 200 * Math.PI * 2;
    const tip = (Math.cos((a + Math.PI / 2) * 5) + 1) / 2;
    const r = 42 + 78 * tip ** 2.5;
    outline += `${i ? "L" : "M"}${(cx + Math.cos(a) * r).toFixed(1)} ${(cy + Math.sin(a) * r).toFixed(1)}`;
  }
  const markings = Array.from({ length: 5 }, (_, arm) => {
    const a = -Math.PI / 2 + arm * Math.PI * 2 / 5;
    return Array.from({ length: 5 }, (_, j) => {
      const r = 28 + j * 17, off = j % 2 ? 5 : -5;
      return `<circle cx="${(cx + Math.cos(a) * r + Math.sin(a) * off).toFixed(1)}" cy="${(cy + Math.sin(a) * r - Math.cos(a) * off).toFixed(1)}" r="${(3.6 - j * .3).toFixed(1)}"/>`;
    }).join("");
  }).join("");
  return `<defs><radialGradient id="starPigment" cx=".46" cy=".42" r=".72"><stop stop-color="#efd3b0"/><stop offset=".57" stop-color="#d69d87"/><stop offset="1" stop-color="#ae6f65"/></radialGradient></defs><path d="${outline}Z" fill="url(#starPigment)" stroke="#986c61" stroke-width="2.6" stroke-linejoin="round"/><g fill="none" stroke="#f8e4cc" stroke-width="1.6" opacity=".65">${Array.from({ length: 5 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI * 2 / 5; return `<path d="M150 170Q${(cx + Math.cos(a) * 42).toFixed(1)} ${(cy + Math.sin(a) * 42).toFixed(1)} ${(cx + Math.cos(a) * 105).toFixed(1)} ${(cy + Math.sin(a) * 103).toFixed(1)}"/>`; }).join("")}</g><g fill="#aa7164" opacity=".77">${markings}</g><circle cx="150" cy="170" r="12" fill="#e0b196" stroke="#b98072" stroke-width="1.4"/>`;
}
function jellyfish() {
  const filaments = Array.from({ length: 8 }, (_, i) => {
    const x = 90 + i * 17, end = 332 - (i % 3) * 18, sway = i % 2 ? 14 : -14;
    return `<path d="M${x} 190C${x + sway} 222 ${x - sway} 249 ${x + sway} 280S${x - sway} ${end - 14} ${x + sway * .4} ${end}" fill="none" stroke="${i % 3 ? "#ae97a4" : "#c6aeba"}" stroke-width="${i % 3 ? 2 : 2.7}" stroke-linecap="round" opacity=".76"/>`;
  }).join("");
  return `<defs><linearGradient id="jellyBell" x2=".8" y2="1"><stop stop-color="#f5e6e5"/><stop offset=".45" stop-color="#dbbac6"/><stop offset="1" stop-color="#a88caa"/></linearGradient></defs><g>${filaments}<path d="M121 195Q106 245 131 293Q148 312 143 323M179 195Q196 245 169 293Q153 312 158 326" fill="none" stroke="#a58199" stroke-width="7" opacity=".45" stroke-linecap="round"/><path d="M51 186Q52 76 150 73Q249 76 249 186Q232 201 215 187Q194 207 174 189Q151 208 129 189Q106 207 85 187Q65 201 51 186Z" fill="url(#jellyBell)" stroke="#9e849b" stroke-width="2.6"/><path d="M61 177Q73 100 150 91Q222 95 239 177" fill="none" stroke="#f8f0e9" stroke-width="4" opacity=".8"/><path d="M72 158Q118 171 150 159Q183 171 229 158" fill="none" stroke="#b48fa3" stroke-width="2" opacity=".6"/><path d="M103 169Q121 137 133 160Q150 132 167 160Q180 138 198 169" fill="none" stroke="#b78fa0" stroke-width="2" opacity=".6"/><g fill="#f4e3df" opacity=".58"><circle cx="111" cy="119" r="6"/><circle cx="164" cy="105" r="4"/><circle cx="197" cy="142" r="5"/></g></g>`;
}
function crab() {
  const legs = Array.from({ length: 3 }, (_, row) => [-1, 1].map(side => {
    const y = 169 + row * 24, from = 150 + side * 67;
    return `<path d="M${from} ${y}Q${from + side * 35} ${y - 10} ${from + side * 52} ${y + 10}L${from + side * (72 + row * 5)} ${y + 40 + row * 9}" fill="none" stroke="#9e6757" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="M${from + side * 52} ${y + 10}l${side * (20 + row * 5)} ${30 + row * 9}" fill="none" stroke="#d3a58b" stroke-width="1.3"/>`;
  }).join("")).join("");
  const claw = `<path d="M95 164Q70 147 50 149Q31 153 27 174Q26 188 45 191Q43 177 58 169Q55 194 74 195Q91 185 98 173Z" fill="#c18970" stroke="#895948" stroke-width="2.3"/><path d="M32 172Q38 156 53 156M57 170Q66 179 68 191" fill="none" stroke="#f0c7a8" stroke-width="2"/><path d="M91 168Q72 158 60 169" fill="none" stroke="#855644" stroke-width="1.4"/>`;
  return `<defs><linearGradient id="crabShell" x2=".25" y2="1"><stop stop-color="#e1ae91"/><stop offset=".58" stop-color="#bd806b"/><stop offset="1" stop-color="#945e53"/></linearGradient></defs><g stroke-linejoin="round">${legs}<g>${claw}</g><g transform="translate(300 0) scale(-1 1)">${claw}</g><path d="M79 171Q87 129 150 126Q213 129 221 171Q215 222 150 234Q85 222 79 171Z" fill="url(#crabShell)" stroke="#895848" stroke-width="2.8"/><path d="M94 156Q139 132 202 157" stroke="#f1c7ac" stroke-width="3.3" fill="none" opacity=".7"/><path d="M104 197Q151 216 196 197" stroke="#965e51" stroke-width="1.4" fill="none"/><path d="M117 143l-9-10M183 143l9-10" stroke="#8d594d" stroke-width="2"/><g fill="#6c463d"><circle cx="113" cy="152" r="3.6"/><circle cx="187" cy="152" r="3.6"/></g><g fill="#e9b69b" opacity=".68"><circle cx="123" cy="177" r="2.3"/><circle cx="140" cy="165" r="2"/><circle cx="162" cy="181" r="2.5"/><circle cx="177" cy="169" r="2"/></g></g>`;
}
function dragonfly() {
  const wing = `<path d="M149 164Q101 106 39 111Q24 119 43 136Q86 166 145 176Z" fill="url(#wingGlass)" stroke="#667f79" stroke-width="2"/><path d="M149 184Q99 194 49 239Q38 253 56 253Q114 242 150 194Z" fill="url(#wingGlass)" stroke="#667f79" stroke-width="2"/><g fill="none" stroke="#8da69a" stroke-width="1.1" opacity=".82"><path d="M147 170Q94 133 41 120M146 190Q94 213 51 247"/>${[0, 1, 2, 3, 4].map(i => `<path d="M${66 + i * 17} ${121 + i * 8}q-9 9-4 23M${62 + i * 18} ${242 - i * 8}q-5-10 3-19"/>`).join("")}</g><path d="M45 118l18 15M52 249l17-9" stroke="#536e68" stroke-width="3"/>`;
  const segments = Array.from({ length: 9 }, (_, i) => `<path d="M${149 + i * .4} ${215 + i * 12}q-2 3 0 7" fill="none" stroke="#d8caa9" stroke-width="1.4" opacity=".8"/>`).join("");
  return `<defs><linearGradient id="wingGlass" x2="1" y2="1"><stop stop-color="#f7f2dd" stop-opacity=".89"/><stop offset=".55" stop-color="#d9e2d6" stop-opacity=".85"/><stop offset="1" stop-color="#a9c0af" stop-opacity=".72"/></linearGradient><linearGradient id="dragonBody" x2="1" y2="1"><stop stop-color="#819c8b"/><stop offset="1" stop-color="#3f6762"/></linearGradient></defs><g>${wing}<g transform="translate(300 0) scale(-1 1)">${wing}</g><path d="M150 207Q159 248 153 327" fill="none" stroke="#496c66" stroke-width="8" stroke-linecap="round"/>${segments}<ellipse cx="150" cy="182" rx="14" ry="38" fill="url(#dragonBody)" stroke="#3f605a" stroke-width="2"/><circle cx="150" cy="129" r="14" fill="#57766e" stroke="#3e5852" stroke-width="2"/><circle cx="138" cy="128" r="8" fill="#435a59"/><circle cx="162" cy="128" r="8" fill="#435a59"/><path d="M145 124q3-3 5 0" stroke="#cfdfc6" stroke-width="2" fill="none" opacity=".6"/><path d="M144 324l-8 12m17-12 10 11" stroke="#546a63" stroke-width="2.6"/></g>`;
}
function feather() {
  const vane = "M157 59Q106 92 96 167Q80 231 119 300Q140 322 156 334Q207 287 214 205Q226 119 157 59Z";
  const barbs = Array.from({ length: 23 }, (_, i) => {
    const y = 86 + i * 10.3;
    return `<path d="M${156 + i * .3} ${y.toFixed(1)}Q${108 + i * .2} ${(y + 1).toFixed(1)} 81 ${(y - 20).toFixed(1)}M${156 + i * .3} ${y.toFixed(1)}Q${207 + i * .15} ${(y - 9).toFixed(1)} 225 ${(y - 32).toFixed(1)}"/>`;
  }).join("");
  return `<defs><linearGradient id="featherVane" x2="1" y2=".2"><stop stop-color="#8d8476"/><stop offset=".45" stop-color="#d7cbb6"/><stop offset=".53" stop-color="#f0e7d1"/><stop offset="1" stop-color="#ad9d82"/></linearGradient><clipPath id="featherClip"><path d="${vane}"/></clipPath></defs><g transform="rotate(15 150 200)"><path d="${vane}" fill="url(#featherVane)" stroke="#978d78" stroke-width="2.2"/><g clip-path="url(#featherClip)" fill="none" stroke="#887d6b" stroke-width="1.35" opacity=".54">${barbs}</g><path d="M156 64Q146 165 157 331Q164 359 173 380" stroke="#806f5a" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M158 66Q157 174 159 323" stroke="#f9f2de" stroke-width="1.6" fill="none"/><path d="M144 298q8 20 15 26" stroke="#eee4cc" stroke-width="4" fill="none" opacity=".7"/></g>`;
}
function bee() {
  const fur = Array.from({ length: 15 }, (_, i) => {
    const x = 107 + (i % 5) * 13, y = 166 + Math.floor(i / 5) * 14;
    return `<path d="M${x} ${y}l${i % 2 ? 7 : -7} -7"/>`;
  }).join("");
  return `<defs><linearGradient id="beeGold" x2="0" y2="1"><stop stop-color="#edce8b"/><stop offset=".5" stop-color="#cba75f"/><stop offset="1" stop-color="#8f7447"/></linearGradient><linearGradient id="beeWing" x2="1" y2="1"><stop stop-color="#f7f2df" stop-opacity=".88"/><stop offset="1" stop-color="#a8b6ab" stop-opacity=".7"/></linearGradient><clipPath id="beeAbdomen"><ellipse cx="195" cy="195" rx="53" ry="33"/></clipPath></defs><g stroke-linejoin="round"><g fill="none" stroke="#584d35" stroke-width="2.7" stroke-linecap="round"><path d="M120 208q-22 27-28 54m56-49q-8 30-2 53m26-52q7 27 18 44m-83-46q-31 14-41 29"/></g><ellipse cx="195" cy="195" rx="53" ry="33" fill="url(#beeGold)" stroke="#80613f" stroke-width="2"/><g clip-path="url(#beeAbdomen)" stroke="#574932" stroke-width="13" opacity=".88"><path d="M171 149q22 38-1 87M200 146q24 49-2 99M231 155q15 40-6 74"/></g><path d="M244 194q18 2 21 14l-19-4" fill="#74583d"/><path d="M135 180Q126 129 151 91Q177 72 178 121Q174 160 148 185Z" fill="url(#beeWing)" stroke="#8d9f94" stroke-width="2"/><path d="M145 181Q128 112 113 98Q84 88 100 129Q113 159 139 187Z" fill="url(#beeWing)" stroke="#8d9f94" stroke-width="2"/><g fill="none" stroke="#9eaa9a" stroke-width="1.2" opacity=".85"><path d="M145 180q24-47 19-90M137 180q-18-48-30-76M147 154l-21-25m27 14 18-32"/></g><ellipse cx="132" cy="193" rx="39" ry="40" fill="url(#beeGold)" stroke="#846a48" stroke-width="2"/><g stroke="#f6dfab" stroke-width="2" opacity=".72">${fur}</g><circle cx="91" cy="197" r="25" fill="#695945" stroke="#4f4336" stroke-width="2"/><ellipse cx="80" cy="194" rx="10" ry="14" fill="#413d32"/><path d="M82 178Q61 145 49 151M91 173Q86 143 70 139" fill="none" stroke="#5c523b" stroke-width="2.6" stroke-linecap="round"/><circle cx="49" cy="151" r="3.5" fill="#5c523b"/><circle cx="70" cy="139" r="3.5" fill="#5c523b"/><path d="M66 205q-13 7-14 14" fill="none" stroke="#51483a" stroke-width="2"/></g>`;
}
function natureButterfly() {
  const wing = `<path d="M148 158Q102 102 80 68Q52 37 31 70Q14 106 34 157Q57 190 142 180Z" fill="#aa8866" stroke="#685941" stroke-width="2.7"/><path d="M147 178Q104 171 68 191Q40 198 51 237Q74 269 109 263Q138 251 150 194Z" fill="#b79570" stroke="#685941" stroke-width="2.7"/><path d="M141 166Q95 106 62 75Q33 110 51 147Q84 170 141 175Z" fill="#d8bd91" opacity=".82"/><path d="M145 189Q95 186 70 211Q70 247 107 250Q135 235 145 189Z" fill="#dac49f" opacity=".77"/><path d="M143 178Q90 118 48 92M143 181Q88 141 37 144M139 199Q108 211 97 253" fill="none" stroke="#705d47" stroke-width="1.6" opacity=".68"/><ellipse cx="67" cy="126" rx="19" ry="24" fill="#695a48"/><ellipse cx="67" cy="126" rx="13" ry="18" fill="#d7c39b"/><ellipse cx="67" cy="126" rx="7" ry="10" fill="#6a5b4b"/><ellipse cx="94" cy="222" rx="12" ry="14" fill="#8e7057"/><ellipse cx="94" cy="222" rx="6" ry="7" fill="#eedbbb"/><g fill="#f5e6c2">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<circle cx="${33 + i * 15}" cy="${82 + (i % 3) * 7}" r="3.1"/>`).join("")}${[0, 1, 2, 3].map(i => `<circle cx="${53 + i * 11}" cy="${239 + (i % 2) * 6}" r="2.5"/>`).join("")}</g>`;
  return `<g>${wing}<g transform="translate(300 0) scale(-1 1)">${wing}</g><path d="M149 148Q145 185 150 222Q155 185 151 148Z" fill="#574b3e" stroke="#433a32" stroke-width="1.6"/><circle cx="150" cy="146" r="7" fill="#5a4b3d"/><path d="M147 143Q137 115 120 107M153 143Q163 115 180 107" fill="none" stroke="#554739" stroke-width="2" stroke-linecap="round"/></g>`;
}

add("fish-koi", "池塘锦鲤", "nature", svgUrl(fish(), 300, 300), 300, 300, 58);
add("shell-spiral", "螺旋海螺", "nature", svgUrl(spiralShell()), 300, 400, 36);
add("shell-scallop", "扇贝空壳", "nature", svgUrl(scallop(), 300, 340), 300, 340, 46);
add("starfish", "五角海星", "nature", svgUrl(starfish(), 300, 340), 300, 340, 42);
add("jellyfish", "月白水母", "nature", svgUrl(jellyfish(), 300, 360), 300, 360, 38);
add("crab", "沙滩小蟹", "nature", svgUrl(crab(), 300, 300), 300, 300, 52);
add("dragonfly", "芦苇蜻蜓", "nature", svgUrl(dragonfly(), 300, 360), 300, 360, 40);
add("feather-grey", "灰羽落叶", "nature", svgUrl(feather()), 300, 400, 32);
add("bee", "野地蜜蜂", "nature", svgUrl(bee(), 280, 300), 280, 300, 40);
add("butterfly-nature", "旧纸蝴蝶", "nature", svgUrl(natureButterfly(), 300, 320), 300, 320, 44);

export const MATERIALS = list;
export const CATEGORIES = [
  ["all", "全部"],
  ["botanical", "花与叶"],
  ["nature", "自然造物"],
  ["handwritten", "手写条"],
  ["stamp", "邮票"],
  ["medal", "勋章"],
  ["sticker", "贴纸"],
  ["ribbon", "丝带"],
  ["postcard", "明信片"],
  ["illustration", "插画"],
  ["photo", "照片框"],
  ["tape", "胶带"],
  ["decoration", "小物件"],
];
