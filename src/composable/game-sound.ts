export function useGameSound(file: string): {
  audio: HTMLAudioElement;
  playSound: () => void;
} {
  const audio = new Audio(file);

  const playSound = () => {
    audio.currentTime = 0;
    audio.play();
  };

  return { audio, playSound };
}
