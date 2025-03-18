import React, {memo} from 'react';
import {Image, ImageSourcePropType, StyleSheet, View} from 'react-native';

type Props = {
  imgSource: ImageSourcePropType;
};

const AuthButtonIcon: React.FC<Props> = ({imgSource}) => {
  return (
    <View>
      <Image source={imgSource} style={styles.container} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 21,
    width: 21,
  },
});
export default memo(AuthButtonIcon);
