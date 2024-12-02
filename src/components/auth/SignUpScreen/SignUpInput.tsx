import React, {useEffect, useState} from 'react';
import NormalInput from '../../shared/NormalInput';
import {IAttributes} from 'oneentry/dist/base/utils';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {InputValue} from '../../ui/inputs/AppInput';
import {addFieldSignUp} from '../../../store/reducers/signUpFieldsReducer';

type Props = {
  field: IAttributes;
  isPassword?: boolean;
  title?: string;
  initialValue?: string;
};

const SignUpInput: React.FC<Props> = ({
  field,
  isPassword,
  title,
  initialValue,
}) => {
  const value = useAppSelector(
    state => state.SignUpFieldsReducer.fields?.[field?.marker],
  );
  const [repeatedPassword, setRepeatedPassword] = useState<string>('');
  const [passwordField, setPasswordField] = useState<any>('');

  const onChangeRepeatedPassword = (value: InputValue) => {
    setRepeatedPassword(value.value);
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isPassword) {
      setPasswordField({
        ...field,
        validators: {
          ...field.validators,
          correctPasswordValidator: repeatedPassword,
        },
      });
    }
  }, [repeatedPassword]);

  const onChangeText = (val: InputValue) => {
    const newValue =
      field?.marker === 'email_reg'
        ? {...val, value: val.value.toLowerCase()}
        : val;
    dispatch(addFieldSignUp({[field?.marker]: newValue}));
  };

  return (
    <>
      <NormalInput
        field={isPassword ? passwordField : field}
        isPassword={isPassword}
        title={title}
        value={value?.value || initialValue}
        setValue={onChangeText}
        keyboardType={
          field?.marker === 'email_reg'
            ? 'email-address'
            : field?.marker === 'phone_reg'
            ? 'phone-pad'
            : 'default'
        }
        textContentType={
          field?.marker === 'email_reg'
            ? 'emailAddress'
            : field?.marker === 'password_reg'
            ? 'newPassword'
            : 'none'
        }
        autoComplete={
          field?.marker === 'email_reg'
            ? 'username-new'
            : field?.marker === 'password_reg'
            ? 'new-password'
            : 'off'
        }
        capitalize={field?.marker !== 'email_reg' ? 'sentences' : 'none'}
        key={field?.marker}
      />
      {isPassword && (
        <NormalInput
          value={repeatedPassword}
          field={{
            ...field,
            validators: {
              requiredValidator: true,
              correctPasswordValidator: value?.value,
            },
          }}
          setValue={onChangeRepeatedPassword}
          textContentType={'newPassword'}
          autoComplete={'new-password'}
          title={'Repeat Password'}
          isPassword
          key={'password_reg_repeat'}
        />
      )}
    </>
  );
};

export default SignUpInput;
