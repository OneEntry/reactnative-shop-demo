import {api} from '../api/api';
import {IAuthPostBody} from 'oneentry/dist/auth-provider/authProvidersInterfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IError} from 'oneentry/dist/base/utils';

type LogInProps = {method: string; login: string; password: string};

export const logInUser = async ({method, login, password}: LogInProps) => {
  try {
    const preparedData: IAuthPostBody = {
      authData: [
        {
          marker: 'email_reg',
          value: login,
        },
        {
          marker: 'password_reg',
          value: password,
        },
      ],
    };
    const result = await api.AuthProvider.auth(method, preparedData);

    if ((result as IError)?.statusCode >= 400) {
      throw new Error((result as IError)?.message);
    }

    if (result?.accessToken) {
      return {data: result};
    }
  } catch (e: any) {
    return {error: e.message};
  }
};
type LogOutProps = {marker: string; token?: string};

export const logOutUser = async ({marker}: LogOutProps) => {
  try {
    const token = await AsyncStorage.getItem('refresh-token');
    if (!token) {
      throw Error('No token provided');
    }
    const result = await api.AuthProvider.logout(marker, token);
    if ((result as IError)?.statusCode >= 400) {
      throw new Error((result as IError)?.message);
    }
    return {data: result};
  } catch (e: any) {
    console.log(e);
    return {error: e.message};
  }
};
