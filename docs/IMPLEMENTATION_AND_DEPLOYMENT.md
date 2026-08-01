# IMPLEMENTATION & DEPLOYMENT SPEC

## 1. หลักการพัฒนา

เอกสารนี้เป็นแผนงาน ไม่บังคับ Framework ตายตัว AI ผู้พัฒนาต้องตรวจ Repository และเลือกเทคโนโลยีที่เหมาะสม แต่ระบบสุดท้ายต้อง

- Deploy บน Railway ได้
- ใช้งานผ่าน `https://prompt-pumlikes-production.up.railway.app/`
- รองรับภาษาไทยเต็มรูปแบบ
- รองรับ Mobile-first
- มี Prompt Only Mode
- แยก Provider ภาพ วิดีโอ เสียง และโมเดลภาษาออกจาก Core System
- ไม่ผูกกับผู้ให้บริการรายเดียว
- ไม่ Commit Secret ลง GitHub

---

## 2. Architecture ที่แนะนำ

### 2.1 Frontend

ความรับผิดชอบ

- Dashboard
- Project Wizard
- Prompt Studio
- Scene Timeline
- Character Editor
- Voice Pronunciation Editor
- Preview 9:16
- Template Library
- Project History
- Settings

ควรใช้ Component-based Architecture และแยก Feature ชัดเจน

### 2.2 Backend/API

ความรับผิดชอบ

- Authentication
- Projects
- Scenes
- Templates
- Prompt Generation
- Word Counting
- Pronunciation Dictionary
- Provider Connections
- Generation Jobs
- Asset Metadata
- Export
- Moderation
- Admin Settings

### 2.3 Database

ระบบควรใช้ฐานข้อมูลถาวรบน Railway หรือฐานข้อมูลภายนอกที่เชื่อถือได้ ไม่เก็บข้อมูลสำคัญไว้ใน Local Filesystem ของ Container

### 2.4 Object Storage

ภาพ วิดีโอ เสียง และ ZIP ควรเก็บใน Object Storage ไม่เก็บถาวรใน Railway Container

### 2.5 Background Jobs

งานสร้างภาพ วิดีโอ เสียง และ Render อาจใช้เวลานาน จึงต้องมี Job Queue หรือระบบสถานะงาน

สถานะมาตรฐาน

- queued
- processing
- completed
- failed
- cancelled
- needs_review

Frontend ต้อง Poll หรือรับ Event เพื่ออัปเดตสถานะโดยไม่ทำให้หน้าเว็บค้าง

---

## 3. โครงสร้างโมดูล

### 3.1 Auth Module

- สมัครสมาชิก
- เข้าสู่ระบบ
- ออกจากระบบ
- ลืมรหัสผ่าน
- Session Management
- Role: user/admin

### 3.2 Project Module

- Create
- Read
- Update
- Duplicate
- Archive
- Delete
- Search
- Export

### 3.3 Scene Module

- Add Scene
- Delete Scene
- Duplicate Scene
- Reorder Scene
- Multi-select Scene
- Regenerate Selected Fields
- Continuity Lock
- Version History

### 3.4 Character Module

- Character Presets
- Custom Character
- Reference Images
- Character Lock
- Default Character
- Character Version

### 3.5 Prompt Engine

รับข้อมูล

- Project Brief
- Product Category
- Platform
- Character
- Scene Template
- Brand Rules
- Safety Rules
- Continuity Memory

คืนข้อมูลแบบ Structured Output

- Story
- Image Prompt
- Video Prompt
- Display Dialogue
- Speech Pronunciation
- Canonical Tokens
- On-screen Text
- Subtitle
- Camera
- Animation
- Audio
- Negative Prompt
- Safety Notes

ต้อง Validate Schema ก่อนบันทึก

### 3.6 Thai Language Module

- Word Segmentation
- Phrase Dictionary
- Pronunciation Dictionary
- Spell Check
- Word Count Validation
- Subtitle Line Breaking
- Brand Name Normalization

