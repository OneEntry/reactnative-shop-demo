import React, {memo} from 'react';
import {View} from 'react-native';
import {Paragraph} from '../ui/texts/Paragraph';
import {Screen} from '../ui/templates/Screen';

interface Props {
  errorTitle?: string;
  errorDescription?: string;
}

const ErrorBlock: React.FC<Props> = ({errorTitle, errorDescription}) => {
  return (
    <View style={{height: '100%'}}>
      <Screen
        white
        style={{height: '100%', justifyContent: 'center'}}
        edges={['horizontal']}>
        <Paragraph size={64} weight={'bold'}>
          {errorTitle}
        </Paragraph>
        <Paragraph size={32}>{errorDescription}</Paragraph>
        <View style={{marginTop: 100}} />
      </Screen>
    </View>
  );
};

export default memo(ErrorBlock);
