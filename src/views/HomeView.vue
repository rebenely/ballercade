<script setup lang="ts">
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import ArcadeText from '@/components/ArcadeText.vue';
import BallercadeButton from '@/components/BallercadeButton.vue';
import { useBluetooth } from '@/composable/bluetooth';
import router from '@/router';
import { ref } from 'vue';

const ballercade: BallercadeStore = useBallercade();
const errors = ref('');
const setupConnection = async () => {
  try {
    const { characteristic }: { characteristic: BluetoothRemoteGATTCharacteristic } =
      await useBluetooth(ballercade.serviceUuid, ballercade.characteristicUuid);
    ballercade.setCharacteristic(characteristic);
    router.push('/game');
  } catch (e: unknown) {
    errors.value += `\n${e}`;
  }
};
</script>

<template>
  <main v-if="!ballercade.characteristic" class="flex items-center justify-center flex-col gap-6">
    <h1 class="text-6xl">BALLERCADE</h1>
    <ArcadeText>ballercade</ArcadeText>

    <div class="flex justify-center flex-col gap-4">
      <form class="grid grid-cols-2 gap-y-5">
        <label for="service-name">Service UUID</label>
        <input type="text" name="service-name" v-model="ballercade.serviceUuid" />

        <label for="service-name">Characteristic UUID</label>
        <input type="text" name="service-name" v-model="ballercade.characteristicUuid" />
      </form>
      <BallercadeButton @click="setupConnection">Connect</BallercadeButton>
    </div>
  </main>

  <main v-else class="flex items-center justify-center flex-col gap-6">
    <h1 class="text-6xl">You are still connected!</h1>
    <h2>
      Click <RouterLink class="underline text-blue-400" to="/game">here</RouterLink> to go back to
      game mode select
    </h2>
    <h2>Exit the page or refresh to disconnect.</h2>
  </main>

  <pre class="w-full whitespace-pre-wrap"> {{ errors }}</pre>
</template>
