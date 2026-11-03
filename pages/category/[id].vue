<template lang="pug">
.category__wrapper
  HomepageNavbar
  HomepageBreadCrumb
  HomepageMainSection(:articles="articles" :pending="pending" :error="error")
</template>

<script lang="ts" setup>
const name = useRoute().params.id as string
const { data: articles, pending, error } = await useAsyncData(`category-${name}`, () =>
  queryCollection('articles')
    .where('category', '=', name)
    .select('path', 'title', 'date')
    .order('date', 'DESC')
    .all()
)
useHead({ title: `${name} - Celia's blog` })
</script>
