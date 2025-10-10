import OpenAI from "openai";
import Mustache from "mustache";

const greetingFactory = ({
  prompt,
  model,
  apiKey,
}: {
  prompt: string;
  model: string;
  apiKey: string;
}) => {
  const openai = new OpenAI({ apiKey });

  return async (numFaces: number, imageString: string): Promise<string> => {
    if (numFaces === 0) {
      return "";
    }

    try {
      const renderedPrompt = Mustache.render(prompt, { numFaces });

      const response = await openai.chat.completions.create({
        model,
        messages: [
          {
            role: "system",
            content: renderedPrompt,
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
    } catch (error) {
      console.error("OpenAI API error:", error);

      return "";
    }
  };
};

export default greetingFactory;
