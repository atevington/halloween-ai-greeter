import OpenAI from "openai";
import type { ReasoningEffort } from "./settings.js";

const greetingFactory = ({
  prompt,
  model,
  reasoningEffort,
  apiKey,
}: {
  prompt: string;
  model: string;
  reasoningEffort: ReasoningEffort;
  apiKey: string;
}) => {
  const openai = new OpenAI({ apiKey });

  return async (imageString: string): Promise<string> => {
    const response = await openai.chat.completions.create({
      model,
      reasoning_effort: reasoningEffort,
      messages: [
        {
          role: "system",
          content: prompt,
        },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: imageString },
            },
          ],
        },
      ],
    });

    return response.choices[0]?.message?.content || "";
  };
};

export default greetingFactory;
