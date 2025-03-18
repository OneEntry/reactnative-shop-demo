import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {InputValue} from '../../components/ui/inputs/AppInput';
import {RootState} from '../store';

type InitialStateType = {
  fields: {
    [key: string]: InputValue;
  };
  isVerified?: boolean;
};

const initialState: InitialStateType = {
  fields: {},
};

function getFirstKey(obj: Record<string, InputValue>): string | undefined {
  const keys = Object.keys(obj);
  return keys.length > 0 ? keys[0] : undefined;
}

const signUpFieldsSlice = createSlice({
  name: 'sign-up-fields',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<{[key: string]: InputValue}>) {
      const key = getFirstKey(action.payload);
      if (key) {
        state.fields[key] = action.payload[key];
      }
    },
    clearAllFieldsSignUp(state) {
      state.fields = {};
    },
    verifyPassword(state, action: PayloadAction<boolean>) {
      state.isVerified = action.payload;
    },
  },
});

export const {
  addField: addFieldSignUp,
  clearAllFieldsSignUp,
  verifyPassword,
} = signUpFieldsSlice.actions;

export const getSignUpFieldByMarker = (
  state: RootState,
  marker: string,
): InputValue | undefined => {
  if (!marker) {
    return undefined;
  }

  return state.SignUpFieldsReducer.fields.marker;
};

export default signUpFieldsSlice.reducer;
