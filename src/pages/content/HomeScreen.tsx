import {RefreshControl, View} from 'react-native';
import React from 'react';
import {NavigationProps} from '../../navigation/types/types';
import {useGetBlocksByPageUrlQuery} from '../../api';
import {Screen} from '../../components/ui/templates/Screen';
import Footer from '../../components/ui/space/Footer';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Skeleton from 'react-native-reanimated-skeleton';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import ErrorBlock from '../../components/shared/ErrorBlock';
import {
  HomeBadges,
  HomeBanner,
  HorizontalOffersBlock,
  useHomeBlocks,
  VerticalOffersBlock,
} from '../../components/content/HomeScreen';

export const HomeScreen: React.FC<NavigationProps> = ({route}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const {
    data: blocks,
    isLoading,
    error,
    refetch,
  } = useGetBlocksByPageUrlQuery({
    pageUrl: route.params.pageUrl,
  });

  //Load blocks pinned to Home page
  const {
    vertical,
    horizontal,
    banner,
    badges,
    loading: loadingBlocks,
  } = useHomeBlocks(blocks);

  const {top} = useSafeAreaInsets();

  //Header animations
  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scrollY.value = event.contentOffset.y;
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      refetch();
    }, 1000);
  }, []);

  if (error) {
    return <ErrorBlock errorTitle={error.toString()} />;
  }

  return (
    <View>
      <Skeleton
        isLoading={!banner}
        containerStyle={{height: isLoading ? 220 + top : 0}}
        layout={[
          {key: 'banner', width: '100%', height: isLoading ? 220 + top : 0},
        ]}
      />
      {banner && <HomeBanner scrollY={scrollY} banner={banner} />}
      <Screen white>
        <Animated.ScrollView
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
          className={''}>
          <Skeleton
            isLoading={isLoading}
            containerStyle={{height: 260, width: '100%', marginTop: 20}}
            layout={[
              {
                key: 'banner',
                width: '100%',
                height: 260,
              },
            ]}>
            <HorizontalOffersBlock products={horizontal} />
          </Skeleton>
          <HomeBadges
            attributes={badges?.attributeValues}
            loading={isLoading || loadingBlocks}
          />

          <VerticalOffersBlock products={vertical} />
          <Footer height={500} />
        </Animated.ScrollView>
      </Screen>
    </View>
  );
};
