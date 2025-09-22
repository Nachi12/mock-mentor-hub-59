import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Interview {
  id: string;
  type: 'behavioral' | 'fullstack' | 'frontend' | 'backend' | 'dsa';
  date: string;
  time: string;
  interviewer: string;
  status: 'upcoming' | 'completed';
  feedback?: string;
  score?: number;
  result?: 'passed' | 'failed' | 'pending';
  resources?: string[];
}

interface InterviewState {
  interviews: Interview[];
  loading: boolean;
  filter: 'all' | 'upcoming' | 'completed';
}

const initialState: InterviewState = {
  interviews: [],
  loading: false,
  filter: 'all',
};

const interviewSlice = createSlice({
  name: 'interviews',
  initialState,
  reducers: {
    setInterviews: (state, action: PayloadAction<Interview[]>) => {
      state.interviews = action.payload;
    },
    addInterview: (state, action: PayloadAction<Interview>) => {
      state.interviews.push(action.payload);
    },
    setFilter: (state, action: PayloadAction<'all' | 'upcoming' | 'completed'>) => {
      state.filter = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setInterviews, addInterview, setFilter, setLoading } = interviewSlice.actions;
export default interviewSlice.reducer;