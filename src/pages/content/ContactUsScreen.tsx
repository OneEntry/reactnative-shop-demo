import React from 'react';
import {View} from 'react-native';
import {NavigationProps} from '../../navigation/types/types';
import TopSpacerV2 from '../../components/ui/space/TopSpacerV2';
import {
  ContactUsForm,
  ContactUsFormHeader,
} from '../../components/content/ContactUsScreen';

const ContactUsScreen: React.FC<NavigationProps> = ({}) => {
  return (
    <View>
      <TopSpacerV2 />
      <ContactUsFormHeader />
      <ContactUsForm />
    </View>
  );
};

export default ContactUsScreen;
