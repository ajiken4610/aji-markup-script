<template lang="pug">
div
  textarea(style="width: 100%; height: 10rem", v-model="input")
  div(style="white-space: pre") {{ output }}
</template>

<script setup lang="ts">
const input = ref("{\\a:b{c;d}}");
const output = ref("");
watchEffect(() => {
  const result = parseAMS(input.value);
  console.log(result);
  output.value = JSON.stringify(result.contents()[0], null, 2);
});
</script>
