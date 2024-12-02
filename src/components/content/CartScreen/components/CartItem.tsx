import React, {useEffect, useMemo} from 'react';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../../ui/texts/Paragraph';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import Dots from '../../../../assets/icons/dots.svg';
import PopUpMenu, {PopUpOption} from '../../../shared/PopUpMenu';
import Card from '../../../ui/cards/Card';
import Rating from '../../../shared/Rating';
import {
  CartState,
  deselectProduct,
  removeProduct,
} from '../../../../store/reducers/CartSlice';
import {useAppDispatch, useAppSelector} from '../../../../store/hooks';
import Tick from '../../../../assets/icons/galk.svg';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import PriceString from '../../../ui/texts/PriceString';
import CustomImage from '../../../ui/templates/CustomImage';
import AddToCartCounter from '../../../shared/AddToCartCounter';
import {updateUserState} from '../../../../api/utils/updateUserState';

interface Props {
  productFromCart?: IProductsEntity;
  item: CartState & {selected: boolean};
  popUpButtons?: IListTitle[];
}

const CartItem: React.FC<Props> = ({productFromCart, popUpButtons, item}) => {
  const dispatch = useAppDispatch();
  const items = useAppSelector(state => state.cartReducer.products);
  const favorites = useAppSelector(state => state.favoritesReducer.products);
  const {outOfStock} = useAppSelector(
    state => state.systemContentReducer.content.buttons,
  );


  useEffect(() => {
    if (productFromCart) {
      if (
        productFromCart?.statusIdentifier === 'out_of_stock' &&
        item?.selected
      ) {
        dispatch(deselectProduct(productFromCart.id));
      }
    }
  }, [[productFromCart]]);

  const actions: Record<string, any> = {
    delete: async () => {
      dispatch(removeProduct(item.id));
      await updateUserState({
        favorites,
        cart: items
          .filter(product => product.id !== item.id)
          .map(product => {
            return {
              id: product.id,
              quantity: product.quantity,
            };
          }),
      });
    },
    share: () => {
      Alert.alert('Share action');
    },
    null: () => {},
  };

  const popUpOptions: PopUpOption[] = useMemo(() => {
    if (!popUpButtons) {
      return [];
    }

    return popUpButtons.map(button => {
      return {
        title: button.title,
        action: actions[button.value as string] || actions.null,
      };
    });
  }, [popUpButtons]);

  const selectItem = () => {
    if (productFromCart?.statusIdentifier !== 'out_of_stock') {
      item && dispatch(deselectProduct(item.id));
    }
  };

  return (
    <Card productId={productFromCart?.id}>
      <View className={'rounded-xs bg-lightGray items-center justify-center'}>
        <TouchableOpacity
          className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-xxs items-center justify-center bg-accent z-10 ${
            !item.selected && 'bg-transparent border-sm border-accent'
          }`}
          onPress={selectItem}>
          {item.selected && <Tick />}
        </TouchableOpacity>
        <View className={'rounded-xl'}>
          <CustomImage
            width={110}
            height={130}
            uri={productFromCart?.attributeValues.pic?.value?.downloadLink}
          />
        </View>
        {!item.selected && (
          <View
            style={StyleSheet.absoluteFillObject}
            className={'bg-lightGray rounded-xs opacity-50'}
          />
        )}
      </View>
      <View className={'flex-row justify-between flex-1 mb-4 p-2.5'}>
        <View className={'justify-between'}>
          <View style={{gap: 5}}>
            <Paragraph className={'w-[23vw]'} size={16}>
              {productFromCart?.statusIdentifier === 'out_of_stock'
                ? outOfStock
                : productFromCart?.localizeInfos?.title}
            </Paragraph>
            <Rating rating={3.5} shorten />
          </View>
          <PriceString
            price={productFromCart?.price}
            size={'md'}
            currency={productFromCart?.attributeValues?.currency?.value}
            sale={productFromCart?.attributeValues?.sale?.value}
          />
        </View>
        <View className={'items-end justify-between mr-0.5'}>
          <PopUpMenu
            trigger={
              <View style={{padding: 10, paddingHorizontal: 8}}>
                <Dots />
              </View>
            }
            options={popUpOptions}
          />
          <View>
            <AddToCartCounter quantity={item.quantity} id={item.id} />
          </View>
        </View>
      </View>
    </Card>
  );
};

export default CartItem;
