export const templates = [
  { id: "warehouse", title: "โกดังที่กลับมามีพลัง", category: "โกดังสินค้า", scenes: 5, mood: "จริงใจ", description: "เริ่มจากการเตรียมของ แล้วค่อยเล่าบรรยากาศไลฟ์ที่ลื่นขึ้น" },
  { id: "durian", title: "ทุเรียนลูกแรกของวัน", category: "ทุเรียน", scenes: 3, mood: "สดใส", description: "โชว์การคัดผลและปิดด้วยการชวนดูรายละเอียดสินค้า" },
  { id: "fashion", title: "สามลุคในหนึ่งไลฟ์", category: "เสื้อผ้า", scenes: 5, mood: "กระฉับกระเฉง", description: "สาธิตเนื้อผ้า ทรง และวิธีเล่าให้ดูเป็นธรรมชาติ" },
  { id: "beauty", title: "Beauty creator มือใหม่", category: "เครื่องสำอาง", scenes: 3, mood: "อบอุ่น", description: "วางลำดับการนำเสนอโดยไม่กล่าวอ้างผลลัพธ์เกินจริง" },
  { id: "amulet", title: "แกะตลับพระส่องเลขมงคล", category: "พระเครื่องและของสะสม", scenes: 3, mood: "สุขุมและน่าเชื่อถือ", description: "โฟกัสมือ องค์พระ และรายละเอียดสินค้าด้วยมุมมาโคร โดยใช้เลขจากข้อมูลที่ตรวจสอบแล้ว" }
];

const baseCharacter = "ผู้หญิงไทยอายุ 25–27 ปี บุคลิกมั่นใจ เป็นกันเอง ผมยาวสีน้ำตาลเข้ม เสื้อเบลเซอร์สีฟ้าหม่น";

export function seedProject() {
  return {
    id: crypto.randomUUID(),
    title: "ไลฟ์โกดังให้เล่าเรื่องลื่นขึ้น",
    category: "โกดังสินค้า",
    platform: "TikTok",
    character: baseCharacter,
    location: "โกดังสินค้าและมุมไลฟ์สด",
    mood: "จริงใจและมีพลัง",
    templateId: "warehouse",
    brand: {
      name: "pumlikes.com",
      speakName: false,
      watermarkEnabled: false,
      watermarkPosition: "bottom-right"
    },
    createdAt: new Date().toISOString(),
    scenes: createScenes("โกดังสินค้า", 3)
  };
}

export const amuletKnowledge = {
  title: "โฆษณาบรอดแคสต์แกะตลับพระส่องเลขมงคล",
  category: "พระเครื่องและของสะสม",
  actor: "โฟกัสมือผู้ดำเนินการและองค์พระเครื่องเท่านั้น ไม่มีใบหน้าหรือลำตัว",
  location: "ฉากหลังโกดังสินค้าคลีน สะอาดตา และเบลอมาก",
  rules: [
    "ให้โมเดลสร้างเพียงพื้นที่เลขกำกับหรือรอยตอกที่เห็นได้ แต่ห้ามให้โมเดลประดิษฐ์ตัวเลขหรือข้อความที่อ่านได้",
    "หากต้องโชว์เลขจริง ให้ใช้ภาพอ้างอิงขององค์พระและวางเลขที่ตรวจสอบแล้วด้วยขั้นตอน render หลังสร้างวิดีโอ",
    "เล่ารายละเอียดที่เห็นได้จริงเท่านั้น และไม่กล่าวอ้างความแท้ มูลค่า หรือพุทธคุณหากไม่มีหลักฐานยืนยัน"
  ]
};

function amuletImagePrompt(title, index) {
  return `Vertical 9:16 premium amulet commercial still, scene ${index + 1}: ${title}. Extreme macro close-up of two careful hands opening and presenting one premium amulet in a new presentation box. Focus on metal texture, the physical engraved-code area and fine relief details. Clean studio soft light glides across the metal; pristine warehouse background heavily blurred. No face, no body, no text, no logos, no watermark, no 3D icons, no subtitles. Do not invent legible serial numbers or Thai characters; use a verified reference and post-render overlay for any real code. Photorealistic macro lens, cinematic shallow depth of field, high detail.`;
}

