import { useState, useEffect } from "react";
import { useLogs } from "./useLogs";

export function useCategories() {
  const { logs, updateLog } = useLogs();
  const [categories, setCategories] = useState(() => {
    return JSON.parse(localStorage.getItem("categories")) || [
      { id: "default", name: "Uncategorized", subcategories: [{ id: "none", name: "None" }] },
    ];
  });

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addCategory = (category) => {
    setCategories([...categories, category]);
  };

  const addSubcategory = (categoryName, subcategory) => {
    setCategories(
      categories.map((cat) =>
        cat.name === categoryName
          ? { ...cat, subcategories: [...cat.subcategories, subcategory] }
          : cat
      )
    );
  };

  const deleteCategory = (id) => {
    const deletedCategory = categories.find((cat) => cat.id === id);
    setCategories(categories.filter((cat) => cat.id !== id));
    logs
      .filter((log) => log.category === deletedCategory.name)
      .forEach((log) => updateLog(log.id, { ...log, category: "Uncategorized", subcategory: "None" }));
  };

  return { categories, addCategory, addSubcategory, deleteCategory };
}