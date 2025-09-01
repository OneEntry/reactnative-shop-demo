import React, {memo, useMemo, useState} from 'react';
import {Button} from '../../../ui/buttons/Button';
import {useAppSelector} from '../../../../state/hooks';
import {navigate} from '../../../../navigation/utils/NavigatonRef';
import {isCartNotEmpty} from '../../../../state/reducers/userStateSlice';
import {findProductsOutOfStock} from './findProductsOutOfStock';
import OutOfStockModal from './OutOfStockModal';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';

interface Props {
  products: IProductsEntity[];
}

const PlaceOrderButton: React.FC<Props> = ({products}) => {
  const {cart_button_active, view_catalog_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const isCart = useAppSelector(isCartNotEmpty);
  const [outOfStockModalVisible, setOutOfStockModalVisible] = useState(false);

  const productsOutOfStock = useMemo(
    () => findProductsOutOfStock(products),
    [products],
  );

  const onPlace = () => {
    if (isCart) {
      if (productsOutOfStock.length) {
        setOutOfStockModalVisible(true);
        return;
      }
      navigate('place_an_order');
    } else {
      navigate('shop');
    }
  };
  return (
    <>
      <Button
        rounded
        className={'bg-accent mb-5'}
        paragraphProps={{
          style: {color: '#fff'},
          weight: 'bold',
          size: 16,
        }}
        onPress={onPlace}>
        {!isCart ? view_catalog_text : cart_button_active}
      </Button>
      <OutOfStockModal
        visible={outOfStockModalVisible}
        setVisible={setOutOfStockModalVisible}
        productsOutOfStock={productsOutOfStock}
      />
    </>
  );
};

export default memo(PlaceOrderButton);
