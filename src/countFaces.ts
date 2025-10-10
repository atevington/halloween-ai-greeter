import cvPromise from "@techstark/opencv-js";

let faceCascade: any;

const loadDataFile = async (cvFilePath: string, url: string): Promise<void> => {
  const cv = await cvPromise;
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const data = new Uint8Array(buffer);
  cv.FS_createDataFile("/", cvFilePath, data, true, false, false);
};

const loadHaarFaceModels = async (): Promise<void> => {
  const cv = await cvPromise;

  const key = "haarcascade_frontalface_default.xml";

  await loadDataFile(
    key,
    `https://raw.githubusercontent.com/opencv/opencv/master/data/haarcascades/${key}`
  );

  faceCascade = new cv.CascadeClassifier();
  faceCascade.load(key);
};

const countFaces = async (
  imageData: Uint8Array,
  width: number,
  height: number,
  minDimensionPercentage: number
): Promise<number> => {
  const cv = await cvPromise;

  if (!faceCascade) {
    await loadHaarFaceModels();
  }

  const src = new cv.Mat(height, width, cv.CV_8UC4);
  src.data.set(imageData);

  if (src.empty()) {
    src.delete();
    return -1;
  }

  const gray = new cv.Mat();
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

  const faces = new cv.RectVector();

  const minDimension = Math.round(
    Math.max(width, height) * minDimensionPercentage
  );

  const minSize = new cv.Size(minDimension, minDimension);

  const scaleFactor = 1.1;
  const minNeighbors = 2;
  const flags = 0;

  if (faceCascade) {
    faceCascade.detectMultiScale(
      gray,
      faces,
      scaleFactor,
      minNeighbors,
      flags,
      minSize
    );
  }

  const faceCount = faces.size();

  src.delete();
  gray.delete();
  faces.delete();

  return faceCount;
};

export default countFaces;
