<template lang="pug">
.giscus__wrapper 
  Giscus(
      id="comments"
      repo="iamCeliatw/blog-website"
      repoId="R_kgDOLnHWQQ"
      category="Announcements"
      categoryId="DIC_kwDOLnHWQc4Cet3_"
      mapping="pathname"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      :theme="theme"
      lang="zh-TW"
      loading="lazy")
</template>

<script lang="ts" setup>
import Giscus from '@giscus/vue'
</script>

<style lang="sass" scoped>
.giscus__wrapper
  width: 100%
</style>