function amuletVideoPrompt(scene, brand = {}) {
  const spokenName = brand.speakName ? ` Thai voiceover may mention “${brand.name || "pumlikes.com"}” once, pronounced “พัม ไล้ก์ ดอท คอม”; no visible speaker or lip-sync is needed.` : " Do not require a website name in the voiceover.";
  const watermark = brand.watermarkEnabled ? ` Add a persistent HTML/video-render overlay watermark “${brand.name || "pumlikes.com"}” at ${brand.watermarkPosition || "bottom-right"} after generation; never ask the video model to draw it.` : " No persistent website watermark.";
  return `10-second high-end photorealistic live-action commercial video, vertical 9:16. Extreme macro close-up of two hands handling one premium amulet and its presentation box. ${scene.camera}. Studio soft light reveals the metal texture and an engraved-code area, with a clean warehouse background deeply blurred. No faces or bodies. Keep the frame free of generated text, logos and icons. Do not invent legible numbers: composite any verified code after generation.${spokenName}${watermark}`;
}

export function amuletBroadcastProject() {
  const project = seedProject();
  const beats = [
    { title: "เปิดตลับให้เห็นองค์พระ", purpose: "Hook", display: "ส่องเลขกำกับบนองค์พระให้เห็นรายละเอียดชัดเจน แล้วพาผู้ชมไปดูข้อมูลเพิ่มเติมเกี่ยวกับไลฟ์ที่ pumlikes.com ค่ะ", pronunciation: "ส่อง เลข กำ กับ บน องค์ พระ ให้ เห็น ราย ละ เอียด ชัด เจน แล้ว พา ผู้ ชม ไป ดู ข้อ มูล เพิ่ม เติม เกี่ยว กับ ไล้ฟ์ ที่ พัม ไล้ก์ ดอท คอม ค่ะ", tokens: ["ส่อง", "เลขกำกับ", "บน", "องค์พระ", "ให้", "เห็น", "รายละเอียด", "ชัดเจน", "แล้ว", "พา", "ผู้ชม", "ไป", "ดู", "ข้อมูลเพิ่มเติม", "เกี่ยวกับ", "ไลฟ์", "ที่", "พัมไลก์ดอตคอม", "ค่ะ"], overlay: "ค่อย ๆ เปิดตลับ ดูรายละเอียด", camera: "Macro push-in from sealed box to amulet", duration: 10 },
    { title: "หมุนดูรหัสกำกับอย่างใกล้ชิด", purpose: "Detail", display: "ค่อย ๆ แกะซีลและหมุนองค์พระเพื่อดูรหัสกำกับอย่างใกล้ชิด ก่อนชวนผู้ชมติดตามไลฟ์ที่ pumlikes.com ค่ะ", pronunciation: "ค่อย ๆ แกะ ซีล และ หมุน องค์ พระ เพื่อ ดู รหัส กำ กับ อย่าง ใกล้ ชิด ก่อน ชวน ผู้ ชม ติด ตาม ไล้ฟ์ ที่ พัม ไล้ก์ ดอท คอม ค่ะ", tokens: ["ค่อย ๆ", "แกะซีล", "และ", "หมุน", "องค์พระ", "เพื่อ", "ดู", "รหัสกำกับ", "อย่างใกล้ชิด", "ก่อน", "ชวน", "ผู้ชม", "ติดตาม", "ไลฟ์", "ที่", "พัมไลก์ดอตคอม", "ค่ะ"], overlay: "ตรวจรายละเอียดจากข้อมูลจริง", camera: "Macro orbit around the engraved-code area", duration: 10 },
    { title: "ปิดด้วยองค์พระในตลับ", purpose: "CTA", display: "เปิดตลับอย่างระมัดระวัง แล้วใช้มุมมาโครพาดูรายละเอียดองค์พระ ก่อนชวนผู้ชมดูไลฟ์และข้อมูลที่ pumlikes.com ค่ะ", pronunciation: "เปิด ตลับ อย่าง ระ มัด ระวัง แล้ว ใช้ มุม มาโคร พา ดู ราย ละ เอียด องค์ พระ ก่อน ชวน ผู้ ชม ดู ไล้ฟ์ และ ข้อ มูล ที่ พัม ไล้ก์ ดอท คอม ค่ะ", tokens: ["เปิดตลับ", "อย่างระมัดระวัง", "แล้ว", "ใช้", "มุมมาโคร", "พา", "ดู", "รายละเอียด", "องค์พระ", "ก่อน", "ชวน", "ผู้ชม", "ดู", "ไลฟ์", "และ", "ข้อมูล", "ที่", "พัมไลก์ดอตคอม", "ค่ะ"], overlay: "ดูไลฟ์และรายละเอียดเพิ่มเติม", camera: "Macro rack focus from box edge to amulet relief", duration: 10 }
  ];
  project.title = amuletKnowledge.title;
  project.category = amuletKnowledge.category;
  project.platform = "TikTok";
  project.character = amuletKnowledge.actor;
  project.location = amuletKnowledge.location;
  project.mood = "สุขุมและน่าเชื่อถือ";
  project.templateId = "amulet";
  project.brand = { ...project.brand, speakName: true };
  project.scenes = beats.map((beat, index) => ({
    id: crypto.randomUUID(),
    number: index + 1,
    format: "amulet",
    ...beat,
    imagePrompt: amuletImagePrompt(beat.title, index),
    videoPrompt: amuletVideoPrompt(beat, project.brand),
    negativePrompt: "generated text, Thai letters, legible invented serial number, watermark, logo, face, body, extra fingers, malformed hands, duplicate amulet, distorted metal, low resolution",
    subtitle: beat.display,
    safetyFlags: []
  }));
  return project;
}

