import React from 'react';
import { ImageState } from '../types';
import { Sliders, Wand2 } from 'lucide-react';
import { FilterSlider } from './controls/FilterSlider';

interface Props {
  filters: ImageState;
  onChange: (filters: ImageState) => void;
}

export const FilterControls: React.FC<Props> = ({ filters, onChange }) => {
  const filterControls = [
    { name: 'brightness', label: 'Brightness', min: 0, max: 200, unit: '%' },
    { name: 'contrast', label: 'Contrast', min: 0, max: 200, unit: '%' },
    { name: 'saturation', label: 'Saturation', min: 0, max: 200, unit: '%' },
    { name: 'exposure', label: 'Exposure', min: -100, max: 100, unit: '%' },
    { name: 'temperature', label: 'Temperature', min: -100, max: 100, unit: '' },
    { name: 'tint', label: 'Tint', min: -100, max: 100, unit: '' },
    { name: 'vibrance', label: 'Vibrance', min: 0, max: 100, unit: '%' },
    { name: 'blur', label: 'Blur', min: 0, max: 20, unit: 'px' },
    { name: 'sharpen', label: 'Sharpen', min: 0, max: 100, unit: '%' },
    { name: 'noise', label: 'Noise', min: 0, max: 100, unit: '%' },
    { name: 'sepia', label: 'Sepia', min: 0, max: 100, unit: '%' },
    { name: 'grayscale', label: 'Grayscale', min: 0, max: 100, unit: '%' },
    { name: 'hueRotate', label: 'Hue Rotate', min: 0, max: 360, unit: '°' },
    { name: 'pixelate', label: 'Pixelate', min: 1, max: 50, unit: 'px' },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl p-6 space-y-4 border border-indigo-100">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-indigo-100 rounded-lg">
          <Wand2 className="w-5 h-5 text-indigo-600" />
        </div>
        <h2 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
          Image Filters
        </h2>
      </div>
      
      <div className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto pr-4 custom-scrollbar">
        {filterControls.map((control) => (
          <FilterSlider
            key={control.name}
            label={control.label}
            value={filters[control.name as keyof ImageState]}
            min={control.min}
            max={control.max}
            unit={control.unit}
            onChange={(value) => 
              onChange({ ...filters, [control.name]: value })
            }
          />
        ))}
      </div>
    </div>
  );
};