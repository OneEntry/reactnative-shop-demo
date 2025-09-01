import React from 'react';
import {Screen} from '../components/ui/templates/Screen';
import {Paragraph} from '../components/ui/texts/Paragraph';
import {View} from 'react-native';
import {useErrorRoute} from '../navigation';

type Props = object;

const ErrorScreen: React.FC<Props> = () => {
  const {
    params: {page},
  } = useErrorRoute();
  return (
    <Screen
      white
      isFull
      style={{justifyContent: 'center'}}
      edges={['horizontal']}>
      <Paragraph size={64} weight={'bold'}>
        {page?.attributeValues?.error_title?.value}
      </Paragraph>
      <Paragraph size={32}>
        {page?.attributeValues?.error_description?.value}
      </Paragraph>
      <View style={{marginTop: 100}} />
    </Screen>
  );
};

export default ErrorScreen;
