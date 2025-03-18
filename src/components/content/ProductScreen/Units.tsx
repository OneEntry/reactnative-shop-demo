import React, {memo} from 'react';
import {View} from 'react-native';
import {styleColors} from '../../../utils/consts';
import {Paragraph} from '../../ui/texts/Paragraph';
import {useAppSelector} from '../../../state/hooks';

interface Props {
  full: number;
  part?: number;
}

const Units: React.FC<Props> = ({full, part}) => {
  const unitsPlug = useAppSelector(
    state => state.systemContentReducer.content.units_plug,
  );
  const items = part ?? 0;

  return (
    <View style={{alignItems: 'flex-end', gap: 2}}>
      <Paragraph>
        {part} {unitsPlug}
      </Paragraph>
      <View className={'w-[160px] h-[3px] bg-gray rounded-full items-end'}>
        <View
          style={{
            height: 3,
            width: `${items * 10 < 100 ? items * 10 : 100}%`,
            backgroundColor: styleColors.background,
          }}
        />
      </View>
    </View>
  );
};

export default memo(Units);
