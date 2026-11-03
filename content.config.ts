import { readFileSync, readdirSync } from 'node:fs'
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const frontmatterOf = (file: string) =>
  readFileSync(`content/articles/${file}`, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
const articleFiles = readdirSync('content/articles').filter((file) => file.endsWith('.md'))

// page 類型會自動補 title，schema 擋不住漏填，所以在這裡讓建置直接失敗
for (const file of articleFiles) {
  const missing = ['title', 'date'].filter((field) => !new RegExp(`^${field}:\\s*\\S`, 'm').test(frontmatterOf(file)))
  if (missing.length) throw new Error(`content/articles/${file} 缺少 ${missing.join('、')}`)
}

// 草稿直接排除在資料來源之外；只在查詢時過濾的話，草稿仍會被打包進瀏覽器端的內容資料
const drafts = articleFiles
  .filter((file) => /^draft:\s*(true|yes)\b/im.test(frontmatterOf(file)))
  .map((file) => `articles/${file}`)

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      type: 'page',
      source: { include: 'articles/*.md', exclude: drafts },
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.string().date(),
        category: z.string().optional(),
        tags: z.array(z.string()).default([]),
        // 草稿在上面就被排除，這裡只為了讓 frontmatter 的欄位有定義
        draft: z.boolean().default(false),
      }),
    }),
    about: defineCollection({
      type: 'page',
      source: 'about.md',
    }),
  },
})
