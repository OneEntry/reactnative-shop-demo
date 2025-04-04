import React, {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {navigate, navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {Alert, View} from 'react-native';
import {ISignUpData} from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import {
  signUpUser,
  useAuth,
} from '../../../state/contexts/AuthContext';
import {clearAllFieldsSignUp} from '../../../state/reducers/SignUpFieldsReducer';
import BigButton from '../../shared/BigButton';
import Toast from 'react-native-toast-message';

type Props = {};

const SignUpButton: React.FC<Props> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fields = useAppSelector(state => state.SignUpFieldsReducer.fields);
  const {sign_up_title} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const {authenticate} = useAuth();
  const dispatch = useAppDispatch();

  const onSignUp = async () => {
    // Check if all fields are valid
    const canSubmit = Object.keys(fields).reduce((isValid, field) => {
      if (!isValid) {
        return false;
      }

      return fields[field].valid;
    }, true);

    setIsLoading(true);

    if (canSubmit) {
      // Prepare form data for sign up submission
      const formData = Object.keys(fields).reduce(
        (
          arr: {
            marker: string;
            type: string;
            value: string;
          }[],
          field,
        ) => {
          if (field === 'password_reg_repeat') {
            return arr;
          }
          if (field === 'phone_reg' && fields[field].value.length === 1) {
            return arr;
          }
          const candidate = {
            marker: field,
            type: 'string',
            value: fields[field].value,
          };
          arr.push(candidate);
          return arr;
        },
        [],
      );
      formData.push({
        marker: 'email_notifications',
        type: 'string',
        value: fields.email_reg.value,
      });

      //Prepare data for sign up submission
      const data: ISignUpData = {
        formIdentifier: 'reg',
        authData: [
          {marker: 'email_reg', value: fields.email_reg.value},
          {marker: 'password_reg', value: fields.password_reg.value},
        ],
        formData,
        notificationData: {
          email: fields.email_reg.value,
          phonePush: [],
          phoneSMS:
            fields.phone_reg.value?.length > 1
              ? fields.phone_reg.value
              : '+19991234567',
        },
      };
      try {
        const result = await signUpUser(data, fields.password_reg.value);

        if (result.isSuccess) {
          authenticate();
          navigate('home');
        }

        if (result.isActivation) {
          navigateAuth('activate_user', {
            email: fields.email_reg.value,
            method: 'email',
            password: fields.password_reg.value,
            event: 'activate',
          });
          dispatch(clearAllFieldsSignUp());
        }
        if (result.error) {
          Toast.show({
            type: 'error',
            text1: result.error,
          });
        }
      } catch (e: any) {
        Alert.alert(e?.message);
      }
      setIsLoading(false);
    }
  };
  return (
    <View className={'absolute bottom-10 px-layout w-screen'}>
      <BigButton
        action={onSignUp}
        title={sign_up_title}
        isLoading={isLoading}
        outline={false}
      />
    </View>
  );
};

export default SignUpButton;
