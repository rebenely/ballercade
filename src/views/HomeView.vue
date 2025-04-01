<script setup lang="ts">
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import BallercadeButton from '@/components/BallercadeButton.vue';
import { useBluetooth } from '@/composable/bluetooth';
import router from '@/router';
import { ref } from 'vue';
import { useLoader } from '@/composable/loader';
import { useGameSound } from '@/composable/game-sound';
import { useRoute, useRouter } from 'vue-router';
import success from '@/assets/sounds/arcade-ui-26-229495.mp3';
import fail from '@/assets/sounds/error-10-206498.mp3';

const { playSound } = useGameSound(success);
const { playSound: playErrorSound } = useGameSound(fail);

const loader = useLoader();
const ballercade: BallercadeStore = useBallercade();
const errors = ref('');
const setupConnection = async () => {
  try {
    loader.showLoader();
    const {
      device,
      characteristic,
    }: { device: BluetoothDevice; characteristic: BluetoothRemoteGATTCharacteristic } =
      await useBluetooth(ballercade.serviceUuid, ballercade.characteristicUuid);
    ballercade.setCharacteristic(characteristic);
    ballercade.setDevice(device);

    // on disconnect, return to this page
    device.addEventListener('gattserverdisconnected', () => {
      router.push({ path: '/', query: { error: 'disconnected' } });
      ballercade.setCharacteristic(null);
      ballercade.setDevice(null);
      ballercade.disconnect();
    });

    loader.hideLoader();
    playSound();
    router.push('/menu');
  } catch (e: unknown) {
    loader.hideLoader();
    errors.value += `\n${e}`;
  }
};

// get query param details
const route = useRoute();
if (route.query.error === 'disconnected') {
  errors.value += '\nYou have been disconnected';
  playErrorSound();
  useRouter().push({ query: {} });
}

if (route.query.serviceUuid && route.query.characteristicUuid) {
  ballercade.serviceUuid = route.query.serviceUuid.toString();
  ballercade.characteristicUuid = route.query.characteristicUuid.toString();
  useRouter().push({ query: {} });
}
</script>

<template>
  <main v-if="!ballercade.characteristic" class="flex items-center justify-center flex-col gap-6">
    <h1 class="text-6xl">BALLE<span class="text-red-600">R</span>CADE</h1>

    <div class="flex justify-center flex-col gap-4 w-full md:w-1/2">
      <form class="grid grid-cols-2 gap-y-5">
        <label for="service-name">Service UUID</label>
        <input type="text" name="service-name" v-model="ballercade.serviceUuid" />

        <label for="service-name">Charac. UUID</label>
        <input type="text" name="service-name" v-model="ballercade.characteristicUuid" />
      </form>
      <BallercadeButton @click="setupConnection">Connect</BallercadeButton>
    </div>
  </main>

  <main v-else class="flex items-center justify-center flex-col gap-6 text-center">
    <h1 class="text-6xl">You are still connected!</h1>
    <h2>
      Click <RouterLink class="underline text-blue-400" to="/menu">here</RouterLink> to go back to
      game mode select
    </h2>
    <h2>Exit the page or refresh to disconnect.</h2>
  </main>

  <pre class="w-full whitespace-pre-wrap text-center"> {{ errors }}</pre>
</template>
