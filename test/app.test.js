import test from "node:test";
import assert from "node:assert/strict";
import { amuletBroadcastProject, amuletKnowledge, createScenes, markdown, sceneSafety, seedProject, videoPrompt } from "../public/js/data.js";

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

test("Video prompt เพิ่มคำสั่งเสียงชื่อเว็บไซต์และลายน้ำแบบ post-render ได้", async () => {
  const scene = createScenes("โกดังสินค้า", 1)[0];
  const prompt = videoPrompt(scene, { name: "pumlikes.com", speakName: true, watermarkEnabled: true, watermarkPosition: "bottom-right" });
  assert.match(prompt, /say the website name/);
  assert.match(prompt, /composited after generation/);
});

test("ตัวอย่างพระเครื่องมี 3 ซีนแบบ macro และไม่ให้โมเดลประดิษฐ์เลข", () => {
  const project = amuletBroadcastProject();
  assert.equal(project.category, amuletKnowledge.category);
  assert.equal(project.scenes.length, 3);
  assert.ok(project.scenes.every((scene) => scene.format === "amulet" && scene.tokens.length >= 17 && scene.tokens.length <= 20));
  assert.match(project.scenes[0].imagePrompt, /Do not invent legible serial numbers/);
  assert.match(videoPrompt(project.scenes[0], project.brand), /No faces or bodies/);
});
