import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
    items: [
        {id: '1', productID: '101', quantity: 2.8, unit: 'kg', expiration: '2024-12-31', addedDate: '2024-06-01'},
        {id: '2', productID: '102', quantity: 1.5, unit: 'L', expiration: '2024-11-15', addedDate: '2024-06-05'},
        {id: '3', productID: '103', quantity: 12, unit: 'pcs', expiration: '2025-01-10', addedDate: '2024-06-10'}
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
                        productID: '',
                        quantity,
                        unit,
                        expiration,
                        addedDate: new Date().toISOString().split('T')[0],
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