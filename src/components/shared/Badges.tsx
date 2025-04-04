import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ViewProps,
} from 'react-native';
import {Paragraph} from '../ui/texts/Paragraph';
import {styleColors} from '../../utils/consts';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {IFilterParams} from 'oneentry/dist/products/productsInterfaces';

type BadgeProps = Record<any, any> & {
  onChange: (value: number, filters: IFilterParams[]) => void;
  isActive?: boolean;
  index: number;
  filters: IFilterParams[];
};

type BadgeListProps = ViewProps & {
  options: Record<any, any>[];
  onChange: (value: number, filters: IFilterParams[]) => void;
  activeValue?: number | string;
  filters: IFilterParams[];
};
const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export const Badge = (props: BadgeProps) => {
  const {label, value, isActive, filters, onChange, index} = props;
  const isActiveValue = useDerivedValue(() => withTiming(isActive ? 1 : 0));
  const animatedStyles = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      isActiveValue.value,
      [0, 1],
      [styleColors.white, '#F6F7F9'],
    ),
    borderColor: interpolateColor(
      isActiveValue.value,
      [0, 1],
      [styleColors.border_color, '#F6F7F9'],
    ),
  }));

  const animatedParagraphStyles = useAnimatedStyle(() => ({
    color: interpolateColor(
      isActiveValue.value,
      [0, 1],
      [styleColors.border_color, '#4C4D56'],
    ),
  }));

  return (
    <AnimatedTouchableOpacity
      className={'px-5 py-1 border-sm rounded-full'}
      onPress={() => onChange(index, filters)}
      style={[animatedStyles]}>
      <Paragraph style={animatedParagraphStyles} size={16} weight="400">
        {label}
      </Paragraph>
    </AnimatedTouchableOpacity>
  );
};

export const BadgeList = (props: BadgeListProps) => {
  const {options, activeValue, onChange, style, filters} = props;

  return (
    <ScrollView
      className={''}
      contentContainerStyle={[styles.container, style]}
      horizontal
      showsHorizontalScrollIndicator={false}>
      {options.map((option, index) => (
        <Badge
          key={option.value}
          onChange={onChange}
          {...option}
          index={index}
          isActive={activeValue === index}
          filters={filters}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingTop: 20,
  },
});
