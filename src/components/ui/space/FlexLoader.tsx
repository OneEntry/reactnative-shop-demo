import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

interface Props {}

const FlexLoader: React.FC<Props> = ({}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
});
export default memo(FlexLoader);
