import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Question {
  id: string;
  question: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'behavioral';
  difficulty: 'easy' | 'medium' | 'hard';
  answer?: string;
}

export interface Blog {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  category: string;
  date: string;
}

interface ResourceState {
  questions: Question[];
  blogs: Blog[];
  selectedCategory: 'frontend' | 'backend' | 'fullstack' | 'behavioral';
  loading: boolean;
  currentPage: number;
}

const initialState: ResourceState = {
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
    setQuestions: (state, action: PayloadAction<Question[]>) => {
      state.questions = action.payload;
    },
    setBlogs: (state, action: PayloadAction<Blog[]>) => {
      state.blogs = action.payload;
    },
    setCategory: (state, action: PayloadAction<'frontend' | 'backend' | 'fullstack' | 'behavioral'>) => {
      state.selectedCategory = action.payload;
      state.currentPage = 1;
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setQuestions, setBlogs, setCategory, setPage, setLoading } = resourceSlice.actions;
export default resourceSlice.reducer;