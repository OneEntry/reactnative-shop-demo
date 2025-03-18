import React, {useRef, useState} from 'react';
import {TextInput, TouchableOpacity, View} from 'react-native';
import {AuthStackNavigatorParamList} from '../../../navigation';
import {Paragraph} from '../../ui/texts/Paragraph';
import CreateAccountButton from '../../shared/CreateAccountButton';
import {navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {RouteProp, useRoute} from '@react-navigation/native';
import {InputValue} from '../../ui/inputs/AppInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import {useAppSelector} from '../../../state/hooks';
import SignInButton from './SignInButton';
import CustomInput from '../../shared/CustomInput';
import Eye from '../../shared/assets/PasswordVisible.svg';
import ClosedEye from '../../shared/assets/PasswordInvisible.svg';

type Props = {};

/**
 * A React component that dynamically generates a sign-in form based on the specified login method.
 * This component supports email-based login and includes input fields for email and password.
 *
 * @component SignInForm
 * @returns {React.ReactElement} A React element containing the sign-in form inputs and buttons.
 */

const SignInForm: React.FC<Props> = ({}): React.ReactElement => {
  // Login and password state
  const [password, setPassword] = useState<InputValue>({
    valid: false,
    value: '',
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [login, setLogin] = useState<InputValue>({value: '', valid: true});

  // Reference to the password input field
  const passwordInputRef = useRef<TextInput>(null);

  const {params} =
    useRoute<RouteProp<AuthStackNavigatorParamList, 'auth_sign_in'>>();

  const {reset_title, forgot_password_text, email_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const onChangePassword = (val: InputValue) => {
    setPassword(val);
  };

  const onReveal = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const onChangeLogin = (val: InputValue) => {
    setLogin(val);
  };

  const onRequestResetPassword = async () => {
    navigateAuth('reset_password', {email: login.value});
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
      <View className={'mt-16'}>
        {params?.method === 'email' && (
          <View style={{gap: 15}}>
            <CustomInput
              value={login}
              setValue={onChangeLogin}
              keyboardType={'email-address'}
              placeholder={'example@mail.ru'}
              title={email_text}
              returnKeyType={'next'}
              // Jump to password field after finished with login
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoComplete={'username'}
              autoCapitalize={'none'}
            />

            <CustomInput
              value={password}
              setValue={onChangePassword}
              title={'Password'}
              placeholder={'Your password'}
              textContentType={'password'}
              ref={passwordInputRef}
              autoComplete={'password'}
              secureTextEntry={!isPasswordVisible}
              Icon={isPasswordVisible ? Eye : ClosedEye}
              onPressIcon={onReveal}
            />
          </View>
        )}
      </View>

      <View className={'absolute w-full bottom-11'}>
        <View className={'mb-10'}>
          <SignInButton password={password.value} login={login.value} />
          <View className={'flex-row mt-2.5 items-center justify-between'}>
            <Paragraph size={20}>{forgot_password_text}</Paragraph>
            <TouchableOpacity onPress={onRequestResetPassword}>
              <Paragraph
                color={'background'}
                size={20}
                style={{textDecorationLine: 'underline'}}>
                {reset_title}
              </Paragraph>
            </TouchableOpacity>
          </View>
        </View>
        <CreateAccountButton />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignInForm;
