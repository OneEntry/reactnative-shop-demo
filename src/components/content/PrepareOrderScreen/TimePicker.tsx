import React, {Dispatch, memo, useEffect, useState} from 'react';
import {View} from 'react-native';
import MiniButton from '../../ui/buttons/MiniButton';
import {useAppSelector} from '../../../state/hooks';

/**
 * Generates an array of booleans representing hourly availability based on provided time slot data.
 * @param {[{hours: number, minutes: number}[][], {hours: number, minutes: number}[][]} availability - Time slot data:
 *   - [startHour, endHour] for a range with no exclusions, or
 *   - [startHour, endHour, excludeTimes] with an array of excluded hours.
 * @returns {{hours: number, minutes: number}[]} Array of length (endHour - startHour), where each element is true if the hour is available,
 *   false if excluded. Returns array of 12 true values if input is invalid.
 */
const getHourlyAvailability = (
  availability: [
    {hours: number; minutes: number}[][],
    {hours: number; minutes: number}[][],
  ],
) => {
  const [available, disabled] = availability;
  if (!available?.length) return;

  const res = available?.map(slot => {
    return {
      slot,
      disabled: disabled?.some(disabledSlot => {
        return (
          disabledSlot[0]?.hours === slot[0]?.hours &&
          disabledSlot[0]?.minutes === slot[0]?.minutes
        );
      }),
    };
  });

  return res;
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

  const [availableHours, setAvailableHours] = useState<
    {
      disabled: boolean;
      slot: {
        hours: number;
        minutes: number;
      }[];
    }[]
  >([]);

  useEffect(() => {
    if (availableTimes) {
      const hours = getHourlyAvailability(availableTimes);
      setAvailableHours(hours);
    }
  }, [availableTimes]);

  return (
    <View className="flex-wrap justify-center items-start gap-2">
      {availableHours?.map((item, index: number) => {
        const currentTime = index;
        return (
          <MiniButton
            key={'time' + index}
            active={!item.disabled}
            selected={currentTime === active}
            title={`${item?.slot[0]?.hours.toString().padStart(2, '0')}:${item?.slot[0]?.minutes.toString().padStart(2, '0')} - ${item?.slot[1]?.hours.toString().padStart(2, '0')}:${item?.slot[1]?.minutes.toString().padStart(2, '0')}`}
            onPress={() => {
              if (currentTime !== active) {
                setActive(currentTime);
                action && action(currentTime);
              } else {
                setActive(null);
              }
            }}
            className={'w-3/4'}
          />
        );
      })}
    </View>
  );
};

export default memo(TimePicker);
