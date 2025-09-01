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

const contactUsFieldsSlice = createSlice({
  name: 'contact-us-fields',
  initialState,
  reducers: {
    addField(state, action: PayloadAction<{[key: string]: InputValue}>) {
      state.fields = {
        ...state.fields,
        ...action.payload,
      };
    },
    clearAllFieldsContactUs(state) {
      state.fields = {};
    },
  },
});

export const {addField: addFieldContactUs, clearAllFieldsContactUs} =
  contactUsFieldsSlice.actions;

export default contactUsFieldsSlice.reducer;
