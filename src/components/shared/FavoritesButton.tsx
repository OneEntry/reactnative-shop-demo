import React, {useState} from 'react';
import Heart from '../../assets/icons/Heart.svg';
import HeartOutline from '../../assets/icons/HeartOutline.svg';
import {ActivityIndicator, TouchableOpacity} from 'react-native';
import {defineApi} from '../../api';
import {useAppDispatch, useAppSelector} from '../../state/hooks';
import {useAuth} from '../../state/contexts/AuthContext';
import {
  checkFavoritesItemById,
  toggleFavorite,
} from '../../state/reducers/userStateSlice';

type Props = {
  id: number;
  size?: 'md' | 'xl';
};

const sizes = {
  md: 20,
  xl: 24,
};

const FavoritesButton: React.FC<Props> = ({id, size = 'md'}) => {
  const isFavorites = useAppSelector(state =>
    checkFavoritesItemById(state, id),
  );
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const {user} = useAuth();

  const onAddFavorites = async () => {
    setLoading(true);
    try {
      dispatch(toggleFavorite(id));

      if (user) {
        if (!isFavorites) {
          await defineApi.Events.subscribeByMarker(
            'product_status_in_stock',
            id,
          );
          await defineApi.Events.subscribeByMarker('status_out_of_stock', id);
        } else {
          await defineApi.Events.unsubscribeByMarker(
            'product_status_in_stock',
            id,
          );
          await defineApi.Events.unsubscribeByMarker('status_out_of_stock', id);
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
