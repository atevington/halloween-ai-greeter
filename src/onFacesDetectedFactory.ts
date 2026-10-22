import { mkdir, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { resolve as pathResolve, join as pathJoin } from "path";

const onFacesDetectedFactory = ({
  decide,
  playInitialGreeting,
  getGreeting,
  generateVoice,
  playSound,
  logPath,
}: {
  decide: (imageString: string) => Promise<boolean>;
  playInitialGreeting: () => Promise<string | null>;
  getGreeting: (imageString: string) => Promise<string>;
  generateVoice: (text: string) => Promise<Buffer>;
  playSound: (filePath: string) => Promise<void>;
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

  const getGreetingWrapped = async (imageString: string) => {
    console.time("getGreeting");

    let greeting: string = "";

    try {
      greeting = await getGreeting(imageString);
    } catch (error) {
      console.error("Error getting greeting:", error);
    }

    console.timeEnd("getGreeting");

    return greeting;
  };

  const generateVoiceWrapped = async (text: string) => {
    try {
      return await generateVoice(text);
    } catch (error) {
      console.error("Error generating voice:", error);
      return null;
    }
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

    const initialGreetingPromise = playInitialGreetingWrapped();

    const preparedPromise = (async () => {
      const greeting = (await getGreetingWrapped(imageString)).trim();

      if (!greeting) {
        return null;
      }

      const now = new Date();
      const jsonFileName = `${now.getTime()}.json`;
      const speechFileName = jsonFileName.replace(/\.json$/, ".mp3");
      const audio = await generateVoiceWrapped(greeting);

      if (!audio) {
        return { greeting, now, speechFileName, speechFilePath: null };
      }

      const speechFilePath = logPath
        ? pathResolve(pathJoin(logPath, speechFileName))
        : pathJoin(tmpdir(), `halloween-greeting-${now.getTime()}.mp3`);

      if (logPath) {
        await mkdir(logPath, { recursive: true });
      }

      await writeFile(speechFilePath, audio);

      return { greeting, now, speechFileName, speechFilePath };
    })();

    const [initialGreeting, prepared] = await Promise.all([
      initialGreetingPromise,
      preparedPromise,
    ]);

    if (!prepared) {
      return false;
    }

    if (logPath) {
      const json = {
        timestamp: prepared.now.toISOString(),
        numFaces,
        initialGreeting,
        greeting: prepared.greeting,
        speechFileName: prepared.speechFileName,
        imageString,
      };

      const writePath = pathResolve(
        pathJoin(logPath, `${prepared.now.getTime()}.json`),
      );

      writeFile(writePath, JSON.stringify(json, null, 2)).then(null, (error) => {
        console.error("Error writing log file:", error);
      });
    }

    if (prepared.speechFilePath) {
      console.time("playSound");

      try {
        await playSound(prepared.speechFilePath);
      } catch (error) {
        console.error("Error playing sound:", error);
      } finally {
        console.timeEnd("playSound");
      }

      if (!logPath) {
        await unlink(prepared.speechFilePath).catch(() => undefined);
      }
    }

    return true;
  };
};

export default onFacesDetectedFactory;
