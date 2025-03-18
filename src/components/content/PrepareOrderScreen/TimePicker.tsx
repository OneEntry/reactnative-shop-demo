import React, {Dispatch, memo} from 'react';
import {View} from 'react-native';
import MiniButton from '../../ui/buttons/MiniButton';
import FlexLoader from '../../ui/space/FlexLoader';
import ErrorBlock from '../../shared/ErrorBlock';
import {IListTitle} from 'oneentry/dist/attribute-sets/attributeSetsInterfaces';
import {useGetSingleAttributeInSetByMarkerQuery} from '../../../api/api/RTKApi';

interface Props {
  active: number | null;
  setActive: Dispatch<number | null>;
  action?: (time: number) => void;
}

const TimePicker: React.FC<Props> = ({active, action, setActive}) => {
  const {
    data: attributes,
    error,
    isLoading,
  } = useGetSingleAttributeInSetByMarkerQuery({
    setMarker: 'order',
    attributeMarker: 'time2',
  });

  if (isLoading) {
    return <FlexLoader />;
  }

  if (error) {
    return <ErrorBlock errorTitle={error.toString()} />;
  }

  return (
    <View
      className={
        'flex-row gap-x-2 gap-y-3 flex-wrap justify-center items-start'
      }>
      {attributes?.listTitles?.map((attribute: IListTitle, index: number) => (
        <MiniButton
          key={'time' + index}
          active={attribute?.extended?.value === 'Available'}
          selected={parseInt(attribute?.value.toString(), 10) === active}
          title={attribute.title}
          onPress={() => {
            const time = parseInt(attribute?.value.toString(), 10);
            if (time !== active) {
              setActive(time);
              action && action(time);
            } else {
              setActive(null);
            }
          }}
          className={'w-1/4'}
        />
      ))}
    </View>
  );
};

export default memo(TimePicker);
