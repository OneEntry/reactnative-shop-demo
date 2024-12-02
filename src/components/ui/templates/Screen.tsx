import {
  Keyboard,
  Platform,
  TouchableWithoutFeedback,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {layoutPadding, styleColors} from '../../../utils/consts';

export type Edge = 'top' | 'bottom' | 'horizontal';

type ScreenProps = ViewProps & {
  edges?: Edge[];
  white?: boolean;
  isFlex?: boolean;
  isFull?: boolean;
  isHideKeyboard?: boolean;
};

export const Screen = (props: ScreenProps) => {
  const {
    children,
    edges,
    style,
    white,
    isFlex,
    isFull,
    isHideKeyboard,
    ...rest
  } = props;
  const {bottom, top} = useSafeAreaInsets();

  const styles: ViewStyle = {
    paddingBottom: edges?.includes('bottom') ? bottom + 60 : undefined,
    paddingTop:
      Platform.OS === 'android'
        ? edges?.includes('top')
          ? top + 10
          : undefined
        : edges?.includes('top')
        ? top
        : undefined,
    paddingLeft: edges?.includes('horizontal') ? layoutPadding : undefined,
    paddingRight: edges?.includes('horizontal') ? layoutPadding : undefined,
    flex: isFlex ? 1 : undefined,
    height: isFull ? '100%' : undefined,
    backgroundColor: white ? styleColors.white : undefined,
  };

  if (isHideKeyboard) {
    return (
      <TouchableWithoutFeedback
        onPress={() => isHideKeyboard && Keyboard.dismiss()}
      >
        <View style={[styles, style]} {...rest}>
          {children}
        </View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <View style={[styles, style]} {...rest}>
      {children}
    </View>
  );
};
