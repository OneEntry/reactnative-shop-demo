import {InputValue} from '../../components/ui/inputs/AppInput';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';

type InitialStateType = {
  fields: {
    [key: string]: InputValue;
  };
};

const initialState: InitialStateType = {
  fields: {},
};

function getFirstKey(obj: Record<string, InputValue>): string | undefined {
  const keys = Object.keys(obj);
  return keys.length > 0 ? keys[0] : undefined;
}

const contactUsFieldsSlice = createSlice({
  name: 'contact-us-fields',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<{[key: string]: InputValue}>) {
      const key = getFirstKey(action.payload);
      if (key) {
        state.fields[key] = action.payload[key];
      }
    },
    clearAllFieldsContactUs(state) {
      state.fields = {};
    },
  },
});

export const {addField: addFieldContactUs, clearAllFieldsContactUs} = contactUsFieldsSlice.actions;

export default contactUsFieldsSlice.reducer;
