import React, {useContext, useEffect} from 'react';
import Menu from '../../assets/icons/menu.svg';
import Search from '../../assets/icons/search-icon.svg';
import {TouchableOpacity, View} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {layoutWidth} from '../../utils/consts';
import {Paragraph} from '../../components/ui/texts/Paragraph';
import GoBackButton from '../../components/ui/buttons/GoBackButton';
import {OpenDrawerContext} from '../../state/contexts/OpenDrawerContext';
import {useAppNavigation} from '../types/types';
import Animated, {interpolate, useAnimatedStyle} from 'react-native-reanimated';
import {useDrawerProgress} from '@react-navigation/drawer';

interface Props {
  isSearch: boolean;
  cantGoBack?: boolean;
  hideTitle?: boolean;
  title?: string;
  isDrawer?: boolean;
  url?: string;
}

const ContentTopBar: React.FC<Props> = ({
  isSearch,
  title,
  cantGoBack,
  isDrawer = true,
  hideTitle,
  url,
}) => {
  const navigation = useAppNavigation();
  const insets = useSafeAreaInsets();
  const {setActive} = useContext(OpenDrawerContext);
  const {setOpen} = useContext(OpenDrawerContext);
  const progress = useDrawerProgress();

  useEffect(() => {
    title && setActive(title.toLowerCase());
  }, [title]);

  const grayScreens = ['orders', 'order_details', 'shop'];
  const handlePressToMenu = () => {
    if (isDrawer) {
      navigation.dispatch(DrawerActions.toggleDrawer());
      setOpen(true);
    }
  };
  const animatedContent = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0], 'clamp'),
  }));

  const paddingTop = insets.top < 5 && {paddingTop: 10};

  if (url === 'profile') {
    return <></>;
  }

  return (
    <Animated.View
      className={'px-layout w-full absolute'}
      style={[animatedContent, paddingTop]}>
      <View
        className={'self-center flex-row items-center justify-end gap-2.5'}
        style={{width: layoutWidth}}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent:
              isSearch || !cantGoBack ? 'space-between' : 'flex-end',
            top: insets.top,
            width: !cantGoBack ? '100%' : '80%',
          }}>
          <View style={{height: 48, zIndex: 1001}}>
            {!cantGoBack && (
              <GoBackButton
                className={`${
                  grayScreens.findIndex(screen => url === screen) === -1 &&
                  'bg-lightGray'
                }`}
              />
            )}
          </View>

          {title && !hideTitle && (
            <View className={'absolute w-full items-center justify-center'}>
              <Paragraph
                weight={'600'}
                size={title?.length > 14 ? 20 : 24}
                color={'gray'}>
                {title}
              </Paragraph>
            </View>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
            {isSearch && (
              <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                <Search width={24} />
              </TouchableOpacity>
            )}
            {/*{url === 'user' && }*/}
            {isDrawer && (
              <TouchableOpacity
                style={{padding: 1}}
                onPress={handlePressToMenu}>
                <Menu width={24} color={'black'} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

export default ContentTopBar;