### 3.7 Provider Module

แยก Interface ตามประเภท

- LLM Provider
- Image Provider
- Video Provider
- TTS Provider
- Lip-sync Provider
- Render Provider
- Storage Provider

ทุก Provider ต้องมี

- Provider Name
- Model
- API Endpoint
- Credential Reference
- Timeout
- Retry Policy
- Rate Limit
- Cost Metadata
- Enabled/Disabled

### 3.8 Moderation Module

ตรวจทั้ง Input และ Output

- คำกล่าวอ้างเกินจริง
- คำเกี่ยวกับการหลบระบบ
- การรับประกันยอดขาย
- ตัวเลขที่ไม่มีแหล่งข้อมูล
- รีวิวปลอม
- ข้อมูลส่วนบุคคล
- เนื้อหาสุขภาพที่เสี่ยง
- การกล่าวอ้างเหนือธรรมชาติ

ระบบไม่ควรลบข้อความเงียบ ๆ ต้องบอกผู้ใช้ว่าประโยคใดเสี่ยงและเสนอเวอร์ชันที่ปลอดภัยกว่า

### 3.9 Export Module

- Markdown
- JSON
- CSV
- SRT
- VTT
- ZIP
- Media Files

---

## 4. Data Model ระดับแนวคิด

### User

- id
- name
- email
- role
- settings
- created_at
- updated_at

### Project

- id
- user_id
- title
- description
- product_category
- target_platform
- aspect_ratio
- status
- brand_settings
- default_character_id
- created_at
- updated_at

### Scene

- id
- project_id
- sequence
- title
- duration
- story
- action
- emotion
- camera
- lighting
- image_prompt
- video_prompt
- negative_prompt
- display_dialogue
- speech_pronunciation
- canonical_tokens
- word_count
- subtitle
- on_screen_text
- animation
- audio
- continuity_memory
- safety_flags
- selected_version_id

### Character

- id
- owner_id
- name
- gender
- age_range
- appearance
- hair
- clothing
- accessories
- personality
- voice_settings
- reference_assets

### PronunciationEntry

- id
- scope
- written_form
- spoken_form
- priority
- notes
- active

### Template

- id
- title
- category
- scene_count
- platform
- structure
- default_prompts
- active

### GenerationJob

- id
- user_id
- project_id
- scene_id
- provider_type
- provider_name
- model
- status
- input_snapshot
- output_metadata
- error_message
- started_at
- completed_at

### Asset

- id
- project_id
- scene_id
- asset_type
- storage_url
- mime_type
- duration
- width
- height
- provider
- metadata

### Version

- id
- entity_type
- entity_id
- version_number
- content_snapshot
- created_by
- created_at

---

## 5. API ระดับแนวคิด

### Projects

- Create Project
- List Projects
- Get Project
- Update Project
- Duplicate Project
- Archive Project
- Delete Project
- Export Project

### Scenes

- Create Scene
- Update Scene
- Delete Scene
- Reorder Scenes
- Duplicate Scene
- Bulk Update Selected Scenes
- Generate Scene
- Regenerate Field
- Validate Scene

### Voice

- Count Words
- Generate Pronunciation
- Preview Voice
- Save Pronunciation Entry
- List Dictionary
- Update Dictionary
- Validate Lip-sync Input

### Assets

- Create Generation Job
- Get Job Status
- Cancel Job
- List Assets
- Delete Asset
- Select Asset Version

### Templates

- List Templates
- Get Template
- Create Personal Template
- Duplicate Template

### Admin

- Provider Settings
- Global Dictionary
- Content Rules
- Templates
- User Management
- Job Logs

ทุก Endpoint ต้องตรวจสิทธิ์เจ้าของข้อมูล

---

## 6. Prompt Pipeline

### ขั้นที่ 1: Normalize Input

