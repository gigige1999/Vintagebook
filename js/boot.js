(() => {
  const script = document.currentScript;
  const url = new URL("./app.js", script.src);
  let ready = false;
  const slow = setTimeout(() => {
    if (!ready)
      document.querySelector("#scene-loading").textContent =
        "正在加载拼贴功能；网络较慢时请稍候或刷新页面。";
  }, 12000);
  import(url.href)
    .then(() => {
      ready = true;
      clearTimeout(slow);
      document.documentElement.dataset.appReady = "true";
    })
    .catch((error) => {
      clearTimeout(slow);
      console.error("[Keepsake] Application unavailable:", error);
      document.querySelector("#scene-loading").classList.remove("hidden");
      document.querySelector("#scene-loading").textContent =
        location.protocol === "file:"
          ? "请通过网站地址或 npm start 打开，不要直接双击 HTML 文件。"
          : "拼贴功能加载失败，请检查网络后刷新页面。";
      document.querySelector("#render-status").textContent = "资源加载中断";
      const retry = document.querySelector("#retry-scene");
      retry.textContent = "重新加载";
      retry.classList.remove("hidden");
      retry.onclick = () => location.reload();
    });
})();
