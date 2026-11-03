<template lang="pug">
nav.breadCrumb__wrapper(aria-label="breadcrumb")
  ol.breadCrumb__list
    li(v-for="(item, index) in items" :key="item.href")
      svg.breadCrumb__divider(v-if="index" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true")
        path(d="M8.59 16.58 13.17 12 8.59 7.41 10 6l6 6-6 6z" fill="currentColor")
      span(v-if="item.disabled" aria-current="page") {{ item.title }}
      NuxtLink(v-else :to="item.href") {{ item.title }}
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
type BreadCrumb = {
  title: {} | undefined;
  href: string;
  disabled: boolean;
};
const route = useRoute();
const reactiveRoute = reactive({
  path: route.path,
  matched: route.matched,
  params: route.params,
});
const items = ref<BreadCrumb[]>([]);

const updateItems = () => {
  let breadcrumbItems: BreadCrumb[] = [];
  reactiveRoute.matched.forEach((routeRecord) => {
    if (routeRecord.path) {
      const segments = routeRecord.path.split("/").filter((segment) => segment);
      segments.forEach((segment, index) => {
        let segmentTitle: string | string[] = segment;
        // Replace dynamic segment (e.g., :id) with actual value from params
        if (segment.startsWith(":")) {
          // :id() => id
          const paramKey = segment.replace(/[:()]/g, "");
          if (reactiveRoute.params[paramKey]) {
            segmentTitle = reactiveRoute.params[paramKey];
          }
        }
        const href = `/${segments
          .slice(0, index + 1)
          .map((seg) =>
            seg.startsWith(":")
              ? reactiveRoute.params[seg.replace(/[:()]/g, "")] || seg
              : seg
          )
          .join("/")}`;
        breadcrumbItems.push({
          title: segmentTitle,
          href,
          disabled: false,
        });
      });
    }
  });
  breadcrumbItems.unshift({
    title: "Home",
    href: "/",
    disabled: false,
  });
  if (breadcrumbItems.length > 1) {
    breadcrumbItems[breadcrumbItems.length - 1].disabled = true;
  }

  items.value = breadcrumbItems;
};

updateItems();

watch(
  () => route.path,
  () => {
    reactiveRoute.path = route.path;
    reactiveRoute.matched = route.matched;
    reactiveRoute.params = route.params;
    updateItems();
  },
  { immediate: true, deep: true }
);
</script>

<style lang="sass" scoped>
.breadCrumb__wrapper
  width: auto
  max-width: 800px
  margin: auto
  padding: 16px
.breadCrumb__list
  display: flex
  flex-wrap: wrap
  align-items: center
  list-style: none
  li
    display: flex
    align-items: center
  a
    color: inherit
.breadCrumb__divider
  margin: 0 6px
</style>
