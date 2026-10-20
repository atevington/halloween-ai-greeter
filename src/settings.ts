import { join as pathJoin } from "path";
const minIntervalMs = 100;
const defaultIntervalMs = 1000;
const minCoolDownMs = 0;
const defaultCoolDownMs = 60000;
const minMaxDimension = 160;
const defaultMaxDimension = 800;
const minMinDimensionPercentage = 0;
const defaultMinDimensionPercentage = 0.05;

export const intervalMs = Math.max(
  process.env.INTERVAL_MS && +process.env.INTERVAL_MS
    ? parseInt(process.env.INTERVAL_MS)
    : defaultIntervalMs,
  minIntervalMs,
);

export const coolDownMs = Math.max(
  process.env.COOL_DOWN_MS && +process.env.COOL_DOWN_MS
    ? parseInt(process.env.COOL_DOWN_MS)
    : defaultCoolDownMs,
  minCoolDownMs,
);

export const maxDimension = Math.max(
  process.env.MAX_DIMENSION && +process.env.MAX_DIMENSION
    ? parseInt(process.env.MAX_DIMENSION)
    : defaultMaxDimension,
  minMaxDimension,
);

export const minDimensionPercentage = Math.min(
  Math.max(
    process.env.MIN_DIMENSION_PERCENTAGE &&
      +process.env.MIN_DIMENSION_PERCENTAGE
      ? +process.env.MIN_DIMENSION_PERCENTAGE
      : defaultMinDimensionPercentage,
    minMinDimensionPercentage,
  ),
  1,
);

const logOptOut = ["0", "false", "no", "off"].includes(
  (process.env.LOG || "").trim().toLowerCase(),
);

export const logPath = logOptOut ? "" : pathJoin(process.cwd(), "logs");

export const voice = (process.env.TTS_VOICE || "").trim() || "coral";

export const ttsModel = (process.env.TTS_MODEL || "").trim() || "tts-1";

export const prompt =
  (process.env.OPENAI_PROMPT || "").trim() ||
  `
Given an image containing approximately {{numFaces}} person(s) (possibly dressed up for Halloween), respond with a brief, fun, and creative Halloween-themed greeting.

Incorporate the costumes, accessories, and people from the image in your response whenever possible (for example, "love the batman costume!", "that mask is so scary and awesome!", "what a pretty princess dress!", etc.).

Keep it under 50 words and appropriate for all ages.

Do not use emojis or markdown formatting, just return plain text.

Do not include any meta-commentary, just the greeting.

Refer to the person(s) in the image only with neutral group terms such as "you," "you all," or "you guys." Do not use any themed or possessive phrases like "my little ghosts" or "you little goblins."
`.trim();

export const model = (process.env.OPENAI_MODEL || "").trim() || "gpt-6-luna";

const reasoningEfforts = [
  "none",
  "minimal",
  "low",
  "medium",
  "high",
  "xhigh",
  "max",
] as const;

export type ReasoningEffort = (typeof reasoningEfforts)[number];

export const reasoningEffort: ReasoningEffort = reasoningEfforts.includes(
  (process.env.OPENAI_REASONING || "").trim() as ReasoningEffort,
)
  ? ((process.env.OPENAI_REASONING || "").trim() as ReasoningEffort)
  : "none";

export const decisionModel =
  (process.env.DECISION_MODEL || "").trim() || "gpt-6-luna";

export const decisionQuestion =
  (process.env.DECISION_QUESTION || "").trim() ||
  "Are there people in active view who appear to be trick-or-treating, either approaching or waiting for a treat, rather than walking past or only in the background?";

export const decisionThreshold = Math.min(
  Math.max(
    process.env.DECISION_THRESHOLD && +process.env.DECISION_THRESHOLD
      ? +process.env.DECISION_THRESHOLD
      : 0.6,
    0,
  ),
  1,
);

export const apiKey = (process.env.OPENAI_API_KEY || "").trim();

export const initialGreetingsDir = pathJoin(process.cwd(), "initialGreetings");
