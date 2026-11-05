<template lang="pug">
HomepageNavbar
section.article__wrapper
  .article__container
    HomepageContent(v-if="article" :article="article")
</template>

<script lang="ts" setup>
const route = useRoute()
const key = route.params.key as string
const { data: article } = await useAsyncData(`article-${key}`, () =>
  queryCollection('articles').path(`/articles/${key}`).first()
)
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found', fatal: true })
}
useHead({
  title: article.value.title,
  meta: [
    { property: 'og:title', content: article.value.title },
    { property: 'og:description', content: article.value.description },
  ],
})
</script>
