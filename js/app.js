import { BOOKS, PAPERS, paperTexture, woodTexture } from "./textures.js";
import {
  MATERIALS,
  CATEGORIES,
  PHOTO_FRAMES,
  noteImage,
  photoImage,
} from "./materials.js";
import { createDesk, renderDimensionalMaterials } from "./scene.js";
import { BOOK_THEMES } from "./themes.js";

const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const STORAGE = "keepsake-atelier-v1";
let bookIndex = 2,
  chosenPaper = "ivory",
  state = null,
  selected = null,
  activeSide = 1,
  category = "all",
  undoStack = [],
  redoStack = [],
  saveTimer,
  toastTimer,
  paperMode = "new",
  zoom = 1,
  turning = false,
  drag = null,
  dirty = false,
  openingBook = false,
  photoDraft = null,
  chosenFrame = "polaroid",
  photoMode = "insert",
  photoDialogTarget = null;
const papers = new Map(
  PAPERS.map((p) => [p.id, paperTexture(p.id).toDataURL()]),
);
const materials = new Map(MATERIALS.map((m) => [m.id, m]));
const uid = () =>
  globalThis.crypto?.randomUUID?.() ||
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const clone = (s) => JSON.parse(JSON.stringify(s));
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
function toast(message) {
  $("#toast").textContent = message;
  $("#toast").classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $("#toast").classList.remove("visible"), 2800);
}
function readStorage() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE) || "{}");
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}
function validState(s) {
  return (
    s &&
    BOOKS.some((b) => b.id === s.book) &&
    Array.isArray(s.pages) &&
    s.pages.length >= 2 &&
    s.pages.length % 2 === 0 &&
    s.pages.every((p) => papers.has(p.paper) && Array.isArray(p.items)) &&
    Number.isInteger(s.spread) &&
    s.spread >= 0 &&
    s.spread < s.pages.length / 2
  );
}
function saveNow() {
  if (!state || !dirty) return;
  try {
    const all = readStorage();
    state.updated = Date.now();
    all[state.book] = state;
    all.last = state.book;
    localStorage.setItem(STORAGE, JSON.stringify(all));
    $("#save-status").textContent = "已保存";
    dirty = false;
    $("#resume-btn").classList.remove("hidden");
  } catch {
    $("#save-status").textContent = "保存失败";
    toast("本地存储空间不足，请先导出此页；当前创作仍保留在页面中。");
  }
}
function save() {
  dirty = true;
  $("#save-status").textContent = "保存中";
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveNow, 500);
}
window.addEventListener("pagehide", saveNow);
document.addEventListener("visibilitychange", () => {
  if (document.hidden) saveNow();
});
function checkpoint() {
  undoStack.push(clone(state));
  if (undoStack.length > 30) undoStack.shift();
  redoStack = [];
  updateHistory();
}
function updateHistory() {
  $("#undo-btn").disabled = turning || !undoStack.length;
  $("#redo-btn").disabled = turning || !redoStack.length;
}
function undo() {
  if (turning || !undoStack.length) return;
  redoStack.push(clone(state));
  state = undoStack.pop();
  selected = null;
  renderSpread();
  updateHistory();
  save();
}
function redo() {
  if (turning || !redoStack.length) return;
  undoStack.push(clone(state));
  state = redoStack.pop();
  selected = null;
  renderSpread();
  updateHistory();
  save();
}
function chooseBook(i) {
  bookIndex = i;
  desk?.select(i);
  $("#chosen-name").textContent = BOOKS[i].name;
  $("#chosen-sub").textContent = BOOKS[i].subtitle;
  $$(".book-option").forEach((b, j) => {
    b.classList.toggle("active", i === j);
    b.setAttribute("aria-pressed", String(i === j));
  });
}
$("#book-options").innerHTML = BOOKS.map(
  (b, i) =>
    `<button class="book-option ${i === bookIndex ? "active" : ""}" data-book="${i}" aria-pressed="${i === bookIndex}" style="--book-color:${b.color}"><span class="color-sample"></span><strong>${b.name}</strong><small>${b.english.split(" ").slice(-2).join(" ")}</small></button>`,
).join("");
let desk = null;
$("#book-options").addEventListener("click", (e) => {
  const b = e.target.closest("[data-book]");
  if (b) openSelectedBook(Number(b.dataset.book));
});
requestAnimationFrame(() => {
  desk = createDesk(openSelectedBook);
});
const deskWood = woodTexture(800, 800).toDataURL();
$("#about-btn").onclick = () => $("#about-dialog").showModal();
$("#close-about").onclick = () => $("#about-dialog").close();
function showPapers(mode) {
  if (turning) return;
  paperMode = mode;
  chosenPaper =
    mode === "new" ? "ivory" : state.pages[state.spread * 2 + activeSide].paper;
  $("#paper-title").textContent =
    mode === "new"
      ? "故事，落在什么纸上？"
      : `为${activeSide === 0 ? "左" : "右"}页换一张纸`;
  $("#confirm-paper").innerHTML =
    (mode === "new" ? "开始收藏" : "换上这张纸") +
    ' <svg><use href="#i-arrow"/></svg>';
  renderPapers();
  $("#paper-dialog").showModal();
}
function renderPapers() {
  $("#paper-options").innerHTML = PAPERS.map(
    (p, i) =>
      `<button class="paper-option ${p.id === chosenPaper ? "active" : ""}" data-paper="${p.id}" aria-pressed="${p.id === chosenPaper}"><span class="paper-swatch" style="background-image:url('${papers.get(p.id)}')"></span><span class="paper-label">${p.name}<small>${String(i + 1).padStart(2, "0")}</small></span></button>`,
  ).join("");
  $("#paper-description").textContent = PAPERS.find(
    (p) => p.id === chosenPaper,
  ).description;
}
$("#paper-options").addEventListener("click", (e) => {
  const b = e.target.closest("[data-paper]");
  if (b) {
    chosenPaper = b.dataset.paper;
    renderPapers();
  }
});
async function openSelectedBook(i) {
  if (openingBook) return;
  openingBook = true;
  chooseBook(i);
  const old = readStorage()[BOOKS[i].id];
  chosenPaper = BOOK_THEMES[BOOKS[i].id].paper;
  $("#home").classList.add("opening");
  $("#chosen-sub").textContent = "正在展开你的故事…";
  try {
    await desk?.open?.(i);
    openEditor(validState(old) ? clone(old) : newJournal());
  } finally {
    $("#home").classList.remove("opening");
    openingBook = false;
  }
}
$("#confirm-paper").onclick = () => {
  if (paperMode === "new") openEditor(newJournal());
  else {
    checkpoint();
    state.pages[state.spread * 2 + activeSide].paper = chosenPaper;
    renderSpread();
    save();
    toast("新的纸张，新的心情。");
  }
  $("#paper-dialog").close();
};
$("#paper-btn").onclick = () => showPapers("edit");
function makeItem(id, x, y, width, angle = 0, extra = {}) {
  return {
    uid: uid(),
    material: id,
    x,
    y,
    width: width || materials.get(id).width,
    rotation: angle,
    ...extra,
  };
}
function newJournal() {
  const theme = BOOK_THEMES[BOOKS[bookIndex].id];
  return {
    version: 1,
    book: BOOKS[bookIndex].id,
    name: "我的拾光手记",
    spread: 0,
    pages: [theme.left, theme.right].map((items) => ({
      paper: chosenPaper,
      items: items.map((args) => makeItem(...args)),
    })),
  };
}
function applyTheme() {
  const book = BOOKS[bookIndex],
    theme = BOOK_THEMES[book.id];
  const editor = $("#editor");
  editor.dataset.theme = book.id;
  for (const [key, value] of Object.entries(theme.colors)) {
    editor.style.setProperty(`--${key}`, value);
    $$("dialog").forEach((dialog) =>
      dialog.style.setProperty(`--${key}`, value),
    );
  }
  editor.style.setProperty("--desk-ink", theme.deskInk);
  editor.style.setProperty("--ribbon", theme.ribbon);
  $(".workbench").style.backgroundImage = `${theme.wash},url("${deskWood}")`;
  $(".workbench-top .eyebrow").textContent = theme.english;
  $(".desk-letter span").textContent = theme.note;
  $(".desk-letter i").textContent = theme.message;
  let label = $(".desk-room-label");
  if (!label) {
    label = document.createElement("div");
    label.className = "desk-room-label";
    $("#workbench-book").after(label);
  }
  label.textContent = theme.room;
  $("#desk-props").replaceChildren();
  theme.props.forEach(([id, position]) => {
    const material = materials.get(id);
    if (!material) return;
    const image = document.createElement("img");
    image.className = `desk-prop ${position}`;
    image.src = material.src;
    image.alt = "";
    $("#desk-props").append(image);
  });
}
function openEditor(s) {
  state = s;
  bookIndex = BOOKS.findIndex((b) => b.id === s.book);
  undoStack = [];
  redoStack = [];
  selected = null;
  activeSide = 1;
  zoom = 1;
  $("#home").classList.add("hidden");
  $("#editor").classList.remove("hidden");
  desk?.setActive(false);
  applyTheme();
  $("#editor").classList.add("arriving");
  setTimeout(() => $("#editor").classList.remove("arriving"), 900);
  $("#workbench-book").textContent = BOOKS[bookIndex].name;
  $("#open-book-stage").style.setProperty(
    "--cover-color",
    BOOKS[bookIndex].color,
  );
  $("#journal-name").value = state.name;
  $("#open-book-stage").style.setProperty("--zoom", zoom);
  $("#zoom-level").textContent = "100%";
  renderSpread();
  renderMaterials();
  updateHistory();
  save();
}
$("#back-home").onclick = () => {
  if (turning) return;
  saveNow();
  $("#editor").classList.add("hidden");
  $("#home").classList.remove("hidden");
  desk?.setActive(true);
  chooseBook(bookIndex);
};
const stored = readStorage();
if (validState(stored[stored.last]))
  $("#resume-btn").classList.remove("hidden");
