<template lang="pug">
.about__wrapper
  HomepageNavbar
  HomepageBreadCrumb
  .about__container(v-if="about")
    .title
      h1 {{ about.title }}
    .about__content
      ContentRenderer(:value="about")
</template>

<script setup lang="ts">
const { data: about } = await useAsyncData('about', () => queryCollection('about').first())
</script>

<style lang="sass" scoped>
.about__wrapper
  width: 100%

.about__container
  width: 100%
  max-width: 800px
  margin: 0 auto
  padding: 0 15px
  h1
    margin-bottom: 1rem
</style>