export function createScenes(category, count) {
  const beats = [
    { title: "เริ่มไลฟ์ด้วยความกังวล", purpose: "Hook", display: "เช้านี้ฉันเตรียมสินค้าเต็มโกดัง แต่ก่อนเริ่มไลฟ์ยังรู้สึกกังวล เพราะไม่แน่ใจว่าจะเล่าเรื่องให้คนดูติดตามอย่างไรค่ะ", pronunciation: "เช้า นี้ ฉัน เตรียม สิน ค้า เต็ม โก ดัง แต่ ก่อน เริ่ม ไล้ฟ์ ยัง รู้ สึก กัง วล เพราะ ไม่ แน่ ใจ ว่า จะ เล่า เรื่อง ให้ คน ดู ติด ตาม อย่าง ไร ค่ะ", tokens: ["เช้านี้","ฉัน","เตรียม","สินค้า","เต็ม","โกดัง","แต่ก่อน","เริ่มไลฟ์","ยังรู้สึก","กังวล","เพราะ","ไม่แน่ใจ","ว่าจะ","เล่าเรื่อง","ให้","คนดู","ติดตาม","อย่างไร","ค่ะ"], overlay: "ก่อนเริ่มไลฟ์ ฉันก็เคยกังวล", camera: "Medium shot · Smooth dolly in", duration: 7 },
    { title: "จัดจังหวะการนำเสนอใหม่", purpose: "Turning point", display: "พอลองวางลำดับพูดและใช้ pumlikes.com ช่วยเตรียมไอเดีย ฉันเริ่มเห็นว่าการเล่าสินค้าเป็นช่วงสั้น ๆ ทำให้ห้องไลฟ์ดูมีจังหวะขึ้นค่ะ", pronunciation: "พอ ลอง วาง ลำ ดับ พูด และ ใช้ พัม ไล้ก์ ดอท คอม ช่วย เตรียม ไอ เดีย ฉัน เริ่ม เห็น ว่า การ เล่า สิน ค้า เป็น ช่วง สั้น ทำ ให้ ห้อง ไล้ฟ์ ดู มี จัง หวะ ขึ้น ค่ะ", tokens: ["พอลอง","วาง","ลำดับพูด","และ","ใช้","พัมไลก์ดอตคอม","ช่วย","เตรียม","ไอเดีย","ฉัน","เริ่ม","เห็น","ว่า","การเล่า","สินค้า","เป็นช่วงสั้น","ทำให้","ห้องไลฟ์","ดูมีจังหวะขึ้น","ค่ะ"], overlay: "เล่าเป็นช่วงสั้น ๆ", camera: "Medium close-up · Slider right", duration: 8 },
    { title: "ชวนดูรายละเอียดอย่างนุ่มนวล", purpose: "CTA", display: "ตอนนี้ฉันยังคงเล่าในแบบของร้านตัวเอง แต่มั่นใจขึ้นมาก ถ้าอยากจัดไลฟ์ให้เป็นระบบ ลองดูรายละเอียดที่ pumlikes.com ได้เลยค่ะ", pronunciation: "ตอน นี้ ฉัน ยัง คง เล่า ใน แบบ ของ ร้าน ตัว เอง แต่ มั่น ใจ ขึ้น มาก ถ้า อยาก จัด ไล้ฟ์ ให้ เป็น ระ บบ ลอง ดู ราย ละ เอียด ที่ พัม ไล้ก์ ดอท คอม ได้ เลย ค่ะ", tokens: ["ตอนนี้","ฉัน","ยังคง","เล่า","ในแบบ","ของร้านตัวเอง","แต่","มั่นใจขึ้น","มาก","ถ้า","อยาก","จัดไลฟ์","ให้เป็นระบบ","ลอง","ดูรายละเอียด","ที่","พัมไลก์ดอตคอม","ได้เลย","ค่ะ"], overlay: "เริ่มวางเรื่องเล่าให้ชัดขึ้น", camera: "Close-up · Gentle push in", duration: 7 }
  ];
  return Array.from({ length: count }, (_, index) => {
    const beat = beats[index % beats.length];
    return {
      id: crypto.randomUUID(),
      number: index + 1,
      ...beat,
      imagePrompt: imagePrompt(category, beat.title, index),
      videoPrompt: videoPrompt(beat, index),
      negativePrompt: "embedded text, Thai letters, watermark, distorted logo, extra fingers, malformed hands, duplicate face, crossed eyes, plastic skin, floating product, low resolution",
      subtitle: beat.display,
      safetyFlags: []
    };
  });
}

