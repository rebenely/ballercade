<script setup lang="ts">
import type { PropType } from 'vue';
import type { InputType } from '@/types/InputTypes';
import { ErrorMessage, Field } from 'vee-validate';

const model = defineModel();
const props = defineProps({
  id: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String as PropType<InputType>, required: true },
});
</script>

<template>
  <div class="flex justify-between py-2 relative pb-8">
    <label class="py-2" :for="props.name"><slot name="label"></slot></label>
    <div class="flex flex-col gap-2">
      <Field
        v-bind="$attrs"
        class="text-center p-2 border border-red-600 rounded-sm disabled:opacity-50"
        :type="props.type"
        :name="props.name"
        :id="props.id"
        v-model="model"
      />
      <ErrorMessage class="absolute text-xs right-0 bottom-2" :name="props.name" />
    </div>

    <slot></slot>
  </div>
</template>
