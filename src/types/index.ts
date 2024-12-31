export interface Filter {
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
}

export interface ImageState {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sepia: number;
  grayscale: number;
  hueRotate: number;
  opacity: number;
  vibrance: number;
  exposure: number;
  sharpen: number;
  noise: number;
  pixelate: number;
  temperature: number;
  tint: number;
}

export interface Crop {
  x: number;
  y: number;
  width: number;
  height: number;
  image: string;
}

export type InterpolationMethod = 'nearest' | 'bilinear' | 'bicubic';