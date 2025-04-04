import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref, type Ref } from 'vue';

export const useBallercade = defineStore('ballercade', () => {
  const deviceVersion = useStorage('deviceVersion', 1);
  const devicePin = useStorage('devicePin', 0);
  const serviceUuid = useStorage('serviceUuid', '');
  const characteristicUuid = useStorage('characteristicUuid', '');
  const characteristic: Ref<BluetoothRemoteGATTCharacteristic | null> = ref(null);
  let onCharacteristicUpdate: ((event: Event) => void) | null = null;

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

    // game logic
    freePlayScore,
    updateFreePlayScore,
    classicScore,
    updateClassicScore,
  };
});

export type BallercadeStore = ReturnType<typeof useBallercade>;
