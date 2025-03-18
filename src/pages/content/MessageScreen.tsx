import React from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import {View} from 'react-native';
import {Paragraph} from '../../components/ui/texts/Paragraph';
import {Button} from '../../components/ui/buttons/Button';
import {navigate} from '../../navigation/utils/NavigatonRef';
import {useAppSelector} from '../../state/hooks';
import {RouteProp, useRoute} from '@react-navigation/native';
import {DrawerStackNavigatorParamList} from '../../navigation';

type Props = {};

const MessageScreen: React.FC<Props> = ({}) => {
  const {
    params: {message},
  } = useRoute<RouteProp<DrawerStackNavigatorParamList, 'message'>>();

  const {close_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  return (
    <Screen isFull edges={['top', 'horizontal']}>
      <View
        className={
          'bg-lightGray items-center justify-center rounded-lg px-4 py-12 mt-20'
        }>
        <Paragraph size={32}>{message}</Paragraph>
      </View>
      <Button
        rounded
        className={'bg-accent mt-10'}
        paragraphProps={{
          style: {color: '#fff'},
          weight: 'bold',
          size: 16,
        }}
        onPress={() => navigate('home')}>
        {close_text}
      </Button>
    </Screen>
  );
};

export default MessageScreen;
