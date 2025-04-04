<script setup lang="ts">
import { RouterView } from 'vue-router';
import { BallercadeLoader } from '@/components';
import { useBallercade } from './stores/ballercade';
import { onMounted, onUnmounted } from 'vue';

const { disconnect } = useBallercade();

onMounted(() => {
  window.addEventListener('pagehide', disconnect);
});
onUnmounted(() => {
  window.removeEventListener('pagehide', disconnect);
});
</script>

<template>
  <RouterView />
  <BallercadeLoader></BallercadeLoader>
</template>
