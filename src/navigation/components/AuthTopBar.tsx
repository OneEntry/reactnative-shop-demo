import React, {memo} from 'react';
import {Image, View} from 'react-native';
import GoBackButton from '../../components/ui/buttons/GoBackButton';
import {Paragraph} from '../../components/ui/texts/Paragraph';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  title?: string;
};

const AuthTopBar: React.FC<Props> = ({title}) => {
  const {top} = useSafeAreaInsets();
  const marginTop = {paddingTop: top + (top < 5 ? 10 : 0)};
  return (
    <View
      style={[marginTop]}
      className={
        'px-layout w-full pb-2 items-center justify-between bg-white flex-row'
      }>
      <View className={'w-full justify-center items-start'}>
        <View className={'z-50 '}>
          <GoBackButton className={'bg-lightGray'} />
        </View>
        <View className={'w-full absolute items-center'}>
          {title && (
            <Paragraph size={24} weight={'500'} color={'gray'}>
              {title}
            </Paragraph>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(AuthTopBar);
