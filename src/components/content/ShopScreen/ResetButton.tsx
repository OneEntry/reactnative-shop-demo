import React from 'react';
import {StyleSheet, View} from 'react-native';
import {layoutPadding} from '../../../utils/consts';
import MiniButton from '../../ui/buttons/MiniButton';

interface Props {
  title: string;
  onReset: () => void;
}

const ResetButton: React.FC<Props> = ({title, onReset}) => {
  return (
    <View style={styles.sortFilterContainer}>
      <View style={[styles.button_container]}>
        <MiniButton onPress={onReset} title={title || 'no localization'} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button_container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: layoutPadding,
    paddingVertical: 10,
  },
  sortFilterContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    zIndex: 1000,
  },
});
export default ResetButton;
