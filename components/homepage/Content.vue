<template lang="pug">
.content__wrapper
  .content__container
    h1.article__title
      p {{ article.title }}
      p {{ formatDate(article.date) }}
    section.article__content
      .article__content--main
        ContentRenderer.content(:value="article")
      .article__content--info
        .article__outline(v-if="outline.length")
          p.outline__title 大綱
          a(v-for="h2 in outline" :key="h2.id" :href="`#${h2.id}`") {{ h2.text }}
        .article__tags
          span.tag(v-for="tag in article.tags" :key="tag") {{ tag }}
</template>

<script lang="ts" setup>
import type { ArticlesCollectionItem } from '@nuxt/content'

const props = defineProps<{ article: ArticlesCollectionItem }>()

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

const outline = computed(() => props.article.body.toc?.links ?? [])
</script>

<style lang="sass" scoped>
@import "../../assets/breakpoint"
.content__wrapper
  width: 100%
  height: 100%
.content__container
  width: 65%
  margin: 0 auto
  @include breakPoint(size-768 ,null)
    width: 90%

.article__title
  justify-content: center
  align-items: center
  display: flex
  flex-direction: column
  height: 150px
  gap: 15px
  border-bottom: 1px solid #666
.article__content
  width: 100%
  display: flex
  margin: 20px 0
  @include breakPoint(size-768 ,null)
    flex-direction: column-reverse

.article__content--main
  width: 70%
  margin-right: 20px
  @include breakPoint(size-768 ,null)
    width: 100%
.article__content--info
  width: 30%
  display: flex
  flex-direction: column
  gap: 20px
  @include breakPoint(size-768 ,null)
    width: 100%
  .article__tags
    display: flex
    flex-wrap: wrap
    gap: 10px
    .tag
      padding: 5px 10px
      border-radius: 5px
      background-color: #666
      color: #fff
      font-size: 14px
      cursor: pointer
      &:hover
        background-color: #333
        color: #fff
.article__outline
  display: flex
  flex-direction: column
  gap: 6px
  a
    color: inherit

.outline__title
  font-size: 24px
  font-weight: 700
</style>
