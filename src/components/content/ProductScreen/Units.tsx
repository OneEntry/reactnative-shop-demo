import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppSelector} from '../../../store/hooks';

interface Props {
  full: number;
  part?: number;
}

const Units: React.FC<Props> = ({full, part}) => {
  const unitsPlug = useAppSelector(
    state => state.systemContentReducer.content.units_plug,
  );
  return (
    <View style={{alignItems: 'flex-end', gap: 2}}>
      <Paragraph>
        {part} {unitsPlug}
      </Paragraph>
      <View style={styles.container}>
        <View
          style={{
            height: 3,
            width: `${((part || 0) / 20) * 100}%`,
            backgroundColor: styleColors.background,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 3,
    backgroundColor: styleColors.lightGray,
    borderRadius: 100,
    alignItems: 'flex-end',
  },
});
export default memo(Units);