- ทำความสะอาดข้อความ
- ตรวจชื่อแบรนด์
- ตรวจหมวดสินค้า
- ตรวจ Platform
- ตรวจจำนวนซีน

### ขั้นที่ 2: Generate Story Outline

สร้าง

- Hook
- Conflict
- Turning Point
- Resolution
- CTA

### ขั้นที่ 3: Generate Scene Data

สร้างข้อมูลซีนแบบ Structured Output

### ขั้นที่ 4: Thai Dialogue Validation

- ตัดคำ
- ตรวจ 17–20 คำ
- ปรับประโยค
- ตรวจสะกด

### ขั้นที่ 5: Generate Pronunciation

ใช้ Dictionary และสร้างคำอ่านแยก

### ขั้นที่ 6: Safety Rewrite

ตรวจและเขียนใหม่เฉพาะส่วนที่เสี่ยง

### ขั้นที่ 7: Continuity Pass

ตรวจตัวละคร เสื้อผ้า สินค้า ฉาก แสง และอารมณ์

### ขั้นที่ 8: Final Schema Validation

หากข้อมูลไม่ครบ ให้ Retry เฉพาะส่วน ไม่ต้องสร้างใหม่ทั้งโปรเจกต์

---

## 7. ระบบสร้างภาพและวิดีโอ

### ภาพ

1. สร้าง Prompt
2. ตรวจ No Embedded Text
3. ส่ง Provider
4. เก็บ Job ID
5. บันทึก Asset
6. ให้ผู้ใช้เลือกเวอร์ชัน
7. Overlay ข้อความไทยภายหลัง

### วิดีโอ

1. ใช้ภาพ Reference หรือ Keyframe
2. ส่ง Motion Prompt
3. สร้างเสียงแยก
4. ทำ Lip-sync หากรองรับ
5. Overlay Subtitle และ Text
6. Mix Audio
7. Render Final

ต้องให้ผู้ใช้สร้างทีละขั้น ไม่บังคับ Full Pipeline เสมอไป

---

## 8. ระบบข้อความไทยบนวิดีโอ

ต้องมี Template Engine สำหรับ

- Hook
- Subtitle
- CTA
- Disclaimer
- Brand Name

ความสามารถ

- Position
- Font
- Size
- Weight
- Line Height
- Background Box
- Shadow
- Stroke
- Animation In/Out
- Safe Area

ต้องวัด Bounding Box ภาษาไทยจริงก่อน Render เพื่อป้องกันสระและวรรณยุกต์ถูกตัด

---

## 9. Error Handling

ข้อผิดพลาดต้องเป็นภาษาไทยและบอกวิธีแก้

ตัวอย่าง

- `บทพูดมี 15 คำ ต้องเพิ่มอีก 2–5 คำ`
- `ยังไม่ได้กำหนดคำอ่านของ pumlikes.com`
- `ระบบสร้างวิดีโอไม่สำเร็จ กรุณาลองใหม่หรือเลือก Provider อื่น`
- `ภาพนี้มีตัวอักษรติดมา ระบบแนะนำให้สร้างใหม่โดยเปิด No Embedded Text`
- `ซับไตเติลอยู่นอก Safe Area`

ห้ามแสดง Stack Trace หรือ Secret ต่อผู้ใช้

---

## 10. Security

- เก็บ Secret ใน Railway Variables
- ไม่ส่ง Secret ไป Frontend
- Validate Input ทุกจุด
- Rate Limit งาน Generate
- จำกัดขนาด Upload
- ตรวจ MIME Type
- ใช้ Signed URL สำหรับ Asset ส่วนตัว
- ป้องกัน CSRF ตาม Architecture
- ป้องกัน XSS ใน Prompt และข้อความ Overlay
- ใช้ Parameterized Query/ORM
- เก็บ Audit Log สำหรับ Admin Action
- ลบ Metadata ที่ไม่จำเป็นจากไฟล์ Upload
- มีระบบลบข้อมูลผู้ใช้

