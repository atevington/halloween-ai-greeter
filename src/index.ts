import "dotenv/config";

import screenshotDesktop from "screenshot-desktop";
import countFaces from "./countFaces.js";
import FaceDetector from "./faceDetector.js";
import onFacesDetectedFactory from "./onFacesDetectedFactory.js";
import greetingFactory from "./greetingFactory.js";
import speakFactory from "./speakFactory.js";

import {
  logPath,
  voice,
  intervalMs,
  coolDownMs,
  maxDimension,
  minDimensionPercentage,
  prompt,
  model,
  apiKey,
} from "./settings.js";

const getGreeting = greetingFactory({
  prompt,
  model,
  apiKey,
});

const speak = speakFactory(voice);

const onFacesDetected = onFacesDetectedFactory({
  getGreeting,
  speak,
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
