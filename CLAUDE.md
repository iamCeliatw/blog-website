# Celia's Note（celia-blog）

個人技術筆記部落格，正式站 https://celia-blog.vercel.app/ ，部署在 Vercel。改版計畫見 `docs/PLAN.md`。

## 開發流程

- 走 `/flow`（Matt Pocock skills），實作前一定先 grill。
- 分支：從 `main` 開功能分支，PR 到 `dev`；`dev` 確認後再合進 `main`（正式站）。合併由使用者操作。
- 指令：`npm run dev`（開發）、`npm run generate`（產生靜態網站）、`npx vitest run`（元件測試）、`npm run test:site`（產生靜態網站並檢查輸出）。

## Agent skills

### Issue tracker

Issues 與規格開在 GitHub Issues（iamCeliatw/vuetify-nuxt3），用 `gh` 操作。See `docs/agents/issue-tracker.md`.

### Triage labels

使用預設五個標籤：needs-triage、needs-info、ready-for-agent、ready-for-human、wontfix。See `docs/agents/triage-labels.md`.

### Domain docs

Single-context：根目錄 `GLOSSARY.md` 加上 `docs/adr/`。See `docs/agents/domain.md`.
