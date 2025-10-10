import { writeFile } from "fs/promises";
import { resolve as pathResolve, join as pathJoin } from "path";

const onFacesDetectedFactory =
  ({
    getGreeting,
    speak,
    logPath,
  }: {
    getGreeting: (numFaces: number, imageString: string) => Promise<string>;
    speak: (text: string) => Promise<void>;
    logPath: string;
  }) =>
  async (numFaces: number, imageString: string): Promise<void> => {
    console.time("getGreeting");
    const greeting = await getGreeting(numFaces, imageString);
    console.timeEnd("getGreeting");

    if (logPath) {
      const now = new Date();

      const json = {
        timestamp: now.toISOString(),
        numFaces,
        greeting,
        imageString,
      };

      const writePath = pathResolve(pathJoin(logPath, `${now.getTime()}.json`));

      writeFile(writePath, JSON.stringify(json, null, 2)).then(
        null,
        (error) => {
          console.error("Error writing log file:", error);
        }
      );
    }

    if (greeting) {
      console.time("speak");

      try {
        await speak(greeting);
      } catch (e) {
        console.error("Error speaking:", e);
      }

      console.timeEnd("speak");
    }
  };

export default onFacesDetectedFactory;
