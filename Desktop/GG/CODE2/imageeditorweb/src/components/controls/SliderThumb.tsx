import React from 'react';
import { GetThumbProps } from './types';

export const SliderThumb = (props: GetThumbProps, state: { valueNow: number }) => {
  const { key, ...restProps } = props;
  
  return (
    <div
      {...restProps}
      key={key}
      className="
        w-6 h-6 -mt-2
        bg-gradient-to-br from-indigo-500 to-indigo-600
        rounded-full shadow-lg
        focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
        hover:from-indigo-600 hover:to-indigo-700
        transition-all duration-200 ease-out
        before:content-[''] before:absolute before:w-12 before:h-12 before:top-1/2 before:left-1/2
        before:-translate-x-1/2 before:-translate-y-1/2 before:bg-indigo-100/20
        before:rounded-full before:opacity-0 before:transition-opacity
        hover:before:opacity-100
      "
    />
  );
};