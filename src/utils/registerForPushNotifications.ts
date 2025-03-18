import {Alert, Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Configures push notifications and retrieves the device's FCM token for both Android and iOS.
 *
 * This function:
 * - Sets up a notification channel for Android (if applicable).
 * - Requests notification permissions from the user.
 * - Retrieves the device's push notification token using Expo Notifications.
 * - Configures the FCM token for Firebase Cloud Messaging (FCM) on both Android and iOS.
 *
 * @returns {Promise<string | undefined>} The FCM token if successfully retrieved, or `undefined` if an error occurs.
 */
export async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  let token: string;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const {status: existingStatus} = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const {status} = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    Alert.alert('Failed to get push token for push notification!');
    return;
  }
  try {
    /**
     * Retrieve the device's push notification token using Expo Notifications. On android it will be already completable with FCM
     */
    token = (await Notifications.getDevicePushTokenAsync()).data;

    /**
     * For iOS, configure the APNs token with Firebase Cloud Messaging (FCM).
     * This ensures compatibility with Firebase for sending notifications.
     */
    if (Platform.OS === 'ios') {
      await messaging().setAPNSToken(token);
      // await messaging().registerDeviceForRemoteMessages();
      token = await messaging().getToken();
    }
  } catch (e) {
    token = `${e}`;
  }

  return token;
}
