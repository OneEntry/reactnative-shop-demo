import {useAppNavigation} from '../navigation/types/types';
import * as Notifications from 'expo-notifications';
import {useEffect, useRef, useState} from 'react';
import {registerForPushNotificationsAsync} from './registerForPushNotifications';
import {Platform} from 'react-native';

export const useNavigateProducts = ({id}: {id?: number}) => {
  const navigation = useAppNavigation();

  return {
    navigate: () => {
      id &&
        navigation.navigate('Products', {
          screen: 'Product',
          params: {id},
        });
    },
  };
};

type PriceProps = {
  amount: number | string;
  currency: string;
};

export const usePrice = ({amount, currency}: PriceProps) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(Number(amount));
};

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [shouldSchedule, setShouldSchedule] = useState(true);
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      token => token && setExpoPushToken(token),
    );

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then();
    }
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async notification => {
        if (shouldSchedule) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: notification.request.content.title,
              body: notification.request.content.body,
            },
            trigger: {seconds: 1},
          });

          setShouldSchedule(false);

          setTimeout(() => setShouldSchedule(true), 5000);
        }
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current,
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [shouldSchedule]);

  return {
    token: expoPushToken,
    notification: notification,
  };
};
