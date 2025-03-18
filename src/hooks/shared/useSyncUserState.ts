import {useEffect} from 'react';
import {useSelector} from 'react-redux';
import {defineApi} from '../../api';
import {RootState} from '../../state/store';

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

  /**
   * Effect to synchronize the user's state with the server whenever the `userState` changes.
   * If the user is logged in (`isUser` is true), it sends the updated `cart` and `favorites` data to the server.
   */
  useEffect(() => {
    if (userState.isUser) {
      const sync = async () => {
        try {
          await defineApi.Users.updateUser({
            formIdentifier: 'reg', // Identifier for the user form
            state: {
              cart: userState.cart, // Current cart items from the Redux store
              favorites: userState.favorites, // Current favorite items from the Redux store
            },
          });
        } catch (error) {
          console.error('Sync failed:', error);
        }
      };

      sync(); // Call the sync function whenever the effect runs
    }
  }, [userState]); // Dependency array ensures the effect runs whenever `userState` changes
};
