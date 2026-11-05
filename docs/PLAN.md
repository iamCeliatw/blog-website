# Celia's Note 改版計畫書

> 2026-11-03 起草。目標：網站不再因為免費資料庫被暫停而失效、程式碼與畫面整理乾淨、有測試保護，並開始放 SAA 學習筆記。

## 1. 現況盤點

| 項目 | 現況 | 問題 |
|---|---|---|
| 資料 | Supabase 免費方案（文章、分類、標籤、個人簡介、圖片） | 7 天沒有活動就暫停；暫停超過 90 天無法從後台還原，只能下載備份 |
| 寫文章 | 自製後台 `/admin` + Quill 編輯器，內容存成 HTML | 後台約 1,100 行程式碼只服務一位作者 |
| 文章頁 | `Content.vue` 整段包在 `ClientOnly` 裡 | 搜尋引擎抓不到文章內容，SEO 白做 |
| 首頁 | `supabase.from('articles').select()` | 撈全部欄位（含全文）；沒有過濾 `status`，**草稿會公開** |
| 瀏覽數 | 前端用匿名金鑰直接 `update articles` | 代表匿名使用者有改文章的權限，**任何人都能改你的文章** |
| 權限 | `middleware/auth.ts` 只擋 `/admin` 本身，且只在瀏覽器端檢查 | `/admin/posts` 等子頁沒擋 |
| 測試 | 8 個 spec，大量 mock `useSupabaseClient` | 換掉資料層後全部失效 |
| 其他 | `pages/test.vue`、`store/index.ts` 的 `count/doubleCount` 範例碼、README 是 Nuxt 範本 | 留著只是雜訊 |

## 2. 資料庫選擇

### 建議：不要資料庫，改用 Markdown 檔 + Nuxt Content

