export function useGameSound(file: string): {
  audio: HTMLAudioElement;
  playSound: () => void;
} {
  const audio = new Audio(`/sounds/${file}`);

  const playSound = () => {
    audio.currentTime = 0; // Restart sound from beginning
    audio.play();
  };

  return { audio, playSound };
}
