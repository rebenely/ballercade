<script setup lang="ts">
import { useLoader } from '@/composable/loader';

const { loaderVisible } = useLoader();
</script>

<template>
  <div v-if="loaderVisible" class="w-full h-full fixed bg-black/50 top-0 left-0">
    <div class="fixed left-1/2 top-1/3">
      <div class="loader">
        <div class="segment"></div>
        <div class="segment"></div>
        <div class="segment"></div>
        <div class="segment"></div>
        <div class="segment"></div>
        <div class="segment"></div>
        <div class="segment"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loader {
  transform: translateX(-60px);
}

.segment {
  position: absolute;
  width: 50px;
  height: 10px;
  background: red;
  clip-path: polygon(10% 0%, 90% 0%, 100% 20%, 90% 100%, 10% 100%, 0% 20%);
  opacity: 0.1;
}
.segment:nth-child(1) {
  transform: translate(35px, 0px);
} /* A */
.segment:nth-child(2) {
  transform: translate(65px, 30px) rotate(90deg);
} /* B */
.segment:nth-child(3) {
  transform: translate(65px, 100px) rotate(90deg);
} /* C */
.segment:nth-child(4) {
  transform: translate(35px, 130px);
} /* D */
.segment:nth-child(5) {
  transform: translate(5px, 100px) rotate(90deg);
} /* E */
.segment:nth-child(6) {
  transform: translate(5px, 30px) rotate(90deg);
} /* F */
.segment:nth-child(7) {
  transform: translate(35px, 65px);
} /* G */

@keyframes lightup {
  0%,
  100% {
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
}
.segment:nth-child(1) {
  animation: lightup 1.2s infinite 0s;
}
.segment:nth-child(2) {
  animation: lightup 1.2s infinite 0.2s;
}
.segment:nth-child(3) {
  animation: lightup 1.2s infinite 0.4s;
}
.segment:nth-child(4) {
  animation: lightup 1.2s infinite 0.6s;
}
.segment:nth-child(5) {
  animation: lightup 1.2s infinite 0.8s;
}
.segment:nth-child(6) {
  animation: lightup 1.2s infinite 1s;
}
</style>
