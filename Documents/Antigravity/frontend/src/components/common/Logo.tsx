interface LogoProps {
  className?: string;
  size?: "small" | "medium" | "large";
}

const Logo = ({ className = "", size = "medium" }: LogoProps) => {
  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-32 h-32", 
    large: "w-48 h-48"
  };

  return (
    <img 
      src="/PREVENT logo.png" 
      alt="PREVENT App Logo" 
      className={`mx-auto ${sizeClasses[size]} ${className}`} 
    />
  );
};

export default Logo;