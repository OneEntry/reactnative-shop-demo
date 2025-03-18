import React, {useState} from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import {styleColors} from '../../utils/consts';
import {Alert, View} from 'react-native';
import {Button} from '../../components/ui/buttons/Button';
import {defineApi} from '../../api';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AuthStackNavigatorParamList} from '../../navigation';
import {navigateAuth} from '../../navigation/utils/NavigatonRef';
import NormalInput from '../../components/shared/NormalInput';
import {InputValue} from '../../components/ui/inputs/AppInput';

type Props = {};

const NewPasswordScreen: React.FC<Props> = ({}) => {
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');
  const {
    params: {email, code},
  } = useRoute<RouteProp<AuthStackNavigatorParamList, 'new_password'>>();

  const onChangePass = async () => {
    try {
      const result = await defineApi.AuthProvider.changePassword(
        'email',
        email,
        '2',
        code,
        password,
        password,
      );

      if (result) {
        navigateAuth('auth_sign_in', {method: 'email'});
      }
    } catch (e: any) {
      Alert.alert(e?.message);
    }
  };
  return (
    <Screen white isFull edges={['top', 'horizontal']}>
      <View className={'mt-16'} style={{gap: 15}}>
        <NormalInput
          value={password}
          setValue={(val: InputValue) => setPassword(val.value)}
          title={'New password'}
          isPassword
        />
        <NormalInput
          value={repeatPassword}
          setValue={(val: InputValue) => setRepeatPassword(val.value)}
          title={'Confirm password'}
          isPassword
        />
      </View>
      <View className={'absolute bottom-10 px-layout w-screen'}>
        <Button
          className={`w-full ${
            repeatPassword !== password || password.length === 0
              ? 'bg-gray'
              : 'bg-accent'
          }`}
          paragraphProps={{
            weight: '600',
            style: {color: styleColors.white, fontSize: 20},
          }}
          disabled={repeatPassword !== password || password.length === 0}
          onPress={onChangePass}
          rounded>
          CHANGE PASSWORD
        </Button>
      </View>
    </Screen>
  );
};

export default NewPasswordScreen;
