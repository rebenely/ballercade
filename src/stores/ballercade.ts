import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { ref, type Ref } from 'vue';

export const useBallercade = defineStore('ballercade', () => {
  const serviceUuid = useStorage('serviceUuid', '');
  const characteristicUuid = useStorage('characteristicUuid', '');
  const characteristic: Ref<BluetoothRemoteGATTCharacteristic | null> = ref(null);
  let onCharacteristicUpdate: ((event: Event) => void) | null = null;

  function setCharacteristic(newCharacteristic: BluetoothRemoteGATTCharacteristic) {
    characteristic.value = newCharacteristic;

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

  return {
    serviceUuid,
    characteristicUuid,
    characteristic,
    setCharacteristic,
    setOnCharacteristicUpdate,
  };
});

export type BallercadeStore = ReturnType<typeof useBallercade>;
