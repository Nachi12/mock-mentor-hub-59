import { Link } from "react-router-dom";
import { FaUserTie } from "react-icons/fa";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ className = "", size = "md", showText = true }: LogoProps) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12"
  };

  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      <motion.div
        className={`relative ${sizeClasses[size]} bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
        whileHover={{ rotate: [0, -5, 5, 0] }}
        transition={{ duration: 0.5 }}
      >
        <FaUserTie className="text-white w-2/3 h-2/3" />
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
        <motion.div
          className="absolute -inset-1 bg-gradient-primary rounded-xl opacity-50 blur-md"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.3, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizeClasses[size]} bg-gradient-primary bg-clip-text text-transparent`}>
            MeetConnect
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Interview Excellence
          </span>
        </div>
      )}
    </Link>
  );
};

export default Logo;