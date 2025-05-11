import { useState } from "react";
import { motion } from "framer-motion";
import { useCategories } from "../hooks/useCategories";
import { toast } from "react-toastify";
import FrostedCard from "./FrostedCard";
import { vibrate } from "../utils/haptic";

function CategoryManager() {
  const { categories, addCategory, addSubcategory, deleteCategory } = useCategories();
  const [newCategory, setNewCategory] = useState("");
  const [newSubcategory, setNewSubcategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleAddCategory = () => {
    if (newCategory) {
      addCategory({ id: Date.now().toString(), name: newCategory, subcategories: [] });
      setNewCategory("");
      vibrate(50);
    }
  };

  const handleAddSubcategory = () => {
    if (newSubcategory && selectedCategory) {
      addSubcategory(selectedCategory, { id: Date.now().toString(), name: newSubcategory });
      setNewSubcategory("");
      vibrate(50);
    }
  };

  const handleDeleteCategory = (category) => {
    deleteCategory(category.id);
    vibrate(50);
    toast.info(
      <div>
        Deleted "{category.name}"
        <button
          className="ml-2 underline"
          onClick={() => {
            addCategory(category);
            toast.dismiss();
          }}
        >
          Undo
        </button>
      </div>,
      { autoClose: 30000 }
    );
  };

  return (
    <FrostedCard className="m-4">
      <h2 className="text-lg font-bold mb-4">Manage Categories</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="neumorphic p-2 w-full rounded"
        />
        <motion.button
          onClick={handleAddCategory}
          className="neumorphic p-2 mt-2 w-full bg-[var(--accent)] text-white"
          whileTap={{ scale: 0.9 }}
        >
          Add Category
        </motion.button>
      </div>
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="neumorphic p-2 w-full rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New Subcategory"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
          className="neumorphic p-2 w-full mt-2 rounded"
        />
        <motion.button
          onClick={handleAddSubcategory}
          className="neumorphic p-2 mt-2 w-full bg-[var(--accent)] text-white"
          whileTap={{ scale: 0.9 }}
        >
          Add Subcategory
        </motion.button>
      </div>
      <div>
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{cat.name}</h3>
              <button
                onClick={() => handleDeleteCategory(cat)}
                className="neumorphic p-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
            <ul className="ml-4">
              {cat.subcategories.map((sub) => (
                <li key={sub.id}>{sub.name}</li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </FrostedCard>
  );
}

export default CategoryManager;