$("#resume-btn").onclick = () => {
  const all = readStorage();
  if (validState(all[all.last]))
    openSelectedBook(BOOKS.findIndex((b) => b.id === all.last));
};
$("#journal-name").addEventListener("change", () => {
  const value = $("#journal-name").value.trim() || "我的拾光手记";
  checkpoint();
  state.name = value;
  $("#journal-name").value = value;
  save();
});
function itemSource(item) {
  const m = materials.get(item.material);
  if (!m) return null;
  if (m.category === "handwritten")
    return noteImage(item.text ?? m.text, m.variant);
  if (m.category === "photo") return photoImage(item.photo || "", m.frame);
  return m.src;
}
function getSelection() {
  if (!selected || !state) return null;
  for (let p = state.spread * 2; p < state.spread * 2 + 2; p++) {
    const i = state.pages[p].items.find((i) => i.uid === selected);
    if (i) return { item: i, page: p };
  }
  return null;
}
function selectItem(id) {
  selected = id;
  $$(".scrap").forEach((s) =>
    s.classList.toggle("selected", s.dataset.uid === id),
  );
  const sel = getSelection();
  $("#element-tools").classList.toggle("hidden", !sel);
  if (sel) {
    const m = materials.get(sel.item.material);
    $('#element-tools [data-action="edit"]').classList.toggle(
      "hidden",
      !["handwritten", "photo"].includes(m.category),
    );
    $('#element-tools [data-action="frame"]').classList.toggle(
      "hidden",
      m.category !== "photo",
    );
    activeSide = sel.page % 2;
  }
}
function renderSpread() {
  if (!state) return;
  $$(".journal-page").forEach((node, side) => {
    const p = state.pages[state.spread * 2 + side];
    node.querySelector(".page-surface").style.backgroundImage =
      `url('${papers.get(p.paper)}')`;
    node.querySelector(".page-number").textContent = String(
      state.spread * 2 + side + 1,
    ).padStart(2, "0");
    const layer = node.querySelector(".page-elements");
    layer.replaceChildren();
    p.items.forEach((item, index) => {
      const m = materials.get(item.material);
      if (!m) return;
      const el = document.createElement("div");
      el.className = "scrap";
      el.dataset.uid = item.uid;
      el.dataset.category = m.category;
      el.setAttribute("role", "button");
      el.tabIndex = 0;
      el.setAttribute("aria-label", m.name + "，拖动调整位置");
      el.innerHTML =
        '<img draggable="false" alt=""><span class="resize-handle"></span><span class="rotate-handle"></span>';
      el.querySelector("img").src = itemSource(item);
      el.querySelector("img").alt = m.name;
      styleItem(el, item, index);
      layer.append(el);
    });
  });
  $("#journal-name").value = state.name;
  $("#page-indicator").textContent =
    `${String(state.spread * 2 + 1).padStart(2, "0")} — ${String(state.spread * 2 + 2).padStart(2, "0")}`;
  $("#page-total").textContent =
    `共 ${state.pages.length} 页 · 每一页都值得留住`;
  $("#prev-page").disabled = state.spread === 0 || turning;
  $("#next-page").disabled =
    state.spread >= state.pages.length / 2 - 1 || turning;
  selectItem(selected);
}
function styleItem(el, item, index) {
  const m = materials.get(item.material);
  el.style.left = `${item.x}%`;
  el.style.top = `${item.y}%`;
  el.style.width = `${item.width}%`;
  el.style.aspectRatio = `${m.w}/${m.h}`;
  el.style.setProperty("--rotation", `${item.rotation}deg`);
  if (index !== undefined) el.style.zIndex = index + 1;
}
function renderMaterials() {
  const search = $("#material-search").value.trim().toLowerCase();
  const filtered = MATERIALS.filter(
    (m) =>
      (category === "all" || m.category === category) &&
      (!search ||
        `${m.name} ${CATEGORIES.find((c) => c[0] === m.category)?.[1]}`
          .toLowerCase()
          .includes(search)),
  );
  $("#material-count").textContent = String(MATERIALS.length).padStart(2, "0");
  $("#material-grid").innerHTML =
    filtered
      .map(
        (m) =>
          `<button class="material-card" draggable="true" data-material="${m.id}" title="点击贴上 ${m.name}"><img src="${m.src}" alt="${m.name}" draggable="false"><span>${m.name}</span>${m.dimensional ? '<small class="dimensional">立体</small>' : ""}</button>`,
      )
      .join("") ||
    '<div class="material-empty">这个抽屉暂时没有找到。<br>换个关键词试试？</div>';
}
$("#category-tabs").innerHTML = CATEGORIES.map(
  ([id, label]) =>
    `<button class="category-tab ${id === "all" ? "active" : ""}" data-category="${id}" aria-pressed="${id === "all"}">${label}</button>`,
).join("");
$("#category-tabs").onclick = (e) => {
  const b = e.target.closest("[data-category]");
  if (!b) return;
  category = b.dataset.category;
  $$(".category-tab").forEach((t) => {
    t.classList.toggle("active", t === b);
    t.setAttribute("aria-pressed", String(t === b));
  });
  renderMaterials();
};
$("#material-search").addEventListener("input", renderMaterials);
function addMaterial(id, side = activeSide, x = 50, y = 50) {
  if (!materials.has(id) || turning) return;
  checkpoint();
  const p = state.pages[state.spread * 2 + side];
  const item = makeItem(id, x, y, null, ((p.items.length % 5) - 2) * 3);
  p.items.push(item);
  selected = item.uid;
  activeSide = side;
  renderSpread();
  save();
  if (materials.get(id).category === "photo")
    toast("双击照片框，放入你自己的照片。");
  else if (materials.get(id).category === "handwritten")
    toast("双击手写条，可以写下自己的故事。");
}
$("#material-grid").onclick = (e) => {
  const b = e.target.closest("[data-material]");
  if (b) addMaterial(b.dataset.material);
};
$("#material-grid").addEventListener("dragstart", (e) => {
  const b = e.target.closest("[data-material]");
  if (!b) return;
  e.dataTransfer.setData("application/x-keepsake", b.dataset.material);
  e.dataTransfer.effectAllowed = "copy";
});
function localPoint(clientX, clientY) {
  const stage = $("#open-book-stage"),
    rect = stage.getBoundingClientRect(),
    a = (-1.5 * Math.PI) / 180,
    dx = clientX - (rect.left + rect.width / 2),
    dy = clientY - (rect.top + rect.height / 2);
  const x =
      (Math.cos(a) * dx + Math.sin(a) * dy) / (stage.offsetWidth * zoom) + 0.5,
    y =
      (-Math.sin(a) * dx + Math.cos(a) * dy) / (stage.offsetHeight * zoom) +
      0.5;
  return { x: x * 200, y: y * 100, side: x < 0.5 ? 0 : 1 };
}
$$(".journal-page").forEach((page, side) => {
  page.addEventListener("dragover", (e) => {
    if ([...e.dataTransfer.types].includes("application/x-keepsake")) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "copy";
    }
  });
  page.addEventListener("drop", (e) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("application/x-keepsake"),
      p = localPoint(e.clientX, e.clientY);
    addMaterial(id, side, clamp(p.x - side * 100, 3, 97), clamp(p.y, 3, 97));
  });
  page.addEventListener("pointerdown", (e) => {
    if (turning || e.button !== 0) return;
    activeSide = side;
    const el = e.target.closest(".scrap");
    if (!el) {
      selectItem(null);
      return;
    }
    e.preventDefault();
    selectItem(el.dataset.uid);
    const sel = getSelection(),
      p = localPoint(e.clientX, e.clientY);
    let mode = e.target.classList.contains("resize-handle")
      ? "resize"
      : e.target.classList.contains("rotate-handle")
        ? "rotate"
        : "move";
    const stage = $("#open-book-stage");
    const centerGlobalX = sel.item.x + side * 100,
      dx = ((p.x - centerGlobalX) * stage.offsetWidth) / 200,
      dy = ((p.y - sel.item.y) * stage.offsetHeight) / 100;
    drag = {
      id: sel.item.uid,
      page: sel.page,
      mode,
      start: p,
      original: clone(sel.item),
      offsetX: p.x - centerGlobalX,
      offsetY: p.y - sel.item.y,
      startDistance: Math.hypot(dx, dy),
      startAngle: (Math.atan2(dy, dx) * 180) / Math.PI,
      moved: false,
      el,
    };
    el.setPointerCapture(e.pointerId);
  });
});
document.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const p = localPoint(e.clientX, e.clientY);
  if (!drag.moved) {
    if (Math.abs(p.x - drag.start.x) + Math.abs(p.y - drag.start.y) < 0.5)
      return;
    checkpoint();
    drag.moved = true;
  }
  const sel = getSelection();
  if (!sel) return;
  const item = sel.item;
  if (drag.mode === "move") {
    const gx = clamp(p.x - drag.offsetX, 3, 197),
      gy = clamp(p.y - drag.offsetY, 3, 97),
      side = gx < 100 ? 0 : 1;
    item.x = gx - side * 100;
    item.y = gy;
    if (side !== sel.page % 2) {
      state.pages[sel.page].items = state.pages[sel.page].items.filter(
        (i) => i.uid !== item.uid,
      );
      const targetPage = state.spread * 2 + side;
      state.pages[targetPage].items.push(item);
      drag.page = targetPage;
      activeSide = side;
      $$(".page-elements")[side].append(drag.el);
    }
  } else {
    const stage = $("#open-book-stage"),
      dx =
        ((p.x - (drag.original.x + (drag.page % 2) * 100)) *
          stage.offsetWidth) /
        200,
      dy = ((p.y - drag.original.y) * stage.offsetHeight) / 100;
    if (drag.mode === "resize")
      item.width = clamp(
        (drag.original.width * Math.hypot(dx, dy)) /
          Math.max(1, drag.startDistance),
        8,
        130,
      );
    else
      item.rotation = Math.round(
        drag.original.rotation +
          (Math.atan2(dy, dx) * 180) / Math.PI -
          drag.startAngle,
      );
  }
  styleItem(drag.el, item);
});
function endDrag() {
  if (!drag) return;
  const moved = drag.moved;
  drag = null;
  if (moved) {
    renderSpread();
    save();
  }
}
document.addEventListener("pointerup", endDrag);
document.addEventListener("pointercancel", endDrag);
$("#spread").addEventListener("dblclick", (e) => {
  const el = e.target.closest(".scrap");
  if (el) {
    selectItem(el.dataset.uid);
    editSelected();
  }
});
$("#spread").addEventListener("keydown", (e) => {
  const el = e.target.closest(".scrap");
  if (el && (e.key === "Enter" || e.key === " ")) {
    e.preventDefault();
    selectItem(el.dataset.uid);
  }
});
function editSelected() {
  const sel = getSelection();
  if (!sel) return;
  const m = materials.get(sel.item.material);
  if (m.category === "handwritten") {
    $("#note-text").value = sel.item.text ?? m.text;
    $("#text-dialog").showModal();
    setTimeout(() => $("#note-text").focus(), 80);
  } else if (m.category === "photo") {
    showPhotoDialog("edit", sel.item);
  }
}
$("#confirm-text").onclick = () => {
  const sel = getSelection();
  if (sel) {
    checkpoint();
    sel.item.text = $("#note-text").value.trim() || " ";
    renderSpread();
    save();
  }
  $("#text-dialog").close();
};
function itemAction(action) {
  const sel = getSelection();
  if (!sel) return;
  const item = sel.item,
    p = state.pages[sel.page];
  if (action === "edit") {
    editSelected();
    return;
  }
  if (action === "frame") {
    showPhotoDialog("edit", item);
    return;
  }
  checkpoint();
  switch (action) {
    case "rotate":
      item.rotation = (item.rotation + 15) % 360;
      break;
    case "smaller":
      item.width = clamp(item.width * 0.9, 8, 130);
      break;
    case "larger":
      item.width = clamp(item.width * 1.1, 8, 130);
      break;
    case "delete":
      p.items = p.items.filter((i) => i.uid !== selected);
      selected = null;
      break;
    case "forward":
      p.items = p.items.filter((i) => i.uid !== selected);
      p.items.push(item);
      break;
    case "copy": {
      const copy = {
        ...clone(item),
        uid: uid(),
        x: clamp(item.x + 5, 3, 97),
        y: clamp(item.y + 5, 3, 97),
      };
      p.items.push(copy);
      selected = copy.uid;
      break;
    }
  }
  renderSpread();
  save();
}
$("#element-tools").onclick = (e) => {
  const b = e.target.closest("[data-action]");
  if (b) itemAction(b.dataset.action);
};
$("#undo-btn").onclick = undo;
$("#redo-btn").onclick = redo;
document.addEventListener("keydown", (e) => {
  if (
    !state ||
    $("#editor").classList.contains("hidden") ||
    (e.target instanceof Element && e.target.matches("input,textarea")) ||
    $("dialog[open]")
  )
    return;
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
    e.preventDefault();
    e.shiftKey ? redo() : undo();
  } else if ((e.key === "Delete" || e.key === "Backspace") && selected) {
    e.preventDefault();
    itemAction("delete");
  } else if (e.key === "Escape") selectItem(null);
  else if (
    (e.metaKey || e.ctrlKey) &&
    e.key.toLowerCase() === "d" &&
    selected
  ) {
    e.preventDefault();
    itemAction("copy");
  } else if (
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key) &&
    selected
  ) {
    e.preventDefault();
    const sel = getSelection();
    checkpoint();
    const step = e.shiftKey ? 3 : 0.5;
    if (e.key === "ArrowLeft") sel.item.x = clamp(sel.item.x - step, 3, 97);
    if (e.key === "ArrowRight") sel.item.x = clamp(sel.item.x + step, 3, 97);
    if (e.key === "ArrowUp") sel.item.y = clamp(sel.item.y - step, 3, 97);
    if (e.key === "ArrowDown") sel.item.y = clamp(sel.item.y + step, 3, 97);
    renderSpread();
    save();
  }
});
function turnTo(target) {
  if (turning || target < 0 || target >= state.pages.length / 2) return;
  const direction = target > state.spread ? "next" : "prev";
  turning = true;
  updateHistory();
  selectItem(null);
  $("#spread").classList.add("turn-" + direction);
  $("#prev-page").disabled = true;
  $("#next-page").disabled = true;
  setTimeout(() => {
    state.spread = target;
    renderSpread();
    save();
  }, 280);
  setTimeout(() => {
    $("#spread").classList.remove("turn-" + direction);
    turning = false;
    updateHistory();
    renderSpread();
  }, 600);
}
$("#prev-page").onclick = () => turnTo(state.spread - 1);
$("#next-page").onclick = () => turnTo(state.spread + 1);
$("#add-page").onclick = () => {
  if (turning) return;
  if (state.pages.length >= 100) {
    toast("这本手记已经有 100 页了，换一本书继续收藏吧。");
    return;
  }
  checkpoint();
  const paper = state.pages[state.spread * 2 + activeSide].paper;
  state.pages.push({ paper, items: [] }, { paper, items: [] });
  save();
  turnTo(state.pages.length / 2 - 1);
  toast("添了两张新书页，故事可以继续了。");
};
function setZoom(v) {
  zoom = clamp(v, 0.7, 1.25);
  $("#open-book-stage").style.setProperty("--zoom", zoom);
  $("#zoom-level").textContent = `${Math.round(zoom * 100)}%`;
}
$("#zoom-out").onclick = () => setZoom(zoom - 0.1);
$("#zoom-in").onclick = () => setZoom(zoom + 0.1);
let photoSession = 0;
function showPhotoDialog(mode = "insert", item = null) {
  if (!state || turning) return;
  photoSession++;
  photoMode = mode;
  photoDialogTarget = item?.uid || null;
  chosenFrame = item ? materials.get(item.material).frame : "polaroid";
  photoDraft = item?.photo || null;
  $("#photo-dialog-title").textContent =
    mode === "edit" ? "回忆不变，换一种装裱。" : "为回忆，挑一个相框。";
  renderPhotoTemplates();
  if (!$("#photo-dialog").open) $("#photo-dialog").showModal();
}
function renderPhotoTemplates() {
  $("#photo-templates").innerHTML = PHOTO_FRAMES.map(
    (frame) =>
      `<button class="photo-template ${frame.id === chosenFrame ? "active" : ""}" data-frame="${frame.id}" aria-pressed="${frame.id === chosenFrame}"><img src="${photoImage(photoDraft || "", frame.id)}" alt="${frame.name}" draggable="false"><span>${frame.name}</span></button>`,
  ).join("");
  $("#photo-frame-description").textContent = PHOTO_FRAMES.find(
    (f) => f.id === chosenFrame,
  ).description;
  $("#confirm-photo").innerHTML =
    (photoDraft
      ? photoMode === "insert"
        ? "贴入书页"
        : "保存这个模板"
      : "选择照片") + ' <svg><use href="#i-arrow" /></svg>';
  $("#replace-photo").classList.toggle("hidden", !photoDraft);
}
$("#photo-templates").onclick = (e) => {
  const button = e.target.closest("[data-frame]");
  if (button) {
    chosenFrame = button.dataset.frame;
    renderPhotoTemplates();
  }
};
$("#replace-photo").onclick = () => $("#photo-input").click();
$("#confirm-photo").onclick = () => {
  if (!photoDraft) {
    $("#photo-input").click();
    return;
  }
  let target = null;
  if (photoDialogTarget)
    target = state.pages
      .flatMap((p) => p.items)
      .find((i) => i.uid === photoDialogTarget);
  if (photoMode === "edit" && !target) {
    toast("这张照片已经不在当前手账里了。");
    return;
  }
  checkpoint();
  if (!target) {
    target = makeItem(`photo-${chosenFrame}`, 50, 50, 57, -4);
    state.pages[state.spread * 2 + activeSide].items.push(target);
  } else target.material = `photo-${chosenFrame}`;
  target.photo = photoDraft;
  selected = target.uid;
  renderSpread();
  save();
  $("#photo-dialog").close();
  toast("照片已装裱好，双击可以重新换框或换照片。");
};
$("#photo-dialog").addEventListener("close", () => {
  photoSession++;
  photoDraft = null;
  photoDialogTarget = null;
});
$("#upload-btn").onclick = () => showPhotoDialog();
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = () => reject(new Error("图片无法读取"));
    i.src = src;
  });
}
$("#photo-input").onchange = async (e) => {
  const file = e.target.files[0];
  e.target.value = "";
  if (!file) return;
  if (file.size > 20 * 1024 * 1024) {
    toast("照片请小于 20 MB。");
    return;
  }
  if (!state || turning) return;
  if (!$("#photo-dialog").open) showPhotoDialog();
  const session = photoSession,
    journal = state;
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImage(url),
      scale = Math.min(1, 900 / Math.max(img.naturalWidth, img.naturalHeight)),
      c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    const x = c.getContext("2d");
    x.fillStyle = "#eee5d5";
    x.fillRect(0, 0, c.width, c.height);
    x.drawImage(img, 0, 0, c.width, c.height);
    if (
      session !== photoSession ||
      journal !== state ||
      !$("#photo-dialog").open
    )
      return;
    photoDraft = c.toDataURL("image/jpeg", 0.82);
    renderPhotoTemplates();
    toast("照片已放入预览，挑好模板后确认贴入书页。");
  } catch {
    toast("没能读到这张图片，请试试 JPG、PNG 或 WebP。");
  } finally {
    URL.revokeObjectURL(url);
  }
};
$("#export-btn").onclick = async () => {
  if (!state) return;
  const b = $("#export-btn");
  b.disabled = true;
  try {
    const W = 1600,
      H = 1120,
      margin = 38,
      gap = 12,
      pageW = (W - 2 * margin - gap) / 2,
      pageH = H - 2 * margin,
      c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const x = c.getContext("2d");
    x.fillStyle = BOOKS[bookIndex].color;
    x.fillRect(0, 0, W, H);
    x.strokeStyle = BOOKS[bookIndex].gold;
    x.strokeRect(8, 8, W - 16, H - 16);
    for (let side = 0; side < 2; side++) {
      const p = state.pages[state.spread * 2 + side],
        left = margin + side * (pageW + gap);
      x.save();
      x.beginPath();
      x.rect(left, margin, pageW, pageH);
      x.clip();
      x.drawImage(paperTexture(p.paper), left, margin, pageW, pageH);
      for (const item of p.items) {
        const m = materials.get(item.material);
        if (!m) continue;
        const img = await loadImage(itemSource(item)),
          iw = (pageW * item.width) / 100,
          ih = (iw * m.h) / m.w;
        x.save();
        x.translate(
          left + (pageW * item.x) / 100,
          margin + (pageH * item.y) / 100,
        );
        x.rotate((item.rotation * Math.PI) / 180);
        x.shadowColor = "rgba(54,38,24,.18)";
        x.shadowOffsetX = 2;
        x.shadowOffsetY = 4;
        x.shadowBlur = 4;
        x.drawImage(img, -iw / 2, -ih / 2, iw, ih);
        x.restore();
      }
      const g = x.createLinearGradient(left, 0, left + pageW, 0);
      g.addColorStop(0, side ? "#372c2540" : "#67502b17");
      g.addColorStop(0.06, "#372c2500");
      g.addColorStop(0.94, "#372c2500");
      g.addColorStop(1, side ? "#67502b17" : "#372c2540");
      x.fillStyle = g;
      x.fillRect(left, margin, pageW, pageH);
      x.font = "18px Georgia";
      x.fillStyle = "#8f7a55";
      x.textAlign = "center";
      x.fillText(
        String(state.spread * 2 + side + 1).padStart(2, "0"),
        left + pageW / 2,
        H - margin - 22,
      );
      x.restore();
    }
    const blob = await new Promise((resolve) => c.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("导出失败");
    const url = URL.createObjectURL(blob),
      a = document.createElement("a");
    a.href = url;
    a.download = `${state.name.replace(/[\\/:*?"<>|]/g, "_")}-${state.spread * 2 + 1}-${state.spread * 2 + 2}.png`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    toast("这一页的故事，已经珍藏为 PNG。");
  } catch {
    toast("导出暂时失败，请稍后重试。");
  } finally {
    b.disabled = false;
  }
};
for (const dialog of $$("dialog"))
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) {
      const r = dialog.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        dialog.close();
    }
  });
setTimeout(() => {
  try {
    const rendered = renderDimensionalMaterials();
    for (const [id, src] of Object.entries(rendered))
      materials.get(id).src = src;
    if (state && !$("#editor").classList.contains("hidden")) {
      renderSpread();
      renderMaterials();
    }
  } catch {}
}, 700);
