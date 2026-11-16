import * as THREE from "../vendor/three.module.js";
import { BOOKS, canvas, seeded } from "./textures.js";

export function roundedShape(w, h, radius) {
  const s = new THREE.Shape(),
    x = -w / 2,
    y = -h / 2,
    r = Math.min(radius, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
export function roundedSlab(w, h, depth, radius = 0.06) {
  const bevel = Math.min(depth * 0.22, 0.009);
  const g = new THREE.ExtrudeGeometry(
    roundedShape(w - bevel * 2, h - bevel * 2, radius),
    {
      depth: depth - bevel * 2,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 2,
      curveSegments: 4,
      steps: 1,
    },
  );
  g.translate(0, 0, -depth / 2 + bevel);
  g.rotateX(-Math.PI / 2);
  return g;
}
function face(w, h, radius) {
  const g = new THREE.ShapeGeometry(roundedShape(w, h, radius), 6);
  const pos = g.attributes.position,
    uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++)
    uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  g.rotateX(-Math.PI / 2);
  return g;
}
function add(g, geometry, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  g.add(m);
  return m;
}
export function surfaceDetails() {
  const c = canvas(128, 128),
    x = c.getContext("2d"),
    r = seeded(934);
  const image = x.createImageData(128, 128);
  for (let i = 0; i < image.data.length; i += 4) {
    const v = 105 + r() * 60;
    image.data[i] = image.data[i + 1] = image.data[i + 2] = v;
    image.data[i + 3] = 255;
  }
  x.putImageData(image, 0, 0);
  const leather = new THREE.CanvasTexture(c);
  leather.wrapS = leather.wrapT = THREE.RepeatWrapping;
  leather.repeat.set(5, 7);
  const edges = canvas(256, 256),
    e = edges.getContext("2d");
  e.fillStyle = "#d4c5a6";
  e.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 2) {
    e.fillStyle =
      i % 14 === 0 ? "#99815a99" : `rgba(120,99,60,${0.12 + r() * 0.19})`;
    e.fillRect(0, i, 256, r() * 0.6 + 0.35);
    e.fillStyle = "#fff3d033";
    e.fillRect(r() * 50, i + 0.7, 170 + r() * 65, 0.5);
  }
  const shade = e.createLinearGradient(0, 0, 256, 0);
  shade.addColorStop(0, "#71573938");
  shade.addColorStop(0.2, "#71573900");
  shade.addColorStop(0.9, "#71573900");
  shade.addColorStop(1, "#71573925");
  e.fillStyle = shade;
  e.fillRect(0, 0, 256, 256);
  const pageEdge = new THREE.CanvasTexture(edges);
  pageEdge.colorSpace = THREE.SRGBColorSpace;
  const soft = canvas(64, 64),
    sx = soft.getContext("2d");
  const gradient = sx.createRadialGradient(32, 32, 10, 32, 32, 31);
  gradient.addColorStop(0, "#22171065");
  gradient.addColorStop(0.6, "#22171035");
  gradient.addColorStop(1, "#22171000");
  sx.fillStyle = gradient;
  sx.fillRect(0, 0, 64, 64);
  return { leather, pageEdge, contact: new THREE.CanvasTexture(soft) };
}
export function makeBook(book, surfaces) {
  const g = new THREE.Group(),
    w = 1.64,
    h = 2.39;
  const t = book.id === "black" ? 0.39 : book.id === "pink" ? 0.22 : 0.29;
  const leather = new THREE.MeshStandardMaterial({
    color: book.color,
    roughness: book.id === "pink" ? 0.93 : 0.75,
    bumpMap: surfaces.leather,
    bumpScale: 0.009,
  });
  const gold = new THREE.MeshPhongMaterial({
    color: book.gold,
    specular: 0xd4c095,
    shininess: 46,
  });
  add(g, roundedSlab(w, h, 0.073, 0.055), leather, 0, 0.067, 0);
  const sheet = new THREE.MeshStandardMaterial({
    map: surfaces.pageEdge,
    roughness: 0.98,
  });
  const pageGeometry = new THREE.BoxGeometry(
    w - 0.095,
    t - 0.025,
    h - 0.13,
    12,
    5,
    1,
  );
  const pos = pageGeometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const nx = pos.getX(i),
      ny = pos.getY(i) / (t / 2);
    if (nx > 0) pos.setX(i, nx - 0.022 * (1 - ny * ny));
    pos.setY(i, pos.getY(i) + Math.sin((nx / w + 0.5) * Math.PI) * 0.012);
  }
  pageGeometry.computeVertexNormals();
  add(g, pageGeometry, sheet, 0.023, t / 2 + 0.095, 0);
  const hinge = new THREE.Group();
  hinge.position.set(-w / 2, t + 0.09, 0);
  g.add(hinge);
  add(hinge, roundedSlab(w, h, 0.083, 0.055), leather, w / 2, 0, 0);
  const coverMaterial = new THREE.MeshPhongMaterial({
    map: surfaces[`cover-${book.id}`],
    bumpMap: surfaces.leather,
    bumpScale: 0.004,
    shininess: book.id === "pink" ? 7 : 22,
    specular: 0x685e4c,
    specularMap: surfaces[`cover-${book.id}`],
  });
  add(hinge, face(w - 0.009, h - 0.009, 0.047), coverMaterial, w / 2, 0.043, 0);
  const endpaper = new THREE.MeshStandardMaterial({
    map: surfaces["paper-ivory"],
    roughness: 1,
    side: THREE.DoubleSide,
    color: 0xe7dcc5,
  });
  add(g, face(w - 0.115, h - 0.14, 0.025), endpaper, 0.025, t + 0.082, 0);
  const lining = add(
    hinge,
    face(w - 0.12, h - 0.12, 0.025),
    endpaper,
    w / 2,
    -0.043,
    0,
  );
  lining.rotation.z = Math.PI;
  const spine = add(
    g,
    new THREE.CylinderGeometry(
      (t + 0.075) / 2,
      (t + 0.075) / 2,
      h - 0.018,
      12,
      1,
      false,
      Math.PI,
      Math.PI,
    ),
    leather,
    -w / 2 + 0.045,
    t / 2 + 0.08,
    0,
  );
  spine.rotation.x = Math.PI / 2;
  for (let i = 0; i < 4; i++) {
    const band = add(
      g,
      new THREE.TorusGeometry((t + 0.083) / 2, 0.014, 4, 14, Math.PI),
      leather,
      -w / 2 + 0.046,
      t / 2 + 0.08,
      -h / 2 + 0.37 + i * 0.55,
    );
    band.rotation.z = Math.PI / 2;
  }
  const thread = new THREE.MeshStandardMaterial({
    color: book.id === "pink" ? 0xc1a08f : 0xa69b79,
    roughness: 1,
  });
  for (const z of [-h / 2 + 0.055, h / 2 - 0.055]) {
    const head = add(
      g,
      new THREE.CylinderGeometry(0.021, 0.021, t + 0.03, 10),
      thread,
      -w / 2 + 0.065,
      t / 2 + 0.091,
      z,
    );
    head.rotation.y = Math.PI / 2;
  }
  if (book.id !== "pink")
    for (const xx of [-1, 1])
      for (const zz of [-1, 1]) {
        const cx = w / 2 + xx * (w / 2 - 0.069),
          cz = zz * (h / 2 - 0.068);
        add(
          hinge,
          roundedSlab(0.09, 0.18, 0.013, 0.022),
          gold,
          cx,
          0.05,
          cz - zz * 0.022,
        );
        add(
          hinge,
          roundedSlab(0.17, 0.07, 0.013, 0.02),
          gold,
          cx - xx * 0.025,
          0.051,
          cz + zz * 0.026,
        );
        add(
          hinge,
          new THREE.SphereGeometry(0.011, 7, 5),
          gold,
          cx - xx * 0.005,
          0.065,
          cz - zz * 0.072,
        );
      }
  const ribbonMaterial = new THREE.MeshStandardMaterial({
    color:
      book.id === "blue"
        ? 0x758795
        : book.id === "black"
          ? 0xa0895d
          : book.id === "pink"
            ? 0xb68181
            : 0x92745c,
    roughness: 0.85,
    side: THREE.DoubleSide,
  });
  const ribbonGeometry = new THREE.PlaneGeometry(0.074, 0.39, 1, 5),
    rp = ribbonGeometry.attributes.position;
  ribbonGeometry.rotateX(-Math.PI / 2);
  for (let i = 0; i < rp.count; i++)
    rp.setY(i, 0.018 + Math.sin(rp.getZ(i) * 13) * 0.013);
  add(
    g,
    ribbonGeometry,
    ribbonMaterial,
    w * 0.18,
    0.028,
    h / 2 + 0.11,
  ).rotation.y = -0.12;
  g.userData = { bookIndex: BOOKS.indexOf(book), t, hinge };
  return g;
}
