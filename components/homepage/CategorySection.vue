<template lang="pug">
.category__wrapper
  .category__container
    NuxtLink.category__title(v-for="name in categories" :key="name" :to="`/category/${name}`")
      h3 {{ name }}
</template>

<script lang="ts" setup>
const { data: categories } = await useAsyncData('categories', async () => {
  const rows = await queryCollection('articles').select('category').all()
  return [...new Set(rows.map((row) => row.category).filter(Boolean))] as string[]
})
</script>

<style lang="sass" scoped>
.category
    &__wrapper
        width: 100%
        max-width: 800px
        margin: 0 auto
        padding: 0 15px
    &__container
        width: 100%
        display: flex
        flex-wrap: wrap
        gap: 8px
    &__title
        margin-bottom: 1rem
        background: #f0f0f5
        width: fit-content
        color: #444
        padding: 4px 12px
        border-radius: 4px
        cursor: pointer
        text-decoration: none
        background-size: 200% 200%
        transition: all 0.5s
        &:hover
            background-image: linear-gradient(to left, #ebbba7 0%, #cfc7f8 100%)
            color: #444
            animation: gradient 3s ease infinite
@keyframes gradient
    0%
        background-position: 0% 50%

    50%
        background-position: 100% 50%

    100%
        background-position: 0% 50%
</style>
