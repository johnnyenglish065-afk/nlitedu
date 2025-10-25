// components/GlareHover.tsx
import "./GlareHover.css";

const GlareHover = ({ children, className = "", style = {}, ...props }) => {
  return (
    <div className={`glare-hover ${className}`} style={style}>
      {children}
    </div>
  );
};

export default GlareHover;
