import {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, reDefine, RTKApi} from '../api/index';
import {useLazyGetMeQuery} from '../api';
import {IUserEntity} from 'oneentry/dist/users/usersInterfaces';
import {LanguageContext} from './LanguageContext';
import {useNotifications} from '../utils/hooks';
import {useAppDispatch, useAppSelector} from '../store/hooks';
import {
  addFavorites,
  removeAllFavorites,
} from '../store/reducers/FavoritesSlice';
import {
  addProductToCart,
  CartState,
  removeAllProductsFromCart,
} from '../store/reducers/CartSlice';
import {IError} from 'oneentry/dist/base/utils';
import {IPagesEntity} from 'oneentry/dist/pages/pagesInterfaces';
import {updateUserState} from '../api/utils/updateUserState';

type ContextProps = {
  isAuth: boolean;
  isLoading: boolean;
  userToken?: string;
  errorPage?: IPagesEntity;
  user?: IUserEntity;
  refreshUser: () => void;
  authenticate: () => void;
};

export const AuthContext = createContext<ContextProps>({
  isAuth: false,
  isLoading: false,
  authenticate: () => {},
  refreshUser: () => {},
});

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({children}: Props) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [user, setUser] = useState<IUserEntity | undefined>();
  const [refetch, setRefetch] = useState<boolean>(false);
  const [isTokenSet, setIsTokenSet] = useState<boolean>(false);
  const [errorPage, setErrorPage] = useState<IPagesEntity | undefined>();
  const [getUser, {isError}] = useLazyGetMeQuery({
    pollingInterval: user ? 5000 : 0,
  });
  const {activeLanguage} = useContext(LanguageContext);
  const {token} = useNotifications();
  const dispatch = useAppDispatch();
  const oldCart = useAppSelector(state => state.cartReducer.products);
  const oldFavorites = useAppSelector(state => state.favoritesReducer.products);

  const onInit = async () => {
    const refresh = await AsyncStorage.getItem('refresh-token');
    console.log(refresh);
    reDefine(refresh || '', activeLanguage);

    setIsAuth(true);
    await checkToken();
  };

  const userFoundCallback = async (data: IUserEntity) => {
    setUser(data);
    setIsAuth(true);
    let newFavorites: number[] = [];
    let newCart: CartState[] = [];
    if (data?.state?.favorites && typeof data?.state?.favorites === 'object') {
      const favorites = data?.state?.favorites;
      newFavorites = [...favorites];
      oldFavorites.forEach((oldItem: number) => {
        if (!newFavorites.some(newItem => newItem === oldItem)) {
          newFavorites.push(oldItem);
        }
      });
      dispatch(addFavorites(newFavorites));
    }
    if (data?.state?.cart && typeof data?.state?.cart === 'object') {
      const cart = data?.state?.cart;
      newCart = [...cart];
      oldCart.forEach((oldItem: CartState) => {
        if (!newCart.some(newItem => newItem.id === oldItem.id)) {
          newCart.push(oldItem);
        }
      });

      cart?.forEach((item: CartState) => {
        dispatch(addProductToCart(item));
      });
    }

    if (
      newCart !== data?.state?.cart ||
      newFavorites !== data?.state?.favorites
    ) {
      await updateUserState({
        favorites: newFavorites,
        cart: newCart,
      });
    }
  };

  const authenticationErrorCallback = async () => {
    const refresh = await AsyncStorage.getItem('refresh-token');
    // @ts-ignore
    if (!refresh) {
      return;
    }

    checkToken().then(() => {});
  };

  //if user found should update push notifications token
  const updatePushToken = async () => {
    try {
      const res = await api.Users.addFCMToken(token);
      if ((res as IError)?.statusCode > 400) {
        throw new Error((res as IError)?.message);
      }
      setIsTokenSet(true);
    } catch (e) {
      console.log('=>(AuthContext.tsx:95) e', e);
    }
  };

  // Check if token is valid
  const checkToken = async () => {
    try {
      const res = await getUser({});
      if (res?.error) {
        throw res.error;
      }
      if (res.data) {
        userFoundCallback(res.data);
      }
    } catch (e: any) {
      setErrorPage(e?.pageData);
      await AsyncStorage.setItem('refresh-token', '');
      setUser(undefined);
      dispatch(removeAllFavorites());
      dispatch(removeAllProductsFromCart());
    }
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(removeAllFavorites());
    dispatch(removeAllProductsFromCart());
    onInit().then(() => {});
    setIsLoading(false);
  }, [refetch, activeLanguage]);

  useEffect(() => {
    if (isError) {
      authenticationErrorCallback().then(() => {});
    }
  }, [isError]);

  useEffect(() => {
    if (token && !isTokenSet && isAuth && user) {
      updatePushToken().then(() => {});
    }
  }, [user, token]);

  const value = {
    isAuth,
    isLoading,
    user,
    refreshUser: () => setRefetch(!refetch),
    errorPage: errorPage,
    authenticate: () => setRefetch(!refetch),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
