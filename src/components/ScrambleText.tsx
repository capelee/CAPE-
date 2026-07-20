import React, { useState, useEffect } from "react";
import { motion } from "motion/react";

interface ScrambleTextProps {
  text: string;
  className?: string;
}

export const ScrambleText: React.FC<ScrambleTextProps> = ({ text, className }) => {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let iteration = 0;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    
    // Add a small initial delay
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayText((prev) =>
          text
            .split("")
            .map((char, index) => {
              if (index < iteration) {
                return text[index];
              }
              if (text[index] === " ") return " ";
              if (text[index] === "·") return "·";
              return chars[Math.floor(Math.random() * chars.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(interval);
        }

        iteration += 1 / 3;
      }, 30);
      
      return () => clearInterval(interval);
    }, 450); // delay start by 450ms matching page load animation

    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <motion.span
      animate={{ letterSpacing: ["0.2em", "0.28em", "0.2em"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className={className}
    >
      {displayText || text.replace(/./g, "\u00A0")}
    </motion.span>
  );
};
