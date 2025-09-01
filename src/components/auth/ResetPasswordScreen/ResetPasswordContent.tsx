import React, {useEffect} from 'react';
import {Alert, View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import BigButton from '../../shared/BigButton';
import {defineApi} from '../../../api';
import {navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AuthStackNavigatorParamList} from '../../../navigation';
import {InputValue} from '../../ui/inputs/AppInput';
import {useAppSelector} from '../../../state/hooks';
import CustomInput from '../../shared/CustomInput';
import {IError} from 'oneentry/dist/base/utils';

type Props = {};

/**
 * Component for entering old email and sending a verification code to reset password
 *
 * @component ResetPasswordContent
 * @returns {React.ReactElement} A React element containing the email input field and the submit button.
 */

const ResetPasswordContent: React.FC<Props> = ({}): React.ReactElement => {
  /**
   * Retrieves the email field value from sign in screen.
   */
  const {params} =
    useRoute<RouteProp<AuthStackNavigatorParamList, 'reset_password'>>();

  const {submit_text, email_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const [value, setValue] = React.useState<InputValue>({
    value: '',
    valid: true,
  });

  /**
   * Effect to pre-fill the email field with value from sign in screen.
   */
  useEffect(() => {
    if (params?.email) {
      onChangeText({value: params.email, valid: true});
    }
  }, []);

  const onChangeText = (val: InputValue) => {
    setValue(val);
  };

  const onResetPassword = async () => {
    try {
      const result = await defineApi.AuthProvider.generateCode(
        'email',
        value.value,
        'generate_code',
      );

      if ((result as IError)?.statusCode >= 400) {
        throw new Error((result as IError)?.message);
      }

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
      <CustomInput
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
