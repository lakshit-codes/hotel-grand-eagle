import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUserThunk, loginThunk, logoutThunk } from "./authThunks";

interface User {
  userName?: string;
  password?: string;
  role?: string;
  email?: string;
  id?: string;
  _id?: string;
}

interface AuthState {
  nestCraftUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  nestCraftUser: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ user: User }>) => {
      state.nestCraftUser = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
    },
    logout: (state) => {
      state.nestCraftUser = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action: any) => {
        state.nestCraftUser = action.payload.user;

        state.isAuthenticated = true;

        state.isLoading = false;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getUserThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state, action: any) => {
        state.nestCraftUser = action.payload.user;

        state.isAuthenticated = true;

        state.isLoading = false;
        state.error = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state, action: any) => {
        state.nestCraftUser = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      })
      .addCase(logoutThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;
