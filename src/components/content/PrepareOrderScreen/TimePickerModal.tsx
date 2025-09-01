import React, {Dispatch} from 'react';
import {View} from 'react-native';
import CustomModal from '../../shared/CustomModal';
import TimePicker from './TimePicker';
import {useAppDispatch, useAppSelector} from '../../../state/hooks';
import {addData, addOrderTime} from '../../../state/reducers/OrderReducer';
import dayjs from 'dayjs';

type Props = {
  visible: boolean;
  setVisible: Dispatch<boolean>;
  // intervals: any;
};

const TimePickerModal: React.FC<Props> = ({visible, setVisible}) => {
  const dispatch = useAppDispatch();
  const {selectedDate, availableTimes} = useAppSelector(
    state => state.orderReducer,
  );
  const {orderTime} = useAppSelector(state => state.orderReducer);

  const onPickTime = (time: number) => {
    const selectedInterval = availableTimes[0][time];

    if (!selectedInterval || selectedInterval?.length < 2) return;

    dispatch(
      addData({
        marker: 'shipping_interval',
        type: 'timeInterval',
        value: [
          [
            dayjs(selectedDate)
              .set('hour', selectedInterval[0]?.hours)
              .set('minute', selectedInterval[0]?.minutes)
              .toISOString(),
            dayjs(selectedDate)
              .set('hour', selectedInterval[1]?.hours)
              .set('minute', selectedInterval[1]?.minutes)
              .toISOString(),
          ],
        ],
      }),
    );
    setVisible(false);
  };

  const setSelectedTime = (time: number) => {
    dispatch(addOrderTime(time));
  };

  return (
    <CustomModal setVisible={setVisible} visible={visible} title={'Time'}>
      <View className={'bg-white flex-1 justify-center items-center'}>
        <TimePicker
          setActive={setSelectedTime}
          active={orderTime}
          action={onPickTime}
        />
      </View>
    </CustomModal>
  );
};

export default TimePickerModal;
