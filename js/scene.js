import * as THREE from "../vendor/three.module.js";
import { BOOKS, canvas, seeded } from "./textures.js";
import { makeBook, roundedSlab, surfaceDetails } from "./book-model.js";
const brass = () =>
  new THREE.MeshPhongMaterial({
    color: 0xb49a67,
    specular: 0xe3cba0,
    shininess: 45,
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
function cupModel() {
  const g = new THREE.Group(),
    ceramic = new THREE.MeshStandardMaterial({
      color: 0xe8dfca,
      roughness: 0.25,
    });
  const saucerProfile = [
    [0.02, 0],
    [0.27, 0],
    [0.35, 0.013],
    [0.53, 0.034],
    [0.65, 0.067],
    [0.7, 0.085],
    [0.71, 0.1],
    [0.69, 0.115],
    [0.62, 0.09],
    [0.47, 0.056],
    [0.32, 0.045],
    [0.02, 0.04],
  ].map((p) => new THREE.Vector2(...p));
  mesh(new THREE.LatheGeometry(saucerProfile, 40), ceramic, g, 0, 0.025, 0);
  const saucerRim = mesh(
    new THREE.TorusGeometry(0.68, 0.007, 4, 48),
    brass(),
    g,
    0,
    0.125,
    0,
  );
  saucerRim.rotation.x = Math.PI / 2;
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
export async function createDesk(onSelect, options = {}) {
  const host = document.getElementById("desk-stage");
  const previous = document.getElementById("desk-canvas");
  const c = previous.cloneNode(false);
  previous.replaceWith(c);
  const scene = new THREE.Scene(),
    owned = new Set(),
    removeListeners = [];
  let renderer,
    observer,
    frame = 0,
    disposed = false,
    lost = false,
    active = true;
  let firstFrame = true,
    dirty = true,
    settleOpening,
    openTimer;
  const low = !!options.low,
    started = performance.now();
  function listen(target, name, fn, settings) {
    target.addEventListener(name, fn, settings);
    removeListeners.push(() => target.removeEventListener(name, fn, settings));
  }
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frame);
    clearTimeout(openTimer);
    settleOpening?.();
    observer?.disconnect();
    removeListeners.forEach((fn) => fn());
    scene.traverse((object) => {
      if (object.geometry) owned.add(object.geometry);
      for (const material of Array.isArray(object.material)
        ? object.material
        : object.material
          ? [object.material]
          : []) {
        owned.add(material);
        Object.values(material).forEach((value) => {
          if (value?.isTexture) owned.add(value);
        });
      }
      object.shadow?.map?.dispose();
    });
    owned.forEach((resource) => resource.dispose());
    renderer?.dispose();
    renderer?.forceContextLoss();
  }
  try {
    if (options.signal?.aborted) throw new Error("Scene loading cancelled");
    if (options.signal) listen(options.signal, "abort", dispose);
    renderer = new THREE.WebGLRenderer({
      canvas: c,
      antialias: !low,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.shadowMap.enabled = !low;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.autoUpdate = false;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.98;
    renderer.debug.onShaderError = () => {
      throw new Error("WebGL shader compilation failed");
    };
    const loader = new THREE.TextureLoader(),
      surfaces = surfaceDetails();
    Object.values(surfaces).forEach((texture) => owned.add(texture));
    await Promise.all(
      [
        "wood",
        "paper-ivory",
        "paper-letter",
        ...BOOKS.map((b) => "cover-" + b.id),
      ].map(async (name) => {
        const texture = await loader.loadAsync(
          new URL(`../assets/textures/${name}.jpg`, import.meta.url).href,
        );
        if (disposed || options.signal?.aborted) {
          texture.dispose();
          throw new Error("Scene loading cancelled");
        }
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(
          low ? 2 : 8,
          renderer.capabilities.getMaxAnisotropy(),
        );
        surfaces[name] = texture;
        owned.add(texture);
      }),
    );
    const camera = new THREE.OrthographicCamera(-6, 6, 5, -5, 0.1, 50);
    camera.position.set(0, 10.4, 8.8);
    camera.lookAt(0, 0, 0);
    scene.add(new THREE.HemisphereLight(0xfff5e5, 0x827865, 1.3));
    const fill = new THREE.DirectionalLight(0xe8efff, 0.45);
    fill.position.set(5, 5, 4);
    scene.add(fill);
    const light = new THREE.DirectionalLight(0xffefdb, 2.0);
    light.position.set(-4.5, 8, -3);
    light.castShadow = !low;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.camera.left = -7;
    light.shadow.camera.right = 7;
    light.shadow.camera.top = 7;
    light.shadow.camera.bottom = -7;
    light.shadow.camera.far = 25;
    light.shadow.normalBias = 0.018;
    light.shadow.bias = -0.00015;
    light.shadow.radius = 3;
    scene.add(light);
    const wood = surfaces.wood;
    wood.wrapS = wood.wrapT = THREE.RepeatWrapping;
    wood.repeat.set(2.6, 2.6);
    const desk = mesh(
      new THREE.PlaneGeometry(25, 24),
      new THREE.MeshStandardMaterial({
        map: wood,
        bumpMap: wood,
        bumpScale: 0.012,
        roughness: 0.82,
        color: 0xc7bda9,
      }),
      scene,
      0,
      0,
      0,
    );
    desk.rotation.x = -Math.PI / 2;
    desk.castShadow = false;
    const matMaterial = new THREE.MeshStandardMaterial({
      color: 0x817661,
      roughness: 0.94,
      bumpMap: surfaces.leather,
      bumpScale: 0.004,
    });
    const blotter = mesh(
      roundedSlab(9.9, 5.6, 0.032, 0.2),
      matMaterial,
      scene,
      0,
      0.012,
      0.5,
    );
    blotter.castShadow = false;
    const borderMaterial = new THREE.MeshBasicMaterial({
      color: 0xc9b48a,
      transparent: true,
      opacity: 0.35,
    });
    for (const x of [-4.76, 4.76])
      mesh(
        new THREE.BoxGeometry(0.009, 0.004, 5.19),
        borderMaterial,
        scene,
        x,
        0.035,
        0.5,
      );
    for (const z of [-2.08, 3.08])
      mesh(
        new THREE.BoxGeometry(9.5, 0.004, 0.009),
        borderMaterial,
        scene,
        0,
        0.035,
        z,
      );
    const books = [];
    for (const book of BOOKS) {
      if (disposed) throw new Error("Scene loading cancelled");
      const model = makeBook(book, surfaces);
      scene.add(model);
      books.push(model);
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    if (disposed) throw new Error("Scene loading cancelled");
    const positions = [
      [-3.8, 0.031, 0.75, -0.14],
      [-1.9, 0.031, 0.1, -0.055],
      [0, 0.064, -0.4, 0],
      [1.95, 0.031, 0.1, 0.055],
      [3.85, 0.031, 0.75, 0.14],
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
        map: surfaces["paper-letter"],
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
    const envelopeCanvas = canvas(320, 192),
      ec = envelopeCanvas.getContext("2d");
    ec.fillStyle = "#d5c4a2";
    ec.fillRect(0, 0, 320, 192);
    ec.strokeStyle = "#a895743f";
    ec.lineWidth = 1.4;
    ec.beginPath();
    ec.moveTo(0, 0);
    ec.lineTo(160, 116);
    ec.lineTo(320, 0);
    ec.moveTo(0, 192);
    ec.lineTo(115, 82);
    ec.moveTo(320, 192);
    ec.lineTo(205, 82);
    ec.stroke();
    const envelope = mesh(
      new THREE.PlaneGeometry(1.8, 1.05),
      new THREE.MeshStandardMaterial({
        map: tex(envelopeCanvas),
        roughness: 1,
      }),
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
      roundedSlab(0.45, 0.45, 0.55, 0.065),
      inkMat,
      scene,
      -4.7,
      0.29,
      -1.85,
    );
    cylinder(scene, 0.15, 0.17, 0.1, brass(), -4.7, 0.61, -1.85);
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
      last = 0,
      opening = null,
      hoverAt = 0;
    const contacts = books.map((book) => {
      const contact = mesh(
        new THREE.PlaneGeometry(2.1, 2.8),
        new THREE.MeshBasicMaterial({
          map: surfaces.contact,
          transparent: true,
          depthWrite: false,
          opacity: 0.68,
        }),
        scene,
        book.position.x,
        0.039,
        book.position.z,
      );
      contact.rotation.x = -Math.PI / 2;
      contact.rotation.z = -book.rotation.y;
      contact.castShadow = contact.receiveShadow = false;
      return contact;
    });
    const ray = new THREE.Raycaster(),
      mouse = new THREE.Vector2();
    function resize() {
      const w = host.clientWidth,
        h = host.clientHeight;
      if (!w || !h) return;
      renderer.setPixelRatio(
        Math.min(
          Math.max(devicePixelRatio || 1, low ? 1 : 1.5),
          low ? 1.25 : 2,
          Math.sqrt((low ? 1500000 : 4600000) / (w * h)),
        ),
      );
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
        contacts[i].position.set(book.position.x, 0.039, book.position.z);
        contacts[i].rotation.z = -book.rotation.y;
      });
      blotter.scale.set(compact ? 0.68 : 1, 1, compact ? 1.08 : 1);
      paper.position.set(compact ? 2.45 : 3.85, 0.048, compact ? -3.7 : -2.4);
      camera.left = (-frustum * aspect) / 2;
      camera.right = (frustum * aspect) / 2;
      camera.top = frustum / 2;
      camera.bottom = -frustum / 2;
      camera.updateProjectionMatrix();
      dirty = true;
      wake();
    }
    observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    listen(c, "pointermove", (e) => {
      if (lost || disposed || !active || performance.now() - hoverAt < 65)
        return;
      hoverAt = performance.now();
      const b = c.getBoundingClientRect();
      mouse.set(
        ((e.clientX - b.left) / b.width) * 2 - 1,
        (-(e.clientY - b.top) / b.height) * 2 + 1,
      );
      ray.setFromCamera(mouse, camera);
      const hit = ray.intersectObjects(books, true)[0];
      c.style.cursor = hit ? "pointer" : "default";
    });
    listen(c, "click", (e) => {
      if (lost || disposed || !active) return;
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
    function wake() {
      if (!frame && active && !lost && !disposed && !document.hidden)
        frame = requestAnimationFrame(animate);
    }
    function renderFrame() {
      if (disposed || lost) return;
      renderer.shadowMap.needsUpdate = true;
      renderer.render(scene, camera);
      if (renderer.getContext().isContextLost()) {
        lost = true;
        options.onState?.("lost");
        return;
      }
      host.dataset.draws = String(Number(host.dataset.draws || 0) + 1);
      host.dataset.triangles = String(renderer.info.render.triangles);
      host.dataset.textures = String(renderer.info.memory.textures);
      if (firstFrame) {
        performance.mark("atelier-scene-ready");
        host.dataset.initializationMs = String(
          Math.round(performance.now() - started),
        );
        options.onState?.(
          "ready",
          low ? "轻量立体书桌 · 低功耗光影" : "立体书桌 · 自动按需渲染",
        );
        firstFrame = false;
      }
      dirty = false;
    }
    function animate(now) {
      frame = 0;
      if (!active || document.hidden || lost || disposed) return;
      if (now - last < (low ? 32 : 20)) {
        wake();
        return;
      }
      last = now;
      try {
        let moving = false;
        const progress = opening ? Math.min(1, (now - opening.start) / 820) : 0;
        const ease = progress * progress * (3 - 2 * progress);
        if (opening && !opening.finished) {
          books[opening.index].userData.hinge.rotation.z = ease * 2.58;
          camera.zoom = 1 + ease * 0.07;
          camera.updateProjectionMatrix();
          moving = true;
          if (progress === 1) opening.finished = true;
        }
        books.forEach((book, i) => {
          const ty = i === selected ? 0.064 : 0.031;
          const ts = i === selected ? 1.055 + ease * 0.05 : 1;
          if (
            Math.abs(book.position.y - ty) > 0.001 ||
            Math.abs(book.scale.x - ts) > 0.001
          ) {
            book.position.y = THREE.MathUtils.lerp(book.position.y, ty, 0.24);
            book.scale.setScalar(THREE.MathUtils.lerp(book.scale.x, ts, 0.24));
            moving = true;
          }
        });
        if (moving || dirty) renderFrame();
        if (moving) wake();
      } catch (error) {
        console.warn("[Keepsake] Frame unavailable:", error.message);
        options.onState?.("fallback");
        dispose();
      }
    }
    listen(c, "webglcontextlost", (event) => {
      event.preventDefault();
      lost = true;
      cancelAnimationFrame(frame);
      frame = 0;
      clearTimeout(openTimer);
      settleOpening?.();
      options.onState?.("lost");
    });
    listen(c, "webglcontextrestored", () => {
      if (disposed) return;
      lost = false;
      dirty = true;
      firstFrame = true;
      owned.forEach((resource) => {
        if (resource.isTexture) resource.needsUpdate = true;
      });
      resize();
      wake();
    });
    listen(document, "visibilitychange", () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
      } else {
        dirty = true;
        wake();
      }
    });
    renderFrame();
    wake();
    return {
      select(i) {
        if (!BOOKS[i]) return;
        selected = i;
        dirty = true;
        wake();
      },
      open(i) {
        if (
          disposed ||
          lost ||
          !BOOKS[i] ||
          matchMedia("(prefers-reduced-motion: reduce)").matches
        )
          return Promise.resolve();
        selected = i;
        opening = { index: i, start: performance.now() };
        dirty = true;
        wake();
        return new Promise((resolve) => {
          settleOpening = resolve;
          openTimer = setTimeout(() => {
            settleOpening = null;
            resolve();
          }, 880);
        });
      },
      setActive(value) {
        active = value;
        if (value) {
          opening = null;
          camera.zoom = 1;
          camera.updateProjectionMatrix();
          books.forEach((book) => {
            book.userData.hinge.rotation.z = 0;
          });
          dirty = true;
          resize();
          wake();
        } else {
          cancelAnimationFrame(frame);
          frame = 0;
        }
      },
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
