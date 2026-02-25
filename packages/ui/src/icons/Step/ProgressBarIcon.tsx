interface ProgressBarProps {
  color: string;
}

const ProgressBarIcon = ({ color }: ProgressBarProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="2.75rem"
    height="0.125rem"
    viewBox="0 0 44 2"
    fill="none"
  >
    <path d="M1 1H43" stroke={color} strokeWidth="2" strokeLinecap="round" strokeDasharray="5 5" />
  </svg>
);

export default ProgressBarIcon;
