export const applyPixelation = (
  ctx: CanvasRenderingContext2D,
  pixelSize: number
) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data, width, height } = imageData;

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      const pixelIndex = (y * width + x) * 4;
      const r = data[pixelIndex];
      const g = data[pixelIndex + 1];
      const b = data[pixelIndex + 2];

      for (let py = 0; py < pixelSize && y + py < height; py++) {
        for (let px = 0; px < pixelSize && x + px < width; px++) {
          const index = ((y + py) * width + (x + px)) * 4;
          data[index] = r;
          data[index + 1] = g;
          data[index + 2] = b;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

export const applyNoise = (
  ctx: CanvasRenderingContext2D,
  amount: number
) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * amount;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }

  ctx.putImageData(imageData, 0, 0);
};

export const applySharpen = (
  ctx: CanvasRenderingContext2D,
  amount: number
) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data, width, height } = imageData;
  const factor = amount / 10;
  const kernel = [
    [-factor, -factor, -factor],
    [-factor, 1 + factor * 8, -factor],
    [-factor, -factor, -factor]
  ];

  const result = new Uint8ClampedArray(data);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      for (let c = 0; c < 3; c++) {
        let sum = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const idx = ((y + ky) * width + (x + kx)) * 4 + c;
            sum += data[idx] * kernel[ky + 1][kx + 1];
          }
        }
        result[(y * width + x) * 4 + c] = sum;
      }
    }
  }

  const newImageData = new ImageData(result, width, height);
  ctx.putImageData(newImageData, 0, 0);
};