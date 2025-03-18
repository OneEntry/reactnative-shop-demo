import React, {Dispatch, memo} from 'react';
import {Alert, Keyboard, View} from 'react-native';
import {useRoute} from '@react-navigation/native';
import {AuthActivateRouteProp} from '../../../navigation/utils/hooks';
import {logInUser, defineApi} from '../../../api';
import {useAuth} from '../../../state/contexts/AuthContext';
import {navigate, navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {IError} from 'oneentry/dist/base/utils';
import {useAppSelector} from '../../../state/hooks';
import useTextManager from '../../../hooks/auth/OTPScreen/useTextManager';
import BigButton from '../../shared/BigButton';

/**
 * A React component that provides a submit button for OTP verification.
 * This component listens for keyboard dismissals and handles OTP verification based on the route parameters.
 *
 * @component OTPButton
 * @param {Props} props - The properties passed to the component.
 * @param {Dispatch<string>} props.setValue - Function to update the OTP code value.
 * @param {string} props.value - The current OTP code value.
 * @returns {React.ReactElement} A React element containing the submit button for OTP verification.
 */
const OTPButton: React.FC<Props> = memo(({setValue, value}) => {
  const {params} = useRoute<AuthActivateRouteProp>();
  const {authenticate} = useAuth();
  const {verify_now_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  /**
   * Handles the submission of the OTP code.
   * Verifies the user based on the route parameters and navigates accordingly.
   */
  const onSubmitPress = async () => {
    if (value.length < 6) {
      return; // Exit early if the OTP code is incomplete.
    }

    Keyboard.dismiss(); // Dismiss the keyboard.

    try {
      // Determine the type of action (activation or password reset)
      if (params.event === 'activate') {
        if (params.method && params.password) {
          const result = await defineApi.AuthProvider.activateUser(
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

            authenticate(); // Trigger re-authentication.
            navigate('home'); // Navigate to the home screen.
          }
        }
      }

      if (params.event === 'reset') {
        const result = await defineApi.AuthProvider.checkCode(
          'email',
          params.email,
          'generate_code',
          value,
        );

        if (result) {
          navigateAuth('new_password', {email: params.email, code: value}); // Navigate to the new password screen.
        } else {
          throw new Error('Incorrect'); // Throw an error if the OTP code is incorrect.
        }
      }
    } catch (e: any) {
      Alert.alert(e.message); // Show an alert for any errors.
    }
  };

  /**
   * Manages the text input and OTP verification logic.
   */
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
        disabled={value.length < 6} // Disable button if OTP code is incomplete.
      />
    </View>
  );
});

/**
 * Type definition for the props of the `OTPButton` component.
 */
type Props = {
  setValue: Dispatch<string>; // Function to update the OTP code value.
  value: string; // The current OTP code value.
};

export default memo(OTPButton);
