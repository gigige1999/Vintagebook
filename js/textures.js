export const BOOKS = [
  {
    id: "wine",
    name: "绯红往事",
    subtitle: "酒红皮革 · 古典烫金",
    english: "THE MEMORY BOOK",
    color: "#722f35",
    gold: "#c4a16b",
    motif: "rose",
    year: "MDCCCXCIII",
  },
  {
    id: "blue",
    name: "午夜诗集",
    subtitle: "深海蓝 · 星月镶金",
    english: "MIDNIGHT POETRY",
    color: "#304858",
    gold: "#c6ac75",
    motif: "stars",
    year: "VOL. II",
  },
  {
    id: "green",
    name: "森林来信",
    subtitle: "橄榄绿 · 植物烫金",
    english: "LETTERS FROM THE GARDEN",
    color: "#465242",
    gold: "#c6ae7b",
    motif: "botanical",
    year: "HERBARIUM · 1893",
  },
  {
    id: "pink",
    name: "蔷薇日记",
    subtitle: "玫瑰粉 · 田园织布",
    english: "A ROSE-TINTED LIFE",
    color: "#ae8580",
    gold: "#e1c6a0",
    motif: "floral",
    year: "A PRIVATE JOURNAL",
  },
  {
    id: "black",
    name: "秘藏之书",
    subtitle: "黑曜皮革 · 神秘纹章",
    english: "THE BOOK OF SECRETS",
    color: "#302d2e",
    gold: "#b79e70",
    motif: "magic",
    year: "EX LIBRIS",
  },
];
export const PAPERS = [
  {
    id: "ivory",
    name: "象牙书页",
    english: "Ivory",
    color: "#eae0c9",
    description: "温润象牙色，细细的棉纤维。",
    pattern: "plain",
  },
  {
    id: "aged",
    name: "岁月羊皮纸",
    english: "Parchment",
    color: "#d8bc88",
    description: "茶色晕染边缘，像被时光轻轻吻过。",
    pattern: "aged",
  },
  {
    id: "linen",
    name: "亚麻纤维",
    english: "Linen",
    color: "#e0d5b8",
    description: "未经漂白的亚麻，粗粝而自然。",
    pattern: "linen",
  },
  {
    id: "letter",
    name: "法式信笺",
    english: "Correspondence",
    color: "#ebe1ce",
    description: "细蓝横线，写一封迟到的来信。",
    pattern: "ruled",
  },
  {
    id: "grid",
    name: "旧时方格",
    english: "Quadrillé",
    color: "#e3dcc8",
    description: "淡淡的格线，记录日常的秩序。",
    pattern: "grid",
  },
  {
    id: "music",
    name: "泛黄乐谱",
    english: "Sonata",
    color: "#e6d7b9",
    description: "一段未完的旋律，一张旧乐谱。",
    pattern: "music",
  },
  {
    id: "botanical",
    name: "植物标本笺",
    english: "Herbarium",
    color: "#e2ddc5",
    description: "淡绿的植物纹样，来自花园的记忆。",
    pattern: "botanical",
  },
  {
    id: "rose",
    name: "蔷薇花笺",
    english: "Rosewater",
    color: "#e9d5cb",
    description: "褪色的蔷薇粉，藏着田园的温柔。",
    pattern: "rose",
  },
  {
    id: "kraft",
    name: "老牛皮纸",
    english: "Kraft",
    color: "#bd9c6f",
    description: "醇厚的焦糖色，带着旧包裹的气息。",
    pattern: "kraft",
  },
  {
    id: "newspaper",
    name: "旧报纸",
    english: "Gazette",
    color: "#d7c9aa",
    description: "密密的铅字，封存一日的故事。",
    pattern: "news",
  },
  {
    id: "lace",
    name: "蕾丝压花",
    english: "Dentelle",
    color: "#eee5d4",
    description: "奶油白的压花，细密的蕾丝边。",
    pattern: "lace",
  },
  {
    id: "blueprint",
    name: "蓝调手稿",
    english: "Blue notes",
    color: "#c5cfcc",
    description: "灰蓝纸面与淡墨，安静的旧手稿。",
    pattern: "blue",
  },
];
const cache = new Map();
export function seeded(seed = 1) {
  return () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
}
export function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}
function grain(ctx, w, h, random, strength = 15) {
  const image = ctx.getImageData(0, 0, w, h);
  for (let i = 0; i < image.data.length; i += 4) {
    const n = (random() - 0.5) * strength;
    image.data[i] += n;
    image.data[i + 1] += n;
    image.data[i + 2] += n;
  }
  ctx.putImageData(image, 0, 0);
}
function leaf(ctx, x, y, len, angle, color) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.strokeStyle = color;
  ctx.lineWidth = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(-len * 0.1, -len * 0.55, 0, -len);
  ctx.quadraticCurveTo(len * 0.55, -len * 0.55, 0, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(len * 0.12, -len * 0.8);
  ctx.stroke();
  ctx.restore();
}
export function paperTexture(id, w = 600, h = 840) {
  const key = `${id}-${w}-${h}`;
  if (cache.has(key)) return cache.get(key);
  const p = PAPERS.find((p) => p.id === id) || PAPERS[0];
  const c = canvas(w, h),
    x = c.getContext("2d"),
    r = seeded(PAPERS.indexOf(p) * 193 + 12);
  x.fillStyle = p.color;
  x.fillRect(0, 0, w, h);
  for (let i = 0; i < 45; i++) {
    let a = r() * w,
      b = r() * h,
      size = 30 + r() * 180;
    const g = x.createRadialGradient(a, b, 0, a, b, size);
    g.addColorStop(0, `rgba(133,101,49,${r() * 0.035})`);
    g.addColorStop(1, "rgba(133,101,49,0)");
    x.fillStyle = g;
    x.fillRect(a - size, b - size, size * 2, size * 2);
  }
  grain(x, w, h, r, p.pattern === "kraft" ? 18 : 10);
  for (let i = 0; i < 2000; i++) {
    x.strokeStyle = `rgba(116,94,61,${r() * 0.09})`;
    x.lineWidth = 0.4;
    x.beginPath();
    let a = r() * w,
      b = r() * h;
    x.moveTo(a, b);
    x.lineTo(a + r() * 3, b + r() * 8);
    x.stroke();
  }
  if (p.pattern === "aged" || p.pattern === "kraft") {
    const g = x.createRadialGradient(
      w / 2,
      h / 2,
      w * 0.3,
      w / 2,
      h / 2,
      h * 0.72,
    );
    g.addColorStop(0, "#67401500");
    g.addColorStop(1, p.pattern === "aged" ? "#89501d43" : "#50351524");
    x.fillStyle = g;
    x.fillRect(0, 0, w, h);
    for (let i = 0; i < 130; i++) {
      x.fillStyle = `rgba(126,81,38,${r() * 0.15})`;
      x.beginPath();
      x.ellipse(r() * w, r() * h, r() * 1.7 + 0.2, r() * 1.5 + 0.3, 0, 0, 7);
      x.fill();
    }
  }
  if (p.pattern === "linen") {
    for (let a = 0; a < w; a += 3) {
      x.strokeStyle = a % 6 ? "#6c684508" : "#fff7df1a";
      x.beginPath();
      x.moveTo(a, 0);
      x.lineTo(a, h);
      x.stroke();
    }
    for (let b = 0; b < h; b += 3) {
      x.strokeStyle = "#8275540c";
      x.beginPath();
      x.moveTo(0, b);
      x.lineTo(w, b);
      x.stroke();
    }
  }
  if (p.pattern === "ruled" || p.pattern === "blue") {
    x.strokeStyle = p.pattern === "blue" ? "#687b8128" : "#7885982c";
    x.lineWidth = 0.8;
    for (let b = 105; b < h - 60; b += 34) {
      x.beginPath();
      x.moveTo(35, b);
      x.lineTo(w - 35, b);
      x.stroke();
    }
    if (p.pattern === "ruled") {
      x.strokeStyle = "#b578752e";
      x.beginPath();
      x.moveTo(75, 80);
      x.lineTo(75, h - 55);
      x.stroke();
      x.font = "italic 18px Georgia";
      x.fillStyle = "#8e806756";
      x.fillText("Correspondance", w - 190, 55);
    }
  }
  if (p.pattern === "grid") {
    x.strokeStyle = "#71867926";
    x.lineWidth = 0.6;
    for (let a = 32; a < w - 22; a += 26) {
      x.beginPath();
      x.moveTo(a, 35);
      x.lineTo(a, h - 35);
      x.stroke();
    }
    for (let b = 35; b < h - 22; b += 26) {
      x.beginPath();
      x.moveTo(32, b);
      x.lineTo(w - 22, b);
      x.stroke();
    }
  }
  if (p.pattern === "music") {
    x.fillStyle = "#65543883";
    x.font = "italic 22px Georgia";
    x.textAlign = "center";
    x.fillText("Sonate pour un souvenir", w / 2, 56);
    x.font = "12px Georgia";
    x.fillText("Andante, con amore.", w / 2, 78);
    x.textAlign = "left";
    for (let k = 0; k < 7; k++) {
      const yy = 130 + k * 95;
      x.strokeStyle = "#67563866";
      x.lineWidth = 0.7;
      for (let j = 0; j < 5; j++) {
        x.beginPath();
        x.moveTo(35, yy + j * 9);
        x.lineTo(w - 35, yy + j * 9);
        x.stroke();
      }
      for (let i = 0; i < 14; i++) {
        const xx = 63 + i * 35,
          ny = yy + Math.floor(r() * 8) * 4.5;
        x.save();
        x.translate(xx, ny);
        x.rotate(-0.35);
        x.fillStyle = "#5a4a3277";
        x.beginPath();
        x.ellipse(0, 0, 4, 3, 0, 0, 7);
        x.fill();
        x.restore();
        x.beginPath();
        x.moveTo(xx + 3, ny);
        x.lineTo(xx + 3, ny - 23);
        x.stroke();
        if (i % 4 === 0) {
          x.beginPath();
          x.moveTo(xx, yy);
          x.lineTo(xx, yy + 36);
          x.stroke();
        }
      }
    }
  }
  if (p.pattern === "botanical") {
    x.strokeStyle = "#7680603c";
    x.lineWidth = 1;
    for (let side = 0; side < 2; side++) {
      const xx = side ? w - 35 : 35;
      x.beginPath();
      x.moveTo(xx, h - 60);
      x.bezierCurveTo(xx - 20, h * 0.65, xx + 20, h * 0.3, xx, 100);
      x.stroke();
      for (let i = 0; i < 11; i++) {
        leaf(
          x,
          xx,
          h - 95 - i * 56,
          30 + (i % 3) * 6,
          side ? -1.1 : 1.1,
          "#77805f38",
        );
        leaf(x, xx, h - 112 - i * 56, 24, side ? 0.8 : -0.8, "#77805f30");
      }
    }
    x.font = "11px Georgia";
    x.textAlign = "center";
    x.fillStyle = "#78826278";
    x.fillText("HORTUS · COLLECTION BOTANIQUE", w / 2, h - 25);
  }
  if (p.pattern === "rose") {
    x.strokeStyle = "#9e7c712b";
    x.strokeRect(25, 25, w - 50, h - 50);
    for (let a = 40; a < w; a += 75) {
      for (let b = 42; b < h; b += 85) {
        x.save();
        x.translate(a, b);
        x.fillStyle = "#b28b8130";
        for (let i = 0; i < 5; i++) {
          x.beginPath();
          x.ellipse(
            Math.cos(i * 1.25) * 4,
            Math.sin(i * 1.25) * 4,
            5,
            4,
            i * 1.25,
            0,
            7,
          );
          x.fill();
        }
        leaf(x, 4, 8, 16, 1, "#74806429");
        x.restore();
      }
    }
  }
  if (p.pattern === "news") {
    x.fillStyle = "#594b3682";
    x.textAlign = "center";
    x.font = "bold 32px Georgia";
    x.fillText("THE EVENING GAZETTE", w / 2, 57);
    x.font = "9px Georgia";
    x.fillText(
      "VOL. XXIV.     MONDAY, OCTOBER 16, 1893.     PRICE ONE PENNY.",
      w / 2,
      78,
    );
    x.strokeStyle = "#594b365c";
    x.beginPath();
    x.moveTo(25, 87);
    x.lineTo(w - 25, 87);
    x.stroke();
    x.textAlign = "left";
    const words = [
      "The quiet art of ordinary living.",
      "A garden in the heart of the city.",
      "On the beauty of small things.",
      "Notes from our correspondent.",
      "Yesterday, in the afternoon light,",
      "the old room held a certain warmth.",
      "Flowers were brought to the table,",
      "and letters arrived from far away.",
      "There are moments we must keep.",
    ];
    for (let col = 0; col < 3; col++) {
      const left = 25 + (col * (w - 50)) / 3;
      x.font = "bold 13px Georgia";
      x.fillText(
        col === 0
          ? "A LETTER FROM PARIS"
          : col === 1
            ? "THE GARDEN NOTES"
            : "LIFE & LETTERS",
        left,
        116,
      );
      x.font = "9px Georgia";
      for (let row = 0; row < 50; row++) {
        x.globalAlpha = 0.5 + r() * 0.3;
        x.fillText(words[Math.floor(r() * words.length)], left, 137 + row * 13);
      }
    }
    x.globalAlpha = 1;
  }
  if (p.pattern === "lace") {
    x.strokeStyle = "#a6906236";
    x.lineWidth = 0.6;
    for (let b = 14; b < h; b += 12) {
      for (let side = 0; side < 2; side++) {
        let xx = side ? w - 16 : 16;
        x.beginPath();
        x.arc(xx, b, 5, 0, 7);
        x.stroke();
        x.beginPath();
        x.arc(xx + (side ? -8 : 8), b, 3, 0, 7);
        x.stroke();
      }
    }
    for (let a = 14; a < w; a += 12) {
      x.beginPath();
      x.arc(a, 16, 5, 0, 7);
      x.stroke();
      x.beginPath();
      x.arc(a, h - 16, 5, 0, 7);
      x.stroke();
    }
    x.strokeRect(33, 33, w - 66, h - 66);
  }
  const edge = x.createLinearGradient(0, 0, w, 0);
  edge.addColorStop(0, "#8d6e3420");
  edge.addColorStop(0.04, "#8d6e3400");
  edge.addColorStop(0.95, "#8d6e3400");
  edge.addColorStop(1, "#8d6e341b");
  x.fillStyle = edge;
  x.fillRect(0, 0, w, h);
  cache.set(key, c);
  return c;
}
export function woodTexture(w = 1024, h = 1024) {
  const c = canvas(w, h),
    x = c.getContext("2d"),
    r = seeded(85);
  x.fillStyle = "#baa17b";
  x.fillRect(0, 0, w, h);
  for (let i = 0; i < h; i++) {
    const v =
      Math.sin(i * 0.045) * 5 + Math.sin(i * 0.28) * 2 + (r() - 0.5) * 6;
    x.strokeStyle = `rgba(${96 + v},${65 + v},${35 + v},${0.08 + r() * 0.1})`;
    x.lineWidth = 0.7;
    x.beginPath();
    x.moveTo(0, i);
    for (let j = 0; j <= w; j += 20)
      x.lineTo(
        j,
        i + Math.sin(j * 0.005 + i * 0.01) * 2 + Math.sin(j * 0.02) * 0.3,
      );
    x.stroke();
  }
  for (let i = 0; i < 17; i++) {
    let b = r() * h;
    x.strokeStyle = "#73552e1c";
    x.lineWidth = 0.7;
    x.beginPath();
    x.moveTo(0, b);
    x.bezierCurveTo(w * 0.25, b + 18, w * 0.7, b - 15, w, b + 6);
    x.stroke();
  }
  for (let b = 245; b < h; b += 260) {
    x.fillStyle = "#5b41231a";
    x.fillRect(0, b, w, 1);
    x.fillStyle = "#edddbd33";
    x.fillRect(0, b + 1, w, 1);
  }
  grain(x, w, h, r, 6);
  return c;
}
function ornament(ctx, x, y, s, color, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(s * (flip ? -1 : 1), s);
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, 42);
  ctx.bezierCurveTo(5, 5, 15, 5, 42, 0);
  ctx.moveTo(0, 29);
  ctx.bezierCurveTo(12, 11, 30, 11, 30, 0);
  ctx.moveTo(6, 31);
  ctx.bezierCurveTo(9, 21, 18, 14, 21, 9);
  ctx.stroke();
  leaf(ctx, 9, 24, 16, 0.7, color);
  leaf(ctx, 21, 10, 12, -0.1, color);
  ctx.restore();
}
export function coverTexture(book) {
  const c = canvas(768, 1080),
    x = c.getContext("2d"),
    r = seeded(123 + BOOKS.indexOf(book) * 100);
  x.fillStyle = book.color;
  x.fillRect(0, 0, 768, 1080);
  grain(x, 768, 1080, r, book.id === "pink" ? 15 : 22);
  for (let i = 0; i < 11000; i++) {
    x.fillStyle = r() > 0.5 ? "#ffffff07" : "#0000000c";
    x.beginPath();
    x.ellipse(r() * 768, r() * 1080, r() * 1.8, r() * 0.9, 0, 0, 7);
    x.fill();
  }
  const g = x.createLinearGradient(0, 0, 768, 0);
  g.addColorStop(0, "#0009");
  g.addColorStop(0.035, "#0002");
  g.addColorStop(0.05, "#ffffff10");
  g.addColorStop(0.07, "#0002");
  g.addColorStop(0.3, "#ffffff07");
  g.addColorStop(1, "#0003");
  x.fillStyle = g;
  x.fillRect(0, 0, 768, 1080);
  x.strokeStyle = book.gold;
  x.lineWidth = 2;
  x.strokeRect(54, 52, 665, 977);
  x.lineWidth = 0.8;
  x.strokeRect(64, 63, 645, 955);
  x.strokeRect(78, 77, 617, 927);
  ornament(x, 86, 86, 1.7, book.gold);
  ornament(x, 682, 86, 1.7, book.gold, true);
  x.save();
  x.translate(0, 1080);
  x.scale(1, -1);
  ornament(x, 86, 86, 1.7, book.gold);
  ornament(x, 682, 86, 1.7, book.gold, true);
  x.restore();
  x.strokeStyle = book.gold;
  x.globalAlpha = 0.5;
  x.beginPath();
  x.moveTo(160, 278);
  x.lineTo(608, 278);
  x.moveTo(160, 797);
  x.lineTo(608, 797);
  x.stroke();
  x.globalAlpha = 1;
  const cx = 384,
    cy = 494;
  x.save();
  x.translate(cx, cy);
  x.strokeStyle = book.gold;
  x.lineWidth = 1.5;
  if (book.motif === "botanical") {
    x.beginPath();
    x.moveTo(0, 126);
    x.bezierCurveTo(-25, 30, 24, -60, -4, -137);
    x.stroke();
    for (let i = 0; i < 9; i++) {
      leaf(
        x,
        Math.sin(i) * 8,
        96 - i * 25,
        45 + (i % 3) * 8,
        i % 2 ? -0.9 : 0.8,
        book.gold,
      );
    }
    x.beginPath();
    x.ellipse(0, 0, 115, 164, 0, 0, 7);
    x.stroke();
    x.globalAlpha = 0.45;
    x.beginPath();
    x.ellipse(0, 0, 122, 171, 0, 0, 7);
    x.stroke();
  }
  if (book.motif === "stars") {
    x.beginPath();
    x.arc(0, -10, 104, 0.4, 5.9);
    x.stroke();
    x.beginPath();
    x.arc(28, -25, 80, 1.9, 4.2);
    x.stroke();
    for (let i = 0; i < 26; i++) {
      let a = r() * 6.28,
        d = 35 + r() * 112,
        s = 2 + r() * 5;
      star(x, Math.cos(a) * d, Math.sin(a) * d, s, book.gold);
    }
    x.beginPath();
    x.ellipse(0, 0, 145, 155, 0.3, 0, 7);
    x.stroke();
  }
  if (book.motif === "magic") {
    x.beginPath();
    x.arc(0, 0, 132, 0, 7);
    x.stroke();
    x.beginPath();
    x.arc(0, 0, 116, 0, 7);
    x.stroke();
    for (let i = 0; i < 5; i++) {
      const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5;
      i
        ? x.lineTo(Math.cos(a) * 99, Math.sin(a) * 99)
        : x.moveTo(Math.cos(a) * 99, Math.sin(a) * 99);
    }
    x.closePath();
    x.stroke();
    x.beginPath();
    x.ellipse(0, 0, 47, 23, 0, 0, 7);
    x.stroke();
    x.beginPath();
    x.arc(0, 0, 14, 0, 7);
    x.stroke();
    for (let i = 0; i < 12; i++) {
      const a = (i * Math.PI) / 6;
      star(x, Math.cos(a) * 154, Math.sin(a) * 154, 4, book.gold);
    }
  }
  if (book.motif === "rose" || book.motif === "floral") {
    x.beginPath();
    x.ellipse(0, 0, 123, 165, 0, 0, 7);
    x.stroke();
    x.beginPath();
    x.moveTo(0, 114);
    x.bezierCurveTo(-5, 36, 22, 0, 0, -63);
    x.stroke();
    for (let j = 0; j < 4; j++)
      leaf(x, 0, 85 - j * 27, 45, j % 2 ? -0.9 : 0.9, book.gold);
    for (let j = 0; j < 7; j++) {
      const radius = 15 + j * 8;
      x.beginPath();
      x.arc(0, -64, radius, j * 0.7, j * 0.7 + 4.6);
      x.stroke();
    }
    if (book.motif === "floral") {
      x.globalAlpha = 0.2;
      for (let xx = -250; xx <= 250; xx += 65)
        for (let yy = -310; yy <= 400; yy += 65) {
          if (Math.abs(xx) < 150 && Math.abs(yy) < 200) continue;
          star(x, xx, yy, 5, book.gold);
        }
      x.globalAlpha = 1;
    }
  }
  x.restore();
  x.fillStyle = book.gold;
  x.textAlign = "center";
  x.font = "22px Georgia";
  x.fillText(book.english, 384, 741);
  x.font = "italic 18px Georgia";
  x.globalAlpha = 0.8;
  x.fillText(
    book.id === "green"
      ? "A collection of things worth keeping"
      : book.id === "black"
        ? "Of wonders, whispers & forgotten things"
        : "A collection of little memories",
    384,
    775,
  );
  x.font = "14px Georgia";
  x.fillText(book.year, 384, 940);
  x.globalAlpha = 1;
  for (let i = 0; i < 4; i++) {
    x.fillStyle = "#0003";
    x.fillRect(4, 155 + i * 230, 23, 9);
    x.fillStyle = book.gold + "60";
    x.fillRect(4, 155 + i * 230, 22, 2);
  }
  return c;
}
function star(x, a, b, s, color) {
  x.fillStyle = color;
  x.beginPath();
  x.moveTo(a, b - s);
  x.quadraticCurveTo(a + s * 0.18, b - s * 0.18, a + s, b);
  x.quadraticCurveTo(a + s * 0.18, b + s * 0.18, a, b + s);
  x.quadraticCurveTo(a - s * 0.18, b + s * 0.18, a - s, b);
  x.quadraticCurveTo(a - s * 0.18, b - s * 0.18, a, b - s);
  x.fill();
}
