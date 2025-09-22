import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  interviews: [],
  loading: false,
  filter: 'all',
};

const interviewSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    setInterviews: (state, action) => {
      state.interviews = action.payload;
    },
    addInterview: (state, action) => {
      state.interviews.push(action.payload);
    },
    setFilter: (state, action) => {
      state.filter = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setInterviews, addInterview, setFilter, setLoading } = interviewSlice.actions;
export default interviewSlice.reducer;