import React from 'react';
import ReactSlider from 'react-slider';
import { SliderThumb } from './SliderThumb';
import { SliderTrack } from './SliderTrack';

interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (value: number) => void;
}

export const FilterSlider: React.FC<Props> = ({
  label,
  value,
  min,
  max,
  unit,
  onChange
}) => {
  return (
    <div className="space-y-2 group">
      <div className="flex justify-between">
        <label className="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition-colors">
          {label}
        </label>
        <span className="text-sm bg-indigo-100 px-2 py-0.5 rounded-full text-indigo-700 font-medium">
          {value}{unit}
        </span>
      </div>
      <ReactSlider
        className="h-2 bg-gradient-to-r from-indigo-100 to-indigo-200 rounded-full"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        renderTrack={SliderTrack}
        renderThumb={SliderThumb}
        pearling
        minDistance={1}
      />
    </div>
  );
};