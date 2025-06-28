import { useEffect, useState, useRef } from "react";
import axios from "../axios"; // ✅ using custom axios instance with token
import ItemCard from "../components/ItemCard";
import "./AllItemsPage.css";

export default function AllItemsPage() {
  const [items, setItems] = useState([]);
  const mobileViewRef = useRef(null);

  useEffect(() => {
    fetchItems();
  }, []);

  // Add smooth continuous scrolling behavior
  useEffect(() => {
    const handleWheel = (e) => {
      if (mobileViewRef.current && window.innerWidth <= 768) {
        e.preventDefault();
        const container = mobileViewRef.current;
        const scrollAmount = e.deltaY;

        // Smooth continuous scroll without stopping
        container.scrollBy({
          top: scrollAmount,
          behavior: "auto", // Use 'auto' for immediate response
        });
      }
    };

    const mobileView = mobileViewRef.current;
    if (mobileView) {
      mobileView.addEventListener("wheel", handleWheel, { passive: false });
      return () => mobileView.removeEventListener("wheel", handleWheel);
    }
  }, []);

  const fetchItems = async () => {
    try {
      const res = await axios.get("/items"); // ✅ token is auto-attached
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching items:", err.message);
    }
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

  return (
    <div className="all-items-page">
      <h2 style={{ marginBottom: "10px", fontSize: "1.5rem" }}>All Items</h2>

      <div className="table-container">
        <div className="table-header">
          <div>Name</div>
          <div>Expiry Type</div>
          <div>Expiry Date</div>
          <div>Status</div>
          <div>Actions</div>
        </div>

        {items.map((item) => (
          <div className="table-row" key={item._id}>
            <div>{item.name}</div>
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
        ))}
      </div>

      <div className="mobile-view" ref={mobileViewRef}>
        {items.map((item, index) => (
          <ItemCard
            key={`${item._id}-${index}`}
            item={item}
            getStatus={getStatus}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
