// components/GlareHover.tsx
import "./GlareHover.css";
import { ReactNode, CSSProperties } from "react";

const GlareHover = ({ children, className = "", style = {}, ...props }: { children: ReactNode; className?: string; style?: CSSProperties; [key: string]: any }) => {
  return (
    <div className={`glare-hover ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};

export default GlareHover;
