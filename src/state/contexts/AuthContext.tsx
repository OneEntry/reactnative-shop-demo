/**
 * A React Context that manages user authentication and session state.
 * This context handles token validation, user data fetching, push notification registration,
 * and error handling for authentication-related operations.
 *
 * @namespace AuthContext
 */
import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {defineApi, reDefine} from '../../api';
import {useLazyGetMeQuery} from '../../api';
import {IUserEntity} from 'oneentry/dist/users/usersInterfaces';
import {LanguageContext} from './LanguageContext';
import {useAppDispatch} from '../hooks';
import {IError} from 'oneentry/dist/base/utils';
import {IPagesEntity} from 'oneentry/dist/pages/pagesInterfaces';
import {useSyncUserState} from '../../hooks/shared/useSyncUserState';
import {initializeUserState, resetUserState} from '../reducers/userStateSlice';
import {useNotifications} from '../../hooks/shared/useNotifications';
import {
  IAuthPostBody,
  ISignUpData,
} from 'oneentry/dist/auth-provider/authProvidersInterfaces';

type ContextProps = {
  isLoading: boolean;
  userToken?: string;
  errorPage?: IPagesEntity;
  user?: IUserEntity;
  authenticate: () => void;
  logOutUser: () => void;
};

/**
 * Creates a React Context for managing user authentication.
 * Provides default values for the context.
 */
export const AuthContext = createContext<ContextProps>({
  isLoading: false,
  authenticate: () => {},
  logOutUser: () => {},
});

type Props = {
  children: ReactNode;
};

/**
 * Provider component for the AuthContext.
 * Manages user authentication, session state, and related operations.
 *
 * @component AuthProvider
 * @param {Props} props - The properties passed to the provider.
 * @param {ReactNode} props.children - The child components wrapped by the provider.
 * @returns {JSX.Element} A React element wrapping the child components with the AuthContext.
 */
