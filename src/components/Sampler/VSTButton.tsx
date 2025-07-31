/**
 * VST-style button component with different variants and sizes
 */
interface VSTButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  className?: string;
}

export const VSTButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  size = "medium",
  disabled = false,
  className = ""
}: VSTButtonProps) => {
  const baseClasses = "font-mono font-bold border-2 rounded transition-all duration-200 select-none";
  const sizeClasses = {
    small: "px-3 py-1 text-xs",
    medium: "px-4 py-2 text-sm",
    large: "px-6 py-3 text-base"
  };
  const variantClasses = {
    primary: "hover:bg-opacity-80 text-white",
    secondary: "hover:bg-opacity-80 text-gray-800",
    danger: "hover:bg-opacity-80 text-white"
  };
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabled ? disabledClasses : ''} ${className} rounded-xl shadow-[2px_2px_5px_rgba(163,177,198,0.6),-2px_-2px_5px_rgba(255,255,255,0.8)]`}
      style={{
        backgroundColor: variant === "primary" ? "#2d3748" : 
                       variant === "danger" ? "#e53e3e" : "#e0e5ec",
        borderColor: variant === "primary" ? "#2d3748" : 
                    variant === "danger" ? "#e53e3e" : "#e0e5ec",
        color: variant === "primary" ? "#ffffff" : 
               variant === "danger" ? "#ffffff" : "#2d3748"
      }}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}; 