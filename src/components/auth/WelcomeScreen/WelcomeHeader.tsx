import React, {memo} from 'react';
import {Image, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppSelector} from '../../../state/hooks';
import CustomImage from '../../ui/templates/CustomImage';

type Props = {};

const WelcomeHeader: React.FC<Props> = ({}) => {
  const {round_logo, auth_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  return (
    <View className={'items-center w-full mb-10 space-y-5'}>
      <CustomImage uri={round_logo} width={190} height={190} />
      <Paragraph
        style={{lineHeight: 30}}
        color={'border_color'}
        size={20}
        weight={'500'}>
        {auth_text}
      </Paragraph>
    </View>
  );
};

export default memo(WelcomeHeader);
