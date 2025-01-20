import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    status: false,
    userData: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload.userData;
        },
        logout: (state) => {
            state.status = false;
            state.userData = null;
            localStorage.removeItem("token");
        },
    }
});

export const { login, logout } = authSlice.actions;
export const selectUserData = (state) => state.auth.userData;
export const selectAuthStatus = (state) => state.auth.status;
export default authSlice.reducer;
