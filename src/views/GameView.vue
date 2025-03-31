<script setup lang="ts">
import ArcadeText from '@/components/ArcadeText.vue';
import { useGameSound } from '@/composable/game-sound';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import { onMounted, onUnmounted } from 'vue';
import success from '@/assets/sounds/arcade-ui-4-229502.mp3';
import { useAutoWakeLock } from '@/composable/wake-lock';
import BallercadeButton from '@/components/BallercadeButton.vue';

useAutoWakeLock();

const ballercade: BallercadeStore = useBallercade();
onMounted(() => {
  ballercade.freePlayScore = 0;
  ballercade.setOnCharacteristicUpdate(() => {
    ballercade.updateFreePlayScore();
    playScoreSound();
  });
});

onUnmounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {});
});

const { playSound: playScoreSound } = useGameSound(success);
</script>

<template>
  <main class="flex justify-center flex-col items-center gap-4">
    <h1 class="text-2xl">Score:</h1>
    <ArcadeText class="text-9xl">{{ ballercade.freePlayScore }}</ArcadeText>
    <BallercadeButton btn-type="a" to="/menu" class="fixed bottom-2 right-2">Exit</BallercadeButton>
  </main>
</template>
