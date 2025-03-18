import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import {styleColors} from '../../../utils/consts';

type Props = {
  onPress: () => void;
  children: React.ReactNode;
  color?: string;
  selected?: boolean;
} & TouchableOpacityProps;

const SelectCard: React.FC<Props> = ({
  onPress,
  children,
  selected,
  ...rest
}) => {
  const {style} = rest;
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      className={`${selected ? 'border-accent' : 'border-transparent'} ${rest.className}`}
      onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
  },
});
export default SelectCard;
