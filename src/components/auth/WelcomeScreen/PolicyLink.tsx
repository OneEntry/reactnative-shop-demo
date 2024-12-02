import React from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppSelector} from '../../../store/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {};

const PolicyLink: React.FC<Props> = ({}) => {
  const {privacy_policy} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const {top} = useSafeAreaInsets();

  return (
    <TouchableOpacity
      className={'w-full items-center self-end'}
      onPress={() =>
        Linking.openURL(
          'https://account.oneentry.cloud/authentication/register#policy',
        )
      }>
      <Paragraph
        className={'underline underline-offset-1'}
        size={18}
        weight={'600'}
        color={'background'}>
        {privacy_policy}
      </Paragraph>
    </TouchableOpacity>
  );
};

export default PolicyLink;
