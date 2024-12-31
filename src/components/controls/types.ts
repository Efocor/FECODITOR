export interface GetThumbProps {
  key: string;
  'aria-label': string;
  'aria-valuemax': number;
  'aria-valuemin': number;
  'aria-valuenow': number;
  'aria-orientation': string;
  draggable: boolean;
  role: string;
  style: React.CSSProperties;
  tabIndex: number;
}

export interface GetTrackProps {
  key: string;
  style: React.CSSProperties;
  className?: string;
};