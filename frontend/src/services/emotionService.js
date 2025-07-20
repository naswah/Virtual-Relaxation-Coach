const EMOTIONS = ["happy", "sad", "angry", "neutral", "surprise"];

export async function detectEmotion(imageFile) {

  const random = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
  return random;
}