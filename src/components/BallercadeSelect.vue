<script setup lang="ts">
const model = defineModel();
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
});
</script>
<template>
  <div class="flex justify-between py-2 relative pb-8">
    <label class="py-2" :for="props.name"><slot name="label"></slot></label>
    <select
      class="text-center border border-red-600 p-2 rounded-sm disabled:opacity-50"
      v-model="model"
      :name="props.name"
      :id="props.id"
    >
      <slot></slot>
    </select>
  </div>
</template>
