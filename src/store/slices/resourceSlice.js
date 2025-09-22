import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  questions: [],
  blogs: [],
  selectedCategory: 'frontend',
  loading: false,
  currentPage: 1,
};

const resourceSlice = createSlice({
  name: 'resources',
  initialState,
  reducers: {
    setQuestions: (state, action) => {
      state.questions = action.payload;
    },
    setBlogs: (state, action) => {
      state.blogs = action.payload;
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setQuestions, setBlogs, setCategory, setPage, setLoading } = resourceSlice.actions;
export default resourceSlice.reducer;