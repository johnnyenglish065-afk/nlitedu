'use client';

// ignore TS error for side-effect CSS import
// @ts-ignore
import './ShinyText.css';

const ShinyText = ({
  text,
  disabled = false,
  speed = 5,
  className = '',
}: {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}) => {
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{ animationDuration }}
    >
      {text}
    </span>
  );
};

export default ShinyText;
