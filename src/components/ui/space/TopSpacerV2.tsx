import React, {memo} from 'react';
import {View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {proportionX} from '../../../utils/consts';

type Props = {
  height?: number;
} & ViewProps;

const TopSpacerV2: React.FC<Props> = ({style, height = 100}) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        {height: height * proportionX + (insets.top > 5 ? insets.top : 10)},
        style,
      ]}
    />
  );
};

export default memo(TopSpacerV2);
