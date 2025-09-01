import React, {memo} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

type Props = {
  children?: React.ReactNode;
};

const FlexLoader: React.FC<Props> = ({children}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} />
      {children}
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
