import { existsSync, readdirSync } from "fs";
import { join as pathJoin, resolve as pathResolve } from "path";
import sound from "sound-play";

const initialGreetingPlayerFactory = (initialGreetingsDir: string) => {
  const mp3Files: string[] = [];

  try {
    if (existsSync(initialGreetingsDir)) {
      mp3Files.push(
        ...readdirSync(initialGreetingsDir)
          .filter(
            (file) =>
              file.toLowerCase().endsWith(".mp3") && !file.startsWith(".")
          )
          .map((file) => pathResolve(pathJoin(initialGreetingsDir, file)))
      );

      if (mp3Files.length === 0) {
        console.log(
          `No MP3 files found in initial greetings directory ${initialGreetingsDir}`
        );
      } else {
        console.log(
          `Loaded ${mp3Files.length} initial greeting file(s) from initial greetings directory ${initialGreetingsDir}`
        );
      }
    } else {
      console.log(
        `Initial greetings directory ${initialGreetingsDir} not found`
      );
    }
  } catch (error) {
    console.error(
      `Error reading initial greetings from ${initialGreetingsDir}:`,
      error
    );
  }

  return async () => {
    if (mp3Files.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * mp3Files.length);
    const randomFile = mp3Files[randomIndex];

    await sound.play(randomFile, 1);

    return randomFile;
  };
};

export default initialGreetingPlayerFactory;
