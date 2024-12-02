import React, {memo} from 'react';
import {View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import XButton from '../../ui/buttons/XButton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props {
  onRequestClose: () => void;
  title: string;
}

const ModalHeader: React.FC<Props> = ({onRequestClose, title}) => {
  const insets = useSafeAreaInsets();

  return (
    <View className={'px-layout w-full z-50'}>
      <View
        className={
          'self-center flex-row items-center justify-between gap-2.5 w-full'
        }>
        <View
          className={'flex-row items-center justify-end absolute w-full'}
          style={{
            top: insets.top > 5 ? insets.top : 10,
          }}>
          <View className={'absolute w-full items-center justify-center'}>
            <Paragraph weight={'600'} size={24} color={'gray'}>
              {title}
            </Paragraph>
          </View>
          <View>
            <XButton action={onRequestClose} />
          </View>
        </View>
      </View>
    </View>
  );
};

export default memo(ModalHeader);
