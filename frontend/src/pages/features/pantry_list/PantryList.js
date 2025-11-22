import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, removeItem, updateItem } from './pantryListSlice';

const PantryList = () => {
    const dispatch = useDispatch();
    const items = useSelector((state) => state.pantryList.items);

    const columns = ['ID', 'ProductID', 'Quantity', 'Unit', 'Expiration', 'AddedDate'];

    const handleAddItem = () => {
        dispatch(addItem({ name: 'New Item', quantity: 1, unit: '', expiration: null }));
    };

    const handleRemoveItem = (id) => {
        dispatch(removeItem(id));
    };

    const handleUpdateItem = (id, column, value) => {
        dispatch(updateItem({ id, changes: { [column]: value } }));
    };

    return (
        <div className="pantry-list">
            <table>
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col}>{col}</th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            {columns.map((col) => (
                                <td key={col}>
                                    <input
                                        type="text"
                                        value={item[col] || ''}
                                        onChange={(e) =>
                                            handleUpdateItem(item.id, col, e.target.value)
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