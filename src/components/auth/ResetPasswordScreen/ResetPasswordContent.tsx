import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import BigButton from '../../shared/BigButton';
import {api} from '../../../api';
import {navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AuthStackNavigatorParamList} from '../../../navigation';
import NormalInput from '../../shared/NormalInput';
import {InputValue} from '../../ui/inputs/AppInput';
import { useAppSelector } from "../../../store/hooks";

type Props = {};

const ResetPasswordContent: React.FC<Props> = ({}) => {
  const {params} =
    useRoute<RouteProp<AuthStackNavigatorParamList, 'reset_password'>>();
  const {submit_text, email_text} = useAppSelector(state => state.systemContentReducer.content);
  const [value, setValue] = React.useState<string>('');

  useEffect(() => {
    if (params?.email) {
      onChangeText({value: params.email, valid: true});
    }
  }, []);

  const onChangeText = (val: InputValue) => {
    setValue(val.value);
  };

  const onResetPassword = async () => {
    try {
      await api.AuthProvider.generateCode('email', value, 'generate_code');
      navigateAuth('activate_user', {
        email: value,
        event: 'reset',
        method: 'email',
      });
    } catch (e: any) {
      Alert.alert(e?.message);
    }
  };

  return (
    <View className={'mt-28 flex-1'} style={{gap: 30}}>
      <NormalInput
        value={value}
        setValue={onChangeText}
        autoCapitalize={'none'}
        keyboardType={'email-address'}
        title={email_text}
        placeholder={'info@example.com'}
      />

      <View className={'absolute bottom-0 w-full'}>
        <BigButton
          paragraphStyle={{color: styleColors.white}}
          className={'bg-accent'}
          action={onResetPassword}
          title={submit_text}
        />
      </View>
    </View>
  );
};

export default ResetPasswordContent;
