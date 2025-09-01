/* eslint-disable prettier/prettier */
import {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {defineApi} from '../../api';
import {RootState} from '../../state/store';
import {IError} from 'oneentry/dist/base/utils';
import Toast from 'react-native-toast-message';

/**
 * A custom hook that ensures the user's state in the Redux store is synchronized with the server.
 * This hook listens for changes in the `userStateReducer` slice of the Redux store and updates the user's state on the server whenever the state changes.
 * The synchronization only occurs if the user is logged in (`isUser` is true).
 *
 * @hook useSyncUserState
 * @returns {void} This hook does not return any value; it automatically synchronizes the user's state when the component using it is mounted or when `userState` changes.
 */
export const useSyncUserState = () => {
  /**
   * Retrieves the current user state from the `userStateReducer` slice of the Redux store.
   */
  const userState = useSelector((state: RootState) => state.userStateReducer);
  const [isInitialSync, setIsInitialSync] = useState(false);

  /**
   * Effect to synchronize the user's state with the server whenever the `userState` changes.
   * If the user is logged in (`isUser` is true), it sends the updated `cart` and `favorites` data to the server.
   */
  useEffect(() => {
    if (userState.isUser) {
      if (!isInitialSync) {
        userState.favorites.forEach(async favorite => {
          try {
            const productStatusInStock =
              await defineApi.Events.subscribeByMarker(
                'product_status_in_stock',
                Number(favorite),
              );
            if ((productStatusInStock as IError)?.statusCode >= 400) {
              throw new Error(
                (productStatusInStock as IError)?.message ||
                  'Failed to subscribe to product in-stock status',
              );
            }

            const statusOutOfStock = await defineApi.Events.subscribeByMarker(
              'status_out_of_stock',
              Number(favorite),
            );
            if ((statusOutOfStock as IError)?.statusCode >= 400) {
              throw new Error(
                (statusOutOfStock as IError)?.message ||
                  'Failed to subscribe to out-of-stock status',
              );
            }
          } catch (err: any) {
            console.error('Subscription sync failed:', err);
            Toast.show({
              type: 'error',
              text1: err?.message || 'Failed to subscribe to product updates',
            });
          }
        });

        userState.cart.forEach(async cartItem => {
          try {
            const productStatusInStock = await defineApi.Events.subscribeByMarker(
              'product_status_in_stock',
              Number(cartItem.id),
            );
            if ((productStatusInStock as IError)?.statusCode >= 400) {
              throw new Error(
                (productStatusInStock as IError)?.message ||
                  'Failed to subscribe to product in-stock status',
              );
            }

            const statusOutOfStock = await defineApi.Events.subscribeByMarker(
              'status_out_of_stock',
              Number(cartItem.id),
            );
            if ((statusOutOfStock as IError)?.statusCode >= 400) {
              throw new Error(
                (statusOutOfStock as IError)?.message ||
                  'Failed to subscribe to out-of-stock status',
              );
            }
          } catch (err: any) {
            console.error('Subscription sync failed:', err);
            Toast.show({
              type: 'error',
              text1: err?.message || 'Failed to subscribe to product updates',
            });
          }
        });

        setIsInitialSync(true);
      }

      const sync = async () => {
        try {
          const updated = await defineApi.Users.updateUser({
            formIdentifier: 'reg', // Identifier for the user form
            state: {
              cart: userState.cart, // Current cart items from the Redux store
              favorites: userState.favorites, // Current favorite items from the Redux store
            },
          });

          console.log(updated);
          

        } catch (error: any) {
          console.error('Sync failed:', error);
          Toast.show({
            type: 'error',
            text1: error?.message || 'Failed to sync user state',
          });
        }
      };

      sync(); // Call the sync function whenever the effect runs
    } else {
      setIsInitialSync(false);
    }
  }, [userState]); // Dependency array ensures the effect runs whenever `userState` changes
};
