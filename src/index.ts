import screenshotDesktop from "screenshot-desktop";
import sound from "sound-play";
import countFaces from "./countFaces.js";
import FaceDetector from "./faceDetector.js";
import onFacesDetectedFactory from "./onFacesDetectedFactory.js";
import greetingFactory from "./greetingFactory.js";
import decisionFactory from "./decisionFactory.js";
import speakFactory from "./speakFactory.js";
import playInitialGreetingFactory from "./playInitialGreetingFactory.js";

import {
  logPath,
  voice,
  ttsModel,
  intervalMs,
  coolDownMs,
  maxDimension,
  minDimensionPercentage,
  prompt,
  model,
  reasoningEffort,
  apiKey,
  decisionModel,
  decisionQuestion,
  decisionThreshold,
  initialGreetingsDir,
} from "./settings.js";

const playSound = async (filePath: string) => {
  await sound.play(filePath, 1);
};
const playInitialGreeting = playInitialGreetingFactory(
  initialGreetingsDir,
  playSound,
);
const getGreeting = greetingFactory({ prompt, model, reasoningEffort, apiKey });
const decide = decisionFactory({
  apiKey,
  model: decisionModel,
  question: decisionQuestion,
  threshold: decisionThreshold,
});
const generateVoice = speakFactory({ apiKey, voice, model: ttsModel });
const onFacesDetected = onFacesDetectedFactory({
  decide,
  playInitialGreeting,
  getGreeting,
  generateVoice,
  playSound,
  logPath,
});

new FaceDetector({
  countFaces,
  getImage: screenshotDesktop,
  coolDownMs,
  intervalMs,
  maxDimension,
  minDimensionPercentage,
  onFacesDetected,
}).start();

console.log("Face detection started...");
