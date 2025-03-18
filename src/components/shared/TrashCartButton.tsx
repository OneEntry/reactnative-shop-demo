import React from 'react';
import Trash from '../../assets/icons/trash.svg';
import {TouchableOpacity} from 'react-native';
import {useAppDispatch} from '../../state/hooks';
import {removeFromCart} from '../../state/reducers/userStateSlice';

type Props = {
  id: number;
};

const TrashCartButton: React.FC<Props> = ({id}) => {
  const dispatch = useAppDispatch();
  const onTrash = async () => {
    dispatch(removeFromCart(id));
  };
  return (
    <TouchableOpacity onPress={onTrash}>
      <Trash />
    </TouchableOpacity>
  );
};

export default TrashCartButton;
