const gold = `
<defs>
  <linearGradient id="g" x2="1" y2="1"><stop stop-color="#f4dfa8"/><stop offset=".28" stop-color="#c8a263"/><stop offset=".55" stop-color="#8e6a38"/><stop offset=".76" stop-color="#e7c88d"/><stop offset="1" stop-color="#6f5129"/></linearGradient>
  <linearGradient id="paper" x2=".2" y2="1"><stop stop-color="#f3ead6"/><stop offset=".55" stop-color="#dfd1b4"/><stop offset="1" stop-color="#c7b696"/></linearGradient>
  <linearGradient id="ink" x2="1" y2="1"><stop stop-color="#3c332a"/><stop offset="1" stop-color="#6d5b45"/></linearGradient>
</defs>`;
const mask = (id, shape, color = "#fff") =>
  `<mask id="m-${id}"><rect width="100%" height="100%" fill="${color}"/><g fill="#000">${shape}</g></mask>`;
const rect = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}"/>`;

const shells = [
  {
    id: "none", name: "不套外壳", aspect: 1, window: { x: 0, y: 0, w: 1, h: 1, shape: "rect" },
    art: "", bg: "transparent",
  },
  {
    id: "frame-gold", name: "古董金相框", style: "victorian", aspect: 0.76,
    window: { x: 0.115, y: 0.105, w: 0.77, h: 0.79, shape: "rect" },
    art: (w, h) => `${mask("gold", `<path d="M0 0h${w}v${h}H0Z"/><rect x="${w * 0.105}" y="${h * 0.095}" width="${w * 0.79}" height="${h * 0.81}"/>`)}<g mask="url(#m-gold)"><rect width="${w}" height="${h}" fill="url(#g)"/><rect x="${w * 0.035}" y="${h * 0.032}" width="${w * 0.93}" height="${h * 0.936}" fill="none" stroke="#f8e6b8" stroke-width="${w * 0.008}"/><rect x="${w * 0.07}" y="${h * 0.064}" width="${w * 0.86}" height="${h * 0.872}" fill="none" stroke="#6b4c25" stroke-width="${w * 0.006}"/><path d="M${w * 0.04} ${h * 0.05}q${w * 0.05} ${h * 0.04} ${w * 0.05} ${h * 0.09}q0-${h * 0.05} ${w * 0.06}-${h * 0.05}m${w * 0.7} 0q${w * 0.06} 0 ${w * 0.06} ${h * 0.05}q0-${h * 0.05} ${w * 0.05}-${h * 0.09}" fill="none" stroke="#fff3ce" stroke-width="${w * 0.011}" opacity=".75"/><rect x="${w * 0.02}" y="${h * 0.02}" width="${w * 0.96}" height="${h * 0.96}" fill="none" stroke="#e8c78d" stroke-width="${w * 0.004}"/></g>`,
  },
  {
    id: "frame-oval", name: "洛可可椭圆浮雕", style: "rococo", aspect: 0.8,
    window: { x: 0.12, y: 0.1, w: 0.76, h: 0.8, shape: "ellipse" },
    art: (w, h) => {
      const cx = w / 2, cy = h / 2, rx = w * 0.44, ry = h * 0.455;
      return `${mask("oval", `<path d="M0 0h${w}v${h}H0Z"/><ellipse cx="${cx}" cy="${cy}" rx="${rx - w * 0.03}" ry="${ry - h * 0.03}"/>`)}<g mask="url(#m-oval)"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#f5ead0"/><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="url(#g)" stroke-width="${w * 0.042}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx - w * 0.024}" ry="${ry - h * 0.024}" fill="none" stroke="#8b6a3e" stroke-width="${w * 0.008}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx + w * 0.02}" ry="${ry + h * 0.018}" fill="none" stroke="#d9bd8a" stroke-width="${w * 0.006}"/><g fill="#c9a467" opacity=".9">${[0, 60, 120, 180, 240, 300].map(a => `<ellipse cx="${cx + Math.cos(a * Math.PI / 180) * rx}" cy="${cy + Math.sin(a * Math.PI / 180) * ry}" rx="${w * 0.05}" ry="${w * 0.022}" transform="rotate(${a} ${cx + Math.cos(a * Math.PI / 180) * rx} ${cy + Math.sin(a * Math.PI / 180) * ry})"/>`).join("")}</g></g>`;
    },
  },
  {
    id: "calendar", name: "老黄历日历", style: "victorian", aspect: 0.78,
    window: { x: 0.1, y: 0.14, w: 0.8, h: 0.6, shape: "rect" },
    art: (w, h) => `${mask("cal", `<path d="M0 0h${w}v${h}H0Z"/><rect x="${w * 0.09}" y="${h * 0.13}" width="${w * 0.82}" height="${h * 0.62}"/>`)}<g mask="url(#m-cal)">${rect(0, 0, w, h)}<rect width="${w}" height="${h}" fill="#d9c9a8"/><rect x="${w * 0.03}" y="${h * 0.03}" width="${w * 0.94}" height="${h * 0.94}" fill="none" stroke="#7b6748" stroke-width="${w * 0.008}"/><rect x="${w * 0.06}" y="${h * 0.055}" width="${w * 0.88}" height="${h * 0.09}" fill="#8e3f37"/><text x="${w / 2}" y="${h * 0.122}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.055}" letter-spacing="${w * 0.012}" fill="#f2e2bd">PERPETUAL CALENDAR</text><path d="M${w * 0.06} ${h * 0.79}h${w * 0.88}" stroke="#7b6748" stroke-width="${w * 0.005}"/><path d="M${w * 0.06} ${h * 0.84}h${w * 0.88}" stroke="#7b6748" stroke-width="${w * 0.005}"/><text x="${w / 2}" y="${h * 0.935}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.048}" fill="#5f5138">A DAY WORTH KEEPING</text><g fill="#7b6748"><circle cx="${w * 0.5}" cy="${h * 0.815}" r="${w * 0.012}"/></g></g>`,
  },
  {
    id: "note", name: "便签纸条", style: "vintage", aspect: 0.82,
    window: { x: 0.065, y: 0.16, w: 0.87, h: 0.62, shape: "rect" },
    art: (w, h) => `${mask("note", `<path d="M0 0h${w}v${h}H0Z"/><rect x="${w * 0.06}" y="${h * 0.15}" width="${w * 0.88}" height="${h * 0.64}"/>`)}<g mask="url(#m-note)"><path d="M0 ${h * 0.05} 47 0h${w * 0.9}l43 ${h * 0.05}-41 ${h * 0.045} 41 ${h * 0.05}v${h * 0.8}l-40 ${h * 0.05} 40 ${h * 0.04}-45 ${h * 0.02}H${w * 0.04}L0 ${h * 0.98}Z" fill="#e7d7b7"/><path d="M${w * 0.06} ${h * 0.15}h${w * 0.88}" stroke="#b7a077" stroke-width="${w * 0.004}" stroke-dasharray="${w * 0.02} ${w * 0.012}"/><path d="M${w * 0.06} ${h * 0.3}h${w * 0.88}M${w * 0.06} ${h * 0.44}h${w * 0.88}M${w * 0.06} ${h * 0.58}h${w * 0.88}M${w * 0.06} ${h * 0.72}h${w * 0.88}" stroke="#cbb98f" stroke-width="${w * 0.003}"/><path d="M${w * 0.29} 0h${w * 0.42}l-${w * 0.03} ${h * 0.1}H${w * 0.32}Z" fill="#b9a77f" opacity=".66"/><text x="${w / 2}" y="${h * 0.92}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.041}" letter-spacing="${w * 0.009}" fill="#7c6947">A SMALL NOTE</text></g>`,
  },
  {
    id: "film", name: "旧胶片", style: "modern", aspect: 1.42,
    window: { x: 0.09, y: 0.16, w: 0.82, h: 0.68, shape: "rect" },
    art: (w, h) => {
      let holes = "";
      for (let x = w * 0.03; x < w * 0.97; x += w * 0.075) holes += `<rect x="${x}" y="${h * 0.04}" width="${w * 0.04}" height="${h * 0.07}" rx="${w * 0.006}"/><rect x="${x}" y="${h * 0.89}" width="${w * 0.04}" height="${h * 0.07}" rx="${w * 0.006}"/>`;
      return `${mask("film", `<path d="M0 0h${w}v${h}H0Z"/><rect x="${w * 0.08}" y="${h * 0.15}" width="${w * 0.84}" height="${h * 0.7}"/>`)}<g mask="url(#m-film)">${rect(0, 0, w, h)}<rect width="${w}" height="${h}" fill="#2f2a25"/><g fill="#d9cba9">${holes}</g><rect x="${w * 0.08}" y="${h * 0.15}" width="${w * 0.84}" height="${h * 0.7}" fill="none" stroke="#b3a179" stroke-width="${w * 0.004}"/><text x="${w * 0.5}" y="${h * 0.965}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.028}" letter-spacing="${w * 0.008}" fill="#c9b791">KODAK · 125 ISO · MEMORY</text></g>`;
    },
  },
  {
    id: "medal", name: "旧勋章", style: "victorian", aspect: 0.78,
    window: { x: 0.25, y: 0.34, w: 0.5, h: 0.36, shape: "ellipse" },
    art: (w, h) => {
      const cx = w / 2, cy = h * 0.52, r = w * 0.31;
      return `${mask("medal", `<path d="M0 0h${w}v${h}H0Z"/><ellipse cx="${cx}" cy="${cy}" rx="${r * 0.72}" ry="${r * 0.74}"/>`)}<g mask="url(#m-medal)"><path d="M${w * 0.34} 0h${w * 0.12}l-${w * 0.06} ${h * 0.28}Z" fill="#7f3f3d"/><path d="M${w * 0.54} 0h${w * 0.12}l-${w * 0.06} ${h * 0.28}Z" fill="#5d5967"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g)" stroke="#6f5229" stroke-width="${w * 0.01}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="#e9dcc0"/><circle cx="${cx}" cy="${cy}" r="${r * 0.79}" fill="none" stroke="#a78650" stroke-width="${w * 0.006}"/><path d="m${cx} ${cy - r * 0.5} ${r * 0.11} ${r * 0.24} ${r * 0.24} ${r * 0.03}-${r * 0.18} ${r * 0.17} ${r * 0.05} ${r * 0.25}-${r * 0.22}-${r * 0.12}-${r * 0.22} ${r * 0.12} ${r * 0.05}-${r * 0.25}-${r * 0.18}-${r * 0.17} ${r * 0.24}-${r * 0.03}Z" fill="#a98a52"/><text x="${cx}" y="${cy + r * 0.62}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.046}" letter-spacing="${w * 0.01}" fill="#6d5730">KEEPSAKE</text></g>`;
    },
  },
  {
    id: "watch", name: "古董怀表", style: "victorian", aspect: 0.8,
    window: { x: 0.25, y: 0.31, w: 0.5, h: 0.4, shape: "circle" },
    art: (w, h) => {
      const cx = w / 2, cy = h * 0.53, r = w * 0.34;
      let ticks = "";
      for (let i = 0; i < 60; i++) {
        const a = i * Math.PI / 30, len = i % 5 ? 0.035 : 0.06;
        ticks += `<path d="M${cx + Math.sin(a) * r * 0.88} ${cy - Math.cos(a) * r * 0.88}l${-Math.sin(a) * r * len} ${Math.cos(a) * r * len}" stroke="#6b5330" stroke-width="${i % 5 ? w * 0.003 : w * 0.007}"/>`;
      }
      const nums = ["XII", "III", "VI", "IX"].map((n, i) => `<text x="${cx + Math.sin(i * Math.PI / 2) * r * 0.68}" y="${cy - Math.cos(i * Math.PI / 2) * r * 0.68 + w * 0.015}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.037}" fill="#5b4a31">${n}</text>`).join("");
      return `${mask("watch", `<path d="M0 0h${w}v${h}H0Z"/><circle cx="${cx}" cy="${cy}" r="${r * 0.7}"/>`)}<g mask="url(#m-watch)"><circle cx="${cx}" cy="${h * 0.12}" r="${w * 0.07}" fill="none" stroke="url(#g)" stroke-width="${w * 0.026}"/><rect x="${cx - w * 0.035}" y="${h * 0.15}" width="${w * 0.07}" height="${h * 0.05}" fill="url(#g)"/><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g)" stroke="#654a24" stroke-width="${w * 0.006}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="#e9dfc8"/><circle cx="${cx}" cy="${cy}" r="${r * 0.83}" fill="none" stroke="#b29665" stroke-width="${w * 0.004}"/>${ticks}${nums}<path d="M${cx} ${cy}l-${r * 0.3}-${r * 0.42}m${r * 0.3} ${r * 0.42} ${r * 0.46}-${r * 0.18}" stroke="#4a4032" stroke-width="${w * 0.008}" stroke-linecap="round"/><circle cx="${cx}" cy="${cy}" r="${w * 0.015}" fill="#7a5f34"/><text x="${cx}" y="${cy + r * 0.55}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.028}" fill="#8b7650">1893</text></g>`;
    },
  },
  {
    id: "gothic", name: "哥特尖拱窗", style: "gothic", aspect: 0.66,
    window: { x: 0.14, y: 0.16, w: 0.72, h: 0.66, shape: "arch" },
    art: (w, h) => {
      const top = h * 0.055, left = w * 0.1, right = w * 0.9, peak = w / 2, base = h * 0.85;
      return `${mask("gothic", `<path d="M0 0h${w}v${h}H0Z"/><path d="M${left} ${base}V${h * 0.36}Q${left} ${top} ${peak} ${top}q${w * 0.4} 0 ${w * 0.4} ${h * 0.3}V${base}Z"/>`)}<g mask="url(#m-gothic)"><rect width="${w}" height="${h}" fill="#2c2723"/><path d="M${left} ${base}V${h * 0.36}Q${left} ${top} ${peak} ${top}q${w * 0.4} 0 ${w * 0.4} ${h * 0.3}V${base}Z" fill="none" stroke="url(#g)" stroke-width="${w * 0.035}"/><path d="M${w * 0.06} ${base}V${h * 0.34}Q${w * 0.06} ${h * 0.02} ${peak} ${h * 0.02}q${w * 0.44} 0 ${w * 0.44} ${h * 0.32}V${base}" fill="none" stroke="#6f5c42" stroke-width="${w * 0.012}"/><path d="M${w * 0.02} ${base}h${w * 0.96}M${left} ${base}V${h * 0.36}" stroke="#8c7249" stroke-width="${w * 0.015}"/><circle cx="${peak}" cy="${h * 0.078}" r="${w * 0.045}" fill="none" stroke="#c5a873" stroke-width="${w * 0.008}"/><path d="M${peak} ${h * 0.045}l${w * 0.022} ${h * 0.022}-${w * 0.022} ${h * 0.022}-${w * 0.022}-${h * 0.022}Z" fill="#c5a873"/><path d="M${left} ${h * 0.62}q${w * 0.16}-${h * 0.09} ${w * 0.18} 0q-${w * 0.06} ${h * 0.1}-${w * 0.18} 0Zm${w * 0.36} 0q${w * 0.16}-${h * 0.09} ${w * 0.18} 0q-${w * 0.06} ${h * 0.1}-${w * 0.18} 0Z" fill="#3c352c" stroke="#8f7751" stroke-width="${w * 0.006}"/></g>`;
    },
  },
  {
    id: "mirror", name: "洛可可镜框", style: "rococo", aspect: 0.7,
    window: { x: 0.16, y: 0.13, w: 0.68, h: 0.72, shape: "arch" },
    art: (w, h) => {
      const cx = w / 2;
      const swirl = (x, y, s, flip = 1) => `<g transform="translate(${x} ${y}) scale(${flip} ${flip})"><path d="M0 0q${w * 0.14}-${h * 0.12} ${w * 0.2} ${h * 0.02}q${w * 0.06} ${h * 0.12}-${w * 0.06} ${h * 0.11}q-${w * 0.11}-${h * 0.01}-${w * 0.04}-${h * 0.08}q${w * 0.05}-${h * 0.04} ${w * 0.09} ${h * 0.02}" fill="none" stroke="#c3a267" stroke-width="${w * 0.013}"/><path d="M${w * 0.03} ${h * 0.12}q${w * 0.09}-${h * 0.02} ${w * 0.1} ${h * 0.08}" fill="none" stroke="#8e7448" stroke-width="${w * 0.007}"/><circle cx="${w * 0.1}" cy="${h * 0.035}" r="${w * 0.012}" fill="#e0c896"/></g>`;
      return `${mask("mirror", `<path d="M0 0h${w}v${h}H0Z"/><path d="M${w * 0.19} ${h * 0.84}V${h * 0.4}Q${w * 0.19} ${h * 0.16} ${cx} ${h * 0.11}q${w * 0.31} ${h * 0.05} ${w * 0.31} ${h * 0.29}V${h * 0.84}Z"/>`)}<g mask="url(#m-mirror)"><rect width="${w}" height="${h}" fill="#efe3c8"/><path d="M${w * 0.17} ${h * 0.86}V${h * 0.4}Q${w * 0.17} ${h * 0.14} ${cx} ${h * 0.09}q${w * 0.33} ${h * 0.05} ${w * 0.33} ${h * 0.31}V${h * 0.86}" fill="none" stroke="url(#g)" stroke-width="${w * 0.045}"/><path d="M${w * 0.12} ${h * 0.88}V${h * 0.38}Q${w * 0.12} ${h * 0.1} ${cx} ${h * 0.05}q${w * 0.38} ${h * 0.05} ${w * 0.38} ${h * 0.33}V${h * 0.88}" fill="none" stroke="#d4b782" stroke-width="${w * 0.008}"/>${swirl(w * 0.15, h * 0.9)}${swirl(w * 0.85, h * 0.9, 1, -1)}${swirl(w * 0.12, h * 0.44, 1)}${swirl(w * 0.88, h * 0.44, 1, -1)}<path d="M${cx - w * 0.07} ${h * 0.035}q${w * 0.07}-${h * 0.03} ${w * 0.14} 0q-${w * 0.04} ${h * 0.045}-${w * 0.14} 0Z" fill="#d8bd8b"/></g>`;
    },
  },
  {
    id: "stamp", name: "齿孔邮票", style: "victorian", aspect: 0.74,
    window: { x: 0.1, y: 0.12, w: 0.8, h: 0.74, shape: "rect" },
    art: (w, h) => {
      let perforation = "";
      const step = w * 0.035;
      for (let x = step; x < w; x += step) perforation += `<circle cx="${x}" cy="0" r="${w * 0.017}"/><circle cx="${x}" cy="${h}" r="${w * 0.017}"/>`;
      for (let y = step; y < h; y += step) perforation += `<circle cx="0" cy="${y}" r="${w * 0.017}"/><circle cx="${w}" cy="${y}" r="${w * 0.017}"/>`;
      return `${mask("stamp", `<path d="M0 0h${w}v${h}H0Z"/><rect x="${w * 0.09}" y="${h * 0.11}" width="${w * 0.82}" height="${h * 0.76}"/>`)}<g mask="url(#m-stamp)"><rect width="${w}" height="${h}" fill="#ded0b4"/><g fill="#c9b998">${perforation}</g><rect x="${w * 0.055}" y="${h * 0.05}" width="${w * 0.89}" height="${h * 0.9}" fill="none" stroke="#8f7a55" stroke-width="${w * 0.006}"/><rect x="${w * 0.09}" y="${h * 0.11}" width="${w * 0.82}" height="${h * 0.76}" fill="none" stroke="#aa9268" stroke-width="${w * 0.004}"/><text x="${w / 2}" y="${h * 0.925}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.043}" letter-spacing="${w * 0.01}" fill="#6b5a3d">POSTAGE · 1893</text><text x="${w * 0.86}" y="${h * 0.96}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.06}" fill="#8a3d35">2d</text></g>`;
    },
  },
  {
    id: "polaroid", name: "拍立得相纸", style: "modern", aspect: 0.82,
    window: { x: 0.07, y: 0.07, w: 0.86, h: 0.68, shape: "rect" },
    art: (w, h) => `${mask("polaroid", `<path d="M0 0h${w}v${h}H0Z"/><rect x="${w * 0.065}" y="${h * 0.06}" width="${w * 0.87}" height="${h * 0.7}"/>`)}<g mask="url(#m-polaroid)"><rect width="${w}" height="${h}" fill="#f2ecdf"/><rect x="${w * 0.03}" y="${h * 0.028}" width="${w * 0.94}" height="${h * 0.944}" fill="none" stroke="#d7cbb4" stroke-width="${w * 0.005}"/><text x="${w / 2}" y="${h * 0.855}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.048}" font-style="italic" fill="#9a8b73">a moment to keep</text><path d="M${w * 0.37} ${h * 0.93}h${w * 0.26}" stroke="#d3c4a9" stroke-width="${w * 0.004}"/></g>`,
  },
  {
    id: "lace", name: "蕾丝椭圆", style: "rococo", aspect: 0.84,
    window: { x: 0.13, y: 0.12, w: 0.74, h: 0.76, shape: "ellipse" },
    art: (w, h) => {
      const cx = w / 2, cy = h / 2, rx = w * 0.43, ry = h * 0.445;
      let lace = "";
      for (let i = 0; i < 36; i++) {
        const a = i * Math.PI / 18;
        lace += `<circle cx="${cx + Math.cos(a) * rx}" cy="${cy + Math.sin(a) * ry}" r="${w * 0.038}"/><circle cx="${cx + Math.cos(a) * rx * 0.92}" cy="${cy + Math.sin(a) * ry * 0.92}" r="${w * 0.012}" fill="none" stroke="#c8b18a" stroke-width="${w * 0.004}"/>`;
      }
      return `${mask("lace", `<path d="M0 0h${w}v${h}H0Z"/><ellipse cx="${cx}" cy="${cy}" rx="${rx - w * 0.035}" ry="${ry - h * 0.035}"/>`)}<g mask="url(#m-lace)"><rect width="${w}" height="${h}" fill="#f0e5cf"/><g fill="#eee3cd">${lace}</g><ellipse cx="${cx}" cy="${cy}" rx="${rx - w * 0.03}" ry="${ry - h * 0.03}" fill="none" stroke="#c3ad86" stroke-width="${w * 0.006}"/><ellipse cx="${cx}" cy="${cy}" rx="${rx - w * 0.05}" ry="${ry - h * 0.05}" fill="none" stroke="#d8c7a4" stroke-width="${w * 0.004}" stroke-dasharray="${w * 0.012} ${w * 0.008}"/></g>`;
    },
  },
  {
    id: "frame-wood", name: "原木画框", style: "curio", aspect: 0.78,
    window: { x: 0.175, y: 0.18, w: 0.655, h: 0.605, shape: "rect" },
    art: (w, h) => `${mask("wood", `<path d="M0 0h${w}v${h}H0Z"/><rect x="${w * 0.175}" y="${h * 0.18}" width="${w * 0.655}" height="${h * 0.605}"/>`)}<g mask="url(#m-wood)"><rect width="${w}" height="${h}" fill="#77573a"/><g fill="none" stroke="#5b412a" stroke-width="${w * 0.006}" opacity=".7">${[0, 1, 2, 3, 4, 5].map(i => `<path d="M${w * 0.05} ${h * (0.1 + i * 0.14)}q${w * 0.18} ${h * 0.028} ${w * 0.36} 0t${w * 0.5} 0"/>`).join("")}</g><rect x="${w * 0.03}" y="${h * 0.025}" width="${w * 0.94}" height="${h * 0.95}" fill="none" stroke="#4a3322" stroke-width="${w * 0.014}"/><rect x="${w * 0.115}" y="${h * 0.12}" width="${w * 0.77}" height="${h * 0.73}" fill="#efe3c9" stroke="#c3ab82" stroke-width="${w * 0.008}"/><rect x="${w * 0.145}" y="${h * 0.15}" width="${w * 0.71}" height="${h * 0.67}" fill="none" stroke="#b09873" stroke-width="${w * 0.004}"/><rect x="${w * 0.06}" y="${h * 0.05}" width="${w * 0.88}" height="${h * 0.9}" fill="none" stroke="#a3814f" stroke-width="${w * 0.004}"/></g>`,
  },
  {
    id: "ticket", name: "复古票根", style: "victorian", aspect: 1.5,
    window: { x: 0.13, y: 0.2, w: 0.74, h: 0.48, shape: "rect" },
    art: (w, h) => {
      let holes = "";
      const step = w * 0.028;
      for (let x = step; x < w; x += step) holes += `<circle cx="${x}" cy="${h * 0.035}" r="${w * 0.012}"/><circle cx="${x}" cy="${h * 0.965}" r="${w * 0.012}"/>`;
      for (let y = h * 0.06; y < h * 0.95; y += step) holes += `<circle cx="${w * 0.015}" cy="${y}" r="${w * 0.012}"/><circle cx="${w * 0.985}" cy="${y}" r="${w * 0.012}"/>`;
      return `<rect width="${w}" height="${h}" fill="#e8dabb"/><g fill="#d7c6a3">${holes}</g><rect x="${w * 0.05}" y="${h * 0.05}" width="${w * 0.9}" height="${h * 0.9}" fill="none" stroke="#9d8259" stroke-width="${w * 0.005}"/><rect x="${w * 0.05}" y="${h * 0.05}" width="${w * 0.9}" height="${h * 0.11}" fill="#8d4034"/><text x="${w * 0.5}" y="${h * 0.132}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.045}" letter-spacing="${w * 0.012}" fill="#f3e3c2">ADMIT ONE</text><path d="M${w * 0.5} ${h * 0.16}V${h * 0.95}" stroke="#a98f66" stroke-width="${w * 0.004}" stroke-dasharray="${w * 0.014} ${w * 0.01}"/><text x="${w * 0.28}" y="${h * 0.9}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.038}" fill="#6d5a3c">No. 0187</text><text x="${w * 0.75}" y="${h * 0.9}" text-anchor="middle" font-family="Georgia,serif" font-size="${w * 0.034}" fill="#8a7350">KEEP THIS</text><circle cx="${w * 0.5}" cy="${h * 0.76}" r="${w * 0.026}" fill="none" stroke="#8a3f34" stroke-width="${w * 0.006}"/>`;
    },
  },
  {
    id: "wreath", name: "月桂环", style: "nouveau", aspect: 0.86,
    window: { x: 0.2, y: 0.19, w: 0.6, h: 0.62, shape: "ellipse" },
    art: (w, h) => {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.44;
      let ring = "", berries = "";
      for (let i = 0; i < 32; i++) {
        const a = i / 32 * Math.PI * 2, rad = a * 180 / Math.PI;
        const x = cx + Math.cos(a) * r * (i % 2 ? 1 : 0.95), y = cy + Math.sin(a) * r * (i % 2 ? 1 : 0.95);
        ring += `<ellipse cx="${x}" cy="${y}" rx="${w * 0.062}" ry="${w * 0.027}" transform="rotate(${rad + 90} ${x} ${y})" fill="${i % 3 ? "#8d976f" : "#a3ad84"}" stroke="#67714b" stroke-width="1"/>`;
      }
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * Math.PI * 2 + 0.35;
        berries += `<circle cx="${cx + Math.cos(a) * r * 0.84}" cy="${cy + Math.sin(a) * r * 0.84}" r="${w * 0.017}" fill="#a4605a"/>`;
      }
      return `<circle cx="${cx}" cy="${cy}" r="${r * 0.86}" fill="none" stroke="#c1b28b" stroke-width="${w * 0.006}" stroke-dasharray="${w * 0.018} ${w * 0.014}"/>${ring}${berries}<circle cx="${cx}" cy="${cy}" r="${r * 1.14}" fill="none" stroke="#b9a97f" stroke-width="${w * 0.004}" opacity=".7"/>`;
    },
  },
  {
    id: "plate-round", name: "黄铜圆章", style: "baroque", aspect: 1,
    window: { x: 0.16, y: 0.16, w: 0.68, h: 0.68, shape: "circle" },
    art: (w, h) => {
      const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.47;
      let dots = "";
      for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2; dots += `<circle cx="${cx + Math.cos(a) * r * 0.845}" cy="${cy + Math.sin(a) * r * 0.845}" r="${w * 0.007}" fill="#6f5228"/>`; }
      return `${mask("plate", `<path d="M0 0h${w}v${h}H0Z"/><circle cx="${cx}" cy="${cy}" r="${r * 0.72}"/>`)}<g mask="url(#m-plate)"><circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#g)" stroke="#6d4f27" stroke-width="${w * 0.006}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.93}" fill="none" stroke="#f7e7bb" stroke-width="${w * 0.009}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="none" stroke="#7a5930" stroke-width="${w * 0.006}"/>${dots}<circle cx="${cx}" cy="${cy}" r="${r * 0.765}" fill="none" stroke="#8b6737" stroke-width="${w * 0.01}"/><g fill="#8d6b3a">${[0, 1, 2, 3, 4, 5, 6, 7].map(i => { const a = i / 8 * Math.PI * 2; return `<circle cx="${cx + Math.cos(a) * r * 0.99}" cy="${cy + Math.sin(a) * r * 0.99}" r="${w * 0.016}"/>`; }).join("")}</g></g>`;
    },
  },
  {
    id: "stained", name: "彩窗边框", style: "gothic", aspect: 0.7,
    window: { x: 0.14, y: 0.14, w: 0.72, h: 0.72, shape: "arch" },
    art: (w, h) => {
      const left = w * 0.14, right = w * 0.86, top = h * 0.14, base = h * 0.86, lw = w * 0.11;
      let glass = "";
      const colors = ["#2f4a5e", "#7a3b40", "#b08748", "#4a5c46", "#6a4a63"];
      for (let i = 0; i < 12; i++) {
        const y = top + (base - top) * i / 12;
        glass += `<rect x="${left - lw}" y="${y}" width="${lw}" height="${(base - top) / 12 + 2}" fill="${colors[i % colors.length]}" opacity=".85"/><rect x="${right}" y="${y}" width="${lw}" height="${(base - top) / 12 + 2}" fill="${colors[(i + 2) % colors.length]}" opacity=".85"/>`;
      }
      for (let i = 0; i < 7; i++) {
        const a = Math.PI + i / 6 * Math.PI, rr = (right - left) / 2 + lw * 0.55;
        glass += `<circle cx="${w / 2 + Math.cos(a) * rr * 0.92}" cy="${top + Math.sin(a) * rr * 0.72}" r="${w * 0.03}" fill="${colors[i % colors.length]}" opacity=".9"/>`;
      }
      return `<path d="M${left - lw} ${base}V${h * 0.36}Q${left - lw} ${top - lw} ${w / 2} ${top - lw}q${w / 2 - left + lw} 0 ${w / 2 - left + lw} ${h * 0.36 - top + lw}V${base}Z" fill="#2b2723"/>${glass}<path d="M${left} ${base}V${h * 0.37}Q${left} ${top} ${w / 2} ${top}q${right - w / 2} 0 ${right - w / 2} ${h * 0.37}V${base}" fill="none" stroke="url(#g)" stroke-width="${w * 0.028}"/><path d="M${left} ${base}h${right - left}" stroke="#8f7448" stroke-width="${w * 0.012}"/><path d="M${w / 2} ${top - lw}V${top}" stroke="#c8ab74" stroke-width="${w * 0.012}"/>`;
    },
  },
  {
    id: "pressed-flowers", name: "押花标本框", style: "nouveau", aspect: 0.78,
    window: { x: 0.09, y: 0.11, w: 0.82, h: 0.78, shape: "rect" },
    art: (w, h) => {
      const stem = (flip) => `<g transform="translate(${flip ? w : 0} 0) scale(${flip ? -1 : 1} 1)" fill="none" stroke="#798367" stroke-width="${w * .0035}"><path d="M${w*.045} ${h*.77}Q${w*.13} ${h*.62} ${w*.05} ${h*.41}"/><path d="M${w*.053} ${h*.6}q${w*.045}-${h*.06} ${w*.055}-${h*.018}q-${w*.02} ${h*.038}-${w*.055} ${h*.018}Zm${w*.015}-${h*.11}q${w*.07}-${h*.06} ${w*.06}-${h*.009}q-${w*.02} ${h*.043}-${w*.06} ${h*.009}Z" fill="#9ba387"/><circle cx="${w*.046}" cy="${h*.395}" r="${w*.02}" fill="#bd9b98" stroke="#9d7d7e"/><circle cx="${w*.046}" cy="${h*.395}" r="${w*.007}" fill="#e6cead"/></g>`;
      return `<rect width="${w}" height="${h}" fill="#eee5d3"/><rect x="${w*.027}" y="${h*.021}" width="${w*.946}" height="${h*.958}" fill="none" stroke="#a39a79" stroke-width="${w*.002}"/><rect x="${w*.062}" y="${h*.086}" width="${w*.876}" height="${h*.828}" fill="none" stroke="#c4ad8c" stroke-width="${w*.006}"/>${stem(false)}${stem(true)}<g font-family="Georgia,serif" text-anchor="middle" fill="#877862"><text x="${w/2}" y="${h*.055}" font-size="${w*.023}" letter-spacing="${w*.008}">HERBARIUM · 1893</text><text x="${w/2}" y="${h*.962}" font-size="${w*.02}" font-style="italic">A little piece of the garden</text></g>`;
    },
  },
  {
    id: "art-nouveau", name: "新艺术藤蔓框", style: "nouveau", aspect: 0.78,
    window: { x: 0.105, y: 0.10, w: 0.79, h: 0.80, shape: "rect" },
    art: (w, h) => {
      const curl = `<path d="M${w*.06} ${h*.28}Q${w*.13} ${h*.18} ${w*.05} ${h*.07}Q${w*.18} ${h*.14} ${w*.3} ${h*.045}Q${w*.15} ${h*.09} ${w*.14} ${h*.02}" fill="none" stroke="#819077" stroke-width="${w*.009}" stroke-linecap="round"/><path d="M${w*.05} ${h*.18}q${w*.055}-${h*.02} ${w*.055} ${h*.028}q-${w*.04} ${h*.026}-${w*.055}-${h*.028}Zm${w*.11}-${h*.09}q${w*.06}-${h*.03} ${w*.047} ${h*.018}q-${w*.043} ${h*.028}-${w*.047}-${h*.018}Z" fill="#a6b096"/><circle cx="${w*.12}" cy="${h*.098}" r="${w*.013}" fill="#b87e74"/>`;
      return `<rect width="${w}" height="${h}" fill="#e2dece"/><rect x="${w*.025}" y="${h*.025}" width="${w*.95}" height="${h*.95}" fill="none" stroke="#4d6256" stroke-width="${w*.018}"/><rect x="${w*.055}" y="${h*.05}" width="${w*.89}" height="${h*.9}" fill="none" stroke="#c4ab77" stroke-width="${w*.005}"/><rect x="${w*.094}" y="${h*.09}" width="${w*.812}" height="${h*.82}" fill="none" stroke="#566d60" stroke-width="${w*.003}"/><g>${curl}</g><g transform="translate(${w} 0) scale(-1 1)">${curl}</g><g transform="translate(0 ${h}) scale(1 -1)">${curl}</g><g transform="translate(${w} ${h}) scale(-1 -1)">${curl}</g><circle cx="${w/2}" cy="${h*.045}" r="${w*.016}" fill="#bd9c64"/><circle cx="${w/2}" cy="${h*.955}" r="${w*.016}" fill="#bd9c64"/>`;
    },
  },
  {
    id: "pearl-lace", name: "珍珠蕾丝框", style: "rococo", aspect: 0.82,
    window: { x: 0.1, y: 0.11, w: 0.8, h: 0.78, shape: "rect" },
    art: (w, h) => {
      let pearls = "";
      for (let x = w*.042; x <= w*.96; x += w*.037) pearls += `<circle cx="${x}" cy="${h*.045}" r="${w*.012}"/><circle cx="${x}" cy="${h*.955}" r="${w*.012}"/>`;
      for (let y = h*.06; y <= h*.94; y += w*.037) pearls += `<circle cx="${w*.04}" cy="${y}" r="${w*.012}"/><circle cx="${w*.96}" cy="${y}" r="${w*.012}"/>`;
      return `<rect width="${w}" height="${h}" fill="#e5d6cb"/><rect x="${w*.028}" y="${h*.024}" width="${w*.944}" height="${h*.952}" fill="none" stroke="#ae929a" stroke-width="${w*.006}"/><g fill="#fcf7ed" stroke="#d7c4b3" stroke-width="${w*.002}">${pearls}</g><rect x="${w*.077}" y="${h*.09}" width="${w*.846}" height="${h*.82}" fill="none" stroke="#fff8e9" stroke-width="${w*.014}"/><rect x="${w*.106}" y="${h*.114}" width="${w*.788}" height="${h*.772}" fill="none" stroke="#ae9191" stroke-width="${w*.005}"/><g fill="#f7ede2">${[0, 1, 2, 3].map(i => {const a=i*Math.PI/2;return `<ellipse cx="${w/2+Math.cos(a)*w*.445}" cy="${h/2+Math.sin(a)*h*.433}" rx="${w*.017}" ry="${w*.04}" transform="rotate(${i*90} ${w/2+Math.cos(a)*w*.445} ${h/2+Math.sin(a)*h*.433})"/>`;}).join("")}</g>`;
    },
  },
  {
    id: "film-slide", name: "幻灯片卡框", style: "modern", aspect: 1.1,
    window: { x: 0.085, y: 0.13, w: 0.83, h: 0.65, shape: "rect" },
    art: (w, h) => `<rect width="${w}" height="${h}" fill="#ebe2ce"/><rect x="${w*.028}" y="${h*.03}" width="${w*.944}" height="${h*.94}" fill="none" stroke="#c7b89b" stroke-width="${w*.005}"/><rect x="${w*.058}" y="${h*.1}" width="${w*.884}" height="${h*.72}" fill="none" stroke="#7b735f" stroke-width="${w*.008}"/><rect x="${w*.076}" y="${h*.122}" width="${w*.848}" height="${h*.666}" fill="none" stroke="#fbf5e8" stroke-width="${w*.012}"/><path d="M${w*.08} ${h*.875}h${w*.84}" stroke="#c0ad8c" stroke-width="${w*.002}"/><text x="${w*.09}" y="${h*.922}" font-family="Georgia,serif" font-size="${w*.032}" font-style="italic" fill="#81725c">a little memory</text><text x="${w*.91}" y="${h*.922}" text-anchor="end" font-family="Georgia,serif" font-size="${w*.028}" fill="#9d886d">01 / 24</text>`,
  },
];
const shellMap = new Map(shells.map(s => [s.id, s]));
const urls = new Map(), images = new Map(), loading = new Map();

