// 檢查 `nuxt generate` 產生的靜態網站；先跑 `npm run test:site`（會先 generate）。
import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { gunzipSync } from 'node:zlib'

const root = resolve(__dirname, '../.output/public')
const page = (path: string) => readFileSync(resolve(root, path, 'index.html'), 'utf8')
const allFiles = () =>
  readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => resolve(entry.parentPath, entry.name))
// Nuxt Content 給瀏覽器查詢用的資料是 gzip 再 base64，要解開才看得到內容
const readOutput = (file: string) => {
  const text = readFileSync(file, 'utf8')
  return file.endsWith('sql_dump.txt') ? gunzipSync(Buffer.from(text, 'base64')).toString() : text
}

describe('靜態網站', () => {
  it('文章頁的 HTML 直接包含標題與內文', () => {
    const html = page('article/moving-off-supabase')
    expect(html).toContain('部落格搬家：從 Supabase 換成 Markdown')
    expect(html).toContain('Supabase 免費專案')
  })

  it('草稿不出現在網站任何輸出裡', () => {
    const leaked = allFiles().filter((file) => readOutput(file).includes('DRAFT-MARKER-7f3a'))
    expect(leaked).toEqual([])
  })

  it('首頁連到已發布的文章', () => {
    expect(page('')).toContain('href="/article/moving-off-supabase"')
  })

  it('分類頁列出該分類的文章', () => {
    expect(page('category/前端')).toContain('部落格搬家：從 Supabase 換成 Markdown')
  })

  it('About 頁有內容', () => {
    expect(page('about')).toContain('AWS Solutions Architect Associate')
  })

  it('不再載入 Supabase、整套圖示字型與 GTM', () => {
    const banned = /supabase\.co|materialdesignicons|googletagmanager\.com\/gtm/
    const hits = allFiles().filter((file) => !file.endsWith('sql_dump.txt') && banned.test(readFileSync(file, 'utf8')))
    expect(hits).toEqual([])
  })

  it('頁面不向 Google Fonts 請求字型', () => {
    const htmlFiles = allFiles().filter((file) => file.endsWith('.html'))
    const hits = htmlFiles.filter((file) => /fonts\.(googleapis|gstatic)\.com/.test(readFileSync(file, 'utf8')))
    expect(htmlFiles.length).toBeGreaterThan(0)
    expect(hits).toEqual([])
  })

  it('粉圓體與 Nunito 的字型檔跟網站一起輸出，且 CSS 有引用', () => {
    const files = allFiles()
    const css = files.filter((file) => file.endsWith('.css') || file.endsWith('.html')).map((file) => readFileSync(file, 'utf8')).join('\n')
    for (const family of ['Huninn', 'Nunito']) {
      const faces = [...css.matchAll(/@font-face\s*{[^}]*}/g)].map(([face]) => face).filter((face) => face.includes(family))
      expect(faces.length, family).toBeGreaterThan(0)
      const urls = faces.flatMap((face) => [...face.matchAll(/url\(["']?(\/[^"')]+)/g)].map(([, url]) => url))
      expect(urls.length, family).toBeGreaterThan(0)
      for (const url of urls) expect(files, url).toContain(resolve(root, '.' + url))
    }
  })
})
