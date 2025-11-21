import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedCard({ children, className, delay = 0 }: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{ 
        y: -5,
        transition: { duration: 0.2 }
      }}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-lg transition-shadow",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

export function FadeIn({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ 
  children, 
  className, 
  direction = "left",
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  direction?: "left" | "right" | "up" | "down";
  delay?: number;
}) {
  const directions = {
    left: { x: -50, y: 0 },
    right: { x: 50, y: 0 },
    up: { x: 0, y: -50 },
    down: { x: 0, y: 50 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ 
  children, 
  className, 
  delay = 0 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FloatingElement({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      animate={{ 
        y: [0, -10, 0],
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 100
    }
  }
};
