import React, {Dispatch, memo, useMemo, useState} from 'react';
import dayjs from 'dayjs';
import {useAppDispatch} from '../../../state/hooks';
import useGetSchedule from '../../../hooks/content/HomeScreen/useGetSchedule';
import useGetDisabledArray from '../../../hooks/content/HomeScreen/useGetDisabledArray';
import {styleColors} from '../../../utils/consts';
import {Calendar, DateData} from 'react-native-calendars';
import {addData} from '../../../state/reducers/OrderReducer';
import CustomModal from '../../shared/CustomModal';
import {View} from 'react-native';

/**
 * A modal calendar component that allows users to select a shipping date for their order.
 * This component uses custom hooks (`useGetSchedule` and `useGetDisabledArray`) to determine available dates
 * and disabled dates based on the interval attribute from OneEntry CMS.
 *
 * @param {Props} props - The properties passed to the component.
 * @param {boolean} props.visible - Controls the visibility of the modal.
 * @param {Dispatch<boolean>} props.setVisible - Function to toggle the visibility of the modal.
 * @returns {React.ReactElement} A React Native modal containing a calendar with marked and disabled dates.
 */
const DatePickerModal: React.FC<Props> = ({
  visible,
  setVisible,
}: Props): React.ReactElement => {
  /**
   * State to state the currently selected date for order in 'YYYY-MM-DD' format.
   */
  const [selectedDate, setSelectedDate] = useState<string>('');

  /**
   * State to state the current month of calendar in 'YYYY-MM' format.
   */
  const [currentMonth, setCurrentMonth] = useState<string>(
    dayjs().format('YYYY-MM'),
  );

  const dispatch = useAppDispatch();

  /**
   * Custom hook to fetch the available days and exceptions from the interval attribute.
   */
  const {available, exceptions} = useGetSchedule();

  /**
   * Custom hook to generate an object of disabled dates for the current month.
   */
  const {disabledDates} = useGetDisabledArray({
    available,
    exceptions,
    currentMonth,
  });

  /**
   * Memoized computation of marked dates for the calendar.
   * Combines the selected date and disabled dates into a single object.
   */
  const marked = useMemo(() => {
    return Object.assign(
      {},
      {
        [selectedDate]: {
          selected: true,
          disableTouchEvent: false,
          selectedColor: styleColors.background,
          borderRadius: 4,
          selectedTextColor: 'white',
        },
      },
      disabledDates,
    );
  }, [selectedDate, disabledDates]);

  /**
   * Handler for when the user changes the displayed month in the calendar.
   * Updates the `currentMonth` state to reflect the new month.
   *
   * @param {DateData} month - The new month data provided by the calendar.
   */
  const handleMonthChange = (month: DateData) => {
    const newMonth = `${month.year}-${String(month.month).padStart(2, '0')}`;
    setCurrentMonth(newMonth);
  };

  /**
   * Handler for when the user selects a date in the calendar.
   * Updates the selected date, dispatches the date to the Redux state, and closes the modal.
   *
   * @param {DateData} day - The selected day data provided by the calendar.
   */
  const onPickDate = (day: DateData) => {
    setSelectedDate(day.dateString);

    // Dispatch the selected date to the Redux state
    dispatch(
      addData({
        marker: 'date',
        type: 'date',
        value: {
          fullDate: day.dateString + 'T00:00:00.000Z', // ISO 8601 format
          formattedValue: day.dateString + ' 00:00', // Custom format
          formatString: 'YYYY-MM-DD', // Format string for reference
        },
      }),
    );

    // Close the modal after selecting a date
    setVisible(false);
  };

  return (
    <CustomModal visible={visible} setVisible={setVisible} title="Calendar">
      <View className="bg-white flex-1 justify-center px-layout">
        <Calendar
          onMonthChange={handleMonthChange}
          theme={{
            monthTextColor: styleColors.background,
            arrowColor: styleColors.background,
            selectedDayTextColor: 'blue',
            selectedDotColor: styleColors.background,
            todayTextColor: styleColors.background,
            // @ts-ignore - Override calendar header styles
            'stylesheet.calendar.header': {
              dayHeader: {
                color: styleColors.background,
              },
            },
          }}
          minDate={new Date(Date.now()).toDateString()} // Restrict selection of previous dates
          onDayPress={onPickDate}
          markedDates={marked} // Apply marked and disabled dates
        />
      </View>
    </CustomModal>
  );
};

/**
 * Type definition for the props of the `DatePickerModal` component.
 */
interface Props {
  visible: boolean; // Whether the modal is visible
  setVisible: Dispatch<boolean>; // Function to toggle the modal's visibility
}

export default memo(DatePickerModal);
