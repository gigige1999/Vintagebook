export const NOTE_FONTS = [
  { id:'classic', name:'古典宋体', family:'"Songti SC","SimSun",Georgia,serif', style:'normal' },
  { id:'hand', name:'手写楷意', family:'"Kaiti SC","KaiTi","STKaiti",cursive', style:'normal' },
  { id:'modern', name:'清爽黑体', family:'"PingFang SC","Microsoft YaHei",Arial,sans-serif', style:'normal' },
  { id:'typewriter', name:'打字机', family:'"Courier New","Songti SC",monospace', style:'normal' },
  { id:'poetry', name:'斜体诗笺', family:'"Cormorant Garamond","Songti SC",Georgia,serif', style:'italic' }
];
const cache = new Map();
const font = (id) => NOTE_FONTS.find(f => f.id === id) || NOTE_FONTS[0];
export function noteFamily(id) { return font(id); }
function wrap(context, text, width) {
  const lines=[];
  for (const paragraph of String(text).split('\n')) {
    let line='';
    const chunks = paragraph.match(/[\u3400-\u9fff]|[^\s\u3400-\u9fff]+[ \t]*|[ \t]+/g) || [''];
    for (const chunk of chunks) {
      if (line && context.measureText(line+chunk).width > width) { lines.push(line.trimEnd()); line=''; }
      if (context.measureText(chunk).width > width) {
        for(const char of chunk){ if(line && context.measureText(line+char).width>width){lines.push(line);line='';} line+=char; }
      } else line+=chunk;
    }
    lines.push(line.trimEnd());
  }
  return lines;
}
export const CARD_PALETTES = [
  { id:'parchment', name:'羊皮纸', paper:'#e8dabd', ink:'#443b2c', accent:'#8a5a45', line:'#b6a17b', gold:'#a9874e' },
  { id:'gothic', name:'哥特墨', paper:'#ddd4c2', ink:'#2f2b28', accent:'#6e2f33', line:'#8d8577', gold:'#8a734f' },
  { id:'rococo', name:'洛可可', paper:'#f0e6d6', ink:'#5b4a3e', accent:'#ad7f7c', line:'#cbae9a', gold:'#bb9660' },
  { id:'sage', name:'鼠尾草', paper:'#e2e3d1', ink:'#3c453a', accent:'#6e7f65', line:'#a9b197', gold:'#8e8a5f' },
  { id:'sepia', name:'旧照片', paper:'#e8dcc5', ink:'#50402f', accent:'#96724f', line:'#c0ab8a', gold:'#ad8b55' },
  { id:'midnight', name:'午夜蓝', paper:'#d8d9d5', ink:'#31363c', accent:'#4f5f6e', line:'#9aa1a0', gold:'#928c72' }
];
export const CARD_KINDS = {
  date: { label:'日期条', w:360, h:92, count:30, max:40, placeholder:'2026 · 11 · 16' },
  diary: { label:'日记便签', w:380, h:520, count:30, max:800, placeholder:'今天发生的事，值得慢慢写下来……' }
};
export const CARD_LAYOUTS = { date:5, diary:5 };
export function cardStyle(kind, index) {
  const palette = CARD_PALETTES[index % CARD_PALETTES.length];
  const layout = Math.floor(index / CARD_PALETTES.length) % (CARD_LAYOUTS[kind] || 5);
  return { palette, layout };
}
export function cardName(kind, index) {
  const { palette } = cardStyle(kind, index);
  const layouts = kind === 'date'
    ? ['细线', '方框', '丝带', '双栏', '印戳']
    : ['横线', '方格', '空白', '窄边', '花角'];
  return `${CARD_KINDS[kind].label} · ${palette.name}${layouts[Math.floor(index / CARD_PALETTES.length) % 5]}`;
}
function ornament(x, cx, y, size, color) {
  x.fillStyle = color;
  x.beginPath();
  x.moveTo(cx, y - size);
  x.quadraticCurveTo(cx + size, y, cx, y + size);
  x.quadraticCurveTo(cx - size, y, cx, y - size);
  x.fill();
}
function drawDate(x, value, layout, p) {
  const w = 360, h = 92;
  x.fillStyle = p.paper;
  x.fillRect(4, 4, w - 8, h - 8);
  x.strokeStyle = p.line;
  x.lineWidth = 0.8;
  if (layout === 1) x.strokeRect(12, 12, w - 24, h - 24);
  if (layout === 2) {
    x.fillStyle = p.accent;
    x.fillRect(0, 0, w, 10);
    x.fillRect(0, h - 10, w, 10);
    x.strokeStyle = p.gold;
    x.strokeRect(9, 14, w - 18, h - 28);
  }
  if (layout === 3) {
    x.strokeStyle = p.line;
    x.beginPath(); x.moveTo(26, 30); x.lineTo(w - 26, 30); x.moveTo(26, h - 30); x.lineTo(w - 26, h - 30); x.stroke();
    x.beginPath(); x.moveTo(w / 2, 20); x.lineTo(w / 2, h - 20); x.stroke();
  }
  if (layout === 4) {
    x.strokeStyle = p.gold;
    x.beginPath(); x.arc(44, h / 2, 22, 0, Math.PI * 2); x.stroke();
    x.beginPath(); x.arc(44, h / 2, 17, 0, Math.PI * 2); x.stroke();
    x.fillStyle = p.accent;
    x.font = '8px Georgia,serif';
    x.textAlign = 'center';
    x.fillText('DATE', 44, h / 2 + 3);
  }
  x.fillStyle = p.ink;
  x.textAlign = 'center';
  x.textBaseline = 'middle';
  x.font = '11px Georgia,serif';
  if (layout !== 4) x.fillText('A  D A T E  T O  K E E P', w / 2, 24);
  x.font = '26px Georgia,"Songti SC",serif';
  x.fillText(String(value).slice(0, 24), layout === 4 ? 208 : w / 2, layout === 4 ? h / 2 + 2 : h / 2 + 6);
  x.font = '9px Georgia,serif';
  x.fillStyle = p.accent;
  if (layout === 0) x.fillText('—  MEMORY  —', w / 2, h - 18);
  if (layout === 2) x.fillText('KEEPSAKE  CALENDAR', w / 2, h - 21);
  if (layout === 3) x.fillText('MEMORY', w / 2, h - 18);
  ornament(x, 22, h / 2, 5, p.gold);
  ornament(x, w - 22, h / 2, 5, p.gold);
}
function drawDiary(x, value, layout, p, fontId) {
  const w = 380, h = 520;
  x.fillStyle = p.paper;
  x.fillRect(0, 0, w, h);
  x.strokeStyle = p.line;
  x.lineWidth = 1;
  const top = 78, left = layout === 3 ? 30 : 42, right = w - (layout === 3 ? 26 : 42);
  if (layout === 1) {
    x.globalAlpha = 0.55;
    for (let y = top; y < h - 40; y += 14) { x.beginPath(); x.moveTo(left, y); x.lineTo(right, y); x.stroke(); }
    for (let gx = left; gx < right; gx += 14) { x.beginPath(); x.moveTo(gx, top); x.lineTo(gx, h - 40); x.stroke(); }
    x.globalAlpha = 1;
  } else if (layout !== 2) {
    x.globalAlpha = 0.7;
    for (let y = top; y < h - 40; y += 22) { x.beginPath(); x.moveTo(left, y); x.lineTo(right, y); x.stroke(); }
    x.globalAlpha = 1;
  }
  x.strokeStyle = p.accent;
  x.lineWidth = 1.4;
  x.beginPath(); x.moveTo(left, top - 12); x.lineTo(right, top - 12); x.stroke();
  if (layout === 0) { x.beginPath(); x.moveTo(left - 12, top); x.lineTo(left - 12, h - 40); x.stroke(); }
  x.fillStyle = p.ink;
  x.textAlign = 'left';
  x.textBaseline = 'alphabetic';
  x.font = 'italic 15px Georgia,serif';
  x.fillText('Dear diary,', left, 44);
  x.font = '9px Georgia,serif';
  x.textAlign = 'right';
  x.fillStyle = p.line;
  x.fillText('NO. ______', right, 44);
  x.strokeStyle = p.line;
  x.beginPath(); x.moveTo(left, 56); x.lineTo(right, 56); x.stroke();
  if (layout === 4) {
    x.strokeStyle = p.gold;
    x.lineWidth = 1;
    for (const [cx, cy, sx, sy] of [[20, 20, 1, 1], [w - 20, 20, -1, 1], [20, h - 20, 1, -1], [w - 20, h - 20, -1, -1]]) {
      x.beginPath();
      x.moveTo(cx, cy + sy * 26);
      x.quadraticCurveTo(cx, cy, cx + sx * 26, cy);
      x.stroke();
      x.beginPath(); x.arc(cx + sx * 9, cy + sy * 9, 3, 0, Math.PI * 2); x.fillStyle = p.gold; x.fill();
    }
  }
  const family = font(fontId);
  let size = 16, lines;
  const width = right - left;
  do {
    x.font = `${family.style} ${size}px ${family.family}`;
    lines = wrap(x, value, width);
    if (lines.length <= Math.floor((h - top - 55) / (size * 1.55))) break;
    size -= 0.5;
  } while (size > 7.5);
  x.fillStyle = p.ink;
  x.textAlign = 'left';
  x.textBaseline = 'middle';
  x.font = `${family.style} ${size}px ${family.family}`;
  const maxLines = Math.floor((h - top - 55) / (size * 1.55));
  lines.slice(0, Math.max(1, maxLines)).forEach((line, i) => x.fillText(line, left, top + i * size * 1.55 + size * 0.5));
  x.fillStyle = p.accent;
  x.font = '9px Georgia,serif';
  x.textAlign = 'center';
  x.fillText('—  KEPT IN A QUIET PLACE  —', w / 2, h - 18);
}
export function renderCard(value, kind = 'date', styleIndex = 0, fontId = 'classic') {
  const meta = CARD_KINDS[kind] || CARD_KINDS.date;
  const key = JSON.stringify([value, kind, styleIndex, fontId, document.fonts?.status]);
  if (cache.has(key)) return cache.get(key);
  const { palette, layout } = cardStyle(kind, styleIndex);
  const scale = 3;
  const canvas = document.createElement('canvas');
  canvas.width = meta.w * scale;
  canvas.height = meta.h * scale;
  const x = canvas.getContext('2d');
  x.scale(scale, scale);
  x.imageSmoothingQuality = 'high';
  x.fillStyle = palette.paper;
  x.fillRect(0, 0, meta.w, meta.h);
  if (kind === 'date') drawDate(x, value || meta.placeholder, layout, palette);
  else drawDiary(x, value || ' ', layout, palette, fontId);
  x.globalAlpha = 0.05;
  x.fillStyle = palette.ink;
  for (let i = 0; i < 240; i++) x.fillRect((i * 53) % meta.w, (i * 37) % meta.h, 0.7, 0.7);
  x.globalAlpha = 1;
  const result = canvas.toDataURL('image/png');
  cache.set(key, result);
  if (cache.size > 60) cache.delete(cache.keys().next().value);
  return result;
}
export function defaultDateText(date = new Date()) {
  return `${date.getFullYear()} · ${String(date.getMonth() + 1).padStart(2, '0')} · ${String(date.getDate()).padStart(2, '0')}`;
}

