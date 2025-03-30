<script setup lang="ts">
import ArcadeText from '@/components/ArcadeText.vue';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import { onMounted, ref } from 'vue';

const ballercade: BallercadeStore = useBallercade();
const score = ref(0);
onMounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {
    score.value++;
  });
});
</script>

<template>
  <main class="flex justify-center">
    <h1 class="text-2xl">Score:</h1>
    <ArcadeText class="text-9xl">{{ score }}</ArcadeText>
  </main>
</template>
