<script setup lang="ts">

import { ref } from "vue";
import { useConfigStore } from "@/web/store/config";
import { useSimulationStore } from "@/web/store/simulation";
import { hexToRgb, rgbToHex, getColorString } from "@/web/components/config-editor/utils";
import { defaultTypeName } from "@/lib/config/atom-types";
import { useI18nStore } from "@/web/store/i18n";

const props = defineProps<{
  colors: [number, number, number][];
  names: string[];
}>();

const configStore = useConfigStore();
const { refillAtoms } = useSimulationStore();
const i18n = useI18nStore();
const openMenuIndex = ref<number | null>(null);

const onColorInput = (index: number, event: Event) => {
  props.colors[index] = hexToRgb((event.target as HTMLInputElement).value);
}

const onNameInput = (index: number, event: Event) => {
  props.names[index] = (event.target as HTMLInputElement).value;
}

const toggleMenu = (index: number) => {
  openMenuIndex.value = openMenuIndex.value === index ? null : index;
}

const closeMenu = () => {
  openMenuIndex.value = null;
}

const cloneType = (index: number) => {
  closeMenu();
  configStore.cloneType(index);
}

const removeType = (index: number) => {
  closeMenu();
  if (confirm(i18n.t('Are you sure to remove type?'))) {
    configStore.removeTypeFromConfig(index);
    refillAtoms!(true);
  }
}

</script>

<template>
  <table>
    <tbody>
      <tr>
        <td style="width: 30px"></td>
        <td
          v-for="(color, index) in colors"
          :key="index"
          class="type-cell"
          @focusout="closeMenu"
        >
          <label
            class="swatch"
            :style="{ backgroundColor: getColorString(color) }"
            :title="i18n.t('Change {0} color', names[index] ?? defaultTypeName(index))"
          >
            <input
              type="color"
              :value="rgbToHex(color)"
              @change="onColorInput(index, $event)"
            />
          </label>
          <input
            class="type-name"
            type="text"
            :value="names[index]"
            maxlength="8"
            :title="i18n.t('Type {0} name', index)"
            @input="onNameInput(index, $event)"
          />
          <div class="menu" :class="{ open: openMenuIndex === index }">
            <button
              type="button"
              class="menu-toggle"
              :title="i18n.t('Type actions')"
              @click="toggleMenu(index)"
            >
              ⋯
            </button>
            <ul v-show="openMenuIndex === index" class="menu-list">
              <li @mousedown.prevent="cloneType(index)">{{ i18n.t('Clone') }}</li>
              <li @mousedown.prevent="removeType(index)">{{ i18n.t('Remove') }}</li>
            </ul>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">

@use "../config-editor/assets/config-editor";

.type-cell {
  position: relative;
  padding: 0;
  vertical-align: top;
  background: #2b2b2b;
}

.swatch {
  position: relative;
  display: block;
  height: 30px;
  cursor: pointer;

  input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    border: 0;
    opacity: 0;
    cursor: pointer;
  }
}

.type-name {
  display: block;
  width: 100%;
  height: 22px;
  box-sizing: border-box;
  margin: 0;
  padding: 0 4px;
  border: 0;
  border-top: 1px solid #444;
  background: #242424;
  color: #eee;
  font-size: 12px;
  text-align: center;
}

.menu {
  position: relative;
}

.menu-toggle {
  display: block;
  width: 100%;
  height: 20px;
  padding: 0;
  border: 0;
  background: #3a3a3a;
  color: #c8c8c8;
  font-size: 14px;
  line-height: 16px;
  letter-spacing: 1px;
  cursor: pointer;

  &:hover,
  .menu.open & {
    background: #4a4a4a;
    color: #fff;
  }
}

.menu-list {
  position: absolute;
  z-index: 20;
  top: 100%;
  left: 0;
  right: 0;
  min-width: 88px;
  margin: 0;
  padding: 4px 0;
  list-style: none;
  background: #1e1e1e;
  border: 1px solid rgb(115, 115, 115);

  li {
    padding: 6px 10px;
    color: #ddd;
    font-size: 13px;
    cursor: pointer;
    white-space: nowrap;

    &:hover {
      background: #333;
      color: #fff;
    }
  }
}

.type-cell:nth-last-child(-n + 2) .menu-list {
  left: auto;
  right: 0;
}

</style>
