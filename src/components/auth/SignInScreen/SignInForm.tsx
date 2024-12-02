import React, {useContext, useRef, useState} from 'react';
import {Alert, TextInput, TouchableOpacity, View} from 'react-native';
import {AuthStackNavigatorParamList} from '../../../navigation';
import {Paragraph} from '../../ui/texts/Paragraph';
import {Button} from '../../ui/buttons/Button';
import CreateAccountButton from '../../shared/CreateAccountButton';
import {logInUser} from '../../../api';
import {AuthContext} from '../../../providers/AuthContext';
import {navigate, navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {RouteProp, useRoute} from '@react-navigation/native';
import NormalInput from '../../shared/NormalInput';
import {InputValue} from '../../ui/inputs/AppInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-controller';
import BigButton from '../../shared/BigButton';
import {useAppSelector} from '../../../store/hooks';

type Props = {};

const SignInForm: React.FC<Props> = ({}) => {
  const [password, setPassword] = useState<string>('');
  const [login, setLogin] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const {authenticate} = useContext(AuthContext);
  const {params} =
    useRoute<RouteProp<AuthStackNavigatorParamList, 'auth_sign_in'>>();
  const passwordInputRef = useRef<TextInput>(null);
  const {sign_in_text, reset_title, forgot_password_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const onChangePassword = (val: InputValue) => {
    setPassword(val.value);
  };

  const onChangeLogin = (val: InputValue) => {
    setLogin(val.value.toLowerCase());
  };

  const onRequestResetPassword = async () => {
    navigateAuth('reset_password', {email: login});
  };

  const onSignIn = async () => {
    setLoading(true);
    try {
      const result = await logInUser({
        method: 'email',
        login,
        password,
      });

      if (result?.error) {
        throw new Error(result?.error);
      }
      authenticate();
      navigate('home');
    } catch (e: any) {
      if (e.message.includes('User is not activated')) {
        navigateAuth('activate_user', {
          email: login,
          method: 'email',
          password: password,
          event: 'activate',
        });
      } else {
        Alert.alert(e.message);
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{flex: 1}}>
      <View className={'mt-16'}>
        {/*Will be possible to use few login methods*/}
        {params?.method === 'email' && (
          <View style={{gap: 15}}>
            <NormalInput
              value={login}
              setValue={onChangeLogin}
              autoCapitalize={'none'}
              keyboardType={'email-address'}
              placeholder={'example@mail.ru'}
              title={'Your email'}
              returnKeyType={'next'}
              textContentType={'emailAddress'}
              onSubmitEditing={() => passwordInputRef.current?.focus()}
              autoComplete={'username'}
            />
            <NormalInput
              value={password}
              setValue={onChangePassword}
              isPassword
              title={'Password'}
              placeholder={'Your password'}
              textContentType={'password'}
              ref={passwordInputRef}
              autoComplete={'password'}
            />
          </View>
        )}
        {params?.method === 'phone' && (
          <NormalInput
            value={login}
            setValue={onChangeLogin}
            autoCapitalize={'none'}
            keyboardType={'phone-pad'}
            placeholder={'+1'}
            title={'Your phone'}
          />
        )}
      </View>
      <View className={'absolute w-full bottom-11'}>
        <View className={'mb-10'}>
          <BigButton
            outline={false}
            disabled={loading}
            action={onSignIn}
            title={sign_in_text}
            isLoading={loading}
          />
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
