// src/components/CategoryFilter.jsx
import PropTypes from "prop-types";
import "./CategoryFilter.css";

export default function CategoryFilter({ selectedCategory, onCategoryChange }) {
  return (
    <div className="category-dropdown">
      <label htmlFor="category">Filter by Category: </label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="All">All</option>
        <option value="Food">Food</option>
        <option value="Medicine">Medicine</option>
        <option value="Masala">Masala</option>
        <option value="Other">Other</option>
      </select>
    </div>
  );
}

CategoryFilter.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
};
