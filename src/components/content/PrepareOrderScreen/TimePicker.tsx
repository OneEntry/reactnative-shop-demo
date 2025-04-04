import React, {Dispatch, memo, useEffect, useState} from 'react';
import {View} from 'react-native';
import MiniButton from '../../ui/buttons/MiniButton';
import {useAppSelector} from '../../../state/hooks';

/**
 * Generates an array of booleans representing hourly availability based on provided time slot data.
 * @param {[number, number] | [number, number, number[]]} availability - Time slot data:
 *   - [startHour, endHour] for a range with no exclusions, or
 *   - [startHour, endHour, excludeTimes] with an array of excluded hours.
 * @returns {boolean[]} Array of length (endHour - startHour), where each element is true if the hour is available,
 *   false if excluded. Returns array of 12 true values if input is invalid.
 */
const getHourlyAvailability = (
  availability: [number, number] | [number, number, number[]],
) => {
  const [start, end, excludeTimes = []] = availability;
  if (typeof start !== 'number' || typeof end !== 'number' || start >= end)
    return Array(12).fill(true);

  const hours = [];
  for (let hour = start; hour < end; hour++) {
    hours.push(!excludeTimes.includes(hour));
  }
  return hours;
};

/**
 * Props for the TimePicker component.
 */
interface Props {
  active: number | null;
  setActive: Dispatch<number | null>;
  action?: (time: number) => void;
}

/**
 * A component for selecting available hours from a time range, rendered as a grid of buttons.
 * @param {Props} props - Component props.
 * @returns {JSX.Element} A view containing MiniButton components for each available hour.
 */
const TimePicker: React.FC<Props> = ({active, action, setActive}) => {
  const availableTimes = useAppSelector(
    state => state.orderReducer.availableTimes,
  );
  const [availableHours, setAvailableHours] = useState<boolean[]>([]);

  useEffect(() => {
    if (availableTimes) {
      const hours = getHourlyAvailability(availableTimes);
      setAvailableHours(hours);
    }
  }, [availableTimes]);

  return (
    <View className="flex-row flex-wrap justify-center items-start gap-2">
      {availableHours?.map((isAvailable, index: number) => {
        const currentTime = (availableTimes[0] || 10) + index;
        return (
          <MiniButton
            key={'time' + index}
            active={isAvailable}
            selected={currentTime === active}
            title={currentTime + ':00'}
            onPress={() => {
              if (currentTime !== active) {
                setActive(currentTime);
                action && action(currentTime);
              } else {
                setActive(null);
              }
            }}
            className={'w-1/4'}
          />
        );
      })}
    </View>
  );
};

export default memo(TimePicker);
