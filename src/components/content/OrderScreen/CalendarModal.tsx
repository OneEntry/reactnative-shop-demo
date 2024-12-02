import React, {Dispatch, memo, useMemo, useState} from 'react';
import CustomModal from '../../shared/CustomModal';
import {styleColors} from '../../../utils/consts';
import {Calendar, DateData} from 'react-native-calendars';
import {View} from 'react-native';
import {useAppDispatch} from '../../../store/hooks';
import {addData} from '../../../store/reducers/orderReducer';

interface Props {
  visible: boolean;
  setVisible: Dispatch<boolean>;
}

const CalendarModal: React.FC<Props> = ({visible, setVisible}) => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const dispatch = useAppDispatch();
  const onPickDate = (day: DateData) => {
    setSelectedDate(day.dateString);
    dispatch(
      addData({
        marker: 'date',
        type: 'date',
        value: {
          fullDate: day.dateString + 'T00:00:00.000Z',
          formattedValue: day.dateString + ' 00:00',
          formatString: 'YYYY-MM-DD',
        },
      }),
    );
    setVisible(false);
  };

  const marked = useMemo(() => {
    return {
      [selectedDate]: {
        selected: true,
        disableTouchEvent: false,
        selectedColor: styleColors.background,
        borderRadius: 4,
        selectedTextColor: 'white',
      },
    };
  }, [selectedDate]);
  return (
    <CustomModal visible={visible} setVisible={setVisible} title={'Calendar'}>
      <View
        style={{
          backgroundColor: 'white',
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: 20,
        }}>
        <Calendar
          theme={{
            monthTextColor: styleColors.background,
            arrowColor: styleColors.background,
            selectedDayTextColor: 'blue',
            selectedDotColor: styleColors.background,
            todayTextColor: styleColors.background,
            // @ts-ignore
            'stylesheet.calendar.header': {
              dayHeader: {
                color: styleColors.background,
              },
            },
          }}
          minDate={new Date(Date.now()).toDateString()}
          onDayPress={onPickDate}
          markedDates={marked}
        />
      </View>
    </CustomModal>
  );
};

export default memo(CalendarModal);
