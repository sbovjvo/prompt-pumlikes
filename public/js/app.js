import { createScenes, imagePrompt, markdown, sceneSafety, seedProject, videoPrompt } from "./data.js";

const STORAGE_KEY = "prompt-pumlikes-project-v2";
const categories = ["โกดังสินค้า", "ทุเรียน", "ผลไม้สด", "พระเครื่อง", "เสื้อผ้า", "รองเท้า", "เครื่องสำอาง", "สกินแคร์", "กระเป๋า", "ของใช้ในบ้าน", "อุปกรณ์ครัว", "อุปกรณ์ไลฟ์สด", "แก็ดเจ็ต", "อาหารและขนม", "เครื่องดื่ม", "สินค้าแม่และเด็ก", "สินค้า OTOP", "อื่น ๆ"];
const platforms = ["TikTok", "Facebook Reels", "Instagram Reels", "YouTube Shorts", "หลายแพลตฟอร์ม"];
const storyStyles = ["รีวิวจริงใจ", "ปัญหาและทางออก", "ก่อนและหลัง", "เบื้องหลังร้าน", "POV แม่ค้า", "เล่าแบบเพื่อนคุยกัน"];

let state = load();
let selectedId = state.scenes[0]?.id;
let selectedScenes = new Set();
let accordionOpen = { project: true, character: false, brand: true, knowledge: false, story: true, voice: false, prompts: false, safety: false };

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || localStorage.getItem("prompt-pumlikes-project-v1"));
    if (!saved) return seedProject();
    return normalize(saved);
  } catch { return seedProject(); }
}
function normalize(project) {
  const defaults = seedProject();
  return { ...defaults, ...project, brand: { ...defaults.brand, ...(project.brand || {}) }, scenes: project.scenes?.length ? project.scenes : defaults.scenes };
}
function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
function currentScene() { return state.scenes.find((scene) => scene.id === selectedId) || state.scenes[0]; }
function esc(value = "") { return String(value).replace(/[&<>'"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#039;", '"': "&quot;" })[character]); }
function icon(name) {
  const paths = { plus: "M12 5v14M5 12h14", play: "m9 5 10 7-10 7V5Z", copy: "M9 5h9v12H9zM6 8H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1", download: "M12 3v12m0 0 4-4m-4 4-4-4M5 21h14", spark: "m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z", lock: "M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z", chevron: "m7 10 5 5 5-5", wand: "m15 4 5 5m-8.5-6 1 4m-8 7 4 1m4 4 1 4m-8-9 14-14" };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.spark}"/></svg>`;
}
function details(id, title, body, open = false, note = "") {
  return `<details class="accordion" data-accordion="${id}" ${accordionOpen[id] ?? open ? "open" : ""}><summary><span>${icon("chevron")}</span><span><strong>${title}</strong>${note ? `<small>${note}</small>` : ""}</span></summary><div class="accordion-body">${body}</div></details>`;
}
function chips(values, active, attribute) {
  return `<div class="chips">${values.map((value) => `<button class="chip ${active === value ? "active" : ""}" ${attribute}="${esc(value)}">${esc(value)}</button>`).join("")}</div>`;
}
function toggle(id, label, hint, checked) {
  return `<label class="toggle-row"><span><strong>${label}</strong><small>${hint}</small></span><input type="checkbox" data-brand-toggle="${id}" ${checked ? "checked" : ""}/><span class="switch" aria-hidden="true"></span></label>`;
}
function header() {
  return `<header class="topbar"><button class="brand" data-action="reset" aria-label="เริ่มโปรเจกต์ใหม่"><span class="brand-mark">${icon("spark")}</span><span>Prompt Pumlikes</span></button><div class="topbar-status"><span class="dot"></span><span>บันทึกอัตโนมัติ</span></div><div class="top-actions"><button class="btn btn-secondary" data-action="export-json">${icon("download")} JSON</button><button class="btn btn-primary" data-action="export-md">${icon("download")} Export ชุดงาน</button></div></header>`;
}
function projectControls() {
  const project = `<label class="field"><span class="field-label">ชื่อโปรเจกต์</span><input class="input" data-project-field="title" value="${esc(state.title)}" /></label><div class="field"><span class="field-label">เลือกหมวดสินค้า</span>${chips(categories, state.category, "data-category")}</div><div class="field"><span class="field-label">ปลายทางวิดีโอ</span>${chips(platforms, state.platform, "data-platform")}</div><div class="field"><span class="field-label">รูปแบบเรื่อง</span>${chips(storyStyles, state.storyStyle || storyStyles[0], "data-story-style")}</div>`;
  const character = `<label class="field"><span class="field-label">ตัวละครหลัก</span><textarea class="textarea compact" data-project-field="character">${esc(state.character)}</textarea></label><label class="field"><span class="field-label">สถานที่</span><input class="input" data-project-field="location" value="${esc(state.location)}" /></label><label class="field"><span class="field-label">อารมณ์</span><select class="select" data-project-field="mood">${["จริงใจและมีพลัง", "สดใส", "อบอุ่น", "กระฉับกระเฉง", "สุขุมและน่าเชื่อถือ"].map((value) => `<option ${state.mood === value ? "selected" : ""}>${value}</option>`).join("")}</select></label><div class="notice">${icon("lock")} ระบบจะคงใบหน้า เสื้อผ้า ฉาก และแสงจากข้อมูลนี้ไว้ตลอดทุกซีน</div>`;
  const brand = `<label class="field"><span class="field-label">ชื่อเว็บไซต์ / แบรนด์</span><input class="input mono" data-brand-field="name" value="${esc(state.brand.name)}" /></label>${toggle("speakName", "ให้ตัวละครพูดชื่อเว็บไซต์", "ใส่คำสั่งพูดชื่อเว็บหนึ่งครั้งใน Video Prompt และบอกคำอ่านภาษาไทย", state.brand.speakName)}${toggle("watermarkEnabled", "แสดงชื่อเว็บไซต์ตลอดวิดีโอ", "วางเป็นลายน้ำด้วยระบบ render ภายหลัง ไม่ให้ AI วาดตัวหนังสือ", state.brand.watermarkEnabled)}<div class="field ${state.brand.watermarkEnabled ? "" : "is-disabled"}"><span class="field-label">ตำแหน่งลายน้ำ</span><select class="select" data-brand-field="watermarkPosition" ${state.brand.watermarkEnabled ? "" : "disabled"}><option value="bottom-right" ${state.brand.watermarkPosition === "bottom-right" ? "selected" : ""}>มุมขวาล่าง</option><option value="bottom-left" ${state.brand.watermarkPosition === "bottom-left" ? "selected" : ""}>มุมซ้ายล่าง</option><option value="top-right" ${state.brand.watermarkPosition === "top-right" ? "selected" : ""}>มุมขวาบน</option><option value="top-left" ${state.brand.watermarkPosition === "top-left" ? "selected" : ""}>มุมซ้ายบน</option></select></div><button class="btn btn-small btn-secondary" data-action="apply-brand">${icon("wand")} อัปเดต Video Prompt ทุกซีน</button>`;
  const knowledge = `<div class="knowledge-list"><article><strong>1. Hook ใน 2 วินาที</strong><p>เริ่มด้วยความรู้สึกหรือปัญหาจริง ไม่ใช่คำรับประกันผลลัพธ์</p></article><article><strong>2. 1 ซีน = 1 ความคิด</strong><p>ให้คนดูเข้าใจทัน แม้ดูแบบปิดเสียงหรือข้ามเข้ากลางคลิป</p></article><article><strong>3. Caption กับเสียงไม่ใช่สิ่งเดียวกัน</strong><p>Subtitle ใช้ข้อความสะกดถูก ส่วนคำอ่านมีไว้ให้ TTS และ Lip-sync เท่านั้น</p></article><article><strong>4. ลายน้ำต้องวางหลังสร้างวิดีโอ</strong><p>ไม่ส่งให้โมเดลวาดตัวอักษรไทย ลดปัญหาสะกดเพี้ยนและโลโก้ผิดรูป</p></article></div>`;
  return `<aside class="control-rail"><div class="rail-intro"><p class="eyebrow">ทำทุกอย่างในหน้าเดียว</p><h1>เริ่มไว แล้วค่อย<br>เปิดรายละเอียด</h1><p>เลือกสิ่งจำเป็นก่อน ระบบจะจัด Prompt ให้พร้อมใช้งานทันที</p></div>${details("project", "สินค้าและเป้าหมาย", project, true, `${state.category} · ${state.platform}`)}${details("character", "ตัวละครและฉาก", character, false, "ล็อกความต่อเนื่อง")}${details("brand", "ชื่อเว็บไซต์และลายน้ำ", brand, true, state.brand.speakName || state.brand.watermarkEnabled ? "เปิดใช้แล้ว" : "เลือกได้")}${details("knowledge", "คู่มือทำคลิปให้น่าดู", knowledge, false, "4 เคล็ดลับ")}</aside>`;
}
function sceneCard(scene) {
  const active = scene.id === selectedId;
  const valid = scene.tokens.length >= 17 && scene.tokens.length <= 20;
  return `<article class="scene-card ${active ? "active" : ""}"><button class="scene-select" data-select-scene="${scene.id}"><span class="scene-number">SCENE ${String(scene.number).padStart(2, "0")}</span><strong>${esc(scene.title)}</strong><small>${esc(scene.purpose)} · ${scene.duration} วินาที</small></button><label class="scene-check"><input type="checkbox" data-select-multi="${scene.id}" ${selectedScenes.has(scene.id) ? "checked" : ""} aria-label="เลือกซีน ${scene.number}"/><span class="status ${valid ? "status-good" : "status-warn"}">${scene.tokens.length} คำ</span></label></article>`;
}
function preview(scene) {
  const position = state.brand.watermarkPosition || "bottom-right";
  return `<section class="preview-panel"><div class="panel-head"><div><span class="eyebrow">Live preview</span><h2>ภาพตัวอย่าง 9:16</h2></div><span class="tag">Safe area</span></div><div class="preview-stage"><div class="phone"><div class="video-glow"></div><div class="person"></div><div class="safe"></div>${state.brand.watermarkEnabled ? `<span class="watermark ${position}">${esc(state.brand.name)}</span>` : ""}<div class="video-caption">${esc(scene.subtitle)}</div></div><button class="play-btn" data-action="preview" aria-label="เล่นตัวอย่าง">${icon("play")}</button></div><div class="brand-preview"><span class="status ${state.brand.speakName ? "status-good" : "status-warn"}">${state.brand.speakName ? "เสียงชื่อเว็บไซต์: เปิด" : "เสียงชื่อเว็บไซต์: ปิด"}</span><span class="status ${state.brand.watermarkEnabled ? "status-good" : "status-warn"}">${state.brand.watermarkEnabled ? "ลายน้ำ: เปิด" : "ลายน้ำ: ปิด"}</span></div></section>`;
}
function storyEditor(scene) {
  const body = `<label class="field"><span class="field-label">ชื่อซีน</span><input class="input" data-scene-field="title" value="${esc(scene.title)}" /></label><label class="field"><span class="field-label">ข้อความบนจอ (ไม่เกิน 10 คำ)</span><input class="input" data-scene-field="overlay" value="${esc(scene.overlay)}" /></label><label class="field"><span class="field-label">บทพูดที่ผู้ชมเห็น</span><textarea class="textarea" data-scene-field="display">${esc(scene.display)}</textarea></label><label class="field"><span class="field-label">Subtitle ที่สะกดถูกต้อง</span><textarea class="textarea" data-scene-field="subtitle">${esc(scene.subtitle)}</textarea></label><div class="copy-row"><button class="btn btn-small btn-secondary" data-copy="display">${icon("copy")} บทพูด</button><button class="btn btn-small btn-secondary" data-copy="subtitle">${icon("copy")} Subtitle</button></div>`;
  const voice = `<div class="notice">${scene.tokens.length >= 17 && scene.tokens.length <= 20 ? "✓ ผ่านเกณฑ์ 17–20 คำ โดยใช้ Canonical tokens" : "จำนวนคำยังไม่ผ่าน กรุณาปรับ Canonical tokens"}</div><label class="field"><span class="field-label">คำอ่านที่ AI ใช้พูด</span><textarea class="textarea" data-scene-field="pronunciation">${esc(scene.pronunciation)}</textarea></label><label class="field"><span class="field-label">Canonical word tokens (${scene.tokens.length})</span><textarea class="textarea mono" data-scene-field="tokens">${esc(scene.tokens.join(" | "))}</textarea></label>${state.brand.speakName ? `<div class="brand-instruction">คำอ่านชื่อเว็บไซต์: <strong>${esc(state.brand.name)}</strong> → พัม ไล้ก์ ดอท คอม <span>ระบบเพิ่มเป็นคำสั่งใน Video Prompt แล้ว</span></div>` : ""}<div class="copy-row"><button class="btn btn-small btn-secondary" data-copy="pronunciation">${icon("copy")} Voice script</button><button class="btn btn-small btn-ghost" data-action="voice-preview">${icon("play")} ฟังตัวอย่าง</button></div>`;
  const prompts = `<label class="field"><span class="field-label">Image Prompt</span><textarea class="textarea" data-scene-field="imagePrompt">${esc(scene.imagePrompt)}</textarea></label><label class="field"><span class="field-label">Video Prompt</span><textarea class="textarea" data-scene-field="videoPrompt">${esc(scene.videoPrompt)}</textarea></label><label class="field"><span class="field-label">Negative Prompt</span><textarea class="textarea compact" data-scene-field="negativePrompt">${esc(scene.negativePrompt)}</textarea></label><div class="copy-row"><button class="btn btn-small btn-secondary" data-copy="imagePrompt">${icon("copy")} Image Prompt</button><button class="btn btn-small btn-secondary" data-copy="videoPrompt">${icon("copy")} Video Prompt</button></div>`;
  const flags = sceneSafety(scene);
  const safety = `<div class="notice">${icon("lock")} ใช้ภาษาที่เล่าประสบการณ์ ไม่กล่าวอ้างยอดขาย การขึ้นฟีด หรือการหลบระบบ</div>${flags.length ? `<div class="status status-bad">${esc(flags.join(" "))}</div>` : `<div class="status status-good">ผ่าน — ไม่พบคำกล่าวอ้างเสี่ยงในซีนนี้</div>`}<label class="field"><span class="field-label">Disclaimer</span><textarea class="textarea compact" readonly>ผลลัพธ์ขึ้นอยู่กับเนื้อหา สินค้า ช่วงเวลา และรูปแบบการไลฟ์ของแต่ละบัญชี</textarea></label>`;
  return `<aside class="editor-rail"><div class="panel-head"><div><span class="eyebrow">Scene editor</span><h2>ซีน ${scene.number}: ${esc(scene.title)}</h2></div><button class="btn btn-small btn-ghost" data-action="regenerate">${icon("wand")} Prompt ใหม่</button></div>${details("story", "เรื่อง บทพูด และ Subtitle", body, true, "แก้จุดเดียว")}${details("voice", "เสียง AI และคำอ่าน", voice, false, `${scene.tokens.length} Canonical tokens`)}${details("prompts", "Image & Video Prompt", prompts, false, "คัดลอกแยกได้")}${details("safety", "ตรวจนโยบายและความปลอดภัย", safety, false, flags.length ? "ต้องตรวจ" : "ผ่าน")}</aside>`;
}
function workspace() {
  const scene = currentScene();
  return `<main class="one-page"><div class="intro-row"><div><p class="eyebrow">Prompt-only creative studio</p><h1>${esc(state.title)}</h1><p>เลือกหมวด ตั้งค่าความต่อเนื่อง และแก้ซีนทั้งหมดจากหน้านี้ — ไม่ต้องสลับไปมา</p></div><div class="intro-actions"><button class="btn btn-secondary" data-action="duplicate-selected">Duplicate ซีน</button><button class="btn btn-primary" data-action="add-scene">${icon("plus")} เพิ่มซีน</button></div></div><div class="single-page-grid">${projectControls()}<section class="workspace"><div class="storyboard-head"><div><h2>Storyboard</h2><p>แตะการ์ดเพื่อแก้ เลือกหลายซีนเพื่อทำสำเนาพร้อมกัน</p></div><span class="tag">${state.scenes.length} ซีน</span></div><div class="scene-strip">${state.scenes.map(sceneCard).join("")}</div>${preview(scene)}</section>${storyEditor(scene)}</div></main>`;
}
function render() { document.querySelector("#app").innerHTML = `<div class="app-shell">${header()}${workspace()}</div>`; bind(); }
function toast(message) { const element = document.querySelector("#toast"); element.textContent = message; element.classList.add("show"); clearTimeout(toast.timer); toast.timer = setTimeout(() => element.classList.remove("show"), 2800); }
function download(name, content, type) { const url = URL.createObjectURL(new Blob([content], { type })); const link = document.createElement("a"); link.href = url; link.download = name; link.click(); URL.revokeObjectURL(url); }
function copy(value) { navigator.clipboard?.writeText(value).then(() => toast("คัดลอกแล้ว"), () => toast("คัดลอกไม่สำเร็จ กรุณาเลือกข้อความเอง")); }
function applyBranding() { state.scenes.forEach((scene) => scene.videoPrompt = videoPrompt(scene, state.brand)); save(); render(); toast("อัปเดตคำสั่งชื่อเว็บไซต์และลายน้ำใน Video Prompt ทุกซีนแล้ว"); }
function bind() {
  document.querySelectorAll("[data-accordion]").forEach((item) => item.addEventListener("toggle", () => { accordionOpen[item.dataset.accordion] = item.open; }));
  document.querySelectorAll("[data-category]").forEach((button) => button.addEventListener("click", () => { state.category = button.dataset.category; save(); render(); toast(`เลือกหมวด ${state.category} แล้ว`); }));
  document.querySelectorAll("[data-platform]").forEach((button) => button.addEventListener("click", () => { state.platform = button.dataset.platform; save(); render(); }));
  document.querySelectorAll("[data-story-style]").forEach((button) => button.addEventListener("click", () => { state.storyStyle = button.dataset.storyStyle; save(); render(); }));
  document.querySelectorAll("[data-select-scene]").forEach((button) => button.addEventListener("click", () => { selectedId = button.dataset.selectScene; render(); }));
  document.querySelectorAll("[data-select-multi]").forEach((input) => input.addEventListener("change", () => { input.checked ? selectedScenes.add(input.dataset.selectMulti) : selectedScenes.delete(input.dataset.selectMulti); }));
  document.querySelectorAll("[data-project-field]").forEach((input) => input.addEventListener("change", () => { state[input.dataset.projectField] = input.value; save(); toast("บันทึกการตั้งค่าแล้ว"); }));
  document.querySelectorAll("[data-brand-field]").forEach((input) => input.addEventListener("change", () => { state.brand[input.dataset.brandField] = input.value; save(); toast("บันทึกชื่อเว็บไซต์แล้ว"); }));
  document.querySelectorAll("[data-brand-toggle]").forEach((input) => input.addEventListener("change", () => { state.brand[input.dataset.brandToggle] = input.checked; applyBranding(); }));
  document.querySelectorAll("[data-scene-field]").forEach((input) => input.addEventListener("change", () => { const scene = currentScene(); const field = input.dataset.sceneField; scene[field] = field === "tokens" ? input.value.split("|").map((token) => token.trim()).filter(Boolean) : input.value; save(); render(); toast("บันทึกซีนแล้ว"); }));
  document.querySelectorAll("[data-copy]").forEach((button) => button.addEventListener("click", () => copy(currentScene()[button.dataset.copy])));
  document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => action(button.dataset.action)));
}
function action(name) {
  const scene = currentScene();
  if (name === "reset") { state = seedProject(); selectedId = state.scenes[0].id; selectedScenes.clear(); save(); render(); toast("เริ่มโปรเจกต์ใหม่แล้ว"); }
  if (name === "apply-brand") applyBranding();
  if (name === "add-scene") { const last = state.scenes.at(-1) || createScenes(state.category, 1)[0]; const added = { ...structuredClone(last), id: crypto.randomUUID(), number: state.scenes.length + 1, title: `ซีนต่อเนื่อง ${state.scenes.length + 1}` }; added.imagePrompt = imagePrompt(state.category, added.title, state.scenes.length); added.videoPrompt = videoPrompt(added, state.brand); state.scenes.push(added); selectedId = added.id; save(); render(); toast("เพิ่มซีนแล้ว"); }
  if (name === "duplicate-selected") { const targets = selectedScenes.size ? state.scenes.filter((item) => selectedScenes.has(item.id)) : [scene]; const duplicates = targets.map((item) => ({ ...structuredClone(item), id: crypto.randomUUID(), title: `${item.title} (สำเนา)` })); state.scenes.push(...duplicates); state.scenes.forEach((item, index) => item.number = index + 1); selectedId = duplicates[0].id; selectedScenes.clear(); save(); render(); toast(`สร้างสำเนา ${duplicates.length} ซีนแล้ว`); }
  if (name === "regenerate") { scene.imagePrompt = imagePrompt(state.category, scene.title, scene.number - 1); scene.videoPrompt = videoPrompt(scene, state.brand); save(); render(); toast("สร้าง Prompt ใหม่แล้ว"); }
  if (name === "export-md") { download("prompt-pumlikes-storyboard.md", markdown(state), "text/markdown;charset=utf-8"); toast("กำลังดาวน์โหลดชุดงาน Markdown"); }
  if (name === "export-json") { download("prompt-pumlikes-project.json", JSON.stringify(state, null, 2), "application/json"); toast("กำลังดาวน์โหลด JSON"); }
  if (name === "preview" || name === "voice-preview") toast("Prompt Only Mode: เชื่อม TTS Provider ในอนาคตเพื่อฟังเสียงจริง");
}
render();
