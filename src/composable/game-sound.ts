import success from '@/assets/sounds/arcade-ui-26-229495.mp3';
import fail from '@/assets/sounds/error-10-206498.mp3';
import score from '@/assets/sounds/arcade-ui-4-229502.mp3';
import countdown from '@/assets/sounds/countdown-sound-effect-8-bit-151797.mp3';
import win from '@/assets/sounds/nba-charge.mp3';
import button from '@/assets/sounds/arcade-ui-7-229506.mp3';
import type { SoundTypes } from '@/types/SoundTypes';

const SOUND_MAP = {
  success: new Audio(success),
  fail: new Audio(fail),
  score: new Audio(score),
  countdown: new Audio(countdown),
  win: new Audio(win),
  button: new Audio(button),
};

export function useGameSound(): {
  playSound: (sound: SoundTypes) => void;
} {
  const playSound = (sound: SoundTypes) => {
    const audio = SOUND_MAP[sound];
    audio.currentTime = 0;
    audio.play();
  };

  return { playSound };
}
