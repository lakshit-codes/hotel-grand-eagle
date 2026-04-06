import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AdminCategoriesState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminCategoriesState = {
  items: [],
  loading: true,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'adminCategories/fetchCategories',
  async () => {
    const response = await fetch('/api/ecommerce/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
);

const adminCategoriesSlice = createSlice({
  name: 'adminCategories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading categories';
      });
  },
});

export const selectAdminCategories = (state: { adminCategories: AdminCategoriesState }) => state.adminCategories.items;
export const selectAdminCategoriesLoading = (state: { adminCategories: AdminCategoriesState }) => state.adminCategories.loading;
export const selectAdminCategoriesError = (state: { adminCategories: AdminCategoriesState }) => state.adminCategories.error;

export default adminCategoriesSlice.reducer;
