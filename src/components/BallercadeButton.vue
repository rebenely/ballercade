<script setup lang="ts">
import sound from '@/assets/sounds/arcade-ui-7-229506.mp3';
import { useGameSound } from '@/composable/game-sound';
const { audio, playSound } = useGameSound(sound);
audio.playbackRate = 1.15;

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
  playSound();
  emit('click');
};
</script>

<template>
  <button
    class="border border-red-600 rounded-sm p-2 cursor-pointer hover:bg-red-950 active:bg-red-900"
    :class="{ 'cursor-default opacity-50': disabled }"
    @click="clickBtn"
  >
    <RouterLink v-if="props.btnType === 'a' && props.to" class="w-full" :to="props.to">
      <slot></slot>
    </RouterLink>
    <slot v-else></slot>
  </button>
</template>