---

## 11. Privacy

หากผู้ใช้อัปโหลดใบหน้าบุคคล ต้องมีข้อความยืนยันว่าผู้ใช้มีสิทธิ์ใช้ภาพนั้น

ระบบต้อง

- ไม่เปิด Asset เป็น Public โดยค่าเริ่มต้น
- ให้ผู้ใช้ลบภาพอ้างอิงได้
- ไม่ใช้ภาพผู้ใช้ฝึกโมเดลโดยไม่ได้รับอนุญาต
- ระบุระยะเวลาเก็บไฟล์ชั่วคราว

---

## 12. Railway Deployment

### 12.1 Production Requirements

- Service ต้อง Listen ตามค่า `PORT` ที่ Railway กำหนด
- มี Health Check Endpoint
- มี Production Start Command
- Build ต้องทำซ้ำได้
- Database Migration ต้องชัดเจน
- Static Assets ต้อง Build สำเร็จ
- URL หลักต้องเปิดผ่าน HTTPS

### 12.2 Environment Variables

จัดกลุ่มอย่างน้อย

- Application
- Database
- Authentication
- Storage
- LLM Provider
- Image Provider
- Video Provider
- TTS Provider
- Lip-sync Provider
- Monitoring

ต้องมีไฟล์ตัวอย่าง Environment ที่ไม่มีค่าจริง และอธิบายทุกตัวแปรในเอกสาร

### 12.3 Health Check

Health Check ควรตรวจ

- App Process
- Database Connection
- Storage Configuration

ไม่ควรเรียก Provider ราคาแพงทุกครั้งที่ Health Check

### 12.4 Logging

- Structured Logs
- Request ID
- Job ID
- Error Category
- Provider Response Code
- ห้าม Log API Key หรือข้อความอ่อนไหวเต็มรูปแบบ

---

## 13. Development Phases

### Phase 1 — Foundation

- ตั้งค่าโปรเจกต์
- Design System
- Layout
- Database
- Auth
- Project CRUD
- Railway Deploy

ผลลัพธ์: ผู้ใช้สมัคร เข้าระบบ และสร้างโปรเจกต์เปล่าได้

### Phase 2 — Prompt Studio

- Project Wizard
- Scene Timeline
- Scene CRUD
- Character Presets
- Scene Templates
- Prompt Output Cards

ผลลัพธ์: สร้าง Storyboard และ Prompt ได้โดยยังไม่เรียก Media API

### Phase 3 — Thai Voice Engine

- Display/Speech Separation
- Word Segmentation
- 17–20 Word Validation
- Pronunciation Dictionary
- Voice Preview Interface

ผลลัพธ์: บทพูดและคำอ่านแยกกันอย่างสมบูรณ์

### Phase 4 — AI Generation

- LLM Provider Adapter
- Structured Output Validation
- Regenerate Field
- Version History
- Safety Rewrite

ผลลัพธ์: สร้างหลายซีนด้วย AI ได้

### Phase 5 — Image & Video

- Image Provider
- Video Provider
- Job Queue
- Asset Library
- Generation Status

ผลลัพธ์: สร้างและเลือกภาพ/วิดีโอได้

### Phase 6 — Voice & Lip-sync

- TTS Provider
- Word Preview
- Lip-sync
- Audio Mix

ผลลัพธ์: สร้างเสียงไทยและประกอบวิดีโอได้

### Phase 7 — Render & Export

- Thai Text Overlay
- Subtitle Render
- SRT/VTT
- MP4 Render
- ZIP Export

ผลลัพธ์: ดาวน์โหลดชุดงานสำเร็จได้

### Phase 8 — Admin & Quality

- Provider Settings
- Global Dictionary
- Template Manager
- Moderation Rules
- Audit Logs
- Analytics

---

## 14. Testing Plan

### Unit Test

