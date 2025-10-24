import { join as pathJoin } from "path";
const minIntervalMs = 100;
const minCoolDownMs = 0;
const minMaxDimension = 160;
const minMinDimensionPercentage = 0;

export const intervalMs = Math.max(
  process.env.INTERVAL_MS && +process.env.INTERVAL_MS
    ? parseInt(process.env.INTERVAL_MS)
    : minIntervalMs,
  minIntervalMs
);

export const coolDownMs = Math.max(
  process.env.COOL_DOWN_MS && +process.env.COOL_DOWN_MS
    ? parseInt(process.env.COOL_DOWN_MS)
    : minCoolDownMs,
  minCoolDownMs
);

export const maxDimension = Math.max(
  process.env.MAX_DIMENSION && +process.env.MAX_DIMENSION
    ? parseInt(process.env.MAX_DIMENSION)
    : minMaxDimension,
  minMaxDimension
);

export const minDimensionPercentage = Math.min(
  Math.max(
    process.env.MIN_DIMENSION_PERCENTAGE &&
      +process.env.MIN_DIMENSION_PERCENTAGE
      ? +process.env.MIN_DIMENSION_PERCENTAGE
      : minMinDimensionPercentage,
    minMinDimensionPercentage
  ),
  1
);

export const logPath = (process.env.LOG_PATH || "").trim();

export const voice = process.env.TTS_VOICE;

export const prompt =
  (process.env.OPENAI_PROMPT || "").trim() ||
  `
Given an image containing approximately {{numFaces}} person(s) (possibly dressed up for Halloween), respond with a brief, fun, and creative Halloween-themed greeting.

Incorporate the costume(s) and people from the image in your response whenever possible (for example, "love the batman costume!", "that mask is so scary and awesome!", "what a pretty princess dress!", etc.).

Keep it under 50 words and appropriate for all ages.

Do not use emojis or markdown formatting, just return plain text.

Do not include any meta-commentary, just the greeting.

Refer to the person(s) in the image only with neutral group terms such as "you," "you all," or "you guys." Do not use any themed or possessive phrases like "my little ghosts" or "you little goblins."

Include a gentle reminder to please only take one piece/bag of candy per person.
`.trim();

export const model = (process.env.OPENAI_MODEL || "").trim() || "gpt-4o-mini";

export const apiKey = (process.env.OPENAI_API_KEY || "").trim();

export const initialGreetingsDir =
  (process.env.INITIAL_GREETINGS_DIR || "").trim() ||
  pathJoin(process.cwd(), "initialGreetings");
