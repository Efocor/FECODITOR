import React from 'react';
import { Download, RotateCcw, ZoomIn, ZoomOut, Crop, ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import { ToolbarButton } from './controls/ToolbarButton';

interface Props {
  onDownload: () => void;
  onReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleCrop: () => void;
  onRotateLeft: () => void;
  onRotateRight: () => void;
  isCropping: boolean;
}

export const Toolbar: React.FC<Props> = ({
  onReset,
  onZoomIn,
  onZoomOut,
  onToggleCrop,
  onRotateLeft,
  onRotateRight,
  isCropping
}) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <ToolbarButton
        onClick={onRotateLeft}
        icon={ArrowBigRight}
        label="Rotate Right"
      />
      <ToolbarButton
        onClick={onRotateRight}
        icon={ArrowBigLeft}
        label="Rotate Left"
      />
      <ToolbarButton
        onClick={onReset}
        icon={RotateCcw}
        label="Redo All"
      />
      <ToolbarButton
        onClick={onZoomIn}
        icon={ZoomIn}
        label="Zoom In"
      />
      <ToolbarButton
        onClick={onZoomOut}
        icon={ZoomOut}
        label="Zoom Out"
      />
      <ToolbarButton
        onClick={onToggleCrop}
        icon={Crop}
        label={isCropping ? "Apply Crop" : "Crop"}
        active={isCropping}
      />
    </div>
  );
};