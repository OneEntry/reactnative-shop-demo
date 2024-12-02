import React, {useEffect} from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import WebView from 'react-native-webview';
import FlexLoader from '../../components/ui/space/FlexLoader';
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import {DrawerStackNavigatorParamList} from '../../navigation';
import {navigate} from '../../navigation/utils/NavigatonRef';
import {Modal, View} from 'react-native';
import {useLazyGetPaymentSessionByIdQuery} from '../../api';
import {useAppNavigation} from '../../navigation/types/types';
import {useAppSelector} from '../../store/hooks';

type Props = {};

const PaymentPayScreen: React.FC<Props> = ({}) => {
  const route =
    useRoute<RouteProp<DrawerStackNavigatorParamList, 'payment_method'>>();
  const id = route.params?.orderId;
  const [getPaymentStatus] = useLazyGetPaymentSessionByIdQuery();
  const paymentUrl = route.params?.paymentUrl;
  const navigation = useAppNavigation();
  const {successful_payment_text, unsuccessful_payment_text} = useAppSelector(
    state => state.systemContentReducer.content,
  );

  const onNavigationStateChange = async (navState: {
    url: string;
    title: string;
    canGoBack: boolean;
  }) => {
    const {url} = navState;
    const res = await getPaymentStatus({id}, false);
    if (res?.data) {
      // @ts-ignore
      if (res?.data?.status === 'completed') {
        navigate('message', {message: successful_payment_text});
        // @ts-ignore
        return navigation.setParams({orderId: undefined});
      }

      if (!url.includes('stripe')) {
        navigate('message', {message: unsuccessful_payment_text});
      }
    }
  };

  useFocusEffect(() => {
    if (!id || !paymentUrl) {
      navigate('home');
    }
  });

  return (
    <Screen isFull white edges={['top', 'horizontal']}>
      <Modal>
        <View className={'h-full pt-12'}>
          <WebView
            cacheEnabled={false}
            startInLoadingState={true}
            onNavigationStateChange={onNavigationStateChange}
            renderLoading={() => <FlexLoader />}
            source={{uri: paymentUrl}}
          />
        </View>
      </Modal>
    </Screen>
  );
};

export default PaymentPayScreen;
