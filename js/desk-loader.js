import { BOOKS } from "./textures.js";

export function mountDesk(onSelect) {
  const host = document.querySelector("#desk-stage");
  const loading = document.querySelector("#scene-loading");
  const fallback = document.querySelector("#desk-fallback");
  const status = document.querySelector("#render-status");
  const retry = document.querySelector("#retry-scene");
  let renderer = null,
    active = true,
    selected = 2,
    generation = 0,
    pending = false,
    moduleReady = false,
    loadingController = null;
  const lowDevice =
    (navigator.deviceMemory && navigator.deviceMemory <= 2) ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    navigator.connection?.saveData;
  fallback.innerHTML = BOOKS.map(
    (book, i) =>
      `<button class="fallback-book" data-cover="${i}" aria-label="打开${book.name}" style="--binding:${book.color};--tilt:${(i - 2) * 4}deg"><img src="${new URL(`../assets/textures/cover-${book.id}.jpg`, import.meta.url).href}" alt="${book.name}" width="192" height="270" decoding="async"><span>${book.name}</span></button>`,
  ).join("");
  fallback.addEventListener("click", (event) => {
    const book = event.target.closest("[data-cover]");
    if (book) onSelect(Number(book.dataset.cover));
  });
  function state(name, message) {
    host.dataset.state = name;
    status.textContent = message;
    loading.classList.add("hidden");
    retry.classList.toggle("hidden", name !== "fallback" && name !== "lost");
  }
  async function load() {
    const ticket = ++generation;
    pending = true;
    loadingController?.abort();
    retry.textContent = "重试光影";
    renderer?.dispose();
    renderer = null;
    state("loading", "自动光影 · 正在准备立体书桌");
    const aborter = new AbortController();
    loadingController = aborter;
    const timeout = setTimeout(() => {
      if (ticket !== generation) return;
      aborter.abort();
      renderer?.dispose();
      renderer = null;
      pending = false;
      state("fallback", "立体书桌加载较慢 · 可直接选书，或重试");
    }, 14000);
    let candidate;
    try {
      const module = await import("./scene.js");
      moduleReady = true;
      if (ticket !== generation || aborter.signal.aborted) return;
      candidate = await module.createDesk(onSelect, {
        low: lowDevice,
        signal: aborter.signal,
        onState: (name, info = "") => {
          if (ticket !== generation) return;
          if (name === "ready") state("ready", info || "立体书桌 · 光影已就绪");
          if (name === "lost")
            state("lost", "显卡连接中断 · 已切换纸本视图，仍可选书");
          if (name === "fallback")
            state("fallback", "立体模式暂不可用 · 仍可自由拼贴");
        },
      });
      if (ticket !== generation || aborter.signal.aborted) {
        candidate.dispose();
        return;
      }
      renderer = candidate;
      renderer.select(selected);
      renderer.setActive(active);
    } catch (error) {
      candidate?.dispose();
      if (ticket === generation && !aborter.signal.aborted) {
        console.warn("[Keepsake] 3D unavailable:", error.message);
        state(
          "fallback",
          moduleReady
            ? "当前浏览器无法开启立体光影 · 选书和拼贴仍可使用"
            : "3D资源未能下载 · 选书和拼贴仍可使用",
        );
        retry.textContent = moduleReady ? "重试 3D" : "刷新重试";
      }
    } finally {
      clearTimeout(timeout);
      if (ticket === generation) pending = false;
    }
  }
  retry.addEventListener("click", () => {
    if (pending) return;
    if (!moduleReady) location.reload();
    else load();
  });
  requestAnimationFrame(() => setTimeout(load, 0));
  return {
    select(index) {
      selected = index;
      renderer?.select(index);
    },
    open(index) {
      selected = index;
      return renderer?.open(index) || Promise.resolve();
    },
    setActive(value) {
      active = value;
      renderer?.setActive(value);
    },
    dispose() {
      generation++;
      loadingController?.abort();
      renderer?.dispose();
    },
  };
}
