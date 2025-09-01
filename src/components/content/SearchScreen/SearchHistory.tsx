import React from 'react';
import {StyleSheet} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {Screen} from '../../ui/templates/Screen';
import {layoutWidth} from '../../../utils/consts';
import {useAppSelector} from '../../../state/hooks';

type Props = {
  query: string;
};

const SearchHistory: React.FC<Props> = ({query}) => {
  const historyTitle = useAppSelector(
    state => state.systemContentReducer.content.search_history_title,
  );
  return (
    <Screen white edges={['horizontal']} style={styles.content}>
      <Paragraph
        size={16}
        weight={'700'}
        color={'gray'}
        style={{paddingBottom: 5}}>
        {historyTitle}
      </Paragraph>
      {query.split(' ').map((searchValue, index) => (
        <Paragraph size={16} weight={'400'} key={index} color={'lightGray'}>
          {searchValue}
        </Paragraph>
      ))}
    </Screen>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    height: '100%',
    width: layoutWidth,
    marginTop: 30,
    gap: 10,
  },
});
export default SearchHistory;
