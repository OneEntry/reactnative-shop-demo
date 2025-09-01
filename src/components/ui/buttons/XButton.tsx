import React, {memo} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import X from '../../../assets/icons/x.svg';

type Props = {
  action: () => void;
} & TouchableOpacityProps;

const XButton: React.FC<Props & TouchableOpacityProps> = props => {
  const {action, style, ...rest} = props;
  return (
    <TouchableOpacity onPress={action} style={[styles.button, style]} {...rest}>
      <View>
        <X />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    shadowColor: 'black',
    padding: 12,
    borderRadius: 10000,
    shadowRadius: 10,
    shadowOpacity: 0.1,
    shadowOffset: {height: 5, width: 0},
    marginLeft: 'auto',
    marginRight: 'auto',
  },
});

export default memo(XButton);
