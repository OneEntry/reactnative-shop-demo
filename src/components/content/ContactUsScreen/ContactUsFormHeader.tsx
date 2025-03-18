import React, {memo} from 'react';
import {Image, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../../../state/hooks';
import CustomImage from '../../ui/templates/CustomImage';

interface Props {}

const ContactUsFormHeader: React.FC<Props> = ({}) => {
  const {top} = useSafeAreaInsets();
  const contactUsLogo = useAppSelector(
    state => state.systemContentReducer.content.contact_us_logo,
  );

  return (
    <View
      className={'absolute w-full items-center z-10'}
      style={[{top: top + 5}]}>
      <CustomImage width={160} height={45} uri={contactUsLogo} />
    </View>
  );
};

export default memo(ContactUsFormHeader);
