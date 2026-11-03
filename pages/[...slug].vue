<template lang="pug">
.noPage__wrapper
    .noPage__container
      h1 404
    .planet
      img(src="/images/planet.png")
    .alien
      img(src="/images/alien.png")
    .not_found
      .text
        h1.title 404
        p page not found
      .back_page
        img(src="/images/arrow-back.png")
        router-link(to="/") Go to homepage
</template>

<script setup lang="ts">
// 只有 404 頁用到這個字型
useHead({
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Concert+One&display=swap' }],
})
</script>

<style lang="sass" scoped>
@import "@/assets/breakpoint.sass"
.noPage__wrapper
  font-family: "Concert One", sans-serif
  width: 100%
  height: 100vh
  background: #0C091E
  position: relative
  overflow: hidden
  &::after
    content: ''
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%
    background-image: url('/images/stars.png')
    background-size: cover
    background-position: center
    z-index: -1
.planet
  position: absolute
  left: 0
  top: 0
  width: 30%
  img
    width: 100%
.alien
  position: absolute
  right: 0
  bottom: 0
  width: 30%
  img
    width: 100%
.not_found
  position: absolute
  top: 50%
  left: 50%
  transform: translate(-50%, -50%)
  width: 50%
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column
  gap: 20px
  .title
    font-size: 20vw
    color: #D7D5E4
  p
    color: #9E9BB2
  img
    width: 100%
  a
    color: white
    text-decoration: none
    font-size: 35px
    &:hover
      text-decoration: underline
    @include breakPoint(size-430 ,null)
      font-size: 15px
.text
  display: flex
  justify-content: center
  align-items: center
  flex-direction: column

.back_page
  display: flex
  justify-content: center
  align-items: center
  gap: 10px
  img
    width: 22px
</style>
