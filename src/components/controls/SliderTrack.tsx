import React from 'react';
import { GetTrackProps } from './types';

export const SliderTrack = (props: GetTrackProps, state: { index: number }) => {
  const { key, ...restProps } = props;
  
  return (
    <div
      {...restProps}
      key={key}
      className="h-2 bg-indigo-500 rounded-full"
      index={state.index}
    />
  );
};