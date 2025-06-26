import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { ShoppingList } from '../../types';

// Define the shape of the slice's state
interface ShoppingListsState {
    lists: ShoppingList[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: ShoppingListsState = {
    lists: [],
    status: 'idle',
    error: null,
};

// Async thunk for fetching shopping lists
export const fetchShoppingLists = createAsyncThunk(
    'shoppingLists/fetchShoppingLists',
    async () => {
        const response = await axios.get('http://localhost:3001/api/shopping-lists');
        return response.data;
    }
);

const shoppingListsSlice = createSlice({
    name: 'shoppingLists',
    initialState,
    reducers: {
        resetStatus: (state) => {
            state.status = 'idle';
        },
        removeList: (state, action) => {
            state.lists = state.lists.filter(list => list.id !== action.payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShoppingLists.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchShoppingLists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.lists = action.payload;
            })
            .addCase(fetchShoppingLists.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message || 'Something went wrong';
            });
    },
});

export const { resetStatus, removeList } = shoppingListsSlice.actions;
export default shoppingListsSlice.reducer; 