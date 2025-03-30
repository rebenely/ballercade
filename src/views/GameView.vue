<script setup lang="ts">
import ArcadeText from '@/components/ArcadeText.vue';
import { useGameSound } from '@/composable/game-sound';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import { useWakeLock } from '@vueuse/core';
import { onMounted, ref } from 'vue';
const { isSupported: wakeLockSupported, request: requestWakeLock } = useWakeLock();

const ballercade: BallercadeStore = useBallercade();
const score = ref(0);
onMounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {
    score.value++;
    playScoreSound();
  });

  if (wakeLockSupported) {
    requestWakeLock('screen');
  }
});

const { playSound: playScoreSound } = useGameSound('arcade-ui-4-229502.mp3');
</script>

<template>
  <main class="flex justify-center">
    <h1 class="text-2xl">Score:</h1>
    <ArcadeText class="text-9xl">{{ score }}</ArcadeText>
  </main>
</template>
