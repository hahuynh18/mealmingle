import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    items: [
        {ID: '1', ProductID: '101', Quantity: 2.8, Unit: 'kg', Expiration: '2024-12-31', AddedDate: '2024-06-01'},
        {ID: '2', ProductID: '102', Quantity: 1.5, Unit: 'L', Expiration: '2024-11-15', AddedDate: '2024-06-05'},
        {ID: '3', ProductID: '103', Quantity: 12, Unit: 'pcs', Expiration: '2025-01-10', AddedDate: '2024-06-10'}
    ],
    status: 'idle',
    error: null
};

const pantryListSlice = createSlice({
    name: 'pantryList',
    initialState,
    reducers: {
        addItem: {
            reducer(state, action) {
                state.items.push(action.payload);
            },
            prepare({ name, quantity = 1, unit = '', expiration = null }) {
                return {
                    payload: {
                        id: nanoid(),
                        name,
                        quantity,
                        unit,
                        expiration,
                        selected: false
                    }
                };
            }
        },
        updateItem(state, action) {
            // payload: { id, changes }
            const { id, changes } = action.payload;
            const item = state.items.find(i => i.id === id);
            if (item) {
                Object.assign(item, changes);
            }
        },
        removeItem(state, action) {
            // payload: id
            state.items = state.items.filter(i => i.id !== action.payload);
        },
        incrementQuantity(state, action) {
            // payload: id
            const item = state.items.find(i => i.id === action.payload);
            if (item) item.quantity = (item.quantity || 0) + 1;
        },
        decrementQuantity(state, action) {
            // payload: id
            const item = state.items.find(i => i.id === action.payload);
            if (item && (item.quantity || 0) > 0) item.quantity -= 1;
        },
        toggleSelected(state, action) {
            // payload: id
            const item = state.items.find(i => i.id === action.payload);
            if (item) item.selected = !item.selected;
        },
        clearPantry(state) {
            state.items = [];
        },
        setItems(state, action) {
            // payload: array of items (should match item shape)
            state.items = action.payload || [];
        }
    }
});

export const {
    addItem,
    updateItem,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    toggleSelected,
    clearPantry,
    setItems
} = pantryListSlice.actions;

export default pantryListSlice.reducer;