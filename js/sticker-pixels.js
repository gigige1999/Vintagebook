export function connectedBackground(pixels, width, height, tolerance = 32, seed = null) {
  const count=width*height, removed=new Uint8Array(count), seen=new Uint8Array(count), queue=new Int32Array(count);
  const sample = i => [pixels[i*4],pixels[i*4+1],pixels[i*4+2]];
  const samples = seed ? [sample(seed.y*width+seed.x)] : [sample(0),sample(width-1),sample((height-1)*width),sample(count-1)];
  let head=0,tail=0;
  function visit(i){
    if(i<0||i>=count||seen[i])return;seen[i]=1;
    const at=i*4;
    const match=pixels[at+3]<12||samples.some(s=>Math.sqrt(((pixels[at]-s[0])**2+(pixels[at+1]-s[1])**2+(pixels[at+2]-s[2])**2)/3)<=tolerance);
    if(match){removed[i]=1;queue[tail++]=i;}
  }
  if(seed)visit(seed.y*width+seed.x);
  else {for(let x=0;x<width;x++){visit(x);visit((height-1)*width+x);}for(let y=0;y<height;y++){visit(y*width);visit(y*width+width-1);}}
  while(head<tail){const i=queue[head++],x=i%width;if(x>0)visit(i-1);if(x<width-1)visit(i+1);visit(i-width);visit(i+width);}
  return removed;
}
export function connectedRegion(pixels, width, height, tolerance = 32, seed) {
  const count = width * height, region = new Uint8Array(count), seen = new Uint8Array(count), queue = new Int32Array(count);
  const sx = Math.max(0, Math.min(width - 1, Math.floor(seed?.x ?? 0)));
  const sy = Math.max(0, Math.min(height - 1, Math.floor(seed?.y ?? 0)));
  const start = sy * width + sx, at = start * 4;
  const sample = [pixels[at], pixels[at + 1], pixels[at + 2]];
  let head = 0, tail = 0;
  const visit = i => {
    if (i < 0 || i >= count || seen[i]) return;
    seen[i] = 1;
    const p = i * 4;
    const distance = Math.sqrt(((pixels[p] - sample[0]) ** 2 + (pixels[p + 1] - sample[1]) ** 2 + (pixels[p + 2] - sample[2]) ** 2) / 3);
    if (distance <= tolerance) { region[i] = 1; queue[tail++] = i; }
  };
  visit(start);
  while (head < tail) {
    const i = queue[head++], x = i % width;
    if (x > 0) visit(i - 1);
    if (x < width - 1) visit(i + 1);
    visit(i - width);
    visit(i + width);
  }
  return region;
}
export function fillRegionHoles(region, width, height) {
  const count = width * height, outside = new Uint8Array(count), queue = new Int32Array(count);
  let head = 0, tail = 0;
  const visit = i => { if (i >= 0 && i < count && !outside[i] && !region[i]) { outside[i] = 1; queue[tail++] = i; } };
  for (let x = 0; x < width; x++) { visit(x); visit((height - 1) * width + x); }
  for (let y = 0; y < height; y++) { visit(y * width); visit(y * width + width - 1); }
  while (head < tail) {
    const i = queue[head++], x = i % width;
    if (x > 0) visit(i - 1);
    if (x < width - 1) visit(i + 1);
    visit(i - width);
    visit(i + width);
  }
  const filled = new Uint8Array(count);
  for (let i = 0; i < count; i++) filled[i] = outside[i] ? 0 : 1;
  return filled;
}
export function keepOnlyRegion(alphaPixels, region, width, height) {
  for (let i = 0; i < region.length; i++) if (!region[i]) alphaPixels[i * 4 + 3] = 0;
  return alphaPixels;
}
export function colorPixels(pixels, preset='original', brightness=100, contrast=100, saturation=100){
  const c=contrast/100, b=brightness/100,s=saturation/100;
  for(let i=0;i<pixels.length;i+=4){
    if(!pixels[i+3])continue;
    let r=pixels[i],g=pixels[i+1],blue=pixels[i+2];
    if(preset==='sepia'){const rr=r*.393+g*.769+blue*.189,gg=r*.349+g*.686+blue*.168,bb=r*.272+g*.534+blue*.131;r=rr;g=gg;blue=bb;}
    if(preset==='warm'){r=r*1.07+8;g=g*1.025+3;blue=blue*.93;}
    if(preset==='fade'){const m=(r+g+blue)/3;r=r*.62+m*.22+40;g=g*.62+m*.22+39;blue=blue*.62+m*.22+37;}
    if(preset==='cream'){r=r*1.03+12;g=g*1.01+10;blue=blue*.9+6;}
    if(preset==='rose'){r=r*1.05+14;g=g*.95+4;blue=blue*.99+10;}
    if(preset==='mint'){r=r*.92;g=g*1.04+11;blue=blue*.99+8;}
    if(preset==='vivid'){const m=(r+g+blue)/3;r=m+(r-m)*1.38;g=m+(g-m)*1.38;blue=m+(blue-m)*1.38;}
    if(preset==='silver'){const gray=r*.299+g*.587+blue*.114;r=gray*.97+7;g=gray*1.0+9;blue=gray*1.04+12;}
    if(preset==='violet'){const gray=r*.299+g*.587+blue*.114;r=gray*.94+16;g=gray*.9+8;blue=gray*1.02+24;}
    if(preset==='mono'||preset==='noir'){const gray=r*.299+g*.587+blue*.114;r=g=blue=preset==='noir'?(gray-128)*1.22+128:gray;}
    if(preset==='blue'){const gray=r*.299+g*.587+blue*.114;r=gray*.85;g=gray*.94+5;blue=gray*1.04+9;}
    if(preset==='honey'){const mid=(r+g+blue)/3;r=r*1.06+mid*.03+11;g=g*.99+mid*.025+7;blue=blue*.84+mid*.04+4;}
    if(preset==='porcelain'){const l=r*.24+g*.68+blue*.08;r=l*.72+r*.28+22;g=l*.73+g*.27+24;blue=l*.76+blue*.24+27;}
    if(preset==='sage'){const l=r*.3+g*.55+blue*.15;r=r*.65+l*.28+11;g=g*.73+l*.23+17;blue=blue*.64+l*.25+10;}
    if(preset==='amber'){const l=r*.26+g*.65+blue*.09;r=(r-128)*1.09+143+8;g=(g-128)*1.04+128+l*.024+3;blue=(blue-128)*.94+119-6;}
    if(preset==='dustyrose'){const l=r*.27+g*.62+blue*.11;r=r*.75+l*.18+21;g=g*.74+l*.19+11;blue=blue*.77+l*.16+15;}
    if(preset==='cinema'){const l=r*.25+g*.62+blue*.13;r=(r-128)*1.13+119+l*.04;g=(g-128)*1.11+122+l*.02;blue=(blue-128)*1.09+137+l*.015;}
    if(preset==='matte'){const l=r*.25+g*.65+blue*.1;r=r*.75+l*.17+18;g=g*.76+l*.17+16;blue=blue*.73+l*.18+12;}
    const l=r*.2126+g*.7152+blue*.0722;
    pixels[i]=Math.max(0,Math.min(255,((l+(r-l)*s)-128)*c*b+128*b));
    pixels[i+1]=Math.max(0,Math.min(255,((l+(g-l)*s)-128)*c*b+128*b));
    pixels[i+2]=Math.max(0,Math.min(255,((l+(blue-l)*s)-128)*c*b+128*b));
  }
  return pixels;
}
