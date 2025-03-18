import React, {useEffect} from 'react';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {InputValue} from '../../ui/inputs/AppInput';
import {addFieldSignUp} from '../../../state/reducers/SignUpFieldsReducer';
import CustomInput from '../../shared/CustomInput';
import Skeleton from '../../shared/Skeleton';

type Props = {
  marker: string;
  validators: Record<any, any>;
  isPassword?: boolean;
  title?: string;
  initialValue?: string;
  requiredError?: string;
};

const SignUpInput: React.FC<Props> = ({
  marker,
  validators,
  title,
  initialValue,
  requiredError,
}) => {
  const value = useAppSelector(
    state => state.SignUpFieldsReducer.fields?.[marker],
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    onChangeText({
      value: initialValue || '',
      valid: !validators?.requiredValidator,
    });
  }, []);

  const onChangeText = (val: InputValue) => {
    const newValue =
      marker === 'email_reg' ? {...val, value: val.value?.toLowerCase()} : val;
    dispatch(addFieldSignUp({[marker]: newValue}));
  };

  if (!value) {
    return <Skeleton width={'100%'} height={40} />;
  }
  return (
    <CustomInput
      value={value}
      setValue={val => {
        onChangeText(val);
      }}
      validators={{validators}}
      title={title}
      type={'normal'}
      key={marker}
      errorMessage={!value.value && requiredError}
    />
  );
};

export default SignUpInput;
