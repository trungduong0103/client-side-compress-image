// https://tech.oyorooms.com/image-compression-behind-the-scenes-and-integration-on-website-f856253ff171
// https://github.com/WangYuLue/image-conversion

import {
  fileToDataUrl,
  imageToCanvas,
  dataURLToImg,
  dataURLToFile
} from "./utils";
import { humanFileSize } from "./prettySize";

const inputElm = document.getElementById("my-input");

// lossy compression supported: image/jpeg, image/webp

// accepts:
// image: File
// quality: quality of image after compression, from range 0.0 -> 1.0, default 0.8

// function sizeFromBase64(str) {
//   return str.length * 0.75;
// }

// quality !== compression

async function compress(image, quality = 0.8) {
  const dataUrl = await fileToDataUrl(image);

  // get image from file
  const img = await dataURLToImg(dataUrl);

  const { width, height } = img;
  const aspectRatio = width / height;

  let newWidth = width;
  let newHeight = height;

  // 1080p resolution
  const max1 = 1980;
  const max2 = 1080;

  // given resizeResolution, we must know if an image is in portrait or landscape mode
  // portrait -> width < height
  if (width < height) {
    newWidth = Math.min(width, max2);
    newHeight = Math.min(height, max1);
  }
  // landscape -> width > height
  else {
    newWidth = Math.min(width, max1);
    newHeight = Math.min(height, max2);
  }

  // we want to keep the original aspect ratio
  // aspectRatio = width / height
  // height = width / aspectRatio
  // width = height * aspectRatio
  if (newHeight * aspectRatio > newWidth) {
    newHeight = newWidth / aspectRatio;
  } else {
    newWidth = newHeight * aspectRatio;
  }

  // draw and resize with quality
  const canvas = imageToCanvas(img, {
    width: newWidth,
    height: newHeight
  });
  const compressedData = canvas.toDataURL("image/jpeg", quality);

  // original size = base64 size * 0.75;
  // if after changing quality and the size is even larger, don't bother
  if (compressedData.length * 0.75 > image.size) {
    return image;
  }

  return await dataURLToFile(compressedData, image.type);
}

inputElm.addEventListener("change", async (ev) => {
  // original image
  const file = ev.target.files[0];

  const start = new Date();
  const blob = await compress(file, 0.8);
  const end = new Date();

  console.log("time todo:", `${end - start}ms`);
  console.log("original", humanFileSize(file.size, true, 3));
  console.log("resized", humanFileSize(blob.size, true, 3));

  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank");
  window.URL.revokeObjectURL(url);
});
