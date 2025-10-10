import say from "say";

const speakFactory =
  (voice?: string) =>
  (text: string): Promise<void> =>
    new Promise((resolve, reject) => {
      say.speak(text, voice, 1, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

export default speakFactory;
