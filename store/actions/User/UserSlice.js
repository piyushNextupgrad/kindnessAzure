import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'userData',
    initialState: {
        userDetails: {}
    },
    reducers: {
        userDetailsData: (state, action) => {
            state.userDetails = action.payload
        },

    },
  
})

export const userDetailsAction = userSlice.actions;

export default userSlice.reducer;