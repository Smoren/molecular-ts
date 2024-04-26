<script setup lang="ts">

const props = defineProps<{
  title: string;
  fileName: string;
  dataGetter: (() => Record<string, unknown>) | (() => Promise<Record<string, unknown>>);
}>();

const formatJsonString = (jsonStr: string) => {
  const regex = /(\[)([\d\s.,-]+)(])/g;
  jsonStr = jsonStr.replace(regex, function(_, p1, p2, p3) {
    let numbersOnly = p2.replace(/\s+/g, ' ');
    return p1 + numbersOnly + p3;
  });
  jsonStr = jsonStr.replace(/\[ /g, '[');
  jsonStr = jsonStr.replace(/([0-9]) ]/g, '$1]');

  return jsonStr;
}

const exportJsonFile = (data: Record<string, unknown>, filename: string) => {
  let jsonStr = formatJsonString(JSON.stringify(data, null, 4));

  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(jsonStr));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const exportData = async () => {
  exportJsonFile(await props.dataGetter(), props.fileName);
}

</script>

<template>
  <button class="btn btn-outline-secondary" @click="exportData">
    {{ title }}
  </button>
</template>
