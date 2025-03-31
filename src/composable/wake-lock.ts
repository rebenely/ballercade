// useAutoWakeLock.ts
import { onMounted, onUnmounted } from 'vue';
import { useWakeLock } from '@vueuse/core';

export function useAutoWakeLock() {
  const { isSupported, request, release } = useWakeLock();

  onMounted(() => {
    if (isSupported.value) {
      request('screen');
    }
  });

  onUnmounted(() => {
    if (isSupported.value) {
      release();
    }
  });
}