- Word Counting
- Phrase Merge
- Pronunciation Replacement
- Schema Validation
- Safety Rules
- Export Formatting

### Integration Test

- Project + Scenes
- Generate + Version
- Provider Job + Asset
- TTS + Lip-sync
- Render + Export

### UI Test

- Desktop
- Mobile
- Scene Drag and Drop
- Multi-select
- Real-time Word Count
- Dictionary Editing
- Error Display

### Thai Language Test

ต้องมี Test Cases สำหรับ

- สระบน/ล่าง
- วรรณยุกต์
- คำทับศัพท์
- ชื่อแบรนด์
- ตัวเลข
- ภาษาไทยปนอังกฤษ
- การตัดบรรทัด Subtitle
- คำอ่านที่แยกพยางค์

### Production Test

- Railway Cold Start
- Health Check
- Database Migration
- File Upload
- Job Retry
- Secret Exposure
- Mobile Performance

---

## 15. Definition of Done

งานแต่ละ Feature จะเสร็จเมื่อ

- ทำงานตาม Acceptance Criteria
- มี Loading, Empty, Error และ Success State
- Responsive
- ข้อความ UI เป็นภาษาไทย
- ไม่มี Secret ใน Code
- มี Validation
- มี Test ที่จำเป็น
- Build ผ่าน
- Deploy ผ่าน
- ไม่ทำ Feature เดิมพัง
- อัปเดตเอกสาร

---

## 16. คำสั่งสำคัญสำหรับ AI ผู้ลงมือพัฒนา

1. อ่านทุกไฟล์ใน `docs/` ก่อนเริ่ม
2. ตรวจ Repository ปัจจุบันก่อนสร้างไฟล์ใหม่
3. อย่าเขียนระบบทั้งหมดไว้ในไฟล์เดียว
4. แยก UI, Domain Logic, Provider และ Storage
5. เริ่มจาก Prompt Only Mode ก่อน Media Generation
6. อย่าใช้การนับคำด้วยช่องว่างอย่างเดียว
7. อย่าใช้ Speech Pronunciation เป็น Subtitle
8. อย่าให้ AI Image/Video วาดข้อความไทยลงภาพ
9. อย่ารับประกันว่าทุก Provider จะรองรับภาษาไทยเหมือนกัน
10. ต้องมี Preview และแก้คำอ่านก่อนสร้างเสียงจริง
11. ทุกงาน Generate ต้องมีสถานะและ Retry
12. ทุก Regenerate ต้องเก็บ Version เดิม
13. ต้องสร้าง Safe Output แทนข้อความที่เสี่ยง ไม่ใช่เพียง Block อย่างเดียว
14. Push เป็นชุด Commit ที่อ่านเข้าใจง่าย
15. ตรวจ Production URL หลัง Deploy

---

## 17. Checklist ก่อนเปิดใช้งานจริง

- [ ] Production URL เปิดได้
- [ ] Health Check ผ่าน
- [ ] Database Backup พร้อม
- [ ] Secret อยู่ใน Railway Variables
- [ ] Prompt Only Mode ใช้งานได้
- [ ] สร้างซีนต่อเนื่องได้
- [ ] ตัวละครไม่เปลี่ยนข้ามซีน
- [ ] บทพูดทุกซีน 17–20 คำ
- [ ] Display Dialogue สะกดถูก
- [ ] Speech Pronunciation แยกชัดเจน
- [ ] Preview เสียงได้
- [ ] Subtitle ใช้ข้อความถูกต้อง
- [ ] Export Markdown/JSON/SRT ได้
- [ ] Mobile ใช้งานได้
- [ ] ระบบแจ้งข้อกล่าวอ้างเสี่ยง
- [ ] ไม่มี API Key ใน Git History
- [ ] Error Log ไม่เผยข้อมูลลับ
- [ ] ผู้ใช้อาจลบโปรเจกต์และ Asset ของตนได้
