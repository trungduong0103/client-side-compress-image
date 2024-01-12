/**
 * 将一个dataURL字符串转变为一个File（Blob）对象
 * 转变时可以确定File对象的类型
 *
 * @param {string} dataURL
 * @param {string=} type - 确定转换后的图片类型，选项有 "image/png", "image/jpeg", "image/gif"
 * @returns {Promise(Blob)}
 */
function dataURLToFile(dataURL, type) {
  const arr = dataURL.split(",");
  const bstr = window.atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], {
    type
  });
}

function fileToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = (ev) => {
      resolve(ev.target.result);
    };
    reader.onerror = (ev) => reject(ev);
  });
}

function imageToCanvas(img, dimensions) {
  const { width, height } = dimensions;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const cvCtx = canvas.getContext("2d");
  cvCtx.drawImage(img, 0, 0, width, height);

  return canvas;
}

function dataURLToImg(dataUrl) {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    img.src = dataUrl;
    img.onload = () => resolve(img);
  });
}

export { fileToDataUrl, imageToCanvas, dataURLToFile, dataURLToImg };
