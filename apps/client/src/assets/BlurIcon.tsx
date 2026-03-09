import { IconProps } from 'types';

const BlurIcon = ({ color }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="15.4375rem"
    height="13.4375rem"
    viewBox="0 0 247 215"
    fill="none"
  >
    <g filter="url(#filter0_f_3984_23873)">
      <circle cx="123.535" cy="91.8392" r="50.4252" fill={color} />
    </g>
    <defs>
      <filter
        id="filter0_f_3984_23873"
        x="0.750404"
        y="-30.9449"
        width="245.57"
        height="245.57"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="36.1795" result="effect1_foregroundBlur_3984_23873" />
      </filter>
    </defs>
  </svg>
);

export default BlurIcon;
