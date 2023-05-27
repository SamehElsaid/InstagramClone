import { configureStore } from "@reduxjs/toolkit";
import auth from "./authSlice/authSlice";
import likes from "./likesSlice/likesSlice";
import story from "./storeSlice/storeSlice";

const store = configureStore({
  reducer: {
    auth,
    likes,
    story,
  },
});
export default store;
