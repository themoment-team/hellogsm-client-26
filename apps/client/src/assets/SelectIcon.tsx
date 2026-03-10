import { IconProps } from 'types';

const SelectIcon = ({ style }: IconProps) => (
  <svg
    className={style}
    width="11"
    height="8"
    viewBox="0 0 11 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M1 1L5.5 6L10 1"
      stroke="white"
      strokeOpacity="0.56"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default SelectIcon;
