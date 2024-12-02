import React, {Dispatch, useState} from 'react';
import {View} from 'react-native';
import CustomModal from '../../shared/CustomModal';
import TimePicker from './TimePicker';
import {useAppDispatch} from '../../../store/hooks';
import {addData} from '../../../store/reducers/orderReducer';

interface Props {
  visible: boolean;
  setVisible: Dispatch<boolean>;
}

const TimePickerModal: React.FC<Props> = ({visible, setVisible}) => {
  const dispatch = useAppDispatch();
  const [selectedTime, setSelectedTime] = useState<number | null>(null);

  const onPickTime = (time: number) => {
    dispatch(
      addData({
        marker: 'time2',
        type: 'list',
        value: [
          {
            title: time + ':00',
            value: time.toString(),
            extended: {
              value: 'Available',
              type: 'string',
            },
          },
        ],
      }),
    );
    setVisible(false);
  };

  return (
    <CustomModal setVisible={setVisible} visible={visible} title={'Time'}>
      <View className={'bg-white flex-1 justify-center'}>
        <TimePicker
          setActive={setSelectedTime}
          active={selectedTime}
          action={onPickTime}
        />
      </View>
    </CustomModal>
  );
};

export default TimePickerModal;
