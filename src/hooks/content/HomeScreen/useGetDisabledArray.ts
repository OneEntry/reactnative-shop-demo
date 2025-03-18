import {MarkingProps} from 'react-native-calendars/src/calendar/day/marking';
import {useMemo} from 'react';
import dayjs from 'dayjs';

/**
 * Custom hook to generate a disabled dates object formatted for react-native-calendars.
 * This hook creates an object where keys are dates in 'YYYY-MM-DD' format, and values indicate whether the date is disabled and inactive.
 *
 * @function useGetDisabledArray
 * @param {Props} params - The parameters passed to the hook.
 * @param {number[]} params.available - Array of numbers representing available weekdays (0 = Sunday, 1 = Monday, ..., 6 = Saturday).
 * @param {string[]} params.exceptions - Array of strings representing exception dates in ISO format (e.g., '2023-10-15').
 * @param {string} params.currentMonth - A string representing the current month in 'YYYY-MM' format (e.g., '2023-10').
 * @returns {{ disabledDates: {[key: string]: MarkingProps} }} An object containing:
 * - `disabledDates`: A mapping of dates (in 'YYYY-MM-DD' format) to objects indicating whether they are disabled and inactive.
 */
const useGetDisabledArray = ({
  available,
  exceptions,
  currentMonth,
}: Props): {disabledDates: {[key: string]: MarkingProps}} => {
  /**
   * Memoized computation of disabled dates for the given month.
   * Iterates through all days in the specified month and determines which ones should be disabled based on:
   * - Whether the day of the week is not in the `available` array.
   * - Whether the date is listed in the `exceptions` array.
   */
  const disabledDates = useMemo(() => {
    if (!available || !exceptions || !currentMonth) {
      return {};
    }

    const disabled: {[key: string]: MarkingProps} = {};

    // Define the start and end of the picked month
    const startOfMonth = dayjs(currentMonth).startOf('month');
    const endOfMonth = dayjs(currentMonth).endOf('month');

    // Initialize currentDate to the start of the month
    let currentDate = startOfMonth;

    // Iterate through each day in the month
    while (
      currentDate.isSame(endOfMonth, 'day') ||
      currentDate.isBefore(endOfMonth, 'day')
    ) {
      const dayOfWeek = currentDate.day(); // Day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)

      // Check if the day should be disabled
      if (
        !available.includes(dayOfWeek) || // Not an available weekday
        exceptions.includes(currentDate.toISOString()) // Listed as an exception
      ) {
        disabled[currentDate.format('YYYY-MM-DD')] = {
          disabled: true,
          inactive: true,
        };
      }

      // Move to the next day
      currentDate = currentDate.add(1, 'day');
    }

    console.log(disabled);
    return disabled;
  }, [available, exceptions, currentMonth]);

  return {
    disabledDates,
  };
};

/**
 * Type definition for the props of the `useGetDisabledArray` hook.
 */
type Props = {
  available: number[]; // Array of numbers representing available weekdays (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  exceptions: string[]; // Array of strings representing exception dates in ISO format (e.g., '2023-10-15')
  currentMonth: string; // A string representing the current month in 'YYYY-MM' format (e.g., '2023-10')
};

export default useGetDisabledArray;
