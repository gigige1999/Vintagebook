const cache = new Map();
let database;
function db() {
  if (!database) database = new Promise((resolve, reject) => {
    if (!globalThis.indexedDB) { reject(new Error('当前浏览器不支持本地图片存储')); return; }
    const request = indexedDB.open('vintagebook-assets', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('images');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('无法打开本地图片库，请检查浏览器隐私设置'));
  });
  return database;
}
export async function saveAsset(blob) {
  if (!(blob instanceof Blob)) throw new Error('图片数据无效');
  const id = crypto.randomUUID?.() || `img-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const store = await db();
  await new Promise((resolve, reject) => {
    const transaction = store.transaction('images', 'readwrite');
    transaction.objectStore('images').put(blob, id);
    transaction.oncomplete = resolve;
    transaction.onerror = transaction.onabort = () => reject(new Error('本地图片空间不足，图片未保存'));
  });
  cache.set(id, URL.createObjectURL(blob));
  return id;
}
export function assetUrl(id) { return cache.get(id) || ''; }
export async function loadAsset(id) {
  if (!id) return '';
  if (cache.has(id)) return cache.get(id);
  const store = await db();
  const blob = await new Promise((resolve, reject) => {
    const request = store.transaction('images').objectStore('images').get(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('本地图片读取失败'));
  });
  if (!blob) throw new Error('图片资源已被清理，请重新上传');
  const url = URL.createObjectURL(blob); cache.set(id, url); return url;
}
export async function prepareAssets(journal) {
  const ids = new Set(journal.pages.flatMap(page => page.items.flatMap(item =>
    [item.photoAsset, item.stickerAsset, item.sourceAsset, item.alphaAsset].filter(Boolean))));
  const results = await Promise.allSettled([...ids].map(loadAsset));
  return results.some(r => r.status === 'rejected');
}
export function imageFrom(src) {
  return new Promise((resolve, reject) => {
    const image = new Image(); image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('图片无法读取')); image.src = src;
  });
}
export function toBlob(canvas, type = 'image/png', quality) {
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('图片编码失败')), type, quality));
}
export async function importImage(file, maxSide = 2048) {
  if (!file || file.size > 20 * 1024 * 1024) throw new Error('请选择小于 20 MB 的 JPG、PNG 或 WebP 图片');
  const url = URL.createObjectURL(file);
  try {
    const image = await imageFrom(url);
    const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
    canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
    const context = canvas.getContext('2d');
    context.imageSmoothingEnabled = true; context.imageSmoothingQuality = 'high';
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
    const blob = await toBlob(canvas, 'image/png');
    return { blob, canvas, width: canvas.width, height: canvas.height, resized: scale < 1 };
  } finally { URL.revokeObjectURL(url); }
}
export async function imageDataUrl(src) {
  const response = await fetch(src);
  if (!response.ok) throw new Error('图片读取失败');
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(blob);
  });
}
