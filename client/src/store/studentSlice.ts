import { createSlice } from '@reduxjs/toolkit';
import type { Student } from '../types/student';

export interface StudentState {
  recent: Student | null;
  loading: boolean;
  error: string | null;
}

const initialState: StudentState = {
  recent: null,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    lookupStart(state) {
      state.loading = true;
      state.error = null;
    },
    lookupSuccess(state, action: { payload: Student }) {
      state.recent = action.payload;
      state.loading = false;
      state.error = null;
    },
    lookupFailure(state, action: { payload: string }) {
      state.loading = false;
      state.error = action.payload;
      state.recent = null;
    },
    clearRecent(state) {
      state.recent = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const { lookupStart, lookupSuccess, lookupFailure, clearRecent } = studentSlice.actions;
export default studentSlice.reducer;
