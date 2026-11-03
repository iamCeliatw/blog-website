<template lang="pug">
section.main__wrapper
  .main__container(v-if="!pending && !error")
    .article__container(v-for="group in articlesByYear" :key="group.year")
      h1.article__title {{ group.year }}
        .article__items--container
          NuxtLink.article__items(v-for="article in group.articles" :key="article.path" :to="articleUrl(article.path)")
            span.date {{ dateFormat(article.date) }}
            span {{ article.title }}
  div(v-if="pending")
    p Loading...
  div(v-if="error")
    p Error loading articles
</template>

<script lang="ts" setup>
type ArticleItem = { path: string; title: string; date: string }

const props = defineProps<{
  articles: ArticleItem[] | null
  pending: boolean
  error: Error | null | undefined
}>()

// 文章已依日期新到舊排序，這裡只依年份分組
const articlesByYear = computed(() => {
  const groups: { year: string; articles: ArticleItem[] }[] = []
  for (const article of props.articles ?? []) {
    const year = article.date.slice(0, 4)
    const last = groups[groups.length - 1]
    if (last?.year === year) last.articles.push(article)
    else groups.push({ year, articles: [article] })
  }
  return groups
})

// content 路徑是 /articles/<key>，網址維持 /article/<key>
const articleUrl = (path: string) => path.replace(/^\/articles\//, '/article/')

const dateFormat = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
</script>

<style lang="sass" scoped>
.main__wrapper
  max-width: 800px
  width: 100%
  height: 100%
  min-height: calc(100vh - 150px)
  margin: auto
  padding: 15px
.main__container
  display: flex
  flex-direction: column
  gap: 50px
  width: 100%
  height: 100%
  margin: 0 auto
.article
  &__container
    display: flex
    flex-direction: column
  &__content
    font-size: 20px
    margin-top: 20px
.article__container
  cursor: pointer

.article__desc
  margin-top: 10px
.article__items--container
  border-left: 1px solid var(--border-color)
.article__items
  display: block
  color: inherit
  text-decoration: none
  margin-bottom: 10px
  padding-left: 25px
  font-size: 16px
  transition: all .2s
  border-left: 1px solid rgba(255, 255, 255, 0)
  &:hover
    border-left: 2px solid var(--border-color)
.article__date
  font-size: 14px
.date
  margin-right: 10px
</style>
