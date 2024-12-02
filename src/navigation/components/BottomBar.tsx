import React, {memo, useContext, useEffect, useState} from 'react';
import {Keyboard, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {styleColors} from '../../utils/consts';
import {navigate} from '../utils/NavigatonRef';
import {useAppSelector} from '../../store/hooks';
import {selectBasketCount} from '../../store/reducers/CartSlice';
import {Paragraph} from '../../components/ui/texts/Paragraph';
import {OpenDrawerContext} from '../../providers/OpenDrawerContext';
import hairlineWidth = StyleSheet.hairlineWidth;
import ErrorBlock from '../../components/shared/ErrorBlock';
import {IMenusPages} from 'oneentry/dist/menus/menusInterfaces';
import CustomImage from '../../components/ui/templates/CustomImage';
import {useGetMenuQuery} from '../../api/api/RTKApi';

interface Props {}

const BottomBar: React.FC<Props> = ({}) => {
  const {data: menu, error} = useGetMenuQuery({marker: 'bottom'});
  const {active} = useContext(OpenDrawerContext);
  const insets = useSafeAreaInsets();
  const cartCount = useAppSelector(selectBasketCount);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

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

  if (error) {
    return <ErrorBlock errorTitle={'error menu'} />;
  }

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
                <View
                  className={
                    'absolute w-4 h-4 bg-accent -right-2.5 rounded-full z-50 items-center justify-center'
                  }>
                  <Paragraph size={9} color={'white'} weight={'700'}>
                    {cartCount}
                  </Paragraph>
                </View>
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
