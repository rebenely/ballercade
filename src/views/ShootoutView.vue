<script setup lang="ts">
import { ArcadeText, BallercadeButton } from '@/components';
import { useGameSound } from '@/composable/game-sound';
import { useGameState } from '@/composable/game-state';
import { useBallercade, type BallercadeStore } from '@/stores/ballercade';
import type { GameState } from '@/types/GameStates';
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';

const { playSound } = useGameSound();

type PlayerScore = {
  [key: number]: number;
};
const currentRoundScore = reactive<PlayerScore>({});
const playerScores = reactive<PlayerScore>({});
const rankedScores = computed(() => {
  return Object.entries(playerScores)
    .map(([player, score]) => ({ id: Number(player), score }))
    .sort((a, b) => b.score - a.score);
});

const ballercade: BallercadeStore = useBallercade();
onMounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {
    if (gameState.value === 'ongoing') {
      currentRoundScore[activePlayer.value]++;
      playSound('score');
    }
  });
});

onUnmounted(() => {
  ballercade.setOnCharacteristicUpdate(() => {});
});

const gameState = ref<GameState>('idle');

const playerCount = ref(1);
const roundCount = ref(2);

const activePlayer = ref(0);
const activeRound = ref(0);

// game timers
const {
  // pre game
  pregameStart,

  // state aware timers
  remainingTimer,
} = useGameState(gameState, 60, {
  onComplete() {
    showStartBtn.value = false;
    gameState.value = 'pregame';
    showNextBtn.value = true;

    for (let i = 0; i <= playerCount.value; i++) {
      playerScores[i] += currentRoundScore[i];
    }
    return true;
  },
});

function initializeGame() {
  gameState.value = 'pregame';
  for (let i = 0; i <= playerCount.value; i++) {
    playerScores[i] = 0;
    currentRoundScore[i] = 0;
  }
}
const showStartBtn = ref(true);
function startPlay() {
  pregameStart();
  showStartBtn.value = false;
}

const showNextBtn = ref(false);
function nextPlayer() {
  activePlayer.value++;
  if (activePlayer.value > playerCount.value) {
    // increase round
    activeRound.value++;
    activePlayer.value = 0;

    // remove round scores
    for (let i = 0; i <= playerCount.value; i++) {
      currentRoundScore[i] = 0;
    }
  }
  showNextBtn.value = false;
  showStartBtn.value = true;

  // set to win screen
  if (activeRound.value >= roundCount.value) {
    gameState.value = 'win';
  }
}
</script>
<template>
  <main v-if="gameState == 'idle'" class="flex justify-center flex-col items-center gap-8">
    <h1 class="text-2xl">Select Players</h1>
    <div class="flex justify-around lg:justify-evenly w-full">
      <BallercadeButton
        class="border-0"
        v-for="index in 4"
        :key="index"
        :class="{ 'bg-red-300/10': index === playerCount }"
        @click="playerCount = index"
      >
        <ArcadeText class="text-4xl">{{ index + 1 }}</ArcadeText>
      </BallercadeButton>
    </div>

    <h1 class="text-2xl">Select Rounds</h1>
    <div class="flex justify-around lg:justify-evenly w-full">
      <BallercadeButton
        class="border-0"
        v-for="index in 3"
        :key="index"
        :class="{ 'bg-red-300/10': index === roundCount }"
        @click="roundCount = index"
      >
        <ArcadeText class="text-4xl">{{ index }}</ArcadeText>
      </BallercadeButton>
    </div>

    <BallercadeButton class="w-full" @click="initializeGame">Start</BallercadeButton>
  </main>

  <main
    v-if="gameState == 'pregame' || gameState == 'ongoing'"
    class="flex justify-center flex-col items-center gap-8"
  >
    <h1 class="text-2xl">
      Player {{ activePlayer + 1 }}, Round: {{ activeRound + 1 }} / {{ roundCount }}
    </h1>
    <div class="flex gap-2 lg:flex-row flex-col">
      <h1>Time</h1>
      <ArcadeText class="text-9xl">
        {{ String(remainingTimer.value).padStart(2, '0') }}
      </ArcadeText>
    </div>
    <div class="flex gap-2 lg:flex-row flex-col">
      <h1>Score</h1>
      <ArcadeText class="text-9xl">
        {{ String(currentRoundScore[activePlayer]).padStart(2, '0') }}
      </ArcadeText>
    </div>
    <BallercadeButton
      v-if="gameState == 'pregame' && showStartBtn"
      class="w-full"
      @click="startPlay"
    >
      Start
    </BallercadeButton>
    <BallercadeButton
      v-if="gameState == 'pregame' && showNextBtn"
      class="w-full"
      @click="nextPlayer"
    >
      Next
    </BallercadeButton>
  </main>

  <main v-if="gameState == 'win'" class="flex justify-center flex-col items-center gap-8">
    <h1 class="text-2xl">Ranking</h1>
    <div class="flex gap-2" v-for="player in rankedScores" :key="player.id">
      <h1>Player {{ player.id + 1 }}</h1>
      <ArcadeText class="text-9xl">
        {{ String(player.score || '0').padStart(2, '0') }}
      </ArcadeText>
    </div>
    <BallercadeButton class="w-full" btn-type="a" to="/menu"> Menu </BallercadeButton>
  </main>
</template>
