import React, {useEffect} from 'react';
import {Screen} from '../../components/ui/templates/Screen';
import WebView from 'react-native-webview';
import FlexLoader from '../../components/ui/space/FlexLoader';
import {RouteProp, useFocusEffect, useRoute} from '@react-navigation/native';
import {DrawerStackNavigatorParamList} from '../../navigation';
import {navigate} from '../../navigation/utils/NavigatonRef';
import {Modal, View} from 'react-native';
import {useLazyGetPaymentSessionByIdQuery} from '../../api';
import {useAppNavigation} from '../../navigation/types/types';
import {useAppSelector} from '../../state/hooks';

type Props = {};

/**
 * PaymentPayScreen Component
 *
 * This component handles the Stripe payment process by loading the payment URL in a WebView.
 * Redirects the user based on the payment result (success or failure).
 *
 * @component
 * @description
 * The `PaymentPayScreen` component is responsible for:
 * - Fetching the payment session ID and payment URL from payment session.
 * - Loading the payment URL in a WebView for the user to complete the payment.
 * - Monitoring the payment status and redirecting the user to appropriate screens
 *   based on whether the payment was successful or not.
 */
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

  /**
   * Monitors the WebView's navigation state to detect payment completion or failure.
   * @param {Object} navState - The current navigation state of the WebView.
   * @param {string} navState.url - The current URL loaded in the WebView.
   * @param {string} navState.title - The title of the current page in the WebView.
   * @param {boolean} navState.canGoBack - Indicates if the WebView can navigate back.
   */
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
