<script setup lang="ts">

import 'bootstrap/dist/css/bootstrap.min.css';
import { useSwitch } from "@/hooks/use-switch";
import type { Config } from '@/hooks/use-config';
import { ref, type Ref } from 'vue';

const props = defineProps<{
  config: Config,
}>();

const leftBarVisible = useSwitch(false);
const rightBarVisible = useSwitch(false);

const rightBarModeMap = {
  GRAVITY: 1,
  LINK_GRAVITY: 2,
};

const rightBarMode: Ref<number> = ref(rightBarModeMap.GRAVITY);

const openRightBar = (mode: number) => {
  rightBarMode.value = mode;
  rightBarVisible.on();
};

const getColorString = (color: [number, number, number]) => {
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

</script>

<template>
  <nav class="navbar bg-body-tertiary fixed-top">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        @click="leftBarVisible.on()"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <a class="navbar-brand" href="#">Molecular TS</a>

      <div
        :class="{ 'show': leftBarVisible.state.value }"
        class="offcanvas offcanvas-start"
      >
        <div class="offcanvas-header">
          <h5 class="offcanvas-title">Main Config</h5>
          <button
            type="button"
            class="btn-close"
            @click="leftBarVisible.off()"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div class="section">
            <h3>World Config</h3>
            <div>
              <div>Max Interaction Radius</div>
              <input type="number" v-model="props.config.worldConfigRef.value.MAX_INTERACTION_RADIUS" min="0" />
            </div>
            <div>
              <div>Max Link Radius</div>
              <input type="number" v-model="props.config.worldConfigRef.value.MAX_LINK_RADIUS" min="0" />
            </div>
            <div>
              <div>Max Force</div>
              <input type="number" v-model="props.config.worldConfigRef.value.MAX_FORCE" />
            </div>
            <div>
              <div>Gravity Multiplier</div>
              <input type="number" v-model="props.config.worldConfigRef.value.GRAVITY_FORCE_MULTIPLIER" />
            </div>
            <div>
              <div>Link Force Multiplier</div>
              <input type="number" v-model="props.config.worldConfigRef.value.LINK_FORCE_MULTIPLIER" step="0.005" min="0.005" />
            </div>
            <div>
              <div>Bounce Force Multiplier</div>
              <input type="number" v-model="props.config.worldConfigRef.value.BOUNCE_FORCE_MULTIPLIER" />
            </div>
            <div>
              <div>Inertial Multiplier</div>
              <input type="number" v-model="props.config.worldConfigRef.value.INERTIAL_MULTIPLIER" />
            </div>
            <div>
              <div>Speed</div>
              <input type="number" v-model="props.config.worldConfigRef.value.SPEED" min="1" />
            </div>
            <div>
              <div>Temperature Multiplier</div>
              <input type="number" v-model="props.config.worldConfigRef.value.TEMPERATURE_MULTIPLIER" step="0.1" />
            </div>
          </div>

          <div class="section">
            <h3>Types Config</h3>
            <div>
              <div class="section">
                <div style="text-align: center">Gravity</div>
                <table>
                  <tr>
                    <td></td>
                    <td
                      v-for="color in props.config.typesConfigRef.value.COLORS"
                      :style="{ backgroundColor: getColorString(color) }"
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr v-for="(row, rowIndex) in props.config.typesConfigRef.value.GRAVITY">
                    <td :style="{ backgroundColor: getColorString(props.config.typesConfigRef.value.COLORS[rowIndex]), width: '30px' }"></td>
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
                    <td></td>
                    <td
                      v-for="color in props.config.typesConfigRef.value.COLORS"
                      :style="{ backgroundColor: getColorString(color) }"
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr v-for="(row, rowIndex) in props.config.typesConfigRef.value.LINK_GRAVITY">
                    <td :style="{ backgroundColor: getColorString(props.config.typesConfigRef.value.COLORS[rowIndex]), width: '30px' }"></td>
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
                      v-for="color in props.config.typesConfigRef.value.COLORS"
                      :style="{ backgroundColor: getColorString(color) }"
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr>
                    <td v-for="(_, index) in props.config.typesConfigRef.value.LINKS">
                      <input type="number" v-model="props.config.typesConfigRef.value.LINKS[index]" step="1" min="0">
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
                      v-for="color in props.config.typesConfigRef.value.COLORS"
                      :style="{ backgroundColor: getColorString(color) }"
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr v-for="(row, rowIndex) in props.config.typesConfigRef.value.TYPE_LINKS">
                    <td :style="{ backgroundColor: getColorString(props.config.typesConfigRef.value.COLORS[rowIndex]), width: '30px' }"></td>
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
                      v-for="color in props.config.typesConfigRef.value.COLORS"
                      :style="{ backgroundColor: getColorString(color) }"
                    >
                      &nbsp;
                    </td>
                  </tr>
                  <tr v-for="(row, rowIndex) in props.config.typesConfigRef.value.LINK_FACTOR_DISTANCE">
                    <td :style="{ backgroundColor: getColorString(props.config.typesConfigRef.value.COLORS[rowIndex]), width: '30px' }"></td>
                    <td v-for="(_, colIndex) in row">
                      <input type="number" v-model="row[colIndex]" step="0.1" min="0">
                    </td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        :class="{ 'show': rightBarVisible.state.value }"
        class="offcanvas offcanvas-end"
      >
        <div class="offcanvas-header">
          <button
              type="button"
              class="btn-close"
              @click="rightBarVisible.off()"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div class="section" v-if="rightBarMode === rightBarModeMap.LINK_GRAVITY">
            <h3>Link Gravity</h3>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped lang="scss">

.section {
  margin-bottom: 30px;

  > div {
    margin-bottom: 10px;

    input {
      width: 100%;
    }

    button {
      margin-right: 10px;
    }
  }

  table {
    max-width: 100%;

    input {
      width: 50px;
    }
  }
}

.offcanvas-end {
  width: 30%;
}

</style>
