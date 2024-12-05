<script setup lang="ts">

import { computed, ref, type Ref, watch } from 'vue';
import type { Tensor } from '@/lib/math/types';
import type { TypesConfig } from '@/lib/config/types';
import { OperationType } from '@/lib/operations/types';
import { Operation, OperationPipe } from '@/lib/operations/operation';
import { useConfigStore } from "@/web/store/config";
import { getTensorDimensions } from '@/lib/math/helpers';
import { BINARY_OPERATOR_FACTORY, UNARY_OPERATOR_FACTORY } from '@/lib/math/operations';
import ConfigSection from "@/web/components/config-editor/components/containers/config-section.vue";
import InputHeader from '@/web/components/base/input-header.vue';
import Dropdown from "@/web/components/inputs/dropdown.vue";
import RadioGroup from "@/web/components/inputs/radio-group.vue";

type TypesConfigKey = keyof TypesConfig;
type TypesConfigItem = {
  name: string;
  alias: TypesConfigKey;
}
type OperationItem = {
  name: string;
  alias: string;
}
type OperationTypeItem = {
  name: string;
  alias: OperationType;
}

const configStore = useConfigStore();

const formatTypeName = (key: string): string => {
  return key.toLowerCase().split('_').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const getItemsAvailable = (item?: keyof TypesConfig): TypesConfigItem[] => {
  const excludeKeys = ['COLORS', 'TRANSFORMATION'];
  const result = Object.keys(configStore.typesConfig)
    .filter((key) => !excludeKeys.includes(key))
    .map((key) => ({ name: formatTypeName(key), alias: key })) as TypesConfigItem[];

  if (item === undefined) {
    return result;
  }

  const itemDimensionsCount = getTensorDimensions(configStore.typesConfig[item] as Tensor<number>);
  return result.filter((x) => getTensorDimensions(configStore.typesConfig[x.alias] as Tensor<number>) === itemDimensionsCount);
};

const createOperationPipe = (): OperationPipe => {
  return new OperationPipe({ inputArgument: inputType.value }, configStore.typesConfig);
}

const addOperation = () => {
  pipe.value.push(new Operation({
    type: OperationType.UNARY,
    factoryName: 'ADD',
    rightArgument: undefined,
  }));
}

const removeOperation = () => {
  if (pipe.value.operations.length === 0) {
    return;
  }

  pipe.value.pop();
}

const applyOperation = () => {
  if (!confirm('Are you sure?')) {
    return;
  }
  (configStore.typesConfig[inputType.value] as Tensor<number>) = pipe.value.run();
}

const getOperationFactories = (type: OperationType): OperationItem[] => {
  if (type === OperationType.UNARY) {
    return Object.keys(UNARY_OPERATOR_FACTORY).map((key) => ({ name: key, alias: key }));
  } else if (type === OperationType.BINARY) {
    return Object.keys(BINARY_OPERATOR_FACTORY).map((key) => ({ name: key, alias: key }));
  }
  throw new Error('Unknown operation type.');
};

const getOperationTypes = (): OperationTypeItem[] => {
  return [
    { name: 'UNARY', alias: OperationType.UNARY },
    { name: 'BINARY', alias: OperationType.BINARY },
  ];
}

const onChangeOperationType = (operation: Operation): void => {
  console.log('operation', operation);
  if (operation.type === OperationType.UNARY) {
    operation.config.rightArgument = undefined;
  } else {
    operation.config.rightArgument = inputType.value;
  }
};

const typesAvailable = computed(() => getItemsAvailable());
const inputType: Ref<keyof TypesConfig> = ref(typesAvailable.value[0].alias as keyof TypesConfig);
const pipe = ref(createOperationPipe());

watch(() => inputType.value, () => {
  pipe.value = createOperationPipe();
});

</script>

<template>
  <config-section>
    <template #body>
      <div>
        <input-header name="Config item to edit" />
        <dropdown
          v-model="inputType"
          :options="typesAvailable"
          value-key="alias"
          title-key="name"
        />
      </div>
      <hr v-if="pipe.operations.length" />
      <div v-for="(operation, index) in pipe.operations" :key="index">
        <input-header :name="`Operation ${index + 1}`" />
        <br />
        <div>
          <div style="display: inline-block; width: 50%">
            <radio-group
              :options="getOperationTypes()"
              v-model="operation.type"
              @change="onChangeOperationType(operation as Operation)"
              value-key="alias"
              title-key="name"
            />
          </div>
          <dropdown
            v-model="operation.factoryName"
            :options="getOperationFactories(operation.type)"
            value-key="alias"
            title-key="name"
            width="50%"
          />
          <br /><br />
        </div>
        <div>
          <table>
            <tr v-if="operation.config.type === OperationType.BINARY">
              <td>Right argument</td>
              <td>
                <dropdown
                  v-model="operation.config.rightArgument"
                  :options="getItemsAvailable(inputType)"
                  value-key="alias"
                  title-key="name"
                />
              </td>
            </tr>
            <tr v-for="(arg, index) in operation.factoryArgs" :key="index">
              <td style="width: 20%;">{{ arg.name }}</td>
              <td>
                <input type="number" v-model="operation.factoryArgs[index].value">
              </td>
            </tr>
          </table>
        </div>
        <hr />
      </div>
      <div>
        <div class="btn-group" role="group">
          <button class="btn btn-outline-secondary" @click="addOperation">
            Append
          </button>
          <button class="btn btn-outline-secondary" @click="removeOperation">
            Remove
          </button>
          <button class="btn btn-outline-primary" @click="applyOperation">
            Apply
          </button>
        </div>
      </div>
    </template>
  </config-section>
</template>

<style scoped lang="scss">

@import "../../assets/config-editor";

</style>
