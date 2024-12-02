import React, {useEffect} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppNavigation} from '../../../navigation/types/types';
import {IProductsEntity} from 'oneentry/dist/products/productsInterfaces';
import {styleColors} from '../../../utils/consts';
import {useGetRelatedProductsQuery} from '../../../api/api/RTKApi';
import ContentNotFoundBlock from '../../shared/ContentNotFoundBlock';

type Props = {
  mainProduct?: IProductsEntity;
};

const ProductOptions: React.FC<Props> = ({mainProduct}) => {
  const {data, isLoading, refetch, error} = useGetRelatedProductsQuery({
    id: mainProduct?.id,
  });

  const products = data?.items;
  const navigation = useAppNavigation();

  useEffect(() => {
    refetch();
  }, [mainProduct]);

  if (isLoading) {
    return <View style={{height: 39}} />;
  }

  if (error) {
    return <ContentNotFoundBlock />;
  }

  if (!products?.length) {
    return <ContentNotFoundBlock />;
  }

  return (
    <View
      className={'flex-row w-full space-y-3 items-center'}
      style={{flexWrap: 'wrap'}}>
      {[mainProduct, ...products]?.map((product, index) => (
        <TouchableOpacity
          className={
            'flex-row items-center p-0.5 rounded-full pr-2.5 space-x-2 mr-1 border-lightGray border-sm'
          }
          style={[
            mainProduct?.id === product?.id && {
              backgroundColor: styleColors.gray_v2,
            },
          ]}
          key={index}
          disabled={mainProduct?.id === product?.id}
          onPress={() => {
            if (mainProduct?.id !== product?.id) {
              //@ts-ignore
              navigation.push('Product', {id: product?.id});
            }
          }}>
          <View className={'flex-row items-center'}>
            {product?.attributeValues?.color?.value?.map(
              (color: any, index: number) => (
                <View
                  key={color + index}
                  className={'rounded-full h-6 w-6 -mr-2.5'}
                  style={[
                    {
                      backgroundColor: color?.extended?.value || 'white',
                    },
                  ]}
                />
              ),
            )}

            <Paragraph size={12} className={'ml-5'} color="lightGray">
              {product?.attributeValues?.color?.value?.length > 1
                ? 'multi'
                : product?.attributeValues?.color?.value[0]?.title}
            </Paragraph>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default ProductOptions;
