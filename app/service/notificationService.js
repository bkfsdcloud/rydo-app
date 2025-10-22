// import messaging from '@react-native-firebase/messaging';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

const isExpo = Constants.appOwnership === 'expo';

export default async function registerForPushNotificationsAsync() {
  try {
    console.log(isExpo);
    if (isExpo) {
      // ✅ Expo Managed Workflow
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted for push notifications');
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo Push Token:', token);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      return { token, provider: 'expo' };
    } else {
      // const authStatus = await messaging().requestPermission();
      // const enabled =
      //   authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      //   authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      // if (!enabled) throw new Error('Permission not granted for FCM');

      // const token = await messaging().getToken();
      // console.log('FCM Token:', token);

      // return { token, provider: 'firebase' };
    }
  } catch (error) {
    console.error('Error registering push notifications:', error);
    return null;
  }
}

export function setupNotificationListeners() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldPlaySound: true,
      shouldSetBadge: true
    }),
  });

  if (isExpo) {
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('Received in foreground:', notification);
    });
  } else {
    // messaging().onMessage(async (remoteMessage) => {
    //   console.log('FCM message in foreground:', remoteMessage);
    // });
  }
}
