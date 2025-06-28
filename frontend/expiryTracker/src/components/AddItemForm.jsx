import { useState } from "react";
import axios from "../axios"; // ✅ use the custom axios instance (with token)
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./AddItemForm.css";

export default function AddItemForm() {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    expiryType: "",
    expiryDate: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/items", formData); // baseURL handles prefix

      if (res.status === 201 || res.status === 200) {
        toast.success("Item added successfully ✅", {
          autoClose: 2000,
          closeButton: false,
        });

        setFormData({
          name: "",
          category: "",
          expiryType: "",
          expiryDate: "",
        });

        navigate("/"); // go to home or you can use `/items`
      }
    } catch (error) {
      toast.error("Failed to add item ❌");
      console.error("Error while adding item:", error);
    }
  };

  return (
    <form className="add-form" onSubmit={handleSubmit}>
      <h2>Add New Item</h2>

      <input
        type="text"
        placeholder="Item Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        required
      >
        <option value="">Select Category</option>
        <option value="Food">Food</option>
        <option value="Medicine">Medicine</option>
        <option value="Masala">Masala</option>
        <option value="Other">Other</option>
      </select>

      <select
        value={formData.expiryType}
        onChange={(e) =>
          setFormData({ ...formData, expiryType: e.target.value })
        }
        required
      >
        <option value="">Select Expiry Type</option>
        <option value="d/m/y">d/m/y</option>
        <option value="best before">best before</option>
        <option value="m/y">m/y</option>
      </select>

      <input
        type="date"
        value={formData.expiryDate}
        onChange={(e) =>
          setFormData({ ...formData, expiryDate: e.target.value })
        }
        required
      />

      <button className="btn-add" type="submit">
        Add Item
      </button>
    </form>
  );
}
