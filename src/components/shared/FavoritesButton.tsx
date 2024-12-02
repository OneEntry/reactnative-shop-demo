import React, { useContext, useState } from "react";
import Heart from '../../assets/icons/Heart.svg';
import HeartOutline from '../../assets/icons/HeartOutline.svg';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {updateUserState} from '../../api/utils/updateUserState';
import {api} from '../../api';
import {useAppDispatch, useAppSelector} from '../../store/hooks';
import {
  addFavorite,
  removeFavorite,
  selectIsFavorites,
} from '../../store/reducers/FavoritesSlice';
import { IError } from "oneentry/dist/base/utils";
import { AuthContext } from "../../providers/AuthContext";

type Props = {
  id: number;
  size?: 'md' | 'xl';
};

const sizes = {
  md: 20,
  xl: 24,
};

//make prop isFavorites and take this state from 1 component to avoid maps in every card
const FavoritesButton: React.FC<Props> = ({id, size = 'md'}) => {
  const favorites = useAppSelector(state => state.favoritesReducer.products);
  const isFavorites = useAppSelector(state => selectIsFavorites(state, id));
  const [loading, setLoading] = useState<boolean>(false);
  const products = useAppSelector(state => state.cartReducer.products);
  const dispatch = useAppDispatch();
  const {user} = useContext(AuthContext);

  const onAddFavorites = async () => {
    setLoading(true);
    try {
      if (!isFavorites) {
        await api.Events.subscribeByMarker('catalog_event', id);
        await api.Events.subscribeByMarker('status_out_of_stock', id);
        await api.Events.subscribeByMarker('product_price', id);
        const updatedFavorites = [...favorites, id];
        const res = await updateUserState({
          favorites: updatedFavorites,
          cart: products.map(product => {
            return {
              id: product.id,
              quantity: product.quantity,
            };
          }),
        });
        if (res || !user) {
          dispatch(addFavorite(id));
        }
      } else {
        await api.Events.unsubscribeByMarker('product_price', id, 'en_US');
        await api.Events.unsubscribeByMarker('catalog_event', id, 'en_US');
        await api.Events.unsubscribeByMarker(
          'status_out_of_stock',
          id,
          'en_US',
        );
        const updatedFavorites = favorites.filter(favorite => favorite !== id);

        const res = await updateUserState({
          favorites: updatedFavorites,
        });
        if (res || !user) {
          dispatch(removeFavorite(id));
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  if (loading) {
    return <ActivityIndicator size="small" color="#000" />;
  }

  return (
    <TouchableOpacity onPress={onAddFavorites}>
      {isFavorites ? (
        <Heart width={sizes[size]} height={sizes[size]} />
      ) : (
        <HeartOutline width={sizes[size]} height={sizes[size]} />
      )}
    </TouchableOpacity>
  );
};

export default FavoritesButton;
