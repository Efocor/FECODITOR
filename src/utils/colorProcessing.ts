export const adjustTemperature = (
  ctx: CanvasRenderingContext2D,
  temperature: number,
  tint: number
) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    // Temperature (blue-yellow)
    data[i] += temperature;     // Red
    data[i + 2] -= temperature; // Blue

    // Tint (green-magenta)
    data[i + 1] += tint;       // Green
    data[i] -= tint / 2;       // Red
    data[i + 2] -= tint / 2;   // Blue
  }

  ctx.putImageData(imageData, 0, 0);
};

export const adjustVibrance = (
  ctx: CanvasRenderingContext2D,
  amount: number
) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    const max = Math.max(data[i], data[i + 1], data[i + 2]);
    const diff = max - avg;
    
    const factor = 1 + (amount / 100);
    
    data[i] += (data[i] > avg) ? diff * factor : 0;
    data[i + 1] += (data[i + 1] > avg) ? diff * factor : 0;
    data[i + 2] += (data[i + 2] > avg) ? diff * factor : 0;
  }

  ctx.putImageData(imageData, 0, 0);
};

// ...exposure percentage, 1 by 1 from -100 to 100...
export const adjustExposure = (
  ctx: CanvasRenderingContext2D,
  exposure: number
) => {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const { data } = imageData;

  const factor = (exposure + 100) / 100;

  for (let i = 0; i < data.length; i += 4) {
    data[i] *= factor;     // Red
    data[i + 1] *= factor; // Green
    data[i + 2] *= factor; // Blue
  }

  ctx.putImageData(imageData, 0, 0);
}