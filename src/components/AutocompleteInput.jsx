import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useCategories } from '../hooks/useCategories';

function AutocompleteInput({ onSelect }) {
  const { categories } = useCategories();
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const getSuggestions = () => {
      const allSuggestions = categories.flatMap(cat => 
        cat.subcategories.map(sub => ({
          category: cat.name,
          subcategory: sub.name
        }))
      );

      return allSuggestions.filter(item => 
        item.category.toLowerCase().includes(inputValue.toLowerCase()) ||
        item.subcategory.toLowerCase().includes(inputValue.toLowerCase())
      );
    };

    if (inputValue.length > 0) {
      setSuggestions(getSuggestions());
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [inputValue, categories]);

  return (
    <div className="relative">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="neumorphic p-3 w-full rounded-lg"
        placeholder="Type category or subcategory..."
      />
      {showSuggestions && suggestions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute z-10 w-full mt-1 frosted-glass rounded-lg shadow-lg"
        >
          {suggestions.map((item, index) => (
            <div
              key={index}
              className="p-2 hover:bg-[var(--secondary)] cursor-pointer"
              onClick={() => {
                onSelect(item);
                setInputValue('');
                setShowSuggestions(false);
              }}
            >
              {item.category} - {item.subcategory}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default AutocompleteInput;
