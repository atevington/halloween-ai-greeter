# Halloween AI Greeter

A spooky face detection and greeting system that monitors screen captures from your desktop (console minimized) for people (especially those in Halloween costumes) and generates Halloween-themed greetings using OpenAI's vision capabilities.

## Features

- **Real-time face detection** using OpenCV.js
- **Screen capture** for continuous monitoring
- **AI-powered greeting generation** with OpenAI vision
- **Text-to-speech** for audio greetings (uses OS default TTS)
- **Configurable detection settings** and timing
- **Logging system** for tracking interactions

## How It Works

1. Takes periodic screenshots and detects faces using OpenCV.js
2. When faces are detected, sends the image to OpenAI's vision model
3. Generates a Halloween-themed greeting and speaks it via OS default text-to-speech
4. Logs all interactions for review

## Installation
1. Install dependencies: `npm install`
2. Set up your environment variables (see below)
3. Run: `npm start`

## Environment Variables

### Required

- **`OPENAI_API_KEY`** - Your OpenAI API key for accessing vision models
  - Get one at: https://platform.openai.com/api-keys
  - Example: `sk-proj-...`

### Optional

- **`INTERVAL_MS`** - How often to capture screenshots (milliseconds)
  - Default: `100` (100ms)
  - Minimum: `100`
  - Note: Intervals won't overlap - the system waits for processing to complete before starting the next interval
  - Example: `1000` for 1 second intervals

- **`COOL_DOWN_MS`** - Delay after speaking a greeting before detecting again (milliseconds)
  - Default: `0` (no delay)
  - Minimum: `0`
  - Example: `5000` for 5 second cooldown

- **`MAX_DIMENSION`** - Size to resize images to before face detection (pixels)
  - Default: `160`
  - Minimum: `160`
  - Images will be resized so the largest dimension equals this value
  - Example: `800` for higher quality face detection

- **`MIN_DIMENSION_PERCENTAGE`** - Minimum face size as percentage of largest dimension (0-1)
  - Default: `0` (any size)
  - Range: `0` to `1`
  - Face detection minimum size = largest dimension × this percentage
  - Example: `0.1` for faces at least 10% of the largest dimension

- **`LOG_PATH`** - Directory to store interaction logs
  - Default: (empty string)
  - Example: `/path/to/logs` or `C:\logs`

- **`TTS_VOICE`** - Text-to-speech voice to use (uses OS default TTS system)
  - Default: Your operating system's default voice
  - Examples: `Alex` (macOS), `Microsoft David Desktop` (Windows)
  - Note: Available voices depend on your operating system's TTS configuration

- **`OPENAI_PROMPT`** - Custom prompt for greeting generation
  - Default: Built-in Halloween-themed prompt
  - Use `{{numFaces}}` placeholder for face count
  - Example: `"Say hello to the {{numFaces}} person(s) in a spooky way!"`

- **`OPENAI_MODEL`** - OpenAI model to use for greeting generation
  - Default: `gpt-4o-mini`
  - Options: Any OpenAI vision-capable model

## Example .env File

Create a `.env` file in the project root:

```env
# Required
OPENAI_API_KEY=sk-proj-your-api-key-here

# Optional - adjust these based on your needs
INTERVAL_MS=1000
COOL_DOWN_MS=5000
MAX_DIMENSION=800
MIN_DIMENSION_PERCENTAGE=0.1
LOG_PATH=
TTS_VOICE=Microsoft David Desktop
OPENAI_MODEL=gpt-4o-mini
```

## Usage

Run: `npm start`

The system monitors screen captures (you can minimize the console). When faces are detected, you'll hear Halloween greetings!

## Logs

Creates JSON logs in the specified directory with:
- Timestamp, face count, greeting, and base64 image data

## Requirements

- Node.js >= 14.0.0
- Valid OpenAI API key
- System with text-to-speech capabilities

## Troubleshooting

- **No greetings generated**: Check your OpenAI API key and ensure you have sufficient credits
- **Poor face detection**: Increase `MAX_DIMENSION` or adjust `MIN_DIMENSION_PERCENTAGE`
- **Too many greetings**: Increase `COOL_DOWN_MS` or `INTERVAL_MS`
- **No audio**: Check your system's text-to-speech settings and `TTS_VOICE` configuration


## License

MIT