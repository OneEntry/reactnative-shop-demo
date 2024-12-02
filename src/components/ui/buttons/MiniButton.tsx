import React, {memo} from 'react';
import {TouchableOpacity, TouchableOpacityProps} from 'react-native';
import {Paragraph} from '../texts/Paragraph';

type Props = TouchableOpacityProps & {
  title: string;
  onPress: () => void;
  active?: boolean;
  selected?: boolean;
  size?: number;
};

const MiniButton: React.FC<Props> = ({
  title,
  onPress,
  style,
  active = true,
  selected,
  size,
  ...rest
}) => {
  const {className, ...other} = rest;
  return (
    <TouchableOpacity
      className={`rounded-full px-5 py-1 border-sm items-center 
      ${selected ? 'bg-accent' : 'bg-transparent'} 
      ${active ? 'border-accent' : 'border-gray'} 
      ${className}`}
      style={[style]}
      onPress={onPress}
      disabled={!active}
      {...other}>
      <Paragraph
        size={size || 14}
        weight={'700'}
        color={selected ? 'white' : active ? 'background' : 'lightGray'}>
        {title?.toUpperCase()}
      </Paragraph>
    </TouchableOpacity>
  );
};

export default memo(MiniButton);
