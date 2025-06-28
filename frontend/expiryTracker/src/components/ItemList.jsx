import { useEffect, useState } from "react";
import API from "../api";
import "./ItemList.css";

export default function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    API.get("/").then((res) => setItems(res.data));
  }, []);

  return (
    <div>
      <h2>All Items</h2>
      <ul className="item-list">
        {items.map((item) => (
          <li key={item._id}>
            <strong>{item.name}</strong> —{" "}
            {new Date(item.expiryDate).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
}
