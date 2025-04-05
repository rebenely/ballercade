<script setup lang="ts">
import { useGameSound } from '@/composable/game-sound';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import { onMounted, onUnmounted, ref } from 'vue';
import { useAutoWakeLock } from '@/composable/wake-lock';
import { ArcadeText, BallercadeButton } from '@/components';

useAutoWakeLock();
const gameScore = ref(0);

const ballercade: BallercadeStore = useBallercade();
onMounted(() => {
  gameScore.value = 0;
  ballercade.setOnCharacteristicUpdate(() => {
    gameScore.value++;
    playSound('score');
  });
});

onUnmounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {});
});

const { playSound } = useGameSound();
</script>

<template>
  <main class="flex justify-center flex-col items-center gap-4">
    <h1 class="text-2xl">Score:</h1>
    <ArcadeText class="text-9xl">{{ gameScore }}</ArcadeText>
    <BallercadeButton btn-type="a" to="/menu" class="fixed bottom-2 right-2">Exit</BallercadeButton>
  </main>
</template>
