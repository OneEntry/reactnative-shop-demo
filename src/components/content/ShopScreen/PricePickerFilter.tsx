import React from 'react';
import {KeyboardAvoidingView, StyleSheet, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import PriceFromInput from './PriceFromInput';
import PriceToInput from './PriceToInput';

interface Props {
  title: string;
}

const PricePickerFilter: React.FC<Props> = ({title}) => {
  return (
    <KeyboardAvoidingView>
      <Paragraph size={16} weight={'400'} style={{marginBottom: 20}}>
        {title}
      </Paragraph>
      <View style={styles.container}>
        <PriceFromInput />
        <PriceToInput />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flexDirection: 'row', justifyContent: 'space-between'},
});
export default PricePickerFilter;
