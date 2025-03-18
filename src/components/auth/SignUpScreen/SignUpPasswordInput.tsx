import React, {memo, useEffect, useRef, useState} from 'react';
import {TextInput} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {addFieldSignUp} from '../../../state/reducers/SignUpFieldsReducer';
import {InputValue} from '../../ui/inputs/AppInput';
import CustomInput from '../../shared/CustomInput';
import Eye from '../../shared/assets/PasswordVisible.svg';
import ClosedEye from '../../shared/assets/PasswordInvisible.svg';

type Props = {
  title?: string;
  validators?: Record<any, any>;
};

/**
 * A React component that generates a password input field with an additional confirmation field.
 * This component ensures both password fields match and validates the password according to the provided rules.
 *
 * @component SignUpPasswordInput
 * @param {Props} props - The properties passed to the component.
 * @param {Record<string, any>} props.validators - Validators for the password field.
 * @param {string} props.title - Main password input title.
 * @returns {React.ReactElement | null} A React element containing the password and repeat password input fields, or null if required data is missing.
 */
const SignUpPasswordInput: React.FC<Props> = ({
  title,
  validators,
}: Props): React.ReactElement | null => {
  const {password_reg, password_reg_repeat} = useAppSelector(
    state => state.SignUpFieldsReducer.fields,
  );
  const [visible, setVisible] = useState<boolean>(false);
  const passwordInputRef = useRef<TextInput>(null);
  const dispatch = useAppDispatch();

  // Effect to initialize the password fields in Redux
  useEffect(() => {
    dispatch(
      addFieldSignUp({
        password_reg: {
          value: '',
          valid: false,
        },
      }),
    );
  }, []);

  // Function to make sure password comparison always with fresh values
  useEffect(() => {
    if (password_reg) {
      dispatch(
        addFieldSignUp({
          password_reg_repeat: {
            value: password_reg_repeat?.value || '',
            valid:
              (password_reg?.value || undefined) === password_reg_repeat?.value,
          },
        }),
      );
    }
  }, [password_reg]);

  const onChangeText = (val: InputValue, marker: string) => {
    dispatch(addFieldSignUp({[marker]: val}));
  };
  const onReveal = () => {
    setVisible(!visible);
  };

  if (!password_reg || !password_reg_repeat) {
    return null;
  }

  return (
    <>
      <CustomInput
        ref={passwordInputRef}
        Icon={visible ? Eye : ClosedEye}
        onPressIcon={onReveal}
        value={password_reg}
        setValue={val => {
          onChangeText(val, 'password_reg');
        }}
        validators={validators}
        secureTextEntry={!visible}
        title={title}
        type={'normal'}
        key={'pass'}
      />
      <CustomInput
        ref={passwordInputRef}
        Icon={visible ? Eye : ClosedEye}
        onPressIcon={onReveal}
        value={password_reg_repeat}
        setValue={val => {
          onChangeText(val, 'password_reg_repeat');
        }}
        validators={{correctPasswordValidator: password_reg.value}}
        secureTextEntry={!visible}
        title={'Repeat ' + title}
        type={'normal'}
        key={'repeat-pass'}
      />
    </>
  );
};

export default memo(SignUpPasswordInput);
