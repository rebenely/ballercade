import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { computed, ref, type Ref } from 'vue';

interface UuidDetails {
  pinUuid: string;
  serviceUuid: string;
  characteristicUuid: string;
}

const UUIDS: Record<number, UuidDetails> = {
  1: {
    pinUuid: '320603c0-dafc-449b-9059-e83de833d44e',
    serviceUuid: '7c59fbb1-7425-49a1-82f8-9f529976b600',
    characteristicUuid: 'c9a6a44d-d4ee-4106-be44-6fe7b0ca71b8',
  },
};

export const useBallercade = defineStore('ballercade', () => {
  const deviceVersion = useStorage('deviceVersion', 1);
  const devicePin = useStorage('devicePin', '');

  const pinUuid = computed(() => UUIDS[deviceVersion.value].pinUuid);
  const serviceUuid = computed(() => UUIDS[deviceVersion.value].serviceUuid);
  const characteristicUuid = computed(() => UUIDS[deviceVersion.value].characteristicUuid);

  const characteristic: Ref<BluetoothRemoteGATTCharacteristic | null> = ref(null);
  function setCharacteristic(newCharacteristic: BluetoothRemoteGATTCharacteristic | null) {
    characteristic.value = newCharacteristic;
    if (characteristic.value == null) {
      return;
    }

    // Attach event listener
    characteristic.value.addEventListener('characteristicvaluechanged', (event) => {
      if (onCharacteristicUpdate) {
        onCharacteristicUpdate(event);
      }
    });
  }

  let onCharacteristicUpdate: ((event: Event) => void) | null = null;
  function setOnCharacteristicUpdate(callback: (event: Event) => void) {
    onCharacteristicUpdate = callback;
  }

  const device: Ref<BluetoothDevice | null> = ref(null);
  function setDevice(reqDevice: BluetoothDevice | null) {
    device.value = reqDevice;
  }
  function disconnect() {
    device.value?.gatt?.disconnect();
  }

  // game logic
  const freePlayScore = useStorage('freePlayScore', 0);
  const updateFreePlayScore = () => {
    freePlayScore.value++;
  };

  const classicScore = useStorage('classicScore', 0);
  const updateClassicScore = () => {
    classicScore.value++;
  };

  return {
    // device
    deviceVersion,
    devicePin,
    serviceUuid,
    characteristicUuid,
    characteristic,
    setCharacteristic,
    setOnCharacteristicUpdate,
    device,
    setDevice,
    disconnect,
    pinUuid,

    // game logic
    freePlayScore,
    updateFreePlayScore,
    classicScore,
    updateClassicScore,
  };
});

export type BallercadeStore = ReturnType<typeof useBallercade>;
