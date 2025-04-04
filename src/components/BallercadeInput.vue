<script setup lang="ts">
import type { PropType } from 'vue';
import type { InputType } from '@/types/InputTypes';

const model = defineModel();
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String as PropType<InputType>, required: true },
});
</script>

<template>
  <label class="py-2" :for="props.name"><slot name="label"></slot></label>
  <input
    v-bind="$attrs"
    class="text-center p-2 border border-red-600 rounded-sm disabled:opacity-50"
    :type="props.type"
    :name="props.name"
    :id="props.id"
    v-model="model"
  />
  <slot></slot>
</template>
