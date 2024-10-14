<script setup lang="ts">

import { useConfigStore } from "@/web/store/config";
import ConfigSection from "@/web/components/config-editor/components/containers/config-section.vue";
import { computed, ref, type Ref, watch } from 'vue';
import type { TypesConfig } from '@/lib/types/config';
import InputHeader from '@/web/components/config-editor/components/base/input-header.vue';
import { Operation, OperationPipe } from '@/lib/operations/operation';
import { OperationType } from '@/lib/operations/types';
import { BINARY_OPERATOR_FACTORY, UNARY_OPERATOR_FACTORY } from '@/lib/math/operations';
import { getTensorDimensions } from '@/lib/math/helpers';
import type { Tensor } from '@/lib/math/types';

type TypesConfigKey = keyof TypesConfig;
type TypesConfigItem = {
  name: string;
  alias: TypesConfigKey;
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

const getOperationFactories = (type: OperationType) => {
  if (type === OperationType.UNARY) {
    return UNARY_OPERATOR_FACTORY;
  } else if (type === OperationType.BINARY) {
    return BINARY_OPERATOR_FACTORY;
  }
};

const onChangeOperationType = (operation: Operation) => {
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
    <template #title>
      Edit types config
    </template>
    <template #body>
      <br />
      <div>
        <input-header name="Config item to edit" />
        <select v-model="inputType" style="width: 100%;">
          <option v-for="(item, index) in typesAvailable" :key="index" :value="item.alias">
            {{ item.name }}
          </option>
        </select>
      </div>

      <hr v-if="pipe.operations.length" />
      <div v-for="(operation, index) in pipe.operations" :key="index">
        <input-header :name="`Operation ${index + 1}`" />
        <br />
        <div>
          <div style="display: inline-block; width: 50%">
            <label>
              <input type="radio" v-model="operation.type" :value="OperationType.UNARY" @change="onChangeOperationType(operation as Operation)" /> UNARY
            </label>
            &nbsp;
            <label>
              <input type="radio" v-model="operation.type" :value="OperationType.BINARY" @change="onChangeOperationType(operation as Operation)" /> BINARY
            </label>
          </div>
          <select v-model="operation.factoryName" style="width: 50%;">
            <option v-for="(_, operationName) in getOperationFactories(operation.config.type)" :key="index" :value="operationName">
              {{ operationName }}
            </option>
          </select>
          <br /><br />
        </div>
        <div>
          <table>
            <tr v-if="operation.config.type === OperationType.BINARY">
              <td>Right argument</td>
              <td>
                <select v-model="operation.config.rightArgument" style="width: 100%;">
                  <option v-for="(item, index) in getItemsAvailable(inputType)" :key="index" :value="item.alias">
                    {{ item.name }}
                  </option>
                </select>
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
