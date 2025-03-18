import {useGetSingleAttributeInSetByMarkerQuery} from '../../../api/api/RTKApi';
import {useMemo} from 'react';
import dayjs from 'dayjs';

/**
 * Custom hook to fetch and process a schedule attribute for order from the OneEntry.
 * Converts the raw schedule data into a more usable format with available days and exceptions.
 *
 * @function useGetSchedule
 * @returns {{ available: number[], exceptions: string[] }} An object containing:
 * - `available`: Array of numbers representing available weekdays (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
 * - `exceptions`: Array of strings representing exception dates in ISO format
 */
const useGetSchedule = (): {available: number[]; exceptions: string[]} => {
  /**
   * Fetches the 'shipping_interval' attribute from the 'order' set using RTK query.
   * The response contains localized interval information.
   */
  const {data: intervals} = useGetSingleAttributeInSetByMarkerQuery({
    setMarker: 'order',
    attributeMarker: 'shipping_interval',
  });

  const intervalsArr = intervals?.localizeInfos?.intervals;

  /**
   * Memoized computation of available days and exceptions.
   * If no intervals are available, returns empty arrays for both.
   */
  const {available, exceptions} = useMemo(() => {
    if (
      !intervalsArr ||
      !Array.isArray(intervalsArr) ||
      intervalsArr.length === 0
    ) {
      return {available: [], exceptions: []};
    }

    // Extract exception dates from the intervals
    const exceptions = intervalsArr
      .flatMap(interval => interval.external ?? [])
      .map(exception => exception.date);

    // Map intervals to available weekdays
    const available = intervalsArr
      .filter(interval => interval.range && interval.inEveryWeek)
      .map(interval => {
        const targetDate = dayjs(interval.range[0]);
        return targetDate.day(); // Returns day of week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
      })
      .filter(day => day !== undefined); // Remove any potential undefined values

    return {available, exceptions};
  }, [intervalsArr]);

  return {
    available,
    exceptions,
  };
};

export default useGetSchedule;
