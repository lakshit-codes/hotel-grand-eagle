import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export const fetchVariants = createAsyncThunk(
  'adminVariants/fetchVariants',
  async () => {
    const response = await fetch('/api/ecommerce/variants');
    if (!response.ok) throw new Error('Failed to fetch variants');
    return response.json();
  }
);

interface AdminVariantsState {
  items: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: AdminVariantsState = {
  items: [],
  status: 'idle',
  error: null,
};

const adminVariantsSlice = createSlice({
  name: 'adminVariants',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariants.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchVariants.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchVariants.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Something went wrong';
      });
  },
});

export const selectAdminVariants = (state: RootState) => state.adminVariants.items;
export const selectAdminVariantsLoading = (state: RootState) => state.adminVariants.status === 'loading';

export default adminVariantsSlice.reducer;
