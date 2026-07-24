import React, { useState } from "react";
import { motion } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  index?: number;
  flipDirection?: "left" | "right" | "up" | "down";
  interactiveTag?: string;
}

export const TiltCard: React.FC<TiltCardProps> = ({
  children,
  className = "",
  onClick,
  index = 0,
  flipDirection = "up",
}) => {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Real-time spatial tilt calculation (max 10 deg rotation)
    const rotateX = -(y / (rect.height / 2)) * 10;
    const rotateY = (x / (rect.width / 2)) * 10;
    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setIsHovered(false);
  };

  const getInitial3D = () => {
    switch (flipDirection) {
      case "left":
        return { opacity: 0, y: 40, rotateY: -18, rotateX: 8, transformPerspective: 1000 };
      case "right":
        return { opacity: 0, y: 40, rotateY: 18, rotateX: 8, transformPerspective: 1000 };
      case "down":
        return { opacity: 0, y: -40, rotateX: -18, transformPerspective: 1000 };
      case "up":
      default:
        return { opacity: 0, y: 45, rotateX: 14, transformPerspective: 1000 };
    }
  };

  return (
    <motion.div
      initial={getInitial3D()}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, rotateY: 0 }}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.6, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={`transition-transform duration-200 ease-out relative group ${className}`}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${
            isHovered ? "translateZ(10px) scale(1.015)" : "translateZ(0px) scale(1)"
          }`,
          transformStyle: "preserve-3d",
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};
