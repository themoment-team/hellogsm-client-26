import { IconProps } from 'types';

const FaqIcon = ({ color }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1.75rem"
    height="1.75rem"
    viewBox="0 0 28 28"
    fill="none"
  >
    <circle cx="14.0003" cy="13.9993" r="12.3333" stroke={color} strokeWidth="2" />
    <rect x="12.667" y="7.33203" width="2.66667" height="9.33333" rx="1.33333" fill={color} />
    <ellipse cx="14.0003" cy="19.3333" rx="1.33333" ry="1.33333" fill={color} />
  </svg>
);

export default FaqIcon;
