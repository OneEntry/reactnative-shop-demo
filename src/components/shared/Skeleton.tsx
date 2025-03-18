import React from 'react';
import {DimensionValue, View, ViewProps} from 'react-native';

type Props = {
  isLoading?: boolean;
  width?: DimensionValue;
  height?: DimensionValue;
  children?: React.ReactNode;
} & ViewProps;

const Skeleton: React.FC<Props> = ({
  isLoading = true,
  children,
  width = '100%',
  height,
  ...rest
}) => {
  const {style, ...other} = rest;
  return (
    <View
      style={[{width, height}, style]}
      className={`${isLoading ? 'animate-pulse bg-lightGray' : 'bg-white'}`}
      {...other}>
      {children}
    </View>
  );
};

export default Skeleton;
