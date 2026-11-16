import * as THREE from "three";
import { RoomEnvironment } from "../vendor/RoomEnvironment.js";
import {
  BOOKS,
  coverTexture,
  paperTexture,
  woodTexture,
  canvas,
  seeded,
} from "./textures.js";
const brass = () =>
  new THREE.MeshStandardMaterial({
    color: 0xa88b50,
    metalness: 0.76,
    roughness: 0.4,
  });
function mesh(geometry, material, parent, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geometry, material);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  parent.add(m);
  return m;
}
function tex(c) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function cylinder(parent, r1, r2, h, mat, x, y, z) {
  return mesh(new THREE.CylinderGeometry(r1, r2, h, 40), mat, parent, x, y, z);
}
function keyModel() {
  const g = new THREE.Group(),
    m = brass();
  const ring = mesh(
    new THREE.TorusGeometry(0.25, 0.046, 10, 48),
    m,
    g,
    0,
    0,
    -0.47,
  );
  ring.rotation.x = Math.PI / 2;
  const rod = cylinder(g, 0.033, 0.033, 0.87, m, 0, 0, 0.15);
  rod.rotation.x = Math.PI / 2;
  mesh(new THREE.BoxGeometry(0.21, 0.067, 0.08), m, g, 0.08, 0, 0.56);
  mesh(new THREE.BoxGeometry(0.14, 0.067, 0.07), m, g, 0.055, 0, 0.42);
  const rim = mesh(
    new THREE.TorusGeometry(0.19, 0.024, 8, 36),
    m,
    g,
    0,
    0,
    -0.47,
  );
  rim.rotation.x = Math.PI / 2;
  return g;
}
function waxModel(color = 0x84372f) {
  const g = new THREE.Group(),
    r = seeded(65),
    m = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.49,
      metalness: 0.04,
    });
  cylinder(g, 0.4, 0.42, 0.1, m, 0, 0.055, 0);
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8,
      rr = 0.34 + r() * 0.03;
    const b = mesh(
      new THREE.SphereGeometry(0.09 + r() * 0.03, 14, 10),
      m,
      g,
      Math.cos(a) * rr,
      0.055,
      Math.sin(a) * rr,
    );
    b.scale.y = 0.42;
  }
  const dark = new THREE.MeshStandardMaterial({
    color: 0x702d27,
    roughness: 0.65,
  });
  const ring = mesh(
    new THREE.TorusGeometry(0.29, 0.014, 8, 48),
    dark,
    g,
    0,
    0.116,
    0,
  );
  ring.rotation.x = Math.PI / 2;
  const c = canvas(256, 256),
    x = c.getContext("2d");
  x.strokeStyle = "#5d2722";
  x.lineWidth = 3;
  x.beginPath();
  x.ellipse(128, 128, 83, 83, 0, 0, 7);
  x.stroke();
  x.font = "italic 96px Georgia";
  x.textAlign = "center";
  x.fillStyle = "#5f2822";
  x.fillText("M", 128, 160);
  const p = mesh(
    new THREE.PlaneGeometry(0.55, 0.55),
    new THREE.MeshStandardMaterial({
      map: tex(c),
      transparent: true,
      roughness: 0.8,
    }),
    g,
    0,
    0.12,
    0,
  );
  p.rotation.x = -Math.PI / 2;
  return g;
}
function medalModel() {
  const g = new THREE.Group(),
    m = brass();
  cylinder(g, 0.37, 0.36, 0.08, m, 0, 0.05, 0);
  const ring = mesh(
    new THREE.TorusGeometry(0.33, 0.023, 8, 48),
    m,
    g,
    0,
    0.1,
    0,
  );
  ring.rotation.x = Math.PI / 2;
  const coin = canvas(256, 256),
    x = coin.getContext("2d");
  x.strokeStyle = "#765b2c";
  x.fillStyle = "#765b2c";
  x.lineWidth = 2;
  x.textAlign = "center";
  x.font = "italic 84px Georgia";
  x.fillText("A", 128, 156);
  for (let side = 0; side < 2; side++) {
    x.beginPath();
    x.ellipse(
      128,
      130,
      78,
      83,
      0,
      side ? -0.1 : Math.PI,
      side ? Math.PI : Math.PI * 2,
    );
    x.stroke();
    for (let i = 0; i < 8; i++) {
      let a = (i / 8) * Math.PI + (side ? Math.PI : 0);
      x.beginPath();
      x.ellipse(
        128 + Math.cos(a) * 75,
        130 + Math.sin(a) * 80,
        10,
        4,
        a + 0.6,
        0,
        7,
      );
      x.fill();
    }
  }
  const p = mesh(
    new THREE.PlaneGeometry(0.61, 0.61),
    new THREE.MeshStandardMaterial({
      map: tex(coin),
      transparent: true,
      roughness: 0.6,
    }),
    g,
    0,
    0.103,
    0,
  );
  p.rotation.x = -Math.PI / 2;
  return g;
}
function makeBook(book) {
  const g = new THREE.Group(),
    w = 1.64,
    h = 2.39,
    t = book.id === "black" ? 0.36 : 0.25;
  const leather = new THREE.MeshStandardMaterial({
    color: book.color,
    roughness: book.id === "pink" ? 0.98 : 0.87,
  });
  mesh(new THREE.BoxGeometry(w, 0.062, h), leather, g, 0, 0.07, 0);
  const hinge = new THREE.Group();
  hinge.position.set(-w / 2, t + 0.075, 0);
  g.add(hinge);
  mesh(new THREE.BoxGeometry(w, 0.074, h), leather, hinge, w / 2, 0, 0);
  const flyleaf = mesh(
    new THREE.PlaneGeometry(w - 0.1, h - 0.13),
    new THREE.MeshStandardMaterial({
      map: tex(paperTexture("ivory")),
      roughness: 1,
      side: THREE.DoubleSide,
    }),
    g,
    0.02,
    t + 0.083,
    0,
  );
  flyleaf.rotation.x = -Math.PI / 2;
  const edge = canvas(256, 256),
    x = edge.getContext("2d");
  x.fillStyle = "#d4c4a4";
  x.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 256; i += 3) {
    x.fillStyle = i % 9 === 0 ? "#8e7b594b" : "#9b89633b";
    x.fillRect(0, i, 256, 1);
  }
  const pageMat = new THREE.MeshStandardMaterial({
    map: tex(edge),
    roughness: 1,
    color: 0xe9dfc7,
  });
  mesh(
    new THREE.BoxGeometry(w - 0.08, t - 0.01, h - 0.12),
    pageMat,
    g,
    0.02,
    t / 2 + 0.085,
    0,
  );
  const spine = mesh(
    new THREE.BoxGeometry(0.075, t + 0.045, h),
    leather,
    g,
    -w / 2 + 0.033,
    t / 2 + 0.1,
    0,
  );
  const texture = tex(coverTexture(book));
  texture.anisotropy = 4;
  const cover = mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshStandardMaterial({
      map: texture,
      roughness: book.id === "pink" ? 0.96 : 0.73,
      metalness: 0.08,
    }),
    hinge,
    w / 2,
    0.039,
    0,
  );
  cover.rotation.x = -Math.PI / 2;
  const gold = brass();
  if (book.id !== "pink")
    for (const xx of [-1, 1])
      for (const zz of [-1, 1]) {
        const corner = mesh(
          new THREE.BoxGeometry(0.1, 0.013, 0.1),
          gold,
          hinge,
          w / 2 + xx * (w / 2 - 0.045),
          0.046,
          zz * (h / 2 - 0.045),
        );
        corner.rotation.y = Math.PI / 4;
      }
  for (let i = 0; i < 4; i++)
    mesh(
      new THREE.BoxGeometry(0.09, 0.03, 0.036),
      leather,
      g,
      -w / 2 + 0.025,
      t + 0.04,
      -h / 2 + 0.4 + i * 0.52,
    );
  g.userData = { bookIndex: BOOKS.indexOf(book), t, hinge };
  return g;
}
function cupModel() {
  const g = new THREE.Group(),
    ceramic = new THREE.MeshStandardMaterial({
      color: 0xe8dfca,
      roughness: 0.25,
    });
  cylinder(g, 0.72, 0.6, 0.09, ceramic, 0, 0.08, 0);
  const p = [];
  p.push(
    new THREE.Vector2(0.02, 0),
    new THREE.Vector2(0.26, 0),
    new THREE.Vector2(0.29, 0.05),
    new THREE.Vector2(0.35, 0.34),
    new THREE.Vector2(0.36, 0.44),
    new THREE.Vector2(0.335, 0.44),
    new THREE.Vector2(0.32, 0.32),
    new THREE.Vector2(0.25, 0.08),
    new THREE.Vector2(0.02, 0.08),
  );
  mesh(new THREE.LatheGeometry(p, 64), ceramic, g, 0, 0.13, 0);
  cylinder(
    g,
    0.32,
    0.32,
    0.006,
    new THREE.MeshStandardMaterial({ color: 0x4c3020, roughness: 0.25 }),
    0,
    0.493,
    0,
  );
  const handle = mesh(
    new THREE.TorusGeometry(0.16, 0.033, 12, 32),
    ceramic,
    g,
    0.38,
    0.38,
    0,
  );
  const rim = mesh(
    new THREE.TorusGeometry(0.358, 0.012, 8, 64),
    brass(),
    g,
    0,
    0.57,
    0,
  );
  rim.rotation.x = Math.PI / 2;
  return g;
}
function stem(parent, points, material, r = 0.012) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
  );
  return mesh(new THREE.TubeGeometry(curve, 20, r, 5, false), material, parent);
}
function branches() {
  const g = new THREE.Group(),
    m = new THREE.MeshStandardMaterial({
      color: 0x7b7750,
      roughness: 1,
      side: THREE.DoubleSide,
    });
  for (let j = 0; j < 3; j++) {
    let offset = j * 0.17;
    stem(
      g,
      [
        [offset, 0.06, 1.0],
        [offset - 0.12, 0.11, 0.4],
        [offset + 0.08, 0.08, -0.4],
        [offset + 0.3, 0.13, -1.6],
      ],
      new THREE.MeshStandardMaterial({ color: 0x7b6440, roughness: 1 }),
      0.013,
    );
    for (let i = 0; i < 9; i++) {
      let z = 0.7 - i * 0.24;
      for (let side of [-1, 1]) {
        const leaf = mesh(
          new THREE.SphereGeometry(1, 12, 6),
          m,
          g,
          offset + side * 0.17,
          0.09,
          z - 0.09,
        );
        leaf.scale.set(0.09, 0.011, 0.23);
        leaf.rotation.y = side * 0.65;
      }
    }
  }
  return g;
}
export function createDesk(onSelect) {
  const host = document.getElementById("desk-stage"),
    c = document.getElementById("desk-canvas");
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas: c,
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    document.getElementById("scene-loading").textContent =
      "当前浏览器未开启 3D；仍可选择书本开始创作。";
    return { select() {}, setActive() {} };
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.8));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.88;
  const scene = new THREE.Scene();
  const env = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const target = env.fromScene(room, 0.04);
  scene.environment = target.texture;
  room.dispose();
  env.dispose();
  const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 100);
  camera.position.set(0, 10.3, 9.9);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.HemisphereLight(0xfff5e5, 0x655b4c, 0.95));
  const light = new THREE.DirectionalLight(0xfff0d9, 2.1);
  light.position.set(-5, 9, -4);
  light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 9;
  light.shadow.camera.bottom = -9;
  light.shadow.normalBias = 0.03;
  light.shadow.bias = -0.0003;
  light.shadow.radius = 4;
  scene.add(light);
  const wood = tex(woodTexture());
  wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(2.2, 2.2);
  const desk = mesh(
    new THREE.PlaneGeometry(25, 24),
    new THREE.MeshStandardMaterial({
      map: wood,
      roughness: 0.94,
      color: 0xd3c4aa,
    }),
    scene,
    0,
    0,
    0,
  );
  desk.rotation.x = -Math.PI / 2;
  desk.castShadow = false;
  const books = BOOKS.map(makeBook);
  const positions = [
    [-3.0, 0.1, 0.95, -0.32],
    [-1.62, 0.1, -0.05, -0.15],
    [0, 0.2, -0.65, 0.03],
    [1.65, 0.1, 0.0, 0.15],
    [3.14, 0.1, 0.95, 0.32],
  ];
  books.forEach((b, i) => {
    const p = positions[i];
    b.position.set(p[0], p[1], p[2]);
    b.rotation.y = p[3];
    scene.add(b);
  });
  const paper = mesh(
    new THREE.PlaneGeometry(2.0, 2.65),
    new THREE.MeshStandardMaterial({
      map: tex(paperTexture("letter")),
      roughness: 1,
    }),
    scene,
    3.85,
    0.026,
    -2.4,
  );
  paper.rotation.set(-Math.PI / 2, 0, -0.28);
  const cup = cupModel();
  cup.position.set(-1.8, 0, -3.5);
  scene.add(cup);
  const twigs = branches();
  twigs.position.set(3.9, 0.04, -1.9);
  twigs.rotation.y = -0.3;
  scene.add(twigs);
  const envelope = mesh(
    new THREE.PlaneGeometry(1.8, 1.05),
    new THREE.MeshStandardMaterial({ color: 0xd5c4a2, roughness: 1 }),
    scene,
    -2.8,
    0.035,
    3.0,
  );
  envelope.rotation.set(-Math.PI / 2, 0, 0.13);
  const wax = waxModel();
  wax.position.set(-2.85, 0.05, 3.0);
  wax.scale.setScalar(0.56);
  scene.add(wax);
  const key = keyModel();
  key.position.set(2.35, 0.05, 3.05);
  key.rotation.y = -0.8;
  key.scale.setScalar(0.78);
  scene.add(key);
  const inkMat = new THREE.MeshPhysicalMaterial({
    color: 0x302e2a,
    roughness: 0.19,
    metalness: 0.1,
  });
  mesh(
    new THREE.BoxGeometry(0.45, 0.55, 0.45),
    inkMat,
    scene,
    -4.3,
    0.29,
    1.45,
  );
  cylinder(scene, 0.15, 0.17, 0.1, brass(), -4.3, 0.61, 1.45);
  const pen = mesh(
    new THREE.CylinderGeometry(0.025, 0.05, 1.65, 12),
    new THREE.MeshStandardMaterial({ color: 0x4e372b, roughness: 0.48 }),
    scene,
    -3.94,
    0.05,
    1.83,
  );
  pen.rotation.set(Math.PI / 2, 0, 0.6);
  let selected = 2,
    active = true,
    last = 0,
    dirty = true,
    opening = null;
  const ray = new THREE.Raycaster(),
    mouse = new THREE.Vector2();
  function resize() {
    const w = host.clientWidth,
      h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    const aspect = w / h,
      compact = w <= 760 && aspect < 1;
    const frustum = compact
      ? Math.max(9.5, 6.9 / aspect)
      : Math.max(6.8, 10.9 / aspect);
    const layout = compact
      ? [
          [-1.8, 0.1, -1.25, -0.12],
          [0, 0.1, -1.6, 0.02],
          [1.8, 0.2, -1.25, 0.12],
          [-1.03, 0.1, 1.2, -0.12],
          [1.03, 0.1, 1.2, 0.12],
        ]
      : positions;
    books.forEach((book, i) => {
      book.position.x = layout[i][0];
      book.position.z = layout[i][2];
      book.rotation.y = layout[i][3];
    });
    paper.position.set(compact ? 2.45 : 3.85, 0.026, compact ? -3.7 : -2.4);
    twigs.position.set(compact ? 2.45 : 3.9, 0.04, compact ? -3.35 : -1.9);
    camera.left = (-frustum * aspect) / 2;
    camera.right = (frustum * aspect) / 2;
    camera.top = frustum / 2;
    camera.bottom = -frustum / 2;
    camera.updateProjectionMatrix();
    dirty = true;
  }
  new ResizeObserver(resize).observe(host);
  resize();
  c.addEventListener("pointermove", (e) => {
    const b = c.getBoundingClientRect();
    mouse.set(
      ((e.clientX - b.left) / b.width) * 2 - 1,
      (-(e.clientY - b.top) / b.height) * 2 + 1,
    );
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObjects(books, true)[0];
    c.style.cursor = hit ? "pointer" : "default";
  });
  c.addEventListener("click", (e) => {
    const b = c.getBoundingClientRect();
    mouse.set(
      ((e.clientX - b.left) / b.width) * 2 - 1,
      (-(e.clientY - b.top) / b.height) * 2 + 1,
    );
    ray.setFromCamera(mouse, camera);
    const hit = ray.intersectObjects(books, true)[0];
    if (hit) {
      let root = hit.object;
      while (root.parent && root.userData.bookIndex === undefined)
        root = root.parent;
      if (root.userData.bookIndex !== undefined)
        onSelect(root.userData.bookIndex);
    }
  });
  function animate(now) {
    requestAnimationFrame(animate);
    if (!active || document.hidden || now - last < 32) return;
    last = now;
    let moving = false;
    const progress = opening ? Math.min(1, (now - opening.start) / 920) : 0;
    const ease = progress * progress * (3 - 2 * progress);
    if (opening && !opening.finished) {
      books[opening.index].userData.hinge.rotation.z = ease * 2.72;
      camera.zoom = 1 + ease * 0.12;
      camera.updateProjectionMatrix();
      moving = true;
      if (progress === 1) opening.finished = true;
    }
    books.forEach((b, i) => {
      const ty = i === selected ? 0.25 : 0.07,
        ts = i === selected ? 1.09 + ease * 0.08 : 0.97;
      if (
        Math.abs(b.position.y - ty) > 0.0005 ||
        Math.abs(b.scale.x - ts) > 0.0005
      ) {
        b.position.y = THREE.MathUtils.lerp(b.position.y, ty, 0.12);
        const s = THREE.MathUtils.lerp(b.scale.x, ts, 0.12);
        b.scale.setScalar(s);
        moving = true;
      }
    });
    if (moving || dirty) {
      renderer.render(scene, camera);
      dirty = false;
    }
  }
  requestAnimationFrame(animate);
  document.getElementById("scene-loading").classList.add("hidden");
  return {
    select(i) {
      selected = i;
      dirty = true;
    },
    open(i) {
      selected = i;
      opening = { index: i, start: performance.now() };
      dirty = true;
      return new Promise((resolve) => setTimeout(resolve, 960));
    },
    setActive(v) {
      active = v;
      if (v) {
        opening = null;
        camera.zoom = 1;
        camera.updateProjectionMatrix();
        books.forEach((b) => {
          b.userData.hinge.rotation.z = 0;
        });
      }
      dirty = true;
    },
  };
}
export function renderDimensionalMaterials() {
  let r;
  try {
    r = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
  } catch {
    return {};
  }
  r.setSize(256, 256);
  r.setPixelRatio(1);
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.5;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffefd2, 0x5e4731, 3));
  const light = new THREE.DirectionalLight(0xffe4b4, 4);
  light.position.set(-3, 6, 4);
  scene.add(light);
  const env = new THREE.PMREMGenerator(r),
    room = new RoomEnvironment();
  const rt = env.fromScene(room);
  scene.environment = rt.texture;
  room.dispose();
  env.dispose();
  const camera = new THREE.OrthographicCamera(-0.8, 0.8, 0.8, -0.8, 0.1, 10);
  camera.position.set(0, 3, 0.45);
  camera.lookAt(0, 0, 0);
  const results = {};
  for (const [id, model] of [
    ["wax", waxModel()],
    ["key", keyModel()],
    ["coin", medalModel()],
  ]) {
    if (id === "key") model.rotation.y = -0.4;
    scene.add(model);
    r.render(scene, camera);
    results[id] = r.domElement.toDataURL("image/png");
    scene.remove(model);
    model.traverse((o) => {
      o.geometry?.dispose();
      if (o.material) {
        o.material.map?.dispose();
        o.material.dispose();
      }
    });
  }
  rt.dispose();
  r.dispose();
  return results;
}
