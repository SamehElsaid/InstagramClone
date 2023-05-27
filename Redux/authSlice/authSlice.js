import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    email: null,
    userName: null,
    userID: null,
    img: null,
}
const auth = createSlice({
    name: "auth",
    initialState,
    reducers: {
        SET_ACTICE_USER: (state, action) => {
            state.email = action.payload.email
            state.userName = action.payload.userName
            state.userID = action.payload.userID
            state.img = action.payload.urlImg
        },
        REMOVE_ACTICE_USER: (state, action) => {
            state.email = null
            state.userName = null
            state.userID = null
            state.img = null
        },
    }
})
export let { SET_ACTICE_USER, REMOVE_ACTICE_USER} = auth.actions
export default auth.reducer