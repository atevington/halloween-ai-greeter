# Halloween AI Greeter

A spooky face detection and greeting system for a porch or doorway. Put a camera feed maximized on the desktop, and the app screenshots that screen, decides whether the people in view are trick-or-treating, and speaks a Halloween greeting.

## Features

- **Real-time face detection** using OpenCV.js Haar frontal-face cascade
- **Screen capture** for continuous monitoring
- **AI-powered greeting generation** with OpenAI vision
- **Text-to-speech** for audio greetings using OpenAI, played from an mp3 file
- **Configurable detection settings** and timing
- **Logging system** for tracking interactions

## Setup

The app does not open a camera. It screenshots the whole desktop, so the picture on screen is the picture it sees.

1. Open your camera feed (doorbell, porch cam, or a phone pointed at the door) and maximize that window so it fills the screen.
2. Run `npm start`, then minimize the console. A visible console ends up in the screenshot.
3. Leave speakers on so people at the door can hear the intro sound and the greeting.

## How It Works

1. Takes a screenshot of the desktop on an interval, and once at startup. With the camera feed maximized, that screenshot is the camera view. Images larger than `MAX_DIMENSION` are resized so the longest side equals that value, then faces are detected with the OpenCV.js Haar cascade
2. When at least one face is found, asks the Decisions API the configured yes/no question and continues only if the probability is greater than `DECISION_THRESHOLD` (default `0.6`)
3. Plays a random mp3 from `initialGreetings` while generating a Halloween greeting from the image. That folder comes with Creative Commons ghost samples from [freesound.org](https://freesound.org), and any extra mp3 you add there is included
4. Speaks the greeting with OpenAI text-to-speech, writes that greeting to `logs` (unless `LOG=false`), then waits `COOL_DOWN_MS` before detecting again

## Installation

1. Install dependencies: `npm install`
2. Set up your environment variables (see below)
3. Run: `npm start` (runs TypeScript with `tsx` and loads `.env` via Node's `--env-file-if-exists`, which continues if that file is missing)

## Environment Variables

### Required

- **`OPENAI_API_KEY`** - Your OpenAI API key for accessing vision models
  - Get one at: https://platform.openai.com/api-keys
  - Example: `sk-proj-...`

### Optional

- **`INTERVAL_MS`** - How often to capture screenshots (milliseconds)
  - Default: `1000` (1 second)
  - Minimum: `100`
  - Note: Intervals won't overlap - the system waits for processing to complete before starting the next interval
  - Example: `1000` for 1 second intervals

- **`COOL_DOWN_MS`** - Delay after speaking a greeting before detecting again (milliseconds)
  - Default: `60000` (60 seconds)
  - Minimum: `0`
  - Example: `5000` for 5 second cooldown

- **`MAX_DIMENSION`** - Size to resize images to before face detection (pixels)
  - Default: `800`
  - Minimum: `160`
  - Images larger than this are resized so the largest dimension equals this value. Smaller images are left as they are
  - Example: `800` for higher quality face detection

- **`MIN_DIMENSION_PERCENTAGE`** - Minimum face size as a fraction of the largest image side (0-1)
  - Default: `0.05` (5% of the largest side)
  - Example: `0.035` ignores faces smaller than 3.5% of the largest side

- **`LOG`** - Set to `false` to skip saving greetings. The folder is always `logs` and is not configurable
  - Default: on
  - Opt out: `false`, `0`, `no`, or `off`

- **`TTS_VOICE`** - OpenAI text-to-speech voice
  - Default: `coral`
  - Options: `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`, `onyx`, `nova`, `sage`, `shimmer`, `verse`, `marin`, `cedar`

- **`TTS_MODEL`** - OpenAI text-to-speech model
  - Default: `tts-1`
  - Options: `tts-1`, `tts-1-hd`

- **`OPENAI_PROMPT`** - Custom prompt for greeting generation
  - Default: Built-in Halloween-themed prompt
  - Use `{{numFaces}}` placeholder for face count
  - Example: `"Say hello to the {{numFaces}} person(s) in a spooky way!"`

- **`OPENAI_MODEL`** - OpenAI model to use for greeting generation
  - Default: `gpt-6-luna`
  - Options: Any OpenAI vision-capable model

- **`OPENAI_REASONING`** - Reasoning effort for greeting generation
  - Default: `none`
  - Options: `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`

- **`DECISION_QUESTION`** - Yes/no question asked about each detected image before greeting
  - Default: `Are there people in active view who appear to be trick-or-treating, either approaching or waiting for a treat, rather than walking past or only in the background?`

- **`DECISION_THRESHOLD`** - Minimum Decisions API probability required before a greeting (0-1)
  - Default: `0.6` (60%)
  - A greeting is spoken only when the probability is greater than this value

- **`DECISION_MODEL`** - Model for the Decisions API
  - Default: `gpt-6-luna` (the only model that endpoint supports)

- **`INITIAL_GREETINGS_DIR`** - Folder of mp3 files played at random when a greeting starts
  - Default: `initialGreetings` in the project root
  - Pre-stocked with Creative Commons ghost samples from [freesound.org](https://freesound.org). Add your own `.mp3` files to that folder to include them in the random pick

## Example .env File

Create a `.env` file in the project root:

```env
# Required
OPENAI_API_KEY=sk-proj-your-api-key-here

# Optional - adjust these based on your needs
INTERVAL_MS=1000
COOL_DOWN_MS=60000
MAX_DIMENSION=800
MIN_DIMENSION_PERCENTAGE=0.05
# LOG=false
TTS_VOICE=coral
TTS_MODEL=tts-1
OPENAI_MODEL=gpt-6-luna
OPENAI_REASONING=none
DECISION_MODEL=gpt-6-luna
DECISION_THRESHOLD=0.6
DECISION_QUESTION=Are there people in active view who appear to be trick-or-treating, either approaching or waiting for a treat, rather than walking past or only in the background?
```

## Usage

Maximize the camera feed, run `npm start`, and minimize the console. When people in that feed look like trick-or-treaters, you'll hear an intro sound and then a Halloween greeting.

## Logs

Every spoken greeting is saved in the `logs` folder, which is committed to git. The files inside it are gitignored. Set `LOG=false` to opt out; the greeting is still spoken, and the mp3 is deleted after playback. Each greeting is two files with the same name:

- `123.json` with `timestamp`, `numFaces`, `initialGreeting`, `greeting`, `speechFileName`, and `imageString` (base64 PNG)
- `123.mp3`, the spoken greeting (`speechFileName` is that file name)

## Requirements

- Node.js >= 22.9.0 (`--env-file-if-exists` loads `.env` when it is present)
- Valid OpenAI API key
- Speakers or another audio output device

## Troubleshooting

- **No greetings generated**: Check your OpenAI API key and ensure you have sufficient credits
- **Poor face detection**: Increase `MAX_DIMENSION` or lower `MIN_DIMENSION_PERCENTAGE`
- **Too many greetings**: Increase `COOL_DOWN_MS` or `INTERVAL_MS`
- **No audio**: Check your speakers and that `TTS_VOICE` is an OpenAI voice such as `coral`

## License

MIT
