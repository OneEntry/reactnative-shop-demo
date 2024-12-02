import React, {memo, useEffect, useRef} from 'react';
import {SvgUri} from 'react-native-svg';
import {Image, Animated, ImageStyle} from 'react-native';

type Props = {
  uri: string | undefined;
  width: number | 'full';
  height: number | 'full';
  style?: ImageStyle;
};
const CustomImage: React.FC<Props> = ({uri, height, width, style}) => {
  const type = uri?.split('.').pop();

  const skeletonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!type) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(skeletonOpacity, {
            toValue: 0.5,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(skeletonOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    }
  }, [skeletonOpacity]);

  return (
    <Animated.View
      className={'rounded-md'}
      style={{
        backgroundColor: type ? 'transparent' : '#eaecee',
        width: width === 'full' ? '100%' : width,
        height: height === 'full' ? '100%' : height,
        opacity: type ? 1 : skeletonOpacity,
      }}>
      {type === 'svg' ? (
        <SvgUri
          height={height === 'full' ? '100%' : height}
          width={width === 'full' ? '100%' : width}
          style={style}
          uri={uri || ''}
        />
      ) : (
        <Image
          style={[
            {
              objectFit: 'contain',
              width: width === 'full' ? '100%' : width,
              height: height === 'full' ? '100%' : height,
            },
            style,
          ]}
          source={{uri}}
        />
      )}
    </Animated.View>
  );
};

export default memo(CustomImage);
