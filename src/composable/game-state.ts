import { useGameSound } from '@/composable/game-sound';
import type { GameState } from '@/types/GameStates';
import { useCountdown } from '@vueuse/core';
import { computed, ref, type Ref } from 'vue';

const { playSound } = useGameSound();

interface CountdownOptions {
  onComplete?: () => boolean;
  onTick?: () => void;
}

export function useGameState(
  gameState: Ref<GameState>,
  countdownSeconds: number,
  opts: CountdownOptions,
) {
  const defaultOpts = {
    onComplete: () => false,
    onTick: () => {},
    ...opts,
  };

  // pregame timer
  const pregameTimer = 3;
  const {
    remaining: pregameRemaining,
    start: pregameStart,
    pause: pregamePause,
    resume: pregameResume,
  } = useCountdown(pregameTimer, {
    onComplete() {
      gameState.value = 'ongoing';
      lastState.value = 'ongoing';
      timerPaused.value = false;
      start(countdownSeconds);
    },
    onTick() {
      // play last three seconds
      if (pregameRemaining.value === 3) {
        playSound('countdown');
      }
    },
  });

  // sets gamestate to idle
  const lastState = ref<GameState>('ongoing');
  function pauseState() {
    lastState.value = gameState.value;
    gameState.value = 'paused';
  }

  // reverts gamestate
  function resumeState() {
    gameState.value = lastState.value;
  }

  // main timer
  const { remaining, start, pause, resume } = useCountdown(countdownSeconds, {
    onComplete() {
      if (defaultOpts.onComplete()) {
        playSound('win');
      } else {
        playSound('fail');
        gameState.value = 'fail';
      }
    },
    onTick() {
      // play last three seconds
      if (remaining.value === 3) {
        playSound('countdown');
      }
      defaultOpts.onTick();
    },
  });

  const remainingTimer = computed(() => {
    if (gameState.value === 'pregame' || lastState.value === 'pregame') {
      return pregameRemaining;
    }
    return remaining;
  });

  const timerPaused = ref(false);
  function pauseTimer() {
    timerPaused.value = true;
    if (gameState.value === 'pregame' || lastState.value === 'pregame') {
      pregamePause();
      pauseState();
      return;
    }

    pause();
    pauseState();
  }

  function resumeTimer() {
    timerPaused.value = false;
    if (gameState.value === 'pregame' || lastState.value === 'pregame') {
      pregameResume();
      resumeState();
      return;
    }

    resume();
    resumeState();
  }
  return {
    gameState,

    // pre game
    pregameRemaining,
    pregameStart: () => {
      timerPaused.value = false;
      gameState.value = 'pregame';
      pregameStart();
    },
    pregamePause: () => {
      pauseState();
      pregamePause();
    },
    pregameResume: () => {
      resumeState();
      pregameResume();
    },

    // actual game
    remaining,
    start: () => {
      timerPaused.value = false;
      start();
    },
    pause: () => {
      pauseState();
      pause();
    },
    resume: () => {
      resumeState();
      resume();
    },

    // gameState aware values
    remainingTimer,
    pauseTimer,
    resumeTimer,
    timerPaused,
  };
}
