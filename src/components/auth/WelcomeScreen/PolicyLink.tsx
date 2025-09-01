import React from 'react';
import {Linking, TouchableOpacity} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppSelector} from '../../../state/hooks';

type Props = {};

const PolicyLink: React.FC<Props> = ({}) => {
  const {privacy_policy} = useAppSelector(
    state => state.systemContentReducer.content,
  );
  const {privacy_url} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  return (
    <TouchableOpacity
      className={'w-full items-center self-end'}
      onPress={() => Linking.openURL(privacy_url)}>
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
