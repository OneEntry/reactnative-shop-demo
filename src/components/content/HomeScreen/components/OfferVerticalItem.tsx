import React, {memo} from 'react';
import {useAppNavigation} from '../../../../navigation/types/types';
import {
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import {Paragraph} from '../../../ui/texts/Paragraph';

interface Props {
  bg: string;
  item: string;
  text: string;
  productId: number;
  sticker?: string;
  action: () => void;
}

const OfferVerticalItem: React.FC<Props> = ({
  bg,
  item,
  sticker,
  text,
  productId,
  action,
}) => {
  const navigation = useAppNavigation();
  const onPress = () => {
    if (action) {
      action();
      return;
    }
    if (productId) {
      navigation.navigate('Products', {
        screen: 'Product',
        params: {id: productId},
      });
    }
  };
  return (
    <TouchableOpacity onPress={onPress}>
      <ImageBackground
        source={{uri: bg}}
        resizeMode="cover"
        borderRadius={20}
        className={'w-full rounded-lg h-[180px] mr-5 mt-5'}>
        <View className={'absolute w-full h-full items-center justify-center'}>
          <Image source={{uri: item}} className={'w-[140px] h-[140px] object-contain'} />
        </View>
        <View className={'w-9 h-9 absolute top-2.5 left-2.5'}>
          <Image
            source={{uri: sticker}}
            className={'w-9 h-9 object-contain'}
          />
        </View>
        <View className={'absolute left-6 bottom-4 w-1/2'}>
          <Paragraph weight={'700'} size={24} color={'white'}>
            {text && text.toUpperCase()}
          </Paragraph>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

export default memo(OfferVerticalItem);
