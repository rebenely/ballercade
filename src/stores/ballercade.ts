import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { computed, ref, type Ref } from 'vue';

interface UuidDetails {
  pinUuid: string;
  serviceUuid: string;
  characteristicUuid: string;
  disconnectUuid: string;
  settingsUuid: string;
}

const UUIDS: Record<number, UuidDetails> = {
  1: {
    pinUuid: '320603c0-dafc-449b-9059-e83de833d44e',
    serviceUuid: '7c59fbb1-7425-49a1-82f8-9f529976b600',
    characteristicUuid: 'c9a6a44d-d4ee-4106-be44-6fe7b0ca71b8',
    disconnectUuid: 'fcb9409e-f2c3-4593-ac4c-03bde43c56d9',
    settingsUuid: 'a7858414-c15f-43b9-94b3-0a8d86ff3835',
  },
};

export const useBallercade = defineStore('ballercade', () => {
  const deviceVersion = useStorage('deviceVersion', 1);
  const devicePin = useStorage('devicePin', '');

  const pinUuid = computed(() => UUIDS[deviceVersion.value].pinUuid);
  const serviceUuid = computed(() => UUIDS[deviceVersion.value].serviceUuid);
  const characteristicUuid = computed(() => UUIDS[deviceVersion.value].characteristicUuid);

  // main sensor characteristic
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

  const disconnectUuid = computed(() => UUIDS[deviceVersion.value].disconnectUuid);
  const disconnectCharacteristic: Ref<BluetoothRemoteGATTCharacteristic | null> = ref(null);
  function setDisconnectCharacteristic(
    newCharacteristic: BluetoothRemoteGATTCharacteristic | null,
  ) {
    disconnectCharacteristic.value = newCharacteristic;
  }

  const settingsUuid = computed(() => UUIDS[deviceVersion.value].settingsUuid);
  const settingsCharacteristic: Ref<BluetoothRemoteGATTCharacteristic | null> = ref(null);
  function setSettingsCharacteristic(newCharacteristic: BluetoothRemoteGATTCharacteristic | null) {
    settingsCharacteristic.value = newCharacteristic;
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
    // device.value?.gatt?.disconnect(); doesnt always work :(
    if (device.value?.gatt?.connected) {
      disconnectCharacteristic.value?.writeValue(Uint8Array.of(1)); // this forces server to restart
      setDevice(null);
      setCharacteristic(null);
      setDisconnectCharacteristic(null);
    }
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
    device,
    setDevice,
    serviceUuid,

    // main sensor characteristic
    characteristicUuid,
    characteristic,
    setCharacteristic,
    setOnCharacteristicUpdate,

    // for authentication
    pinUuid,
    devicePin,

    // disconnect
    disconnectUuid,
    disconnect,
    setDisconnectCharacteristic,

    // settings
    settingsUuid,
    setSettingsCharacteristic,
    settingsCharacteristic,

    // game logic
    freePlayScore,
    updateFreePlayScore,
    classicScore,
    updateClassicScore,
  };
});

export type BallercadeStore = ReturnType<typeof useBallercade>;
