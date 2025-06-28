import { useState, useEffect } from "react";
import axios from "../axios";
import ItemCard from "../components/ItemCard";
import { GrAdd } from "react-icons/gr";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import "../pages/Home.css";

export default function Home() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // REMOVED: scroll direction state and logic that was causing problems
  // const [scrollDirection, setScrollDirection] = useState("");
  // const [lastScrollY, setLastScrollY] = useState(0);

  const categories = ["All", "Food", "Medicine", "Masala", "Other"];

  useEffect(() => {
    fetchItems();

    // REMOVED: scroll event listener that was interfering with normal scrolling
    /*
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setScrollDirection("scroll-up");
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection("scroll-down");
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    */
  }, []); // Removed lastScrollY dependency

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, searchTerm]);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/items");
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err.message);
    }
  };

  const filterItems = () => {
    let filtered = items;

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/items/${id}`);
      fetchItems();
    } catch (err) {
      console.error("Error deleting item:", err.message);
    }
  };

  const getStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "Expired";
    if (diffDays <= 7) return `${diffDays} days remaining — Expiring Soon`;
    return `${diffDays} days remaining — Safe`;
  };

  const handleAddClick = () => {
    navigate("/add");
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="home-page">
      {/* Search and Filter Section */}
      <div className="filter-section">
        {/* Search Bar */}
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        {/* Category Filter Buttons */}
        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              className={`category-btn ${
                selectedCategory === category ? "active" : ""
              }`}
              onClick={() => handleCategoryChange(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Items Display */}
      <div className="items-section">
        <h2>
          {selectedCategory === "All"
            ? "All Items"
            : `${selectedCategory} Items`}
          {searchTerm && ` - Search: "${searchTerm}"`}
          <span className="items-count">({filteredItems.length})</span>
        </h2>

        {/* Desktop Table View */}
        <div className="table-container">
          <div className="table-header">
            <div>Name</div>
            <div>Category</div>
            <div>Expiry Type</div>
            <div>Expiry Date</div>
            <div>Status</div>
            <div>Actions</div>
          </div>

          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div className="table-row" key={item._id}>
                <div>{item.name}</div>
                <div>{item.category}</div>
                <div>{item.expiryType}</div>
                <div>{item.expiryDate.split("T")[0]}</div>
                <div
                  className={`status ${getStatus(item.expiryDate)
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {getStatus(item.expiryDate)}
                </div>
                <div className="actions">
                  <button>Edit</button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-items">
              <p>No items found matching your criteria.</p>
            </div>
          )}
        </div>

        {/* Mobile Card View - REMOVED scrollDirection class */}
        <div className="mobile-view">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                getStatus={getStatus}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="no-items-mobile">
              <p>No items found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Button */}
      <GrAdd className="plus-add" onClick={handleAddClick} />
    </div>
  );
}
