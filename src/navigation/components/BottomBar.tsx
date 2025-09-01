import React, {memo, useContext, useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styleColors} from '../../utils/consts';
import {navigate} from '../utils/NavigatonRef';
import {useAppSelector} from '../../state/hooks';
import {Paragraph} from '../../components/ui/texts/Paragraph';
import {OpenDrawerContext} from '../../state/contexts/OpenDrawerContext';
import hairlineWidth = StyleSheet.hairlineWidth;
import {IMenusEntity, IMenusPages} from 'oneentry/dist/menus/menusInterfaces';
import CustomImage from '../../components/ui/templates/CustomImage';
import {getCartLength} from '../../state/reducers/userStateSlice';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

interface Props {
  menu: IMenusEntity;
}

const BottomBar: React.FC<Props> = ({menu}) => {
  const {active} = useContext(OpenDrawerContext);
  const insets = useSafeAreaInsets();
  const cartCount = useAppSelector(getCartLength);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  const scale = useSharedValue(1);

  useEffect(() => {
    if (cartCount > 0) {
      // Trigger pop animation
      scale.value = withSpring(1.4, {damping: 5});
      setTimeout(() => {
        scale.value = withSpring(1);
      }, 150);
    }
  }, [cartCount]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  useEffect(() => {
    if (menu?.pages) {
      // dispatch(addMenu(menu.pages as IMenusPages[]));
    }
  }, [menu]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    // Clean up the event listeners
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <View
      className={
        'absolute w-full left-0 bg-white flex-row items-center justify-evenly border-t-gray z-10'
      }
      style={[
        {
          height: insets.bottom > 20 ? insets.bottom + 38 : 52,
          paddingBottom: insets.bottom > 15 ? 10 : 3,
          bottom: isKeyboardVisible ? -50 : 0,
          borderTopWidth: hairlineWidth,
        },
      ]}>
      {(menu?.pages as IMenusPages[])?.map((item: any, i: number) => {
        if (i < 5) {
          return (
            <TouchableOpacity
              className={'p-1'}
              onPress={() => {
                if (item) {
                  navigate(item.pageUrl);
                }
              }}
              key={i}>
              {item?.pageUrl === 'cart' && cartCount > 0 && (
                <Animated.View
                  style={animatedStyle}
                  className={
                    'absolute w-4 h-4 bg-accent -right-2.5 rounded-full z-50 items-center justify-center'
                  }>
                  <Paragraph size={9} color={'white'} weight={'700'}>
                    {cartCount}
                  </Paragraph>
                </Animated.View>
              )}
              <CustomImage
                width={24}
                height={24}
                uri={item?.attributeValues?.page_icon?.value?.downloadLink}
                style={{
                  tintColor:
                    active !== item?.pageUrl
                      ? '#4C4D56'
                      : styleColors.background,
                }}
              />
            </TouchableOpacity>
          );
        }
      })}
    </View>
  );
};

export default memo(BottomBar);
