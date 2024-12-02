import React, {useContext, useState} from 'react';
import {useAppDispatch, useAppSelector} from '../../../store/hooks';
import {navigateAuth} from '../../../navigation/utils/NavigatonRef';
import {api} from '../../../api';
import {Alert, View} from 'react-native';
import {Button} from '../../ui/buttons/Button';
import {ISignUpData} from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import {logInUser} from '../../../api';
import {AuthContext} from '../../../providers/AuthContext';
import {IError} from 'oneentry/dist/base/utils';
import {clearAllFieldsSignUp} from '../../../store/reducers/signUpFieldsReducer';
import BigButton from "../../shared/BigButton";

type Props = {};

const SignUpButton: React.FC<Props> = ({}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fields = useAppSelector(state => state.SignUpFieldsReducer.fields);
  const {sign_up_title} = useAppSelector(state => state.systemContentReducer.content);
  const {authenticate} = useContext(AuthContext);
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
          arr: Array<{
            marker: string;
            type: string;
            value: string;
          }>,
          field,
        ) => {
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
        const res = await api.AuthProvider.signUp('email', data, 'en_US');
        if (!res || (res as IError)?.statusCode >= 400) {
          throw new Error((res as IError).message);
        }

        //If no activation required, log in user
        if (res.isActive) {
          try {
            await logInUser({
              method: 'email',
              login: res.identifier,
              password: fields.password_reg.value,
            });

            authenticate();
          } catch (e: any) {
            Alert.alert(e.message);
          }
        } else {
          //If activation required, navigate to activation screen
          navigateAuth('activate_user', {
            email: res.identifier,
            method: 'email',
            password: fields.password_reg.value,
            event: 'activate',
          });
          dispatch(clearAllFieldsSignUp());
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
