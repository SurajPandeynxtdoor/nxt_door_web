import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User } from "@/types/auth";
import { initiatePhoneAuth, verifyPhoneOTP } from "@/lib/api/auth";
import { jwtDecode } from "jwt-decode";

const initialState: AuthState = {
  isAuthenticated: false,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  user: null,
  isLoading: false,
};

export const sendOTP = createAsyncThunk(
  "auth/sendOTP",
  async (phone: string) => {
    const response = await initiatePhoneAuth(phone);
    return response;
  }
);

export const verifyOTP = createAsyncThunk(
  "auth/verifyOTP",
  async ({ phone, otp }: { phone: string; otp: string }) => {
    const response = await verifyPhoneOTP(phone, otp);
    return response;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload);
        // Decode and set user
        const decoded = jwtDecode<User>(action.payload);
        state.user = {
          _id: decoded._id,
          username: decoded.username,
          firstName: decoded.firstName,
          lastName: decoded.lastName,
          phone: decoded.phone,
          role: decoded.role,
          isSuperAdmin: decoded.isSuperAdmin,
          isActive: decoded.isActive,
        };
      }
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
    openLoginModal: (state) => {
      console.log(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOTP.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.token) {
          state.token = action.payload.token;
          state.isAuthenticated = true;
          if (typeof window !== "undefined") {
            localStorage.setItem("token", action.payload.token);
            const decoded = jwtDecode<User>(action.payload.token);
            state.user = {
              _id: decoded._id,
              username: decoded.username,
              firstName: decoded.firstName,
              lastName: decoded.lastName,
              phone: decoded.phone,
              role: decoded.role,
              isSuperAdmin: decoded.isSuperAdmin,
              isActive: decoded.isActive,
            };
          }
        }
      })
      .addCase(verifyOTP.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setToken, setUser, setLoading, logout, openLoginModal } =
  authSlice.actions;
export default authSlice.reducer;
