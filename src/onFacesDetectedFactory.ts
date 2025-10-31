import { writeFile } from "fs/promises";
import { resolve as pathResolve, join as pathJoin } from "path";

const onFacesDetectedFactory = ({
  playInitialGreeting,
  getGreeting,
  speak,
  logPath,
}: {
  playInitialGreeting: () => Promise<string | null>;
  getGreeting: (numFaces: number, imageString: string) => Promise<string>;
  speak: (text: string) => Promise<void>;
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

  const speakWrapped = async (text: string) => {
    console.time("speak");

    if (text.trim()) {
      try {
        await speak(text.trim());
      } catch (e) {
        console.error("Error speaking:", e);
      }
    }

    console.timeEnd("speak");
  };

  return async (numFaces: number, imageString: string): Promise<boolean> => {
    const [initialGreeting, greeting] = await Promise.all([
      playInitialGreetingWrapped(),
      getGreetingWrapped(numFaces, imageString),
    ]);

    if (greeting && greeting.trim()) {
      if (logPath) {
        const now = new Date();

        const json = {
          timestamp: now.toISOString(),
          numFaces,
          initialGreeting,
          greeting,
          imageString,
        };

        const writePath = pathResolve(
          pathJoin(logPath, `${now.getTime()}.json`)
        );

        writeFile(writePath, JSON.stringify(json, null, 2)).then(
          null,
          (error) => {
            console.error("Error writing log file:", error);
          }
        );
      }

      await speakWrapped(greeting);

      return true;
    }

    return false;
  };
};

export default onFacesDetectedFactory;
