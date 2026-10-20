import { unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join as pathJoin } from "path";
import OpenAI from "openai";
import sound from "sound-play";

const speakFactory = ({
  apiKey,
  voice,
  model,
}: {
  apiKey: string;
  voice: string;
  model: string;
}) => {
  const openai = new OpenAI({ apiKey });

  return async (text: string, filePath?: string): Promise<void> => {
    const speech = await openai.audio.speech.create({
      model,
      voice,
      input: text,
      response_format: "mp3",
    });

    const outputPath =
      filePath ?? pathJoin(tmpdir(), `halloween-greeting-${Date.now()}.mp3`);
    await writeFile(outputPath, Buffer.from(await speech.arrayBuffer()));

    try {
      await sound.play(outputPath, 1);
    } finally {
      if (!filePath) {
        await unlink(outputPath).catch(() => undefined);
      }
    }
  };
};

export default speakFactory;
