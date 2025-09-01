import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type InitialStateType = {
  screen: string;
};

const initialState: InitialStateType = {
  screen: '',
};

const lastVisitedScreenSlice = createSlice({
  name: 'last-screen',
  initialState,
  reducers: {
    setScreen(state, action: PayloadAction<string>) {
      state.screen = action.payload;
    },
    resetScreen(state) {
      state.screen = '';
    },
  },
});

export const {setScreen, resetScreen} = lastVisitedScreenSlice.actions;

export default lastVisitedScreenSlice.reducer;
