import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    documents: [], 
};

const postSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.documents = action.payload; 
        },
        removePost: (state, action) => {
            state.documents = state.documents.filter(post => post.$id !== action.payload); 
        },
        addPost: (state, action) => {
            state.documents.push(action.payload); 
        },
        updatePost: (state, action) => {
          const index = state.documents?.findIndex((post) => post.$id === action.payload.$id);
          if (index !== -1) {
            state.documents[index] = { ...state.documents[index], ...action.payload };
          }
        },
    },
});

export const { setPosts, removePost, addPost ,updatePost} = postSlice.actions;
export default postSlice.reducer;








