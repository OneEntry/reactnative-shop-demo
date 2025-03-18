import * as Notifications from 'expo-notifications';
import {useEffect, useRef, useState} from 'react';
import {Platform} from 'react-native';
import {registerForPushNotificationsAsync} from '../../utils/registerForPushNotifications';
import {SchedulableTriggerInputTypes} from 'expo-notifications';

/**
 * A custom hook for managing push notifications in the application.
 *
 * @returns {{
 *   token: string, // The FCM push token used for sending notifications.
 * }} An object containing the Expo push token and the latest notification.
 */
export const useNotifications = (): {
  token: string; // The FCM push token used for sending notifications.
} => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();
  const [shouldSchedule, setShouldSchedule] = useState(true);

  useEffect(() => {
    // Register the device for push notifications and retrieve the push token for Firebase.
    registerForPushNotificationsAsync().then(
      token => token && setExpoPushToken(token),
    );

    if (Platform.OS === 'android') {
      Notifications.getNotificationChannelsAsync().then();
    }

    /**
     * Adds a listener for incoming notifications.
     *
     * Note: When the app is open, notifications do not appear as system alerts.
     * Instead, they are routed to this listener. It is our responsibility
     * to handle how the notification should be displayed. In this case,
     * we schedule the notification manually to ensure it is shown to the user.
     */
    notificationListener.current =
      Notifications.addNotificationReceivedListener(async notification => {
        if (shouldSchedule) {
          await Notifications.scheduleNotificationAsync({
            content: {
              title: notification.request.content.title,
              body: notification.request.content.body,
            },
            trigger: {
              type: SchedulableTriggerInputTypes.TIME_INTERVAL,
              repeats: false,
              seconds: 1,
            },
          });

          setShouldSchedule(false);

          setTimeout(() => setShouldSchedule(true), 5000);
        }
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(response => {});

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
  };
};
