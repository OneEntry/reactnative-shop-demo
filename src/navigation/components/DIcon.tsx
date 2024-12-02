import React from 'react';
import {ImageStyle} from 'react-native';
import {styleColors} from '../../utils/consts';
import CustomImage from '../../components/ui/templates/CustomImage';

export const DIcon = (
  options: {color: string; size: number; focused: boolean},
  uri: string,
) => {
  const additionalStyles: ImageStyle = {
    tintColor: !options.focused ? styleColors.black : styleColors.background,
  };
  return (
    <CustomImage uri={uri} width={16} height={16} style={additionalStyles} />
  );
};
