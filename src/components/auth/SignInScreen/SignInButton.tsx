import React, {useEffect, useState} from 'react';
import BigButton from '../../shared/BigButton';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {signInUser, useAuth} from '../../../state/contexts/AuthContext';
import {navigate, navigateAuth} from '../../../navigation/utils/NavigatonRef';
import Toast from 'react-native-toast-message';
import {useAppNavigation} from '../../../navigation/types/types';
import {CommonActions} from '@react-navigation/native';
import {resetScreen} from '../../../state/reducers/lastVisitedScreenSlice';

type Props = {
  login: string;
  password: string;
};

const SignInButton: React.FC<Props> = ({login, password}) => {
  const {sign_in_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {authenticate, user} = useAuth();
  const screen = useAppSelector(state => state.lastVisitedScreenReducer.screen);

  const onSignIn = async () => {
    setIsLoading(true);
    const result = await signInUser(login, password);
    setIsLoading(false);

    if (result.isSuccess) {
      authenticate();
    }
    if (result.isActivation) {
      return navigateAuth('activate_user', {
        email: login,
        method: 'email',
        password: password,
        event: 'activate',
      });
    }
    if (result.error) {
      return Toast.show({
        type: 'error',
        text1: result.error,
      });
    }
  };

  useEffect(() => {
    if (user && screen) {
      navigate(screen);
      dispatch(resetScreen());
    }
  }, [user]);

  return (
    <BigButton
      outline={false}
      disabled={isLoading}
      action={onSignIn}
      title={sign_in_text}
      isLoading={isLoading}
    />
  );
};

export default SignInButton;
