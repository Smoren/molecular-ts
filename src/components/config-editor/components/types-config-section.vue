<script setup lang="ts">

import ConfigSection from '@/components/config-editor/components/config-section.vue';
import { useConfigStore } from '@/store/config';

const {
  typesConfig,
} = useConfigStore();

const getColorString = (color: [number, number, number]) => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

</script>

<template>
  <config-section>
    <template #title>
      Types Config
    </template>
    <template #body>
      <div class="section">
        <div style="text-align: center">Gravity</div>
        <table>
          <tr>
            <td></td>
            <td
                v-for="color in typesConfig.COLORS"
                :style="{ backgroundColor: getColorString(color) }"
            >
              &nbsp;
            </td>
          </tr>
          <tr v-for="(row, rowIndex) in typesConfig.GRAVITY">
            <td :style="{ backgroundColor: getColorString(typesConfig.COLORS[rowIndex]), width: '30px' }"></td>
            <td v-for="(_, colIndex) in row">
              <input type="number" v-model="row[colIndex]" step="0.1">
            </td>
          </tr>
        </table>
      </div>
      <div>
        <div class="section">
          <div style="text-align: center">Link Gravity</div>
          <table>
            <tr>
              <td></td>
              <td
                  v-for="color in typesConfig.COLORS"
                  :style="{ backgroundColor: getColorString(color) }"
              >
                &nbsp;
              </td>
            </tr>
            <tr v-for="(row, rowIndex) in typesConfig.LINK_GRAVITY">
              <td :style="{ backgroundColor: getColorString(typesConfig.COLORS[rowIndex]), width: '30px' }"></td>
              <td v-for="(_, colIndex) in row">
                <input type="number" v-model="row[colIndex]" step="0.1">
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <div class="section">
          <div style="text-align: center">Link Gravity</div>
          <table>
            <tr>
              <td
                  v-for="color in typesConfig.COLORS"
                  :style="{ backgroundColor: getColorString(color) }"
              >
                &nbsp;
              </td>
            </tr>
            <tr>
              <td v-for="(_, index) in typesConfig.LINKS">
                <input type="number" v-model="typesConfig.LINKS[index]" step="1" min="0">
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <div class="section">
          <div style="text-align: center">Type Links</div>
          <table>
            <tr>
              <td></td>
              <td
                  v-for="color in typesConfig.COLORS"
                  :style="{ backgroundColor: getColorString(color) }"
              >
                &nbsp;
              </td>
            </tr>
            <tr v-for="(row, rowIndex) in typesConfig.TYPE_LINKS">
              <td :style="{ backgroundColor: getColorString(typesConfig.COLORS[rowIndex]), width: '30px' }"></td>
              <td v-for="(_, colIndex) in row">
                <input type="number" v-model="row[colIndex]" step="1" min="0">
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div>
        <div class="section">
          <div style="text-align: center">Links Distance Factor</div>
          <table>
            <tr>
              <td></td>
              <td
                  v-for="color in typesConfig.COLORS"
                  :style="{ backgroundColor: getColorString(color) }"
              >
                &nbsp;
              </td>
            </tr>
            <tr v-for="(row, rowIndex) in typesConfig.LINK_FACTOR_DISTANCE">
              <td :style="{ backgroundColor: getColorString(typesConfig.COLORS[rowIndex]), width: '30px' }"></td>
              <td v-for="(_, colIndex) in row">
                <input type="number" v-model="row[colIndex]" step="0.1" min="0">
              </td>
            </tr>
          </table>
        </div>
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../assets/config-editor.scss";

</style>
