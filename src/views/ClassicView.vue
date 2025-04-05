<script setup lang="ts">
import { useGameSound } from '@/composable/game-sound';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useAutoWakeLock } from '@/composable/wake-lock';
import { ArcadeText, BallercadeButton } from '@/components';
import { type GameState } from '@/types/GameStates';
import { useGameState } from '@/composable/game-state';

useAutoWakeLock();

const { playSound } = useGameSound();

const gameScore = ref(0);

const ballercade: BallercadeStore = useBallercade();
onMounted(() => {
  gameScore.value = 0;
  ballercade.setOnCharacteristicUpdate(() => {
    if (gameState.value === 'ongoing') {
      gameScore.value++;
      playSound('score');
    }
  });
});

onUnmounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {});
});

const round = ref(0);
const target = computed(() => round.value * 10 + 15);
const gameState = ref<GameState>('idle');

const resetState = () => {
  gameScore.value = 0;
  round.value = 0;
  gameState.value = 'idle';
};
resetState();

const disablePause = ref(true);

// game timers
const countdownSeconds = 60;
const {
  // pre game
  pregameStart,

  // state aware timers
  remainingTimer,
  pauseTimer,
  resumeTimer,
  timerPaused,
} = useGameState(gameState, countdownSeconds, {
  onComplete() {
    const win = gameScore.value >= target.value;
    if (win) {
      round.value += 1;
      startCountdown(false);
    }
    return win;
  },
});

const startCountdown = (shouldReset = true) => {
  if (shouldReset) {
    resetState();
  }
  disablePause.value = false;
  pregameStart();
};
</script>

<template>
  <main
    class="flex relative justify-around w-full gap-4 lg:gap-12 flex-col md:flex-row items-center"
  >
    <div class="flex gap-2 lg:flex-row flex-col">
      <h1>Time</h1>
      <ArcadeText class="text-9xl">
        {{ String(remainingTimer.value).padStart(2, '0') }}
      </ArcadeText>
    </div>
    <div class="flex gap-2 lg:flex-row flex-col">
      <h1>Score</h1>
      <ArcadeText class="text-9xl">
        {{ String(gameScore).padStart(2, '0') }}
      </ArcadeText>
    </div>
    <div class="flex gap-2 lg:flex-row flex-col">
      <h1>Target (R{{ round + 1 }})</h1>
      <ArcadeText class="text-9xl">
        {{ String(target).padStart(2, '0') }}
      </ArcadeText>
    </div>
    <div class="fixed right-2 bottom-2 flex md:w-1/4 justify-center gap-2 flex-wrap">
      <BallercadeButton
        v-if="gameState == 'idle' || gameState === 'fail'"
        @click="() => startCountdown()"
      >
        <h2 v-if="gameState === 'idle'" class="text-xl">Start</h2>
        <h2 v-if="gameState === 'fail'" class="text-xl">Restart</h2>
      </BallercadeButton>
      <BallercadeButton
        v-if="timerPaused"
        v-show="gameState != 'fail'"
        @click="() => resumeTimer()"
      >
        <h2 class="text-xl">Resume</h2>
      </BallercadeButton>
      <BallercadeButton
        v-else
        v-show="gameState != 'fail'"
        @click="() => pauseTimer()"
        :disabled="disablePause"
      >
        <h2 class="text-xl">Pause</h2>
      </BallercadeButton>
      <BallercadeButton btn-type="a" to="menu">
        <h2 class="text-xl">Exit</h2>
      </BallercadeButton>
    </div>
  </main>
</template>
