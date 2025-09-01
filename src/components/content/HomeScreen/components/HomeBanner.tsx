import React, {memo} from 'react';
import {ImageBackground, Platform, TouchableOpacity} from 'react-native';
import {Screen} from '../../../ui/templates/Screen';
import {Paragraph} from '../../../ui/texts/Paragraph';
import {IPositionBlock} from 'oneentry/dist/pages/pagesInterfaces';
import {navigate} from '../../../../navigation/utils/NavigatonRef';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import CustomImage from '../../../ui/templates/CustomImage';

interface Props {
  banner?: IPositionBlock;
  scrollY: SharedValue<number>;
}

/**
 * HomeBanner component displays a banner with an image background.
 * As the user scrolls, the banner transitions into a smaller white header.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const HomeBanner: React.FC<Props> = ({
  banner,
  scrollY,
}: Props): React.ReactElement => {
  const onTextClick = () => {
    navigate('shop');
  };

  const animatedColorStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      scrollY.value,
      [0, 100],
      ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)'], // From transparent to white
    );

    return {
      backgroundColor,
    };
  });
  const animatedInnerStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 100],
      [220, 60],
      Extrapolation.CLAMP,
    );

    return {
      height: Platform.OS === 'ios' ? height : 220,
    };
  });

  const animatedOpacityStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollY.value,
      [0, 100],
      [1, 0],
      Extrapolation.CLAMP,
    );

    return {
      opacity: Platform.OS === 'ios' ? opacity : 1,
    };
  });

  return (
    <ImageBackground
      source={{uri: banner?.attributeValues?.banner?.value[0]?.downloadLink}}>
      <Animated.View style={[animatedColorStyle]}>
        <Screen edges={['top']}>
          <Animated.View className={'px-layout'} style={[animatedInnerStyle]}>
            <CustomImage
              uri={banner?.attributeValues?.logo?.value[0]?.downloadLink}
              height={41}
              width={150}
            />
            <Animated.View
              style={[animatedOpacityStyle]}
              className={
                'absolute bottom-layout flex-row justify-between items-end right-0 left-0 px-layout'
              }>
              <TouchableOpacity onPress={onTextClick}>
                <Paragraph color={'white'} size={24} weight={'600'}>
                  {banner?.attributeValues?.title?.value || ''}
                </Paragraph>
              </TouchableOpacity>
              <Paragraph
                className={'text-right w-2/5'}
                color={'black'}
                size={20}
                weight={'300'}>
                {banner?.attributeValues?.quote?.value || ''}
              </Paragraph>
            </Animated.View>
          </Animated.View>
        </Screen>
      </Animated.View>
    </ImageBackground>
  );
};

export default memo(HomeBanner);