這是一個人寫、大家看的筆記站，文章就是檔案。把文章放進 repo 的 `content/` 資料夾，用 [Nuxt Content](https://content.nuxt.com) 讀取，再以 `nuxt generate` 產生靜態網站部署到 Vercel。

- **永遠免費、不會被暫停**：沒有資料庫，就沒有東西會被鎖。
- **SAA 筆記本來就是 Markdown**：Obsidian 寫好直接複製進 `content/saa/`，不用再貼進網頁編輯器。
- **git 就是備份與版本紀錄**：改壞了可以還原，不怕再遇到這次的狀況。
- **SEO 變好**：靜態 HTML，文章內容直接在原始碼裡。
- **少掉大量程式碼**：整個 `/admin`、登入頁、Supabase 模組、Quill、highlight.js（Nuxt Content 內建 Shiki 語法上色）都可以刪。

代價：
- 不能在網頁上寫文章，要改用 Obsidian／編輯器寫完 `git push`。
- 瀏覽數沒有資料庫可存 → 改看已經裝好的 Google Analytics（`nuxt-gtag`）。
- 留言 → 沿用已經寫好的 Giscus（`TheGiscus.vue`，存在 GitHub Discussions，免費）。

### 備案

| 選項 | 什麼時候選 | 備註 |
|---|---|---|
| **Neon**（Postgres） | 一定要保留網頁後台 | 免費方案閒置時只會休眠、有請求就喚醒，不會整個專案被鎖；但 Supabase 的登入與圖片儲存要另外找替代品，改動比 Markdown 方案大 |
| **AWS DynamoDB + S3** | 想把部落格當 SAA 練習專案 | DynamoDB 25 GB 永久免費、S3 前 12 個月免費；學習價值高，但工作量最大，建議等 SAA 考完再做 |

## 3. 執行階段

每個階段結束都要能部署、網站可正常瀏覽。

### 階段 0：把舊資料救出來（最優先）

1. 登入 Supabase 後台，專案若能還原就先還原；不能就下載備份（`.backup` / SQL）。
2. 匯出 `articles`、`categories`、`tags`、`article_tag`、`profile` 成 JSON 或 CSV。
3. 下載 Storage `article` bucket 裡所有圖片。
4. 資料與圖片先存進一個私有位置（不要放進公開 repo 的 `user` 資料表，裡面有 `password` 欄位）。

完成條件：每篇文章的標題、內容、分類、標籤、發布日期、圖片都在本機。

### 階段 1：換資料層

1. 安裝 `@nuxt/content`，建立 `content.config.ts` 定義文章欄位：`title`、`description`、`date`、`category`、`tags`、`draft`。
2. 寫一支一次性轉換腳本：舊文章 HTML → Markdown（用 `npx turndown` 之類的工具，不用加進專案相依套件），產生 `content/<分類>/<key>.md`，frontmatter 帶上欄位。
3. 圖片搬到 `public/images/posts/`，文章內的 Supabase 圖片網址換成本地路徑。
4. 改寫讀資料的地方：`pages/index.vue`、`pages/article/[key].vue`、`pages/category/*`、`pages/about.vue`、`CategorySection.vue`、`Content.vue`，改用 `queryCollection()`，並過濾 `draft: true`。
5. 刪除：`pages/admin/**`、`pages/login.vue`、`pages/test.vue`、`components/admin/Editor.vue`、`middleware/auth.ts`、`composables/supabase-api.ts`、`types/supabase.ts`、`store/index.ts`（確認 `openImagePopup` 只有後台在用）、`@nuxtjs/supabase`、`@vueup/vue-quill`、`highlight.js`、`@vuelidate/*`、`pinia`（若已無人使用）。
6. 部署方式改為 `nuxt generate`（Vercel Build Command 設為 `npm run generate`）。要確認 Nuxt Content 在靜態模式下不需要額外資料庫設定。

完成條件：舊文章全部可瀏覽、網址不變（`/article/<key>`）、`npm run generate` 成功、專案裡搜不到 `supabase`。

### 階段 2：程式碼整理

1. `Content.vue` 拿掉 `ClientOnly`，大綱改用 Nuxt Content 產生的 `toc`，不再用 `DOMParser` 在瀏覽器端解析 HTML。
2. 清掉所有 `// @ts-ignore` 與 `as unknown as`，型別改由 `content.config.ts` 自動產生。
3. `useHead` 改用 `useSeoMeta`，每篇文章有正確的 `og:title`、`og:description`、`canonical`。
4. sitemap 目前只有 `/`，改為列出所有文章頁。
5. GTM 與 gtag 同時裝了兩套，留一套。
6. `nuxt.config.js` 的 `build.analyze: true` 關掉（每次建置都產生分析報告）。
7. README 改寫成這個專案自己的說明：怎麼寫文章、怎麼部署。

### 階段 3：畫面

先做截圖給自己看過，再動手改（設計方向自己挑）。

1. 文章閱讀體驗：內文寬度、行高、程式碼區塊、表格（SAA 筆記會大量用到比較表）。
2. 大綱固定在側邊、點擊跳到段落；手機版收合。
3. 首頁文章列表：顯示分類、標籤、日期、摘要；加上依分類／標籤篩選。
4. SAA 筆記專區：依考試領域（安全、韌性、效能、成本）分組，顯示進度。
5. 深色／淺色模式檢查對比度；圖片加 `alt`；鍵盤可操作。
6. Lighthouse 跑一次，記下改版前後分數。

### 階段 4：測試

舊的 spec 都在測 Supabase mock，換資料層後直接刪除重寫，只測真正會壞的地方：

| 測試 | 工具 | 內容 |
|---|---|---|
| 內容檢查 | Vitest | 每篇 `.md` 都有 `title`、`date`；`key` 不重複；文章裡的本地圖片檔案存在 |
| 頁面 | `@nuxt/test-utils` | 首頁不出現草稿；文章頁有標題與內文；不存在的網址顯示 404 |
| 建置 | GitHub Actions | PR 時跑 `vitest run` 與 `nuxt generate`，失敗就不能合併 |

### 階段 5：放上 SAA 筆記

1. 在 Obsidian 筆記的 frontmatter 加 `publish: true`，只有標記的才上網站。
2. 寫一支同步腳本：從 Obsidian Vault 複製標記的筆記到 `content/saa/`，同時轉換 Obsidian 專屬語法：
   - `[[筆記名稱]]` → 一般 Markdown 連結
   - `![[圖片.png]]` → `![](/images/saa/圖片.png)` 並複製圖片
3. 先發 3 篇確認排版，再陸續補齊。

## 4. 風險與待確認

- **Supabase 備份能不能下載**：階段 0 失敗的話，舊文章只能從網站現有頁面或 Google 快取撈回來，越早處理越好。
- **Obsidian 語法**：callout（`> [!note]`）、內嵌筆記等語法網站不認得，同步腳本要處理或寫作時避開。
- **時間分配**：每天 2 小時主要給 SAA，這份改版建議排在週末，階段 0–1 優先，其餘可以慢慢做。

## 5. 範圍外（這次不做）

- 升級 Nuxt 4、拿掉 Vuetify 或 Pug：可行但不是這次要解決的問題。
- 全文搜尋、RSS、多語系。
