<script setup lang="ts">
import BallercadeButton from '@/components/BallercadeButton.vue';
import router from '@/router';
import { useBallercade } from '@/stores/ballercade';

const { disconnect } = useBallercade();

const exit = () => {
  disconnect();
  router.push('/');
};
</script>

<template>
  <main class="flex items-center justify-center flex-col gap-6">
    <BallercadeButton btn-type="a" to="/classic" class="w-full"
      ><h1 class="text-4xl p-6 md:p-12">Classic</h1>
    </BallercadeButton>

    <BallercadeButton btn-type="a" to="/game" class="w-full"
      ><h1 class="text-4xl p-6 md:p-12">Free Play</h1>
    </BallercadeButton>

    <BallercadeButton btn-type="a" to="/shootout" class="w-full"
      ><h1 class="text-4xl p-6 md:p-12">Multi: Shootout</h1>
    </BallercadeButton>

    <BallercadeButton btn-type="a" to="/settings" class="w-full"
      ><h1 class="text-4xl p-6 md:p-12">Settings</h1>
    </BallercadeButton>

    <BallercadeButton @click="exit" class="w-full"
      ><h1 class="text-4xl p-6 md:p-12">Disconnect</h1>
    </BallercadeButton>
  </main>
</template>
