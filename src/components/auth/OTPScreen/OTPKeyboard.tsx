import React, {Dispatch, memo, useContext} from 'react';
import {Alert, Keyboard, View} from 'react-native';
import {proportionY, styleColors} from '../../../utils/consts';
import {Button} from '../../ui/buttons/Button';
import {useRoute} from '@react-navigation/native';
import {AuthActivateRouteProp} from '../../../navigation/utils/hooks';
import {logInUser, api} from '../../../api';
import {AuthContext} from '../../../providers/AuthContext';
import {navigate, navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {IError} from 'oneentry/dist/base/utils';
import {useAppSelector} from '../../../store/hooks';
import useTextManager from './hooks/useTextManager';
import BigButton from '../../shared/BigButton';

type Props = {
  setValue: Dispatch<string>;
  value: string;
};

const OtpKeyboard: React.FC<Props> = ({setValue, value}) => {
  const {params} = useRoute<AuthActivateRouteProp>();
  const {authenticate} = useContext(AuthContext);
  const {verify_now_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const onSubmitPress = async () => {
    if (value.length < 6) {
      return;
    }
    Keyboard.dismiss();
    try {
      //Detect type of action
      if (params.event === 'activate') {
        if (params.method && params.password) {
          const result = await api.AuthProvider.activateUser(
            params.method,
            params.email,
            value,
          );

          if ((result as IError).statusCode > 400) {
            throw new Error((result as IError).message);
          }

          if (result) {
            await logInUser({
              method: 'email',
              login: params.email,
              password: params.password,
            });

            authenticate();
            navigate('home');
          }
        }
      }

      if (params.event === 'reset') {
        navigateAuth('new_password', {email: params.email, code: value});
      }
    } catch (e: any) {
      Alert.alert(e.message);
    }
  };

  const {onSubmit} = useTextManager({
    maxLength: 6,
    onPress: setValue,
    onSubmitPress,
  });

  return (
    <View
      className={
        'absolute items-center justify-center w-full mx-layout bottom-menu'
      }>
      <BigButton
        action={onSubmit}
        title={verify_now_text}
        outline={false}
        disabled={value.length < 6}
      />
    </View>
  );
};

export default memo(OtpKeyboard);