export const STICKER_SHELLS = shells.map(({ id, name, style }) => ({ id, name, style }));

export function shellInfo(id) { return shellMap.get(id) || shellMap.get("none"); }

export function shellUrl(id) {
  const shell = shellInfo(id);
  if (!shell.art) return "";
  if (urls.has(id)) return urls.get(id);
  const W = 1080, H = Math.round(W / shell.aspect);
  const body = `${gold}${shell.art(W, H)}`
    .replace(/<mask[\s\S]*?<\/mask>/g, "")
    .replace(/\smask="url\(#m-[^"]+\)"/g, "");
  const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`);
  urls.set(id, url);
  return url;
}

export function shellImage(id) {
  if (!shellMap.get(id)?.art) return Promise.resolve(null);
  if (images.has(id)) return Promise.resolve(images.get(id));
  if (loading.has(id)) return loading.get(id);
  const promise = new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => { images.set(id, image); resolve(image); };
    image.onerror = () => { loading.delete(id); reject(new Error("外壳模板读取失败")); };
    image.src = shellUrl(id);
  });
  loading.set(id, promise);
  return promise;
}

function clipWindow(context, window, width, height) {
  const x = window.x * width, y = window.y * height, w = window.w * width, h = window.h * height;
  context.beginPath();
  if (window.shape === "ellipse") context.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
  else if (window.shape === "circle") context.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
  else if (window.shape === "arch") {
    const radius = w * 0.5;
    context.moveTo(x, y + h);
    context.lineTo(x, y + radius);
    context.quadraticCurveTo(x, y, x + radius, y);
    context.quadraticCurveTo(x + w, y, x + w, y + radius);
    context.lineTo(x + w, y + h);
  } else context.rect(x, y, w, h);
  context.closePath();
  context.clip();
}

export async function applyShell(sticker, id, maxSide = 1600) {
  const shell = shellInfo(id);
  if (!shell.art) return sticker;
  const overlay = await shellImage(id);
  if (!overlay) return sticker;
  const scale = Math.min(2.2, maxSide / Math.max(overlay.naturalWidth, overlay.naturalHeight));
  const width = Math.max(32, Math.round(overlay.naturalWidth * scale));
  const height = Math.max(32, Math.round(overlay.naturalHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.imageSmoothingQuality = "high";
  context.save();
  clipWindow(context, shell.window, width, height);
  const scaleX = (shell.window.w * width) / sticker.width;
  const scaleY = (shell.window.h * height) / sticker.height;
  const cover = Math.max(scaleX, scaleY);
  const drawW = sticker.width * cover, drawH = sticker.height * cover;
  context.drawImage(sticker, shell.window.x * width + ((shell.window.w * width) - drawW) / 2, shell.window.y * height + ((shell.window.h * height) - drawH) / 2, drawW, drawH);
  context.restore();
  const layer = document.createElement("canvas");
  layer.width = width;
  layer.height = height;
  const overlayContext = layer.getContext("2d");
  overlayContext.drawImage(overlay, 0, 0, width, height);
  overlayContext.globalCompositeOperation = "destination-out";
  overlayContext.save();
  clipWindow(overlayContext, shell.window, width, height);
  overlayContext.fillStyle = "#000";
  overlayContext.fill();
  overlayContext.restore();
  overlayContext.globalCompositeOperation = "source-over";
  context.drawImage(layer, 0, 0);
  return canvas;
}
