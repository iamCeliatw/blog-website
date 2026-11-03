---
title: 部落格搬家：從 Supabase 換成 Markdown
description: Supabase 免費專案被暫停後，把部落格改成 Markdown 靜態網站的過程。
date: 2026-11-03
category: 前端
tags: [Nuxt, Supabase]
---

這個部落格原本把文章存在 Supabase 免費專案，專案閒置一段時間後被暫停，網站就讀不到任何文章了。

## 為什麼不換另一個免費資料庫

一個人寫、大家看的筆記站，文章本來就是檔案。改用 Markdown 放在 repo 裡：

- 沒有資料庫，就沒有東西會被暫停。
- git 就是備份與版本紀錄。
- 筆記本來就在 Obsidian 用 Markdown 寫，直接搬過來就能發表。

## 換掉了什麼

- 網頁後台與登入：改用編輯器寫完 `git push`。
- 伺服器端渲染：改成建置時就產生好每一頁的 HTML，訪客不用等伺服器啟動與資料庫查詢。
- 整套 UI 元件庫、圖示字型、語法上色套件：前台用不到那麼多。

```ts
export default defineNuxtConfig({
  modules: ['@nuxt/content'],
})
```