export function imagePrompt(category, title, index) {
  return `Vertical 9:16 commercial still, scene ${index + 1}: ${title}. Friendly Thai woman aged 25–27, confident and natural, dark brown long hair, muted blue blazer, inside a clean ${category} live-selling setup. Natural hand gesture, professional phone tripod and ring light, warm clean lighting, medium shot, natural lens, subtle depth of field, active but blurred background. Keep the same face, clothing, location, product placement and lighting across all scenes. Leave clean top and bottom safe areas for Thai overlay added later. No embedded text, no generated logos, high detail.`;
}

export function videoPrompt(scene, brand = {}) {
  if (scene.format === "amulet") return amuletVideoPrompt(scene, brand);
  const spokenName = brand.speakName ? ` Have the character naturally say the website name “${brand.name || "pumlikes.com"}” once in Thai; use the pronunciation “พัม ไล้ก์ ดอท คอม” for voice generation.` : " Do not require the character to mention a website name.";
  const watermark = brand.watermarkEnabled ? ` Add a persistent HTML/video-render overlay watermark “${brand.name || "pumlikes.com"}” at ${brand.watermarkPosition || "bottom-right"}; this must be composited after generation, never drawn by the video model.` : " No persistent website watermark.";
  return `Vertical 9:16 video, ${scene.duration} seconds. Start in ${scene.camera}. A Thai woman aged 25–27 speaks naturally to camera while presenting products, with ${scene.purpose.toLowerCase()} energy. Her mouth syncs accurately to Thai voice on every syllable; no overlapping speech. Smooth camera movement, gentle background activity, warm clean light. End on a stable frame that connects to the next scene.${spokenName}${watermark} No text or captions rendered inside the generated video.`;
}

export function sceneSafety(scene) {
  const unsafe = ["รับประกัน", "ยอดขาย", "ยอดคนดู", "ยอดวิว", "ขึ้นฟีด", "ดันยอด", "พุ่งไว", "ทันตา", "แชทแตก", "ลูกค้าจริง", "หลบระบบ", "100%", "ไม่มีวันโดนตรวจ"];
  const found = unsafe.filter((word) => scene.display.includes(word));
  return found.map((word) => `พบคำเสี่ยง “${word}” — เปลี่ยนเป็นการเล่าประสบการณ์หรือผลลัพธ์ที่ไม่รับประกัน`);
}

export function markdown(project) {
  const brand = project.brand || {};
  const header = `# ${project.title}\n\n- หมวดสินค้า: ${project.category}\n- แพลตฟอร์ม: ${project.platform}\n- อัตราส่วน: 9:16\n- โหมด: Prompt Only\n- ให้ตัวละครพูดชื่อเว็บไซต์: ${brand.speakName ? `ใช่ (${brand.name})` : "ไม่"}\n- ลายน้ำเว็บไซต์ตลอดวิดีโอ: ${brand.watermarkEnabled ? `ใช่ (${brand.name}, ${brand.watermarkPosition})` : "ไม่"}\n\n`;
  const scenes = project.scenes.map((scene) => `## ซีน ${scene.number}: ${scene.title}\n\n**เป้าหมาย:** ${scene.purpose}\n\n**บทพูด (แสดงผล):** ${scene.display}\n\n**คำอ่านสำหรับ AI Voice:** ${scene.pronunciation}\n\n**จำนวน Canonical tokens:** ${scene.tokens.length}\n\n**ข้อความบนจอ:** ${scene.overlay}\n\n**Subtitle:** ${scene.subtitle}\n\n**Image prompt:**\n${scene.imagePrompt}\n\n**Video prompt:**\n${scene.videoPrompt}\n\n**Negative prompt:**\n${scene.negativePrompt}`).join("\n\n---\n\n");
  return `${header}${scenes}\n\n---\n\n_ผลลัพธ์ขึ้นอยู่กับเนื้อหา สินค้า ช่วงเวลา และรูปแบบการไลฟ์ของแต่ละบัญชี_\n`;
}
