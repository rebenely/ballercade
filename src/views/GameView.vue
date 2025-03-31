<script setup lang="ts">
import ArcadeText from '@/components/ArcadeText.vue';
import { useGameSound } from '@/composable/game-sound';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import { useWakeLock } from '@vueuse/core';
import { onMounted, ref } from 'vue';
import success from '@/assets/sounds/arcade-ui-4-229502.mp3';
const { isSupported: wakeLockSupported, request: requestWakeLock } = useWakeLock();

const ballercade: BallercadeStore = useBallercade();
const score = ref(0);
onMounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {
    score.value++;
    playScoreSound(); // nagloloko sa android
  });

  if (wakeLockSupported) {
    requestWakeLock('screen');
  }
});

const { playSound: playScoreSound } = useGameSound(success);
</script>

<template>
  <main v-if="ballercade.characteristic" class="flex justify-center">
    <h1 class="text-2xl">Score:</h1>
    <ArcadeText class="text-9xl">{{ score }}</ArcadeText>
  </main>
  <main class="flex justify-center flex-col items-center gap-8 text-center" v-else>
    <h1 class="text-4xl md:text-6xl font-bold">You are not connected to ballercadeBT!</h1>
    <h2>
      Please go to <RouterLink class="underline text-blue-400" to="/">home</RouterLink> screen and
      connect.
    </h2>
  </main>
</template>
