import { createAsyncThunk } from "@reduxjs/toolkit";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials: any, { rejectWithValue }) => {
    try {
      const response: any = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Authentication failed");
      }

      return {
        status: response.status,
        user: data.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);

export const getUserThunk = createAsyncThunk(
  "auth/getUser",
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await fetch("/api/login", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Authentication failed");
      }
      return {
        status: response.status,
        user: data.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response: any = await fetch("/api/login", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Authentication failed");
      }
      return {
        status: response.status,
        user: data.user,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "An unexpected error occurred");
    }
  },
);
