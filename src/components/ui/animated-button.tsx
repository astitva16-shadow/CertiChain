import { motion } from "framer-motion";
import { ButtonProps, Button } from "./button";
import { forwardRef } from "react";

const AnimatedButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="inline-block"
      >
        <Button ref={ref} className={className} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
