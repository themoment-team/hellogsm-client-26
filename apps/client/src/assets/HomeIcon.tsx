import { IconProps } from 'types';

const HomeIcon = ({ size, color }: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M2.25 11.9991L11.204 3.04409C11.644 2.60509 12.356 2.60509 12.795 3.04409L21.75 11.9991M4.5 9.74909V19.8741C4.5 20.4951 5.004 20.9991 5.625 20.9991H9.75V16.1241C9.75 15.5031 10.254 14.9991 10.875 14.9991H13.125C13.746 14.9991 14.25 15.5031 14.25 16.1241V20.9991H18.375C18.996 20.9991 19.5 20.4951 19.5 19.8741V9.74909M8.25 20.9991H16.5"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HomeIcon;
