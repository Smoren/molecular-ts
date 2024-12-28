<script setup lang="ts">

import DropdownMenu from "@/web/components/inputs/dropdown-menu.vue";
import { useConfigStore } from "@/web/store/config";
import { useSimulationStore } from "@/web/store/simulation";

defineProps<{
  colors: [number, number, number][];
}>();

type ActionAlias = "clone" | "remove";

const configStore = useConfigStore();
const { refillAtoms } = useSimulationStore();

const actions: [ActionAlias, string][] = [
  ["clone", "Clone"],
  ["remove", "Remove"],
];

const handleAction = (action: ActionAlias, index: number) => {
  switch (action) {
    case "clone":
      cloneType(index);
      break;
    case "remove":
      removeType(index);
      break;
  }
}

const removeType = (index: number) => {
  if (confirm('Are you sure to remove type?')) {
    configStore.removeTypeFromConfig(index);
    refillAtoms!(true);
  }
}

const cloneType = (index: number) => {
  configStore.cloneType(index);
}

const getAlignByIndex = (index: number, total: number) => {
  return index < total/2 ? 'left' : 'right';
}

</script>

<template>
  <table>
    <tbody>
      <tr>
        <td style="width: 30px"></td>
        <td v-for="(_, index) in colors" style="background: #515151;">
          <dropdown-menu
            :key="index"
            :color="colors[index]"
            :align="getAlignByIndex(index, colors.length)"
            :actions="actions"
            @choose="(action) => handleAction(action as ActionAlias, index)"
          />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">

@use "../config-editor/assets/config-editor";

</style>
