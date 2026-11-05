<template lang="pug">
HomepageNavbar
HomepageBreadCrumb
HomepageMainSection(:articles="articles" :pending="pending" :error="error")
//- HomepageMessageBoard
</template>

<script setup lang="ts">
const { data: articles, pending, error } = await useAsyncData('articles', () =>
  queryCollection('articles')
    .select('path', 'title', 'date')
    .order('date', 'DESC')
    .all()
)
useHead({
  title: `文章 - Celia's blog`,
  meta: [
    { property: 'og:title', content: `Celia's blog` },
    { property: 'og:description', content: '前端的隨筆紀錄' },
  ],
})
</script>

<style lang="sass" scoped>
.test
  color: red
</style>
