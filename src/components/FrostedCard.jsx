import { motion } from "framer-motion";

function FrostedCard({ children, className }) {
  return (
    <motion.div
      className={`frosted-glass p-6 rounded-xl ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}

export default FrostedCard;