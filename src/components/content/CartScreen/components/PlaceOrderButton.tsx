import React, {memo} from 'react';
import {Button} from '../../../ui/buttons/Button';
import {useAppSelector} from '../../../../store/hooks';
import {navigate} from '../../../../navigation/utils/NavigatonRef';
import {selectCartSelectedItems} from '../../../../store/reducers/CartSlice';

interface Props {}

const PlaceOrderButton: React.FC<Props> = ({}) => {
  const {cart_button_active, view_catalog_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const items = useAppSelector(selectCartSelectedItems);
  const onPlace = () => {
    if (items) {
      navigate('place_an_order');
    } else {
      navigate('shop');
    }
  };
  return (
    <Button
      rounded
      className={'bg-accent mb-5'}
      paragraphProps={{
        style: {color: '#fff'},
        weight: 'bold',
        size: 16,
      }}
      onPress={onPlace}>
      {!items ? view_catalog_text : cart_button_active}
    </Button>
  );
};

export default memo(PlaceOrderButton);
