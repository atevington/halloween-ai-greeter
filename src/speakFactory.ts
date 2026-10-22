import OpenAI from "openai";

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

  const generateVoice = async (text: string): Promise<Buffer> => {
    console.time("generateVoice");

    try {
      const speech = await openai.audio.speech.create({
        model,
        voice,
        input: text,
        response_format: "mp3",
      });

      return Buffer.from(await speech.arrayBuffer());
    } finally {
      console.timeEnd("generateVoice");
    }
  };

  return generateVoice;
};

export default speakFactory;
