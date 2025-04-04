<script setup lang="ts">
import { useGameSound } from '@/composable/game-sound';
const { playSound } = useGameSound();

const props = defineProps({
  btnType: {
    type: String,
    required: false,
    default: 'normal',
  },
  to: {
    type: String,
    required: false,
    default: '/',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);
const clickBtn = () => {
  playSound('button');
  emit('click');
};
</script>

<template>
  <RouterLink v-if="props.btnType === 'a' && props.to" :to="props.to">
    <button
      class="border w-full border-red-600 rounded-sm cursor-pointer p-2 hover:bg-red-950 active:bg-red-900"
      :class="{ 'cursor-default opacity-50': disabled }"
      @click="clickBtn"
      tabindex="-1"
    >
      <slot></slot>
    </button>
  </RouterLink>
  <button
    v-else
    class="border border-red-600 rounded-sm cursor-pointer p-2 hover:bg-red-950 active:bg-red-900"
    :class="{ 'cursor-default opacity-50': disabled }"
    @click="clickBtn"
  >
    <slot></slot>
  </button>
</template>
