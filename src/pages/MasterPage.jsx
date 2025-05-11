import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { useCategories } from "../hooks/useCategories";
import FrostedCard from "../components/FrostedCard";

function MasterPage() {
  const { categories, addCategory, addSubcategory, deleteCategory, deleteSubcategory, resetCategories } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory) {
      addCategory({ id: Date.now().toString(), name: newCategory, subcategories: [] });
      setNewCategory("");
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory && selectedCategory) {
      addSubcategory(selectedCategory, { id: Date.now().toString(), name: newSubcategory });
      setNewSubcategory("");
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all categories to default? This will overwrite your current categories.")) {
      resetCategories();
    }
  };

  return (
    <motion.div
      className="p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between mb-6">
        <Link to="/" className="neumorphic p-2 bg-[var(--accent)] text-white rounded-lg">
          Back to Logs
        </Link>
        <motion.button
          onClick={handleReset}
          className="neumorphic p-2 bg-red-500 text-white rounded-lg"
          whileTap={{ scale: 0.9 }}
        >
          Reset to Default
        </motion.button>
      </div>

      <FrostedCard className="mb-6">
        <h2 className="text-lg font-bold mb-4">Add New Category</h2>
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="New Category"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="neumorphic p-3 flex-1 rounded-lg"
          />
          <motion.button
            onClick={handleAddCategory}
            className="neumorphic p-3 bg-[var(--accent)] text-white rounded-lg"
            whileTap={{ scale: 0.9 }}
          >
            Add
          </motion.button>
        </div>
      </FrostedCard>

      <FrostedCard className="mb-6">
        <h2 className="text-lg font-bold mb-4">Add New Subcategory</h2>
        <div className="flex gap-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="neumorphic p-3 flex-1 rounded-lg"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="New Subcategory"
            value={newSubcategory}
            onChange={(e) => setNewSubcategory(e.target.value)}
            className="neumorphic p-3 flex-1 rounded-lg"
          />
          <motion.button
            onClick={handleAddSubcategory}
            className="neumorphic p-3 bg-[var(--accent)] text-white rounded-lg"
            whileTap={{ scale: 0.9 }}
          >
            Add
          </motion.button>
        </div>
      </FrostedCard>

      <h2 className="text-lg font-bold mb-4">Manage Categories</h2>
      {categories.map((category) => (
        <FrostedCard key={category.id} className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold">{category.name}</h3>
            {category.name !== "Uncategorized" && (
              <motion.button
                onClick={() => deleteCategory(category.id)}
                className="neumorphic p-2 bg-red-500 text-white rounded-lg"
                whileTap={{ scale: 0.9 }}
              >
                Delete
              </motion.button>
            )}
          </div>
          <div className="ml-4">
            {category.subcategories.map((sub) => (
              <div key={sub.id} className="flex justify-between items-center mb-2">
                <span>{sub.name}</span>
                {sub.name !== "None" && (
                  <motion.button
                    onClick={() => deleteSubcategory(category.name, sub.id)}
                    className="neumorphic p-1 bg-red-500 text-white rounded-lg text-sm"
                    whileTap={{ scale: 0.9 }}
                  >
                    Delete
                  </motion.button>
                )}
              </div>
            ))}
          </div>
        </FrostedCard>
      ))}
    </motion.div>
  );
}

export default MasterPage;