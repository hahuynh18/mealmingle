import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem, appendItems } from "./pantryListSlice";
import { scanInventoryImage } from "../../../services/apiService";
import { v4 as uuidv4 } from "uuid"; // Using UUID to generate unique IDs

const PantryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector((state) => state.pantryList.items);

  // Removed "id" column so ID is hidden from the UI, but still used internally
  const columns = [
    { key: "productID", label: "Product ID" },
    { key: "name", label: "Name" },
    { key: "category", label: "Category" },
    { key: "quantity", label: "Quantity" },
    { key: "unit", label: "Unit" },
    { key: "expiration", label: "Expiration" },
    { key: "addedDate", label: "Added Date" },
  ];

  const cameraInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleAddItem = () => {
    dispatch(
      addItem({
        name: "New Item",
        quantity: 1,
        unit: "",
        expiration: null,
      })
    );
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };

  const handleUpdateItem = (id) => {
    navigate(`/edit/${id}`);
  };

  const handleScan = async (file) => {
    try {
      // Call backend scan API through the shared services/api file
      const data = await scanInventoryImage(file);

      // Map scanned items => frontend list format
      // Use UUID so IDs are numeric-free and fully unique
      const formatted = data.inventoryItems.map((item) => ({
        id: uuidv4(),
        productID: "",
        quantity: item.quantity,
        unit: "",
        expiration: null,
        addedDate: new Date().toISOString().split("T")[0],
        name: item.name,
        category: item.category,
      }));

      // Append scanned items to the existing pantry list
      dispatch(appendItems(formatted));
      console.log("Scan result:", formatted);
    } catch (err) {
      console.error(err);
    }
  };

  // IMAGE HANDLING FUNCTIONS

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleScan(file);
    e.target.value = null;
  };

  const handleOpenCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleUploadPicture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="pantry-list">
      {/* CAMERA/UPLOAD INPUTS AND BUTTONS */}
      {/* Input for camera access */}
      <input
        type="file"
        accept="image/*"
        capture="environment" // Forces rear camera on mobile
        ref={cameraInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      {/* Input for file upload */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* Buttons to trigger the hidden inputs */}
      <div style={{ marginBottom: "15px" }}>
        <button onClick={handleOpenCamera} className="camera-button">
          Take Photo
        </button>
        <button
          onClick={handleUploadPicture}
          className="upload-button"
          style={{ marginLeft: "10px" }}
        >
          Upload Picture
        </button>
      </div>
      {/* ENDS CAMERA/UPLOAD */}

      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              {columns.map((col) => (
                <td key={col.key}>
                  <div>{item[col.key] || ""}</div>
                </td>
              ))}
              <td>
                <button onClick={() => handleRemoveItem(item.id)}>
                  Remove
                </button>
                <button onClick={() => handleUpdateItem(item.id)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={handleAddItem} className="add-item">
        Add Item
      </button>
    </div>
  );
};

export default PantryList;
