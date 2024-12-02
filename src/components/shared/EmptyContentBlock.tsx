import React, {memo} from 'react';
import {StyleSheet, View, ViewProps} from 'react-native';
import {Paragraph} from '../ui/texts/Paragraph';

type Props = {
  title: string;
} & ViewProps;

const EmptyContentBlock: React.FC<Props> = ({title, ...rest}) => {
  if (!title) {
    return <></>;
  }
  return (
    <View {...rest}>
      <Paragraph size={22} color={'lightGray'} style={styles.paragraph}>
        {title}
      </Paragraph>
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    textAlign: 'center',
  },
});
export default memo(EmptyContentBlock);
