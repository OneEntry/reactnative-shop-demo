import {api} from '../api/api';
import {IError} from 'oneentry/dist/base/utils';

export const updateUserState = async ({
  favorites,
  cart,
}: {
  favorites?: number[];
  cart?: {id: number; quantity: number}[];
}) => {
  try {
    const res = await api.Users.updateUser({
      formIdentifier: 'reg',
      state: {
        ...(favorites && {favorites}),
        ...(cart && {cart}),
      },
    });

    if (!res || (res as IError)?.statusCode) {
      return false;
    }

    if (res === true) {
      return true;
    }
  } catch (e) {}
};
