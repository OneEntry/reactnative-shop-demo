import {useCallback, useMemo} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import {useGetSingleAttributeInSetByMarkerQuery} from '../../../api/api/RTKApi';
import {useFocusEffect} from '@react-navigation/native';

/**
 * Checks if a given date matches an interval's criteria.
 *
 * @param {Dayjs} currentDate - The date to evaluate.
 * @param {Object} interval - The interval object with matching conditions.
 * @returns {boolean} True if the date matches the interval, false otherwise.
 */
const isMatch = (currentDate: Dayjs, interval: any) => {
  const current = dayjs(currentDate);
  const intervalDate = dayjs(interval.dateISO);

  // Check month if not recurring every month
  if (!interval.inEveryMonth) {
    if (current.month() !== intervalDate.month()) return false;
  }

  // Check year if not recurring every year
  if (!interval.inEveryYear) {
    if (current.year() !== intervalDate.year()) return false;
  }

  // Check day of week if recurring weekly, otherwise check day of month
  if (interval.inEveryWeek) {
    if (current.day() !== intervalDate.day()) return false;
  } else {
    if (current.date() !== intervalDate.date()) return false;
  }

  return true;
};

type Props = {
  displayedMonth: string;
};

/**
 * Custom hook to fetch and process a schedule for a specified month.
 *
 * @param {Object} props - The props object.
 * @param {string} props.displayedMonth - The month to fetch the schedule for, in 'YYYY-MM' format.
 * @returns {Object} An object with available times and fully disabled dates.
 * @returns {Object} available - An object mapping dates (in 'YYYY-MM-DD' format) to arrays of available times.
 * @returns {string[]} fullyDisabledDates - An array of fully disabled dates (in 'YYYY-MM-DD' or ISO format).
 */
const useGetSchedule = ({
  displayedMonth,
}: Props): {available: Record<string, any>; fullyDisabledDates: string[]} => {
  const {data: schedule, refetch} = useGetSingleAttributeInSetByMarkerQuery({
    setMarker: 'order',
    attributeMarker: 'shipping_interval',
  });

  console.log(schedule);

  /**
   * Computes available time slots and fully disabled dates for the displayed month.
   * @returns {{
   *   available: Record<string, [number, number] | [number, number, number[]]>,
   *   fullyDisabledDates: string[]
   * }}
   * - `available`: An object where keys are dates in 'YYYY-MM-DD' format and values are arrays:
   *   - [startHour, endHour] if no exceptions, or
   *   - [startHour, endHour, excludeTimes] if there are exceptions (excludeTimes is an array of excluded hours).
   * - `fullyDisabledDates`: An array of fully disabled dates in 'YYYY-MM-DD' or ISO format.
   */
  const {available, fullyDisabledDates} = useMemo(() => {
    const dayjsMonth = dayjs(displayedMonth);

    if (!schedule) {
      // No schedule data, return all days as available
      return {available: []};
    }
    // @ts-ignore
    const intervals = schedule?.value[0]?.values;

    if (!intervals?.length) {
      // No intervals defined, return all days as available
      return {available: []};
    }

    const available: Record<string, any> = {};
    const fullyDisabledDates: string[] = [];

    // Set up the start and end of the displayed month
    let currentDate = dayjsMonth.startOf('month');
    const lastDayOfMonth = dayjsMonth.endOf('month');

    const today = dayjs().startOf('day');
    // Loop through each day of the month
    while (
      currentDate.isSame(lastDayOfMonth) ||
      currentDate.isBefore(lastDayOfMonth)
    ) {
      // Disable past dates
      if (currentDate.isBefore(today)) {
        currentDate = currentDate.add(1, 'day');
        continue;
      }

      // Process each interval for the current day
      for (const interval of intervals) {
        const exceptions: any[] = interval.external || [];

        let excludeTimes = [];
        let isDisabledByException = false;

        // Check exceptions that might disable the day or exclude specific times
        for (const exception of exceptions) {
          const match = isMatch(currentDate, {
            dateISO: exception.date,
            ...exception,
          });

          if (match) {
            if (exception.times) {
              // Collect times to exclude from this date interval
              excludeTimes = exception.times;
            } else {
              // No times means the day is fully disabled
              isDisabledByException = true;
              break;
            }
          }
        }

        if (isDisabledByException) {
          fullyDisabledDates.push(currentDate.format('YYYY-MM-DD'));
          break;
        }

        // Validate the interval's date range
        const [startDateStr, endDateStr] = interval?.dates || [];
        if (!startDateStr || !endDateStr) continue;
        let startDate = dayjs(startDateStr);
        const endDate = dayjs(endDateStr);

        const daysOfInterval = [];
        // Build list of dates within the interval's range
        while (startDate.isSame(endDate) || startDate.isBefore(endDate)) {
          daysOfInterval.push(startDate.toISOString());
          startDate = startDate.add(1, 'day');
        }

        // Check if current day matches any interval day
        for (const day of daysOfInterval) {
          const match = isMatch(currentDate, {dateISO: day, ...interval});
          if (match) {
            if (excludeTimes.length) {
              available[currentDate.format('YYYY-MM-DD')] = [
                interval?.times,
                excludeTimes,
              ];
            } else {
              available[currentDate.format('YYYY-MM-DD')] = [
                interval?.times,
                undefined,
              ];
            }
            break;
          }
        }
      }
      currentDate = currentDate.add(1, 'day');
    }

    return {available, fullyDisabledDates};
  }, [schedule, displayedMonth]);

  useFocusEffect(
    useCallback(() => {
      refetch();
      return;
    }, []),
  );

  return {
    available,
    fullyDisabledDates,
  };
};

export default useGetSchedule;
