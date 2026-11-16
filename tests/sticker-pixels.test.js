import test from "node:test";
import assert from "node:assert/strict";
import { connectedBackground, connectedRegion, fillRegionHoles, keepOnlyRegion, colorPixels } from "../js/sticker-pixels.js";
import { MATERIALS, PHOTO_FRAMES, photoImage } from "../js/materials.js";
import { EXTRA_MATERIALS } from "../js/material-styles.js";
import { GENERATED_MATERIALS } from "../js/material-library.js";
import { STICKER_SHELLS } from "../js/sticker-frames.js";
import { PAPERS } from "../js/textures.js";

function image(width, height, color = [255, 255, 255, 255]) {
  return new Uint8ClampedArray(Array.from({ length: width * height }, () => color).flat());
}
function set(pixels, width, x, y, color) {
  pixels.set(color, (y * width + x) * 4);
}
test("background removal keeps enclosed regions and does not mutate the original", () => {
  const pixels = image(7, 7);
  for (let y = 1; y <= 5; y++) for (let x = 1; x <= 5; x++) set(pixels, 7, x, y, [180, 30, 30, 255]);
  set(pixels, 7, 3, 3, [255, 255, 255, 255]);
  const original = pixels.slice();
  const removed = connectedBackground(pixels, 7, 7, 10);
  assert.equal(removed[0], 1);
  assert.equal(removed[3 * 7 + 3], 0);
  assert.equal(removed[2 * 7 + 2], 0);
  assert.equal(removed.reduce((a, b) => a + b, 0), 24);
  assert.deepEqual(pixels, original);
});
test("magic wand removes only the clicked connected color region", () => {
  const pixels = image(5, 3);
  for (let y = 0; y < 3; y++) set(pixels, 5, 2, y, [0, 0, 0, 255]);
  const removed = connectedBackground(pixels, 5, 3, 5, { x: 0, y: 1 });
  assert.equal(removed.reduce((a, b) => a + b, 0), 6);
  assert.equal(removed[4], 0);
});
test("transparent pixels remain connected without affecting opaque subjects", () => {
  const pixels = image(3, 3, [24, 200, 80, 0]);
  set(pixels, 3, 1, 1, [180, 20, 30, 255]);
  const removed = connectedBackground(pixels, 3, 3, 5);
  assert.equal(removed[4], 0);
  assert.equal(removed.reduce((a, b) => a + b, 0), 8);
});
test("filters preserve alpha and original mode preserves all channels", () => {
  const original = new Uint8ClampedArray([90, 140, 190, 128, 20, 30, 40, 0]);
  assert.deepEqual(colorPixels(original.slice()), original);
  for (const preset of ["sepia", "warm", "mono", "noir", "blue", "honey", "porcelain", "sage", "amber", "dustyrose", "cinema", "matte"]) {
    const processed = colorPixels(original.slice(), preset, 110, 120, 80);
    assert.equal(processed[3], 128);
    assert.deepEqual(processed.slice(4), original.slice(4));
    assert.notDeepEqual(processed.slice(0, 3), original.slice(0, 3));
  }
  const mono = colorPixels(original.slice(), "mono");
  assert.equal(mono[0], mono[1]);
  assert.equal(mono[1], mono[2]);
});
test("positive magic wand keeps only the clicked connected region", () => {
  const pixels = image(7, 7);
  for (let y = 2; y <= 4; y++) for (let x = 2; x <= 4; x++) set(pixels, 7, x, y, [40, 90, 60, 255]);
  set(pixels, 7, 0, 0, [10, 20, 30, 255]);
  const region = connectedRegion(pixels, 7, 7, 12, { x: 3, y: 3 });
  assert.equal(region.reduce((a, b) => a + b, 0), 9);
  assert.equal(region[0], 0);
  const alpha = new Uint8ClampedArray(7 * 7 * 4).fill(255);
  keepOnlyRegion(alpha, region, 7, 7);
  assert.equal(alpha[3], 0);
  assert.equal(alpha[(3 * 7 + 3) * 4 + 3], 255);
});

