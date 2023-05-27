import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    open: false,
    data: [],

}
const story = createSlice({
    name: "story",
    initialState,
    reducers: {
        OPEN_STORY: (state, action) => {
            state.open = true
            state.data = action.payload
         
        },
        CLOSE_STORY: (state, action) => {
            state.open = false
            state.data = []
         
        },
    }
})
export let { OPEN_STORY, CLOSE_STORY} = story.actions
export default story.reducer