import React, {memo, useEffect, useRef} from 'react';
import {Animated} from 'react-native';

type Props = {};

const SkeletonWrapper: React.FC<Props> = ({}) => {
  const skeletonOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
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
  }, [skeletonOpacity]);
  return <Animated.View></Animated.View>;
};

export default memo(SkeletonWrapper);
