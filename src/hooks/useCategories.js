import { useState, useEffect } from "react";
import { useLogs } from "./useLogs";

export function useCategories() {
  const { logs, updateLog } = useLogs();

  // Define default categories with unique IDs
  const defaultCategories = [
    { id: "default", name: "Uncategorized", subcategories: [{ id: "none", name: "None" }] },
    {
      id: "eat",
      name: "Eat",
      subcategories: [
        { id: "eat-1", name: "Breakfast" },
        { id: "eat-2", name: "Lunch" },
        { id: "eat-3", name: "Dinner" },
        { id: "eat-4", name: "Snack" },
      ],
    },
    {
      id: "workout",
      name: "Workout",
      subcategories: [
        { id: "workout-1", name: "Cardio" },
        { id: "workout-2", name: "Strength" },
        { id: "workout-3", name: "Yoga" },
        { id: "workout-4", name: "Stretching" },
      ],
    },
    {
      id: "study",
      name: "Study",
      subcategories: [
        { id: "study-1", name: "Reading" },
        { id: "study-2", name: "Writing" },
        { id: "study-3", name: "Research" },
        { id: "study-4", name: "Practice" },
      ],
    },
    {
      id: "work",
      name: "Work",
      subcategories: [
        { id: "work-1", name: "Meetings" },
        { id: "work-2", name: "Coding" },
        { id: "work-3", name: "Planning" },
        { id: "work-4", name: "Admin" },
      ],
    },
    {
      id: "leisure",
      name: "Leisure",
      subcategories: [
        { id: "leisure-1", name: "Gaming" },
        { id: "leisure-2", name: "TV/Movies" },
        { id: "leisure-3", name: "Socializing" },
        { id: "leisure-4", name: "Hobbies" },
      ],
    },
    {
      id: "sleep",
      name: "Sleep",
      subcategories: [
        { id: "sleep-1", name: "Nap" },
        { id: "sleep-2", name: "Night Sleep" },
      ],
    },
    {
      id: "chores",
      name: "Chores",
      subcategories: [
        { id: "chores-1", name: "Cleaning" },
        { id: "chores-2", name: "Cooking" },
        { id: "chores-3", name: "Shopping" },
        { id: "chores-4", name: "Laundry" },
      ],
    },
  ];

  const [categories, setCategories] = useState(() => {
    const savedCategories = localStorage.getItem("categories");
    return savedCategories ? JSON.parse(savedCategories) : defaultCategories;
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

  const deleteSubcategory = (categoryName, subcategoryId) => {
    setCategories(
      categories.map((cat) =>
        cat.name === categoryName
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryId),
            }
          : cat
      )
    );
    logs
      .filter((log) => log.category === categoryName && log.subcategory === categories.find((cat) => cat.name === categoryName).subcategories.find((sub) => sub.id === subcategoryId)?.name)
      .forEach((log) => updateLog(log.id, { ...log, subcategory: "None" }));
  };

  const resetCategories = () => {
    setCategories(defaultCategories);
    localStorage.setItem("categories", JSON.stringify(defaultCategories));
  };

  return { categories, addCategory, addSubcategory, deleteCategory, deleteSubcategory, resetCategories };
}