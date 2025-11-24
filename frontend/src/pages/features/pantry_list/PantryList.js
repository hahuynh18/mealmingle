import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, updateItem } from './pantryListSlice';

const PantryList = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.pantryList.items);

    const columns = [
        { key: 'id', label: 'ID' },
        { key: 'productID', label: 'Product ID' },
        { key: 'quantity', label: 'Quantity' },
        { key: 'unit', label: 'Unit' },
        { key: 'expiration', label: 'Expiration' },
        { key: 'addedDate', label: 'Added Date' }
    ];

    const cameraInputRef = useRef(null);
    const fileInputRef = useRef(null);

    const handleAddItem = () => {
        dispatch(addItem({ 
            name: 'New Item', 
            quantity: 1, 
            unit: '', 
            expiration: null 
        }));
    };

    const handleRemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    const handleUpdateItem = (id, key, value) => {
        dispatch(updateItem({ id, changes: { [key]: value } }));
    };

    // IMAGE HANDLING FUNCTIONS

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Selected file:', file.name, file);

            event.target.value = null;
        }
    };

    const handleOpenCamera = () => {
        if (cameraInputRef.current){
            cameraInputRef.current.click();
        }
    };

    const handleUploadPicture = () => {
        if (fileInputRef.current){
            fileInputRef.current.click();
        }
    }

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
                style={{ display: 'none' }}
            />
            {/* Input for file upload */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />

            {/* Buttons to trigger the hidden inputs */}
            <div style={{ marginBottom: '15px' }}>
                <button onClick={handleOpenCamera} className="camera-button">
                    Take Photo
                </button>
                <button onClick={handleUploadPicture} className="upload-button" style={{ marginLeft: '10px' }}>
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
                                    <input
                                        type="text"
                                        value={item[col.key] || ''}
                                        onChange={(e) =>
                                            handleUpdateItem(item.id, col.key, e.target.value)
                                        }
                                    />
                                </td>
                            ))}
                            <td>
                                <button onClick={() => handleRemoveItem(item.id)}>Remove</button>
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