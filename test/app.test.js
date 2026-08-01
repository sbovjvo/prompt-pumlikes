import test from "node:test";
import assert from "node:assert/strict";
import { createScenes, markdown, sceneSafety, seedProject } from "../public/js/data.js";

test("สร้าง storyboard ตามจำนวนซีนที่ขอ", () => {
  const scenes = createScenes("ทุเรียน", 5);
  assert.equal(scenes.length, 5);
  assert.deepEqual(scenes.map((scene) => scene.number), [1, 2, 3, 4, 5]);
});

test("แยกคำอ่านออกจากข้อความที่ผู้ชมเห็น", () => {
  const scene = createScenes("โกดังสินค้า", 2)[1];
  assert.notEqual(scene.display, scene.pronunciation);
  assert.match(scene.pronunciation, /พัม ไล้ก์ ดอท คอม/);
});

test("ซีนตั้งต้นทุกซีนมี 17–20 Canonical tokens", () => {
  const scenes = createScenes("โกดังสินค้า", 3);
  assert.ok(scenes.every((scene) => scene.tokens.length >= 17 && scene.tokens.length <= 20));
});

test("ตรวจคำกล่าวอ้างเสี่ยง", () => {
  const scene = createScenes("โกดังสินค้า", 1)[0];
  scene.display = "รับประกันยอดขายและขึ้นฟีดแน่นอน";
  assert.equal(sceneSafety(scene).length, 3);
});

test("ส่งออก Markdown มีส่วนของบทพูดและ Prompt", () => {
  const output = markdown(seedProject());
  assert.match(output, /บทพูด \(แสดงผล\)/);
  assert.match(output, /Image prompt/);
});
