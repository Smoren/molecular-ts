<script setup lang="ts">

withDefaults(defineProps<{
  text: string;
  nowrap?: boolean;
}>(), {
  nowrap: false,
});

</script>

<template>
  <div :data-tooltip="text" :class="{ nowrap }">
    <slot />
  </div>
</template>

<style scoped lang="scss">

[data-tooltip] { position: relative; }

[data-tooltip]::before {
  content: attr(data-tooltip);
  display: inline-block;
  position: absolute;
  bottom: 50%;
  background: #1e1e1e;
  color: rgb(180, 180, 180);
  padding: 7px 15px;
  border-radius: 5px;
  border: 2px solid rgb(115, 115, 115);
  opacity: 0;
  transition: 0.3s;
  overflow: hidden;
  pointer-events: none;
  text-align: center;
  z-index: 100000;
  box-shadow: 0 0 30px 0 rgba(0, 0, 0, 0.9);
}

[data-tooltip].nowrap::before {
  white-space: nowrap;
}

[data-tooltip]:hover::before { opacity:1; bottom: 100%; }

</style>
