import React, {memo, useMemo} from 'react';
import {CustomDrawerContent} from '../components/CustomDrawer';
import {getHeaderTitle} from '@react-navigation/elements';
import ContentTopBar from '../components/ContentTopBar';
import {styleColors} from '../../utils/consts';
import DrawerScreenWrapper from '../components/DrawerScreenWrapper';
import SearchScreen from '../../pages/content/SearchScreen';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import {NavigationProps} from '../types/types';
import {ShopScreen} from '../../pages/content/ShopScreen';
import {HomeScreen} from '../../pages/content/HomeScreen';
import FavoritesScreen from '../../pages/content/FavoritesScreen';
import CartScreen from '../../pages/content/CartScreen';
import ProfileScreen from '../../pages/content/ProfileScreen';
import UserOrdersScreen from '../../pages/content/UserOrdersScreen';
import ContactUsScreen from '../../pages/content/ContactUsScreen';
import ContentNotVisible from '../../pages/content/ContentNotVisibleScreen';
import {StackNavigator} from './StackNavigator';
import PrepareOrderScreen from '../../pages/content/PrepareOrderScreen';
import {DrawerStackNavigatorParamList} from '../types/DrawerStackNavigatorParamList';
import PaymentPayScreen from '../../pages/content/PaymentPayScreen';
import CreateOrderScreen from '../../pages/content/CreateOrderScreen';
import OrderDetailsScreen from '../../pages/content/OrderDetailsScreen';
import ReviewsScreen from '../../pages/content/ReviewsScreen';
import ErrorBlock from '../../components/shared/ErrorBlock';
import Loader from '../../components/ui/space/Loader';
import BottomBar from '../components/BottomBar';
import {useGetPagesQuery} from '../../api/api/RTKApi';
import MessageScreen from '../../pages/content/MessageScreen';

type Props = {};

const Drawer = createDrawerNavigator<DrawerStackNavigatorParamList>();

interface ScreenTypes {
  [key: string]: React.FC<NavigationProps>;
}

const dynamicScreens: ScreenTypes = {
  shop: ShopScreen,
  home: HomeScreen,
  favorites: FavoritesScreen,
  cart: CartScreen,
  profile: ProfileScreen,
  orders: UserOrdersScreen,
  contact_us: ContactUsScreen,
  place_an_order: PrepareOrderScreen,
  payment_method: PaymentPayScreen,
  order_details: OrderDetailsScreen,
  message: MessageScreen,
  payment: CreateOrderScreen,
  null: ContentNotVisible,
};

/**
 * DrawerNavigator component manages the "content" navigation structure.
 * It dynamically generates screens based on the fetched pages data.
 *
 * @param {Props} props - Component props.
 * @returns {React.ReactElement} - Rendered component.
 */
const DrawerNavigator: React.FC<Props> = ({}) => {
  // Fetch all pages data using the RTK query
  const {
    data: pages,
    isLoading: loadingPages,
    error: errorPages,
  } = useGetPagesQuery({});

  // Memoize the titles to display in the drawer
  const showTitle = useMemo(() => {
    return pages
      ? pages?.reduce((arr: string[], page) => {
          if (page?.attributeValues?.show_title?.value?.value === 'true') {
            arr.push(page?.localizeInfos?.menuTitle);
          }
          return arr;
        }, [])
      : [];
  }, [pages]);

  if (errorPages) {
    return <ErrorBlock errorDescription={errorPages.toString()} />;
  }

  if (loadingPages || !pages?.length) {
    return <Loader showBanner />;
  }

  return (
    <>
      <Drawer.Navigator
        drawerContent={(props: DrawerContentComponentProps) => (
          <CustomDrawerContent {...props} />
        )}
        backBehavior={'history'}
        initialRouteName={'home'}
        screenOptions={{
          unmountOnBlur: true,
          header: ({route, options}) => {
            const title = getHeaderTitle(options, route.name);

            return (
              route.name !== 'Search' &&
              route.name.toUpperCase() !== 'PRODUCTS' && (
                <ContentTopBar
                  isSearch={
                    route.name.toUpperCase() !== 'HOME' &&
                    route.name.toUpperCase() !== 'PROFILE'
                  }
                  cantGoBack={
                    route.name.toUpperCase() === 'HOME' ||
                    route.name.toUpperCase() === 'PRODUCTS'
                  }
                  url={route.name}
                  hideTitle={
                    showTitle?.findIndex(
                      candidate =>
                        title.toUpperCase() === candidate.toUpperCase(),
                    ) === -1
                  }
                  title={title[0].toUpperCase() + title.slice(1) || undefined}
                />
              )
            );
          },
          drawerType: 'slide',
          overlayColor: 'rgba(255,255,255,0)',
          drawerStyle: {
            width: '70%',
            height: '100%',
          },
          sceneContainerStyle: {
            backgroundColor: styleColors.white,
          },
        }}>
        {/* Dynamic Screens */}
        {pages?.map(page => {
          const RenderedScreen = page.templateIdentifier
            ? dynamicScreens[
                page?.templateIdentifier === 'shop' ? 'shop' : page?.pageUrl
              ]
            : dynamicScreens.null;

          if (page?.isVisible) {
            return (
              <Drawer.Screen
                name={page.pageUrl}
                key={page.pageUrl}
                options={{
                  drawerLabel: page.localizeInfos?.menuTitle,
                  title: page.localizeInfos?.menuTitle,
                }}
                initialParams={{
                  pageUrl: page.pageUrl,
                  title: page.localizeInfos?.menuTitle,
                }}>
                {({route, navigation}) => (
                  <DrawerScreenWrapper>
                    <RenderedScreen navigation={navigation} route={route} />
                  </DrawerScreenWrapper>
                )}
              </Drawer.Screen>
            );
          } else {
            return (
              <Drawer.Screen
                name={page.pageUrl}
                key={page.pageUrl}
                options={{
                  drawerLabel: page.localizeInfos?.menuTitle,
                  title: page.localizeInfos?.menuTitle,
                }}
                initialParams={{
                  pageUrl: page.pageUrl,
                  title: page.localizeInfos?.menuTitle,
                }}>
                {() => (
                  <DrawerScreenWrapper>
                    <ContentNotVisible />
                  </DrawerScreenWrapper>
                )}
              </Drawer.Screen>
            );
          }
        })}

        {/* Static Screens */}
        {pages && (
          <>
            <Drawer.Screen name={'Search'} component={SearchScreen} />
            <Drawer.Screen name={'reviews'} component={ReviewsScreen} />
            <Drawer.Screen name={'Products'} options={{title: 'Products'}}>
              {() => (
                <DrawerScreenWrapper>
                  <StackNavigator />
                </DrawerScreenWrapper>
              )}
            </Drawer.Screen>
            <Drawer.Screen
              name={'payment_method'}
              options={{}}
              initialParams={{
                pageUrl: 'payment_method',
                title: 'payment_method',
              }}
              component={dynamicScreens?.payment_method || dynamicScreens.null}
            />
            <Drawer.Screen
              name={'message'}
              options={{}}
              initialParams={{
                pageUrl: 'message',
                title: 'Message',
              }}
              component={dynamicScreens?.message || dynamicScreens.null}
            />
          </>
        )}
      </Drawer.Navigator>
      <BottomBar />
    </>
  );
};

export default memo(DrawerNavigator);
