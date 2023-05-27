import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false,
    data: [],

}
const likes = createSlice({
    name: "likes",
    initialState,
    reducers: {
        OPEN_LIKES: (state, action) => {
            state.open = true
            state.data = action.payload
         
        },
        CLOSE_LIKES: (state, action) => {
            state.open = false
            state.data = []
         
        },
    }
})
export let { OPEN_LIKES, CLOSE_LIKES} = likes.actions
export default likes.reducer