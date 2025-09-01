import React, {useMemo} from 'react';
import {FlatList, View} from 'react-native';
import CustomModal from '../../../shared/CustomModal';
import {Paragraph} from '../../../ui/texts/Paragraph';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Card from '../../../ui/cards/Card';
import CustomImage from '../../../ui/templates/CustomImage';
import PriceString from '../../../ui/texts/PriceString';
import Rating from '../../../shared/Rating';
import {Button} from '../../../ui/buttons/Button';
import {useAppSelector} from '../../../../state/hooks';
import {navigate} from '../../../../navigation/utils/NavigatonRef';

const OutOfStockItem = ({item}: {item: IProductsEntity}) => {
  return (
    <Card productId={item.id}>
      <View className={'rounded-xs bg-lightGray items-center justify-center'}>
        <View className={'rounded-xl'}>
          <CustomImage
            width={110}
            height={130}
            uri={item.attributeValues.pic?.value?.downloadLink}
          />
        </View>
      </View>
      <View className={'flex-row justify-between flex-1 mb-4 p-2.5'}>
        <View className={'justify-between'}>
          <View style={{gap: 5}}>
            <Paragraph className={'w-[23vw]'} size={16}>
              {item.localizeInfos?.title}
            </Paragraph>
            <Rating rating={3.5} shorten />
          </View>
          <PriceString
            price={item.price}
            size={'md'}
            currency={item.attributeValues?.currency?.value}
            sale={item.attributeValues?.sale?.value}
          />
        </View>
      </View>
    </Card>
  );
};

const OutOfStockModal: React.FC<Props> = ({
  visible,
  setVisible,
  productsOutOfStock,
}) => {
  const {top} = useSafeAreaInsets();
  const {go_next_anyway: buttonText, view_catalog_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const cart = useAppSelector(state => state.userStateReducer.cart);

  const hasAvailableProducts = useMemo(() => {
    const outOfStockIds = productsOutOfStock.map(product => product.id);
    return cart.some(cartItem => !outOfStockIds.includes(cartItem.id));
  }, [cart, productsOutOfStock]);

  const handleContinue = () => {
    setVisible(false);
    navigate('place_an_order');
  };

  const handleGoToShop = () => {
    setVisible(false);
    navigate('shop');
  };

  return (
    <CustomModal
      visible={visible}
      setVisible={setVisible}
      title={'Out of stock'}>
      <View style={{marginTop: top + 80}} className={'flex-1 px-layout'}>
        <FlatList
          data={productsOutOfStock}
          renderItem={({item}) => <OutOfStockItem item={item} />}
          contentContainerStyle={{paddingBottom: 20}}
        />

        <View className={'mt-4 mb-5'}>
          {hasAvailableProducts ? (
            <Button
              rounded
              className={'bg-accent'}
              paragraphProps={{
                style: {color: '#fff'},
                weight: 'bold',
                size: 16,
              }}
              onPress={handleContinue}>
              {buttonText}
            </Button>
          ) : (
            <Button
              rounded
              className={'bg-accent'}
              paragraphProps={{
                style: {color: '#fff'},
                weight: 'bold',
                size: 16,
              }}
              onPress={handleGoToShop}>
              {view_catalog_text}
            </Button>
          )}
        </View>
      </View>
    </CustomModal>
  );
};

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  productsOutOfStock: IProductsEntity[];
};

export default OutOfStockModal;