export function renderNote(value, variant=0, fontId='classic') {
  const key=JSON.stringify([value,variant,fontId,document.fonts?.status]);
  if(cache.has(key))return cache.get(key);
  const width=360, height=variant===2?180:125, scale=4;
  const c=document.createElement('canvas');c.width=width*scale;c.height=height*scale;
  const x=c.getContext('2d');x.scale(scale,scale);
  const paper=variant===1?'#d7bf91':'#e5d7b9';
  x.fillStyle=paper;x.beginPath();x.moveTo(8,9);
  for(let a=8;a<352;a+=16)x.lineTo(a,8+(a%3)*1.2);
  x.lineTo(350,height-10);
  for(let a=350;a>=8;a-=17)x.lineTo(a,height-8-(a%4));
  x.closePath();x.fill();
  x.strokeStyle='#9c87621c';x.lineWidth=.6;x.stroke();
  x.fillStyle='#8b744c0a';for(let i=0;i<100;i++)x.fillRect((i*47)%width,(i*31)%height,.6,.6);
  const f=font(fontId);let size=variant===2?22:23,lines;
  do {x.font=`${f.style} ${size}px ${f.family}`;lines=wrap(x,value,310);if(lines.length*size*1.3<=height-30)break;size-=.5;}while(size>8);
  x.fillStyle='#423c2f';x.textAlign='center';x.textBaseline='middle';
  lines.forEach((line,i)=>x.fillText(line,180,height/2+(i-(lines.length-1)/2)*size*1.3));
  const result=c.toDataURL('image/png');cache.set(key,result);
  if(cache.size>60)cache.delete(cache.keys().next().value);
  return result;
}
