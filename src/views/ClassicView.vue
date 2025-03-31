<script setup lang="ts">
import { useGameSound } from '@/composable/game-sound';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useAutoWakeLock } from '@/composable/wake-lock';
import { useCountdown } from '@vueuse/core';
import ArcadeText from '@/components/ArcadeText.vue';
import BallercadeButton from '@/components/BallercadeButton.vue';

import score from '@/assets/sounds/arcade-ui-4-229502.mp3';
import countdown from '@/assets/sounds/countdown-sound-effect-8-bit-151797.mp3';
import fail from '@/assets/sounds/cartoon-fail-trumpet-278822.mp3';
import win from '@/assets/sounds/nba-charge.mp3';

useAutoWakeLock();

const { playSound: playScoreSound } = useGameSound(score);
const { playSound: playCountdownSound } = useGameSound(countdown);
const { playSound: playFailSound } = useGameSound(fail);
const { playSound: playWinSound } = useGameSound(win);

const ballercade: BallercadeStore = useBallercade();
onMounted(() => {
  ballercade.classicScore = 0;
  ballercade.setOnCharacteristicUpdate(() => {
    if (gameState.value === 'ongoing') {
      ballercade.updateClassicScore();
      playScoreSound();
    }
  });
});

onUnmounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {});
});

const round = ref(0);
const target = computed(() => round.value * 10 + 15);
const gameState = ref('idle');

const resetState = () => {
  ballercade.classicScore = 0;
  round.value = 0;
  gameState.value = 'idle';
};
resetState();

// countdown timer
const countdownPaused = ref(false);
const disablePause = ref(true);
const countdownSeconds = 60;
const { remaining, start, pause, resume } = useCountdown(countdownSeconds, {
  onComplete() {
    if (ballercade.classicScore >= target.value) {
      playWinSound();
      round.value += 1;
      startCountdown(false);
    } else {
      // fail, set to idle but do not reset
      gameState.value = 'idle';
      playFailSound();
    }
  },
  onTick() {
    // play last three seconds
    if (remaining.value === 4) {
      disablePause.value = true;
    } else if (remaining.value === 3) {
      playCountdownSound();
    }
  },
});

const pregameCountdownSeconds = 10;
const {
  remaining: pregameRemaining,
  start: pregameStart,
  pause: pregamePause,
  resume: pregameResume,
} = useCountdown(pregameCountdownSeconds, {
  onComplete() {
    gameState.value = 'ongoing';
    disablePause.value = false;
    start(countdownSeconds);
  },
  onTick() {
    // play last three seconds
    if (pregameRemaining.value === 4) {
      disablePause.value = true;
    } else if (pregameRemaining.value === 3) {
      playCountdownSound();
    }
  },
});

const startCountdown = (shouldReset = true) => {
  if (shouldReset) {
    resetState();
  }
  gameState.value = 'pregame';
  disablePause.value = false;
  pregameStart();
};

const pauseTimer = () => {
  if (gameState.value === 'ongoing') {
    pause();
  } else {
    pregamePause();
  }
  countdownPaused.value = true;
};

const resumeCountdown = () => {
  if (gameState.value === 'ongoing') {
    resume();
  } else {
    pregameResume();
  }
  countdownPaused.value = false;
};
</script>

<template>
  <main
    class="flex relative justify-around w-full gap-4 lg:gap-12 flex-col md:flex-row items-center"
  >
    <div class="flex gap-2 lg:flex-row flex-col">
      <h1>Time</h1>
      <ArcadeText class="text-9xl">
        {{ String(gameState === 'ongoing' ? remaining : pregameRemaining).padStart(2, '0') }}
      </ArcadeText>
    </div>
    <div class="flex gap-2 lg:flex-row flex-col">
      <h1>Score</h1>
      <ArcadeText class="text-9xl">
        {{ String(ballercade.classicScore).padStart(2, '0') }}
      </ArcadeText>
    </div>
    <div class="flex gap-2 lg:flex-row flex-col">
      <h1>Target (R{{ round + 1 }})</h1>
      <ArcadeText class="text-9xl">
        {{ String(target).padStart(2, '0') }}
      </ArcadeText>
    </div>
    <div class="fixed right-2 bottom-2 flex md:w-1/4 justify-center gap-2 flex-wrap">
      <BallercadeButton v-if="gameState == 'idle'" @click="() => startCountdown()">
        <h2 class="text-xl">Start</h2>
      </BallercadeButton>
      <BallercadeButton v-if="countdownPaused" @click="() => resumeCountdown()">
        <h2 class="text-xl">Resume</h2>
      </BallercadeButton>
      <BallercadeButton v-else @click="() => pauseTimer()" :disabled="disablePause">
        <h2 class="text-xl">Pause</h2>
      </BallercadeButton>
      <BallercadeButton btn-type="a" to="menu">
        <h2 class="text-xl">Exit</h2>
      </BallercadeButton>
    </div>
  </main>
</template>
