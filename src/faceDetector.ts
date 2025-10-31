import Jimp from "jimp";

type CountFacesFunction = (
  imageData: Uint8Array,
  width: number,
  height: number,
  minDimensionPercentage: number
) => Promise<number>;

type GetImageFunction = () => Promise<Buffer>;

type OnFacesDetectedFunction = (
  numFaces: number,
  imageString: string
) => Promise<boolean>;

const processImage = async (
  buffer: Buffer,
  maxDimension: number,
  minDimensionPercentage: number,
  countFaces: CountFacesFunction
): Promise<{ base64: string; numFaces: number }> => {
  const jimpImage = await Jimp.read(buffer);
  let { width, height } = jimpImage.bitmap;

  const maxDim = Math.max(width, height);

  if (maxDim > maxDimension) {
    const scale = maxDimension / maxDim;
    jimpImage.resize(Math.round(width * scale), Math.round(height * scale));
    width = jimpImage.getWidth();
    height = jimpImage.getHeight();
  }

  const numFaces = await countFaces(
    jimpImage.bitmap.data,
    width,
    height,
    minDimensionPercentage
  );

  if (numFaces > 0) {
    const base64 = await jimpImage.getBase64Async(Jimp.MIME_PNG);
    return { base64, numFaces };
  }

  return { base64: "", numFaces };
};

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class FaceDetector {
  private countFaces: CountFacesFunction;
  private getImage: GetImageFunction;
  private onFacesDetected: OnFacesDetectedFunction;
  private maxDimension: number;
  private intervalMs: number;
  private intervalId: NodeJS.Timeout | null = null;
  private isProcessing: boolean = false;
  private lastProcessingPromise: Promise<void> = Promise.resolve();
  private coolDownMs: number;
  private minDimensionPercentage: number;

  constructor({
    countFaces,
    getImage,
    onFacesDetected,
    intervalMs,
    maxDimension,
    coolDownMs,
    minDimensionPercentage,
  }: {
    countFaces: CountFacesFunction;
    getImage: GetImageFunction;
    onFacesDetected: OnFacesDetectedFunction;
    intervalMs: number;
    maxDimension: number;
    coolDownMs: number;
    minDimensionPercentage: number;
  }) {
    this.countFaces = countFaces;
    this.getImage = getImage;
    this.onFacesDetected = onFacesDetected;
    this.maxDimension = maxDimension;
    this.intervalMs = intervalMs;
    this.coolDownMs = coolDownMs;
    this.minDimensionPercentage = minDimensionPercentage;
  }

  private async getAndProcessImage(): Promise<{
    base64: string;
    numFaces: number;
  }> {
    const buffer = await this.getImage();

    return processImage(
      buffer,
      this.maxDimension,
      this.minDimensionPercentage,
      this.countFaces
    );
  }

  private async doOnProcess(): Promise<void> {
    try {
      const { numFaces, base64 } = await this.getAndProcessImage();

      if (numFaces > 0) {
        console.log(`Found ${numFaces} face(s) in image...`);

        console.time("onFacesDetected");
        const success = await this.onFacesDetected(numFaces, base64);
        console.timeEnd("onFacesDetected");

        if (success) {
          console.time("pauseForCoolDown");
          await pause(this.coolDownMs);
          console.timeEnd("pauseForCoolDown");
        }
      }
    } catch (error) {
      console.error("Face detection error:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  private onProcess(): void {
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;
    this.lastProcessingPromise = this.doOnProcess();
  }

  start(): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.onProcess();
    }, this.intervalMs);

    this.onProcess();
  }

  stop(): Promise<void> {
    if (!this.intervalId) {
      return Promise.resolve();
    }

    clearInterval(this.intervalId);
    this.intervalId = null;

    return this.lastProcessingPromise;
  }
}

export default FaceDetector;
