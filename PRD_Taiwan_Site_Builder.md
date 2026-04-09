# PRD: Taiwan Static Site Builder
> 給 Cursor 使用的產品需求文件

---

## 產品概述

一個針對台灣中小品牌、廣告投放商設計的訂閱制靜態官網建站工具。
核心差異化：繁體中文排版優化 + 歐美簡約質感版型 + 極低學習成本。

**目標用戶**：台灣中小型品牌、店家、個人工作室，想要一個乾淨的官網投廣告或展示產品，不需要電商功能。

**商業模式**：訂閱制
- Free：1 個頁面，無自訂網域
- Basic NT$200/月：3 個頁面，自訂網域
- Pro NT$400/月：無限頁面，AI 文案功能，進階模組

---

## 技術架構

```
Frontend:     Next.js 14 (App Router)
Backend:      Supabase (Auth + Database + Storage)
Deploy:       Vercel + GitHub (每個用戶站台獨立 repo/project)
Editor:       GrapesJS 或 Craft.js（開源編輯器框架）
Styling:      Tailwind CSS
```

### 資料庫 Schema（Supabase）

```sql
-- 用戶
users (id, email, plan, created_at)

-- 站台
sites (id, user_id, name, subdomain, custom_domain, published, created_at)

-- 頁面
pages (id, site_id, title, slug, content_json, published_at)

-- 模組（由營運後台上傳）
modules (id, name, category, thumbnail_url, html, css, js, is_active)

-- 部署紀錄
deployments (id, site_id, vercel_url, status, created_at)
```

---

## 功能模組

### 1. 用戶前台 Editor（核心）

**路徑**：`/editor/[site_id]/[page_id]`

#### 1-1 畫布區（Canvas）
- 左側：模組選取面板（Section Library）
- 中間：預覽畫布，支援拖拉排序 section
- 右側：選中元件的屬性編輯面板

#### 1-2 Section 拖拉邏輯
- 每個 section 是獨立的 HTML/CSS/JS 單元
- 從左側 library 拖入畫布，插入到指定位置
- Section 順序可上下拖拉調整
- 可刪除、複製 section

#### 1-3 文字編輯
- 點擊文字元素進入 inline 編輯模式
- 支援：粗體、斜體、字級、字色、連結
- 繁體中文字體選項：
  - 內文：Noto Serif TC / Noto Sans TC
  - 標題：可自訂（預設品牌首選字體）
- 行高、字距可調整（符合中文排版需求）

#### 1-4 圖片上傳
- 點擊圖片區塊 → 上傳或從媒體庫選取
- 上傳至 Supabase Storage
- 支援裁切比例設定（16:9 / 1:1 / 自由）
- 自動壓縮（< 2MB）

#### 1-5 預覽模式
- 桌機 / 平板 / 手機 三種視窗切換
- 即時預覽，不需儲存

#### 1-6 儲存 & 發布
- 自動儲存（每 30 秒）
- 手動發布 → 觸發 Vercel 部署
- 發布後產生連結：`[subdomain].yourdomain.com`

---

### 2. 用戶後台 Dashboard

**路徑**：`/dashboard`

#### 2-1 站台管理
- 新增站台（輸入名稱、選擇子網域）
- 站台列表：名稱、狀態（草稿/已發布）、最後更新時間
- 進入 Editor 按鈕

#### 2-2 頁面管理
- 每個站台可有多個頁面（依方案限制）
- 新增頁面、設定 slug、刪除頁面

#### 2-3 網域設定
- 子網域：`yourname.platform.com`（免費）
- 自訂網域：輸入網域 → 顯示 DNS 設定說明（Basic 以上）

#### 2-4 媒體庫
- 所有上傳圖片集中管理
- 可在 Editor 中引用

#### 2-5 方案 & 帳單
- 目前方案顯示
- 升級按鈕（串接 Stripe 或綠界）

---

### 3. 營運後台 Admin

**路徑**：`/admin`（需 admin role）

#### 3-1 模組管理（Section Library 管理）
- 上傳新模組：
  - 名稱、分類（Hero / Feature / CTA / Footer / Gallery 等）
  - 縮圖（用於 Library 預覽）
  - HTML / CSS / JS 檔案上傳或直接貼上
  - 設定可編輯欄位（哪些文字、圖片可被用戶替換）
- 啟用 / 停用模組
- 模組列表管理

#### 3-2 用戶管理
- 用戶列表：email、方案、站台數量
- 手動升降方案

#### 3-3 部署紀錄
- 各站台部署狀態查看
- 失敗紀錄 log

---

### 4. 部署流程（Vercel + GitHub）

```
用戶點「發布」
→ 後端將頁面 content_json 轉換成靜態 HTML
→ Push 到該用戶專屬的 GitHub repo（或統一 repo 下的子目錄）
→ Trigger Vercel Deploy Hook
→ Vercel 完成部署
→ 回傳 URL 存入 deployments 表
→ 前端顯示「發布成功，連結：xxx」
```

**注意**：
- 每個站台對應一個 Vercel Project 或使用 Vercel 的 multi-tenant 架構
- 子網域透過 Vercel Domains API 動態新增
- 自訂網域同樣透過 Vercel API 設定

---

## Section 模組規格

每個模組是獨立的 HTML/CSS/JS 單元，格式如下：

```html
<!-- module: hero-minimal -->
<section class="section-hero" data-module="hero-minimal">
  <div class="hero-inner">
    <h1 data-editable="title">品牌標題放這裡</h1>
    <p data-editable="subtitle">副標題，一句話說清楚你是誰</p>
    <img data-editable="image" src="placeholder.jpg" alt="">
    <a data-editable="cta" href="#">了解更多</a>
  </div>
</section>
```

- `data-editable` 標記哪些元素可被用戶編輯
- CSS 使用 scoped class，避免模組間衝突
- JS 只處理該模組的互動（如輪播），不依賴全域狀態

---

## MVP 範圍（第一版）

**包含：**
- [ ] Supabase Auth（Email 登入）
- [ ] 用戶 Dashboard（站台 + 頁面管理）
- [ ] Editor 基本功能（拖拉 section、文字編輯、圖片上傳）
- [ ] 預覽（桌機/手機切換）
- [ ] 發布 → 產生子網域連結
- [ ] 營運後台：上傳模組
- [ ] 5 個預設版型模組（Hero / Feature / Gallery / CTA / Footer）

**不含（之後再做）：**
- 自訂網域
- AI 文案功能
- Stripe 金流
- 多頁面（MVP 只支援單頁）
- 動態資料（表單送出等）

---

## 設計規範

**色系**：白底為主，極少量黑/深灰強調，單一品牌色點綴
**字體**：
- 中文內文：Noto Sans TC 400
- 中文標題：Noto Serif TC 700
- 英文/數字：搭配歐美 sans-serif（如 DM Sans）

**間距原則**：section padding 上下最少 80px，讓版面有呼吸感
**RWD 斷點**：
- Desktop：≥ 1280px
- Tablet：768px – 1279px
- Mobile：< 768px

---

## 開發優先順序

1. Supabase 初始化（Auth + Schema）
2. 用戶 Dashboard 骨架
3. Editor 畫布 + GrapesJS 整合
4. Section Library（硬寫 3 個模組先跑通）
5. 文字編輯 + 圖片上傳
6. 發布流程（Vercel Deploy Hook）
7. 營運後台模組上傳
8. 測試 + 調整 RWD