export const AuthProvider = ({children}: Props) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  /**
   * Lazy query to fetch the current user's data.
   */
  const [getUser, {data: user, error, reset: resetQuery}] = useLazyGetMeQuery({
    pollingInterval: 10000,
  });
  /**
   * Synchronizes the user's cart and favorites state with the server.
   */
  useSyncUserState();
  /**
   * Retrieves the active language from the LanguageContext to refresh user on language change.
   */
  const {activeLanguage} = useContext(LanguageContext);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<IPagesEntity | undefined>();
  const dispatch = useAppDispatch();

  //--Push notifications management--
  /**
   * Retrieves the FCM push notification token.
   */
  const {token: pushToken} = useNotifications();
  const [isTokenSet, setIsTokenSet] = useState<boolean>(false);

  /**
   * Updates the user's FCM push notification token on the server.
   */
  const updatePushToken = async () => {
    try {
      const res = await defineApi.Users.addFCMToken(pushToken);
      if ((res as IError)?.statusCode > 400) {
        throw new Error((res as IError)?.message);
      }
      setIsTokenSet(true); // Mark the token as set after successful update.
    } catch (e) {
      console.log('=>(AuthContext.tsx:95) e', e);
    }
  };

  /**
   * Effect to update the FCM token when the user or token changes.
   */
  useEffect(() => {
    if (pushToken && !isTokenSet && user) {
      updatePushToken().then(() => {});
    }
  }, [user, pushToken]);

  //--------------------------------

  /**
   * Initial user render
   */
  const onInit = async () => {
    const refresh = await AsyncStorage.getItem('refresh-token');
    reDefine(refresh || '', activeLanguage);

    await validateToken();
  };

  /**
   * Handles errors during token validation or user data fetching.
   *
   * @param {any} e - The error object.
   */
  const handleError = async (e?: any) => {
    if (e?.pageData) {
      setErrorPage(e?.pageData);
    }
    await AsyncStorage.setItem('refresh-token', '');
    resetQuery();
    dispatch(resetUserState());
    setIsLoading(false);
  };

  /**
   * Method to log the user out by calling method from API.
   */
  const logOutUser = async () => {
    try {
      setIsLoading(true);
      const refreshToken = await AsyncStorage.getItem('refresh-token');
      const response = await defineApi.AuthProvider.logout(
        'email',
        refreshToken || '',
      );
      // @ts-ignore
      if (response.statusCode >= 400) throw new Error(response.message);
    } catch (error) {
      console.log('log out error');
    } finally {
      await validateToken();
      setIsLoading(false);
    }
  };

  /**
   * Fetches the user data and checking for error.
   */
  const validateToken = async () => {
    try {
      const res = await getUser({});
      if (res?.error) {
        throw res.error;
      }
      if (res.data) {
        dispatch(initializeUserState(res.data.state));
      }
    } catch (e: any) {
      await handleError(e);
    }
  };

  /**
   * Effect to initialize the context when the language changes or re-authentication is triggered.
   */
  useEffect(() => {
    setIsLoading(true);
    onInit().then(() => setIsLoading(false)); // Initialize and stop loading.
  }, [refetch, activeLanguage]);

  /**
   * Handles errors from the `useLazyGetMeQuery` hook.
   */
  const onError = async () => {
    const refresh = await AsyncStorage.getItem('refresh-token');

    if (!refresh) {
      return setIsLoading(false);
    }

    validateToken().then(() => {});
  };

  useEffect(() => {
    if (error) {
      onError();
    }
  }, [error]);

  const value = {
    isLoading,
    user,
    logOutUser,
    errorPage,
    authenticate: () => setRefetch(!refetch),
    signInUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access the AuthContext.
 *
 * @function useAuth
 * @returns {ContextProps} The context value containing authentication-related data and functions.
 */
export const useAuth = (): ContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface MethodResult {
  isActivation: boolean;
  error: string;
  isSuccess: boolean;
}

/**
 * Signs in a user with the provided login credentials.
 *
 * @async
 * @param {string} login - The user's login identifier (e.g., email).
 * @param {string} password - The user's password.
 * @returns {Promise<MethodResult>}
 *          An object containing the result of the sign-in process:
 *          - `isActivation`: Indicates if the user needs to activate their account.
 *          - `error`: Contains an error message if the process fails.
 *          - `isSuccess`: Indicates if the sign-in was successful.
 * @throws {Error} Throws an error if the API response contains a status code >= 400 or other unexpected issues.
 */
export const signInUser = async (
  login: string,
  password: string,
): Promise<MethodResult> => {
  const methodResult: MethodResult = {
    isActivation: false,
    error: '',
    isSuccess: false,
  };
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
    const provider = 'email';
    const result = await defineApi.AuthProvider.auth(provider, preparedData);

    if ((result as IError)?.statusCode >= 400) {
      throw new Error((result as IError)?.message);
    }

    if (result.accessToken) {
      await AsyncStorage.setItem('refresh-token', result.refreshToken);
      methodResult.isSuccess = true;
    } else {
      methodResult.error = 'No access token';
    }
  } catch (e: any) {
    if (e.message.includes('User is not activated')) {
      methodResult.isActivation = true;
    } else {
      methodResult.error = e?.message;
    }
  }
  return methodResult;
};

/**
 * Registers a new user with the provided data and password.
 *
 * @async
 * @param {ISignUpData} data - The user's registration data (e.g., name, email, etc.).
 * @param {string} password - The user's password.
 * @returns {Promise<MethodResult>}
 *          An object containing the result of the registration process:
 *          - `isActivation`: Indicates if the user needs to activate their account.
 *          - `error`: Contains an error message if the process fails.
 *          - `isSuccess`: Indicates if the registration was successful.
 * @throws {Error} Throws an error if the API response contains a status code >= 400 or other unexpected issues.
 */
export const signUpUser = async (
  data: ISignUpData,
  password: string,
): Promise<MethodResult> => {
  let methodResult = {
    isActivation: false,
    error: '',
    isSuccess: false,
  };
  try {
    const registration = await defineApi.AuthProvider.signUp('email', data, 'en_US');
    if (!registration || (registration as IError)?.statusCode >= 400) {
      throw new Error((registration as IError).message);
    }

    // If no activation required, log in the user automatically
    if (registration.isActive) {
      const result = await signInUser(registration.identifier, password);
      return result;
    } else {
      methodResult.isActivation = true;
    }
  } catch (e: any) {
    methodResult.error = e?.message;
  }

  return methodResult;
};
