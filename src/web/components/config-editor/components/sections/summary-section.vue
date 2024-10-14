<script setup lang="ts">

import { ref, type Ref } from 'vue';
import ConfigSection from '@/web/components/config-editor/components/containers/config-section.vue';
import { useSimulationStore } from '@/web/store/simulation';
import type { TimeSeriesConfig } from "@/web/components/config-editor/components/widgets/chart.vue";
import Chart from "@/web/components/config-editor/components/widgets/chart.vue";
import Flag from '@/web/components/config-editor/components/inputs/flag.vue';

const { getCurrentSimulation } = useSimulationStore();

const showMean: Ref<boolean> = ref(false);

type ChartConfig = {
  id: string;
  name: string;
  data: () => number[];
  width?: number;
  height?: number;
  period?: number;
  config: TimeSeriesConfig[];
}

const timeSeriesFpsConfig: ChartConfig = {
  id: 'fps',
  name: 'FPS',
  data: () => getCurrentSimulation().summary['STEP_FREQUENCY'],
  config: [
    {
      name: 'FPS',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
    },
  ],
};
const timeSeriesLinksCountConfig = {
  id: 'links-count',
  name: 'Links Count',
  data: () => getCurrentSimulation().summary['LINKS_COUNT'],
  config: [
    {
      name: 'Links Count',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
    },
  ],
};
const timeSeriesAtomsMeanSpeedConfig = {
  id: 'atoms-mean-speed',
  name: 'Atoms Mean Speed',
  data: () => getCurrentSimulation().summary['ATOMS_MEAN_SPEED'],
  config: [
    {
      name: 'Atoms Mean Speed',
      options: {
        strokeStyle: 'rgb(13, 110, 253)',
        fillStyle: 'rgba(13, 110, 253, 0.4)',
        lineWidth: 3,
      },
    },
  ],
}
const timeSeriesAtomsTypeMeanSpeedConfig = {
  id: 'atoms-type-mean-speed',
  name: 'Atoms Type Mean Speed',
  height: 200,
  data: () => getCurrentSimulation().summary['ATOMS_TYPE_MEAN_SPEED'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color) => {
    const strColor = color.join(', ');
    return {
      name: 'Atoms Mean Speed',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}
const timeSeriesAtomsTypeLinksCountConfig = {
  id: 'atoms-type-links-count-speed',
  name: 'Atoms Type Links Count',
  height: 200,
  data: () => getCurrentSimulation().summary['ATOMS_TYPE_LINKS_COUNT'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color) => {
    const strColor = color.join(', ');
    return {
      name: 'Atoms Type Links Count',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}
const timeSeriesAtomsTypeLinksMeanCountConfig = {
  id: 'atoms-type-links-mean-count-speed',
  name: 'Atoms Type Links Mean Count',
  height: 200,
  data: () => getCurrentSimulation().summary['ATOMS_TYPE_LINKS_MEAN_COUNT'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color) => {
    const strColor = color.join(', ');
    return {
      name: 'Atoms Type Links Mean Count',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}

const timeSeriesLinksCreatedDeletedConfig = {
  id: 'links-created-deleted',
  name: 'New links / Deleted links',
  height: 200,
  data: () => [getCurrentSimulation().summary['LINKS_CREATED'][0], getCurrentSimulation().summary['LINKS_DELETED'][0]],
  config: [
    {
      name: 'New links',
      options: {
        strokeStyle: 'rgb(0, 255, 0)',
        lineWidth: 3,
      },
    },
    {
      name: 'Deleted links',
      options: {
        strokeStyle: 'rgb(255, 0, 0)',
        lineWidth: 3,
      },
    },
  ],
}

const timeSeriesLinksCreatedDeletedMeanConfig = {
  id: 'links-created-deleted-mean',
  name: 'New links / Deleted links Mean',
  height: 200,
  data: () => [getCurrentSimulation().summary['LINKS_CREATED_MEAN'][0], getCurrentSimulation().summary['LINKS_DELETED_MEAN'][0]],
  config: [
    {
      name: 'New links',
      options: {
        strokeStyle: 'rgb(0, 255, 0)',
        lineWidth: 3,
      },
    },
    {
      name: 'Deleted links',
      options: {
        strokeStyle: 'rgb(255, 0, 0)',
        lineWidth: 3,
      },
    },
  ],
}

const timeSeriesLinksTypeCreatedConfig = {
  id: 'links-types-created',
  name: 'Links Types Created',
  height: 200,
  data: () => getCurrentSimulation().summary['LINKS_TYPE_CREATED'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color) => {
    const strColor = color.join(', ');
    return {
      name: 'Links Types Created',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}

const timeSeriesLinksTypeDeletedConfig = {
  id: 'links-types-deleted',
  name: 'Links Types Deleted',
  height: 200,
  data: () => getCurrentSimulation().summary['LINKS_TYPE_DELETED'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color) => {
    const strColor = color.join(', ');
    return {
      name: 'Links Types Deleted',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}

const timeSeriesLinksTypeCreatedMeanConfig = {
  id: 'links-types-created-mean',
  name: 'Links Types Created Mean',
  height: 200,
  data: () => getCurrentSimulation().summary['LINKS_TYPE_CREATED_MEAN'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color) => {
    const strColor = color.join(', ');
    return {
      name: 'Links Types Created Mean',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}

const timeSeriesLinksTypeDeletedMeanConfig = {
  id: 'links-types-deleted-mean',
  name: 'Links Types Deleted Mean',
  height: 200,
  data: () => getCurrentSimulation().summary['LINKS_TYPE_DELETED_MEAN'],
  config: getCurrentSimulation().config.typesConfig.COLORS.map((color) => {
    const strColor = color.join(', ');
    return {
      name: 'Links Types Deleted Mean',
      options: {
        strokeStyle: `rgb(${strColor})`,
        lineWidth: 2,
      },
    };
  }),
}

const timeSeriesConfigBase: ChartConfig[] = [
  timeSeriesFpsConfig,
  timeSeriesAtomsMeanSpeedConfig,
  timeSeriesLinksCountConfig,
];

const timeSeriesConfigCount: ChartConfig[] = [
  timeSeriesAtomsTypeLinksCountConfig,
  timeSeriesLinksCreatedDeletedConfig,
  timeSeriesLinksTypeCreatedConfig,
  timeSeriesLinksTypeDeletedConfig,
];

const timeSeriesConfigMean: ChartConfig[] = [
  timeSeriesAtomsTypeLinksMeanCountConfig,
  timeSeriesLinksCreatedDeletedMeanConfig,
  timeSeriesLinksTypeCreatedMeanConfig,
  timeSeriesLinksTypeDeletedMeanConfig,
];

</script>

<template>
  <config-section>
    <template #title>
      Summary
    </template>
    <template #body>
      <br />
      <div v-for="config in timeSeriesConfigBase">
        <chart
          :id="config.id"
          :name="config.name"
          :data="config.data"
          :period="config.period ?? 100"
          :width="config.width ?? 467"
          :height="config.height ?? 100"
          :config="config.config"
        />
      </div>
      <div>
        <flag title="Mean Mode" v-model="showMean" />
      </div>
      <div v-for="config in timeSeriesConfigCount" v-show="!showMean">
        <chart
          :id="config.id"
          :name="config.name"
          :data="config.data"
          :period="config.period ?? 100"
          :width="config.width ?? 467"
          :height="config.height ?? 100"
          :config="config.config"
        />
      </div>
      <div v-for="config in timeSeriesConfigMean" v-show="showMean">
        <chart
          :id="config.id"
          :name="config.name"
          :data="config.data"
          :period="config.period ?? 100"
          :width="config.width ?? 467"
          :height="config.height ?? 100"
          :config="config.config"
        />
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
