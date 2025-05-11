import { Link } from "react-router-dom";
import CategoryManager from "../components/CategoryManager";
import { motion } from "framer-motion";

function MasterPage() {
  return (
    <motion.div
      className="p-4"
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      <Link to="/" className="neumorphic p-2 mb-4 bg-[var(--accent)] text-white rounded">
        Back to Logging
      </Link>
      <CategoryManager />
    </motion.div>
  );
}

export default MasterPage;