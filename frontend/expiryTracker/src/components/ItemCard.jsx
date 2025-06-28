import PropTypes from "prop-types";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
} from "react-icons/fa";
import "./ItemCard.css";

export default function ItemCard({ item, getStatus, onDelete }) {
  console.log("Item data:", item);
  const statusText = getStatus(item.expiryDate);
  const statusLower = statusText.toLowerCase();

  const getStatusIcon = () => {
    if (statusLower.includes("expired")) {
      return <FaTimesCircle className="status-icon status-expired" />;
    } else if (statusLower.includes("expiring")) {
      return <FaExclamationTriangle className="status-icon status-warning" />;
    } else {
      return <FaCheckCircle className="status-icon status-safe" />;
    }
  };

  // Pick a gradient class based on index or condition
  const gradientClass = {
    safe: "gradient-blue",
    expiring: "gradient-orange",
    expired: "gradient-pink",
  };

  let gradient = "gradient-purple"; // fallback
  if (statusLower.includes("expired")) gradient = gradientClass["expired"];
  else if (statusLower.includes("expiring"))
    gradient = gradientClass["expiring"];
  else if (statusLower.includes("safe")) gradient = gradientClass["safe"];

  return (
    <div className={`modern-card ${gradient}`}>
      {getStatusIcon()}
      <h3>{item.name}</h3>
      <p>Category: {item.category}</p>
      <p>Type: {item.expiryType}</p>
      <p>Expiry: {new Date(item.expiryDate).toISOString().split("T")[0]}</p>
      <p>Status: {statusText}</p>

      {/* <div className="ranking">Rank: #{item.ranking || "N/A"}</div> */}

      <div className="actions">
        <button>Edit</button>
        <button className="delete-btn" onClick={() => onDelete(item._id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

ItemCard.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    expiryType: PropTypes.string.isRequired,
    expiryDate: PropTypes.string.isRequired,
    ranking: PropTypes.number,
  }).isRequired,
  getStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
