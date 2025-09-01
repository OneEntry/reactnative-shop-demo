import React from 'react';
import {View} from 'react-native';
import {InputValue} from '../../ui/inputs/AppInput';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {addFieldContactUs} from '../../../state/reducers/ContactUsFieldsReducer';
import CustomInput from '../../shared/CustomInput';

type Props = {
  multiline?: boolean;
  title: string;
  validators?: Record<string, any>;
  marker: string;
  autoCapitalize?: boolean;
  field: InputValue;
};

const ContactUsInput: React.FC<Props> = ({
  multiline,
  title,
  validators,
  autoCapitalize,
  marker,
  field,
}) => {
  const {invalid_input_value} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const dispatch = useAppDispatch();

  const onChange = (value: InputValue) => {
    dispatch(addFieldContactUs({[marker]: value}));
  };

  return (
    <View>
      <CustomInput
        validators={validators}
        title={title}
        value={field}
        setValue={onChange}
        multiline={multiline}
        numberOfLines={5}
        textAlignVertical={multiline ? 'top' : 'center'}
        type={'compact'}
        errorMessage={invalid_input_value}
        autoCapitalize={autoCapitalize ? 'sentences' : 'none'}
      />
    </View>
  );
};

export default ContactUsInput;
