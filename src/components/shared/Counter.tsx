import {
  Pressable,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {ROUNDED_RADIUS, styleColors} from '../../utils/consts';
import {Paragraph} from '../ui/texts/Paragraph';
import Plus from '../../assets/icons/plus.svg';
import Minus from '../../assets/icons/minus.svg';

type Props = {
  count: number;
  style?: StyleProp<ViewStyle>;
  isZeroValue?: boolean;
  onEdit: (value: number, operator: '+' | '-') => void;
};
export const Counter = ({count, onEdit, style, isZeroValue = false}: Props) => {
  return (
    <Pressable style={[styles.container, style]}>
      <TouchableOpacity
        disabled={!isZeroValue ? count < 2 : count < 1}
        onPress={async () => {
          if (!isZeroValue ? count > 1 : count > 0) {
            onEdit(count - 1, '-');
          }
        }}
        hitSlop={24}>
        <Minus
          stroke={
            (!isZeroValue ? count < 2 : count < 1)
              ? styleColors.lightGray
              : styleColors.black
          }
        />
      </TouchableOpacity>
      <Paragraph numberOfLines={1} weight="bold">
        {count}
      </Paragraph>
      <TouchableOpacity
        onPress={async () => {
          onEdit(count + 1, '+');
        }}
        hitSlop={24}>
        <Plus />
      </TouchableOpacity>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: ROUNDED_RADIUS,
    gap: 15,
    // borderColor: styleColors.lightGray,
    // borderWidth: 1,
    zIndex: 1001,
    backgroundColor: styleColors.gray_v2,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
});
