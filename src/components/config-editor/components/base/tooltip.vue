<script setup lang="ts">

import { ref } from "vue";

withDefaults(defineProps<{
  text: string;
  nowrap?: boolean;
  center?: boolean;
  width?: number;
}>(), {
  nowrap: false,
  center: false,
  width: 300,
});

const container = ref(null);

const offset = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect();
  const scrollLeft = document.documentElement.scrollLeft;
  const scrollTop = document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
}

const onMouseover = () => {
  const divOffset = offset((container.value as unknown as HTMLElement));
  const element = (container.value as unknown as HTMLElement);
  if (divOffset.left < 0) {
    element.style.marginLeft = `${-divOffset.left}px`;
  }
};

</script>

<template>
  <span :data-tooltip="text" :class="{ nowrap, center }" @mouseover="onMouseover">
    <span class="before" :style="{ width: `${width}px`, left: `${-width/2}px` }" ref="container">
      {{ text }}
    </span>
    <slot />
  </span>
</template>

<style scoped lang="scss">

[data-tooltip] {
  position: relative;
}

[data-tooltip] .before {
  transform: scale(0);
  position: absolute;
  bottom: 50%;
  background: #1e1e1e;
  color: rgb(180, 180, 180);
  padding: 7px 15px;
  border-radius: 5px;
  border: 2px solid rgb(115, 115, 115);
  opacity: 0;
  transition: 0.3s opacity ease, 0.3s bottom ease;
  overflow: hidden;
  pointer-events: none;
  text-align: center;
  z-index: 100000;
  margin-bottom: 3px;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.9);
}

[data-tooltip].nowrap .before {
  white-space: nowrap;
}

[data-tooltip]:hover .before {
  transform: scale(1);
  position: absolute;
  display: inline-block;
  opacity: 1;
  bottom: 100%;
}

</style>