test("positive selection fills enclosed details but keeps outer background cut out", () => {
  const pixels = image(9, 9, [240, 240, 240, 255]);
  for (let y = 2; y <= 6; y++) for (let x = 2; x <= 6; x++) set(pixels, 9, x, y, [120, 40, 40, 255]);
  for (let y = 4; y <= 5; y++) for (let x = 4; x <= 5; x++) set(pixels, 9, x, y, [220, 180, 90, 255]);
  const selected = connectedRegion(pixels, 9, 9, 8, { x: 2, y: 2 });
  const filled = fillRegionHoles(selected, 9, 9);
  assert.equal(filled[0], 0);
  assert.equal(filled[4 * 9 + 4], 1);
  assert.equal(filled[6 * 9 + 6], 1);
  assert.equal(filled.reduce((a, b) => a + b, 0), 25);
});

test("material IDs remain unique and all new styles include their expected assets", () => {
  const all = [...MATERIALS, ...EXTRA_MATERIALS];
  assert.equal(new Set(all.map(m => m.id)).size, all.length);
  assert.equal(EXTRA_MATERIALS.length, 30);
  assert.equal(EXTRA_MATERIALS.filter(m => m.category === "bookmark").length, 8);
  assert.equal(EXTRA_MATERIALS.filter(m => m.style === "surreal").length, 8);
  assert.equal(EXTRA_MATERIALS.filter(m => m.style === "modern").length, 8);
  const svg = decodeURIComponent(EXTRA_MATERIALS[0].src.split(",")[1]);
  assert.match(svg, /width="640" height="1280" viewBox="0 0 160 320"/);
  assert.doesNotMatch(svg, /filter="url\(#(?:paper|ink)\)"/);
});

test("expanded library offers at least 30 items per type across vintage styles", () => {
  const expected = ["sticker", "bookmark", "botanical", "stamp", "medal", "ribbon", "postcard", "illustration", "tape", "decoration", "date", "diary"];
  for (const category of expected) {
    const items = GENERATED_MATERIALS.filter(m => m.category === category);
    assert.ok(items.length >= 30, `${category} only has ${items.length}`);
  }
  const styles = new Set(GENERATED_MATERIALS.map(m => m.style));
  for (const style of ["gothic", "rococo", "victorian", "nouveau", "curio", "baroque"]) assert.ok(styles.has(style), style);
  const ids = [...MATERIALS, ...EXTRA_MATERIALS, ...GENERATED_MATERIALS].map(m => m.id);
  assert.equal(new Set(ids).size, ids.length);
  const names = GENERATED_MATERIALS.filter(m => m.category !== "date" && m.category !== "diary").map(m => m.name);
  assert.equal(new Set(names).size, names.length);
  const sample = decodeURIComponent(GENERATED_MATERIALS[0].src.split(",")[1]);
  assert.match(sample, /width="1200" height="1320" viewBox="0 0 300 330"/);
});

test("decorative sticker shells provide distinct windows and valid templates", () => {
  assert.ok(STICKER_SHELLS.length >= 12);
  assert.equal(new Set(STICKER_SHELLS.map(s => s.id)).size, STICKER_SHELLS.length);
  for (const id of ["frame-gold", "calendar", "film", "medal", "watch", "gothic", "mirror", "stamp", "pressed-flowers", "art-nouveau", "pearl-lace", "film-slide"]) assert.ok(STICKER_SHELLS.some(s => s.id === id), id);
});

test("new paper textures have unique IDs and supported patterns", () => {
  assert.equal(new Set(PAPERS.map(p => p.id)).size, PAPERS.length);
  for (const pattern of ["rice", "ledger", "postcard", "dotted", "marbled", "pressed"])
    assert.ok(PAPERS.some(p => p.pattern === pattern), pattern);
});

test("British magical stationery has curated stickers and editable photo frames", () => {
  const arcana = [...MATERIALS, ...GENERATED_MATERIALS].filter(m => m.style === "arcana");
  assert.ok(arcana.filter(m => m.category === "sticker").length >= 10);
  assert.ok(arcana.filter(m => m.category === "photo").length >= 3);
  for (const id of ["arcana-indigo", "arcana-rose", "arcana-ivory"]) {
    assert.ok(PHOTO_FRAMES.some(f => f.id === id));
    const markup = decodeURIComponent(photoImage("data:image/png;base64,AA==", id).split(",")[1]);
    assert.match(markup, /clip-path="url\(#photoclip\)"/);
    assert.match(markup, /data:image\/png;base64,AA==/);
  }
});
