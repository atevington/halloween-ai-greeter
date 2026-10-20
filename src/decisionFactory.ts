import OpenAI from "openai";

const decisionFactory = ({
  apiKey,
  model,
  question,
  threshold,
}: {
  apiKey: string;
  model: string;
  question: string;
  threshold: number;
}) => {
  const openai = new OpenAI({ apiKey });

  return async (imageString: string): Promise<boolean> => {
    const decision = await openai.decisions.create({
      model,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Evaluate this image." },
            { type: "input_image", image_url: imageString },
          ],
        },
      ],
      questions: [
        {
          type: "predicate",
          name: "decision",
          instructions: question,
        },
      ],
    });

    const answer = decision.answers[0];
    if (!answer || answer.type !== "predicate") {
      return false;
    }

    console.log(`Decision probability: ${answer.probability}`);
    return answer.probability > threshold;
  };
};

export default decisionFactory;
