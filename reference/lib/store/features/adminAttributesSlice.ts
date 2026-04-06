import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AdminAttributesState {
  items: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AdminAttributesState = {
  items: [],
  loading: true,
  error: null,
};

export const fetchAttributes = createAsyncThunk(
  'adminAttributes/fetchAttributes',
  async () => {
    const response = await fetch('/api/ecommerce/attributes');
    if (!response.ok) {
      throw new Error('Failed to fetch attributes');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  }
);

const adminAttributesSlice = createSlice({
  name: 'adminAttributes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttributes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttributes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchAttributes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error loading attributes';
      });
  },
});

export const selectAdminAttributes = (state: { adminAttributes: AdminAttributesState }) => state.adminAttributes.items;
export const selectAdminAttributesLoading = (state: { adminAttributes: AdminAttributesState }) => state.adminAttributes.loading;
export const selectAdminAttributesError = (state: { adminAttributes: AdminAttributesState }) => state.adminAttributes.error;

export default adminAttributesSlice.reducer;
