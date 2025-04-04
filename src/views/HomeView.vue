<script setup lang="ts">
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import { useBluetooth } from '@/composable/bluetooth';
import router from '@/router';
import { ref } from 'vue';
import { useLoader } from '@/composable/loader';
import { useGameSound } from '@/composable/game-sound';
import { useRoute, useRouter } from 'vue-router';

import { BallercadeButton, BallercadeInput, BallercadeSelect } from '@/components';
import { storeToRefs } from 'pinia';

const { playSound } = useGameSound();

const loader = useLoader();
const ballercade: BallercadeStore = useBallercade();
const errors = ref('');

function stringToUint8Array(str: string) {
  const encoder = new TextEncoder(); // This encoder will convert the string to UTF-8
  return encoder.encode(str); // This returns a Uint8Array
}

const setupConnection = async () => {
  try {
    loader.showLoader();

    // this creates the connection
    const { device, characteristic, service } = await useBluetooth(
      ballercade.serviceUuid,
      ballercade.characteristicUuid,
    );

    // validate pin code
    const pinCharacteristic = await service.getCharacteristic(ballercade.pinUuid);
    const devicePinArr = stringToUint8Array(ballercade.devicePin.toUpperCase());
    await pinCharacteristic.writeValue(devicePinArr);
    console.log('wat');
    const successVal = await pinCharacteristic.readValue();
    console.log('init value is ' + successVal.getUint8(0));
    if (!successVal.getUint8(0)) {
      errors.value += '\nInvalid pin! Cannot connect.';
      device?.gatt?.disconnect();
      return;
    }

    ballercade.setCharacteristic(characteristic);
    ballercade.setDevice(device);

    // on disconnect, return to this page
    device.addEventListener('gattserverdisconnected', () => {
      errors.value += '\nYou have been disconnected from the server.';
      router.push({ path: '/', query: { error: 'disconnected' } });
      ballercade.setCharacteristic(null);
      ballercade.setDevice(null);
      ballercade.disconnect();
    });

    playSound('success');
    router.push('/menu');
  } catch (e: unknown) {
    loader.hideLoader();
    errors.value += `\n${e}`;
  } finally {
    loader.hideLoader();
  }
};

// get query param details
const route = useRoute();
if (route.query.error === 'disconnected') {
  errors.value += '\nYou have been disconnected';
  playSound('fail');
  useRouter().push({ query: {} });
}

// device
const { deviceVersion } = storeToRefs(ballercade);
</script>

<template>
  <main v-if="!ballercade.characteristic" class="flex items-center justify-center flex-col gap-6">
    <h1 class="text-6xl">BALLE<span class="text-red-600">R</span>CADE</h1>

    <div class="flex justify-center flex-col gap-4 w-full md:w-1/2">
      <form class="grid grid-cols-2 gap-y-5">
        <BallercadeSelect id="deviceVersion" name="deviceVerSelect" v-model="deviceVersion">
          <template #label>Device Version</template>
          <option value="1">v1</option>
        </BallercadeSelect>

        <BallercadeInput
          id="serviceUuid"
          name="serviceUuid"
          type="text"
          v-model="ballercade.serviceUuid"
          disabled
        >
          <template #label>Service UUID</template>
        </BallercadeInput>

        <BallercadeInput
          id="characUuid"
          name="characteristicUuid"
          type="text"
          v-model="ballercade.characteristicUuid"
          disabled
        >
          <template #label>Charac. UUID</template>
        </BallercadeInput>

        <BallercadeInput
          id="devicePin"
          name="devicePin"
          type="text"
          v-model="ballercade.devicePin"
          maxlength="8"
          class="uppercase"
          required
        >
          <template #label>Device Pin</template>
        </BallercadeInput>
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

  <pre class="pt-4 w-full whitespace-pre-wrap text-center"> {{ errors }}</pre>
</template>
