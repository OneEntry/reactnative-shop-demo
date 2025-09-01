import React, {memo} from 'react';
import {StyleProp, TouchableOpacity, View, ViewStyle} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppDispatch} from '../../../state/hooks';
import {setColorFilterActive} from '../../../state/reducers/FilterSlice';

type Props = {
  code: string;
  name: string;
  active?: number;
  index: number;
};

const ColorPicker: React.FC<Props> = ({code, name, active, index}) => {
  const dispatch = useAppDispatch();
  const additionalStyles: StyleProp<ViewStyle> = {
    backgroundColor: code,
    borderRadius: 1000,
    width: 24,
    height: 24,
  };
  const selectedStyles: ViewStyle = {
    backgroundColor: '#f6f6f8',
  };
  const onPress = () => {
    dispatch(setColorFilterActive(index));
  };
  return (
    <TouchableOpacity
      onPress={onPress}
      className={'rounded-full py-1.5 items-center flex-row gap-x-1 w-[74px]'}
      style={[index === active && selectedStyles]}>
      <View style={[additionalStyles]} />
      <Paragraph className={'text-gray'}>{name}</Paragraph>
    </TouchableOpacity>
  );
};

export default memo(ColorPicker);
