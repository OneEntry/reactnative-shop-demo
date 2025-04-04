import React, {memo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import Back from '../../../assets/icons/back.svg';
import {useNavigation} from '@react-navigation/native';
type Props = TouchableOpacityProps;

const GoBackButton: React.FC<Props> = ({style, ...rest}) => {
  const navigation = useNavigation();
  const onPress = () => navigation.goBack();
  return (
    <View>
      <TouchableOpacity
        onPress={rest.onPress || onPress}
        style={[styles.button, style]}>
        <Back />
      </TouchableOpacity>
    </View>
  );
};

export default memo(GoBackButton);

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    shadowColor: 'black',
    padding: 12,
    borderRadius: 10000,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});
