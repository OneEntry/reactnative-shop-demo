import React, {memo} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Paragraph} from '../ui/texts/Paragraph';
import {useAppSelector} from '../../store/hooks';

type Props = {
  loading?: boolean;
  Spacer?: React.ReactNode;
} & ViewProps;

const ContentNotFoundBlock: React.FC<Props> = ({Spacer, loading, ...rest}) => {
  const {style} = rest;
  const contentNotFound = useAppSelector(
    state => state.systemContentReducer.content.content_not_found,
  );

  if (loading) {
    return <></>;
  }
  return (
    <View style={[styles.container, style]}>
      {Spacer}
      <Paragraph size={20} color={'lightGray'} style={styles.paragraph}>
        {contentNotFound}
      </Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  paragraph: {textAlign: 'center'},
});
export default memo(ContentNotFoundBlock);
