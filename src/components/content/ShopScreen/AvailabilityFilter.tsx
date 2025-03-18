import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Paragraph} from '../../ui/texts/Paragraph';
import {Switch} from 'react-native-switch';
import {styleColors} from '../../../utils/consts';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {setAvailability} from '../../../state/reducers/FilterSlice';

interface Props {
  title?: string;
}

const AvailabilityFilter: React.FC<Props> = ({title}) => {
  const available = useAppSelector(state => state.filterReducer.availability);
  const dispatch = useAppDispatch();

  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
      <Paragraph size={16} weight={'400'}>
        {title}
      </Paragraph>
      <Switch
        value={available}
        onValueChange={value => dispatch(setAvailability(value))}
        circleSize={13}
        backgroundActive={styleColors.background}
        backgroundInactive={'#EEEFF0'}
        renderActiveText={false}
        renderInActiveText={false}
        circleBorderActiveColor={'#F6F7F9'}
        circleActiveColor={'#F6F7F9'}
        circleInActiveColor={styleColors.background}
        circleBorderInactiveColor={styleColors.background}
        switchWidthMultiplier={3}
        switchRightPx={1}
        switchLeftPx={1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
});
export default AvailabilityFilter;
