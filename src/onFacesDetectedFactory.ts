import { mkdir, writeFile } from "fs/promises";
import { resolve as pathResolve, join as pathJoin } from "path";

const onFacesDetectedFactory = ({
  decide,
  playInitialGreeting,
  getGreeting,
  speak,
  logPath,
}: {
  decide: (imageString: string) => Promise<boolean>;
  playInitialGreeting: () => Promise<string | null>;
  getGreeting: (numFaces: number, imageString: string) => Promise<string>;
  speak: (text: string, filePath?: string) => Promise<void>;
  logPath: string;
}) => {
  const playInitialGreetingWrapped = async () => {
    console.time("playInitialGreeting");

    let initialGreeting: string | null = null;

    try {
      initialGreeting = await playInitialGreeting();
    } catch (error) {
      console.error("Error playing initial greeting:", error);
    }

    console.timeEnd("playInitialGreeting");

    return initialGreeting;
  };

  const getGreetingWrapped = async (numFaces: number, imageString: string) => {
    console.time("getGreeting");

    let greeting: string = "";

    try {
      greeting = await getGreeting(numFaces, imageString);
    } catch (error) {
      console.error("Error getting greeting:", error);
    }

    console.timeEnd("getGreeting");

    return greeting;
  };

  const speakWrapped = async (text: string, filePath?: string) => {
    console.time("speak");

    if (text.trim()) {
      try {
        await speak(text.trim(), filePath);
      } catch (e) {
        console.error("Error speaking:", e);
      }
    }

    console.timeEnd("speak");
  };

  return async (numFaces: number, imageString: string): Promise<boolean> => {
    let shouldGreet = false;

    try {
      console.time("decide");
      shouldGreet = await decide(imageString);
      console.timeEnd("decide");
    } catch (error) {
      console.timeEnd("decide");
      console.error("Error calling decisions API:", error);
      return false;
    }

    if (!shouldGreet) {
      return false;
    }

    const [initialGreeting, greeting] = await Promise.all([
      playInitialGreetingWrapped(),
      getGreetingWrapped(numFaces, imageString),
    ]);

    if (greeting && greeting.trim()) {
      const now = new Date();
      const jsonFileName = `${now.getTime()}.json`;
      const speechFileName = jsonFileName.replace(/\.json$/, ".mp3");
      const speechPath = logPath
        ? pathResolve(pathJoin(logPath, speechFileName))
        : undefined;

      if (logPath) {
        await mkdir(logPath, { recursive: true });

        const json = {
          timestamp: now.toISOString(),
          numFaces,
          initialGreeting,
          greeting,
          speechFileName,
          imageString,
        };

        const writePath = pathResolve(pathJoin(logPath, jsonFileName));

        writeFile(writePath, JSON.stringify(json, null, 2)).then(
          null,
          (error) => {
            console.error("Error writing log file:", error);
          }
        );
      }

      await speakWrapped(greeting, speechPath);

      return true;
    }

    return false;
  };
};

export default onFacesDetectedFactory;
