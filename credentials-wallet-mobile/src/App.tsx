import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import theme from '@app/lib/styles/theme';
import { initApp } from '@app/redux/actions';
import reduxConf from '@app/redux/config';
import { useReduxDispatch } from '@app/redux/config';
import Links, { RootStackParamList } from '@app/screens';
import messaging from '@react-native-firebase/messaging';
import {
  LinkingOptions,
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { PersistGate } from 'redux-persist/integration/react';
import { ThemeProvider } from 'styled-components';
import 'react-native-gesture-handler';
import LoadingIcon from './components/LoadingIcon';
import { addNotificationAction } from './redux/notifications/actions';

const { persistedStore, persistor } = reduxConf;

const config = {
  screens: {
    Template: {
      path: 'template/:template',
      parse: {
        template: (template: string) => {
          console.log(JSON.parse(decodeURIComponent(template)));
          return JSON.parse(decodeURIComponent(template));
        },
      },
      stringify: {
        template: (template: any) => {
          return encodeURIComponent(JSON.stringify(template));
        },
      },
    },
    LinkScreen: {
      path: 'link/:link',
      parse: {
        link: (link: string) => {
          return link;
        },
      },
      stringify: {
        link: (link: any) => {
          return encodeURIComponent(JSON.stringify(link));
        },
      },
    },
  },
};

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['reclaim://'],
  config,
};

const AppWrapper = () => {
  return (
    <Provider store={persistedStore}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  );
};

const App: React.FC = () => {
  const dispatch = useReduxDispatch();
  const navigationRef = useNavigationContainerRef();
  const [loading, setLoading] = React.useState(true);

  const addNewNotification = async (remoteMessage: any) => {
    if (remoteMessage.data) {
      await dispatch(
        addNotificationAction({
          id: remoteMessage.data.verificationRequestId,
          linkId: remoteMessage.data.linkId,
          requestorId: remoteMessage.data.requestorId,
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
        })
      );
    }
  };

  const notificationListener = (navigation: any) => {
    messaging().onNotificationOpenedApp(async (remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      );
      await addNewNotification(remoteMessage);
      if (remoteMessage.data?.linkId) {
        navigation.navigate('NotificationInfo', {
          linkId: remoteMessage.data.linkId,
          id: remoteMessage.data.verificationRequestId,
        });
      }
      // navigation.navigate(remoteMessage.data.type);
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log('Message handled in the background!', remoteMessage);
      await addNewNotification(remoteMessage);
      if (remoteMessage.data?.linkId) {
        navigation.navigate('NotificationInfo', {
          linkId: remoteMessage.data.linkId,
          id: remoteMessage.data.verificationRequestId,
        });
      }
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async (remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          );
          await addNewNotification(remoteMessage);
          // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
        }
        //   setLoading(false);
      });

    messaging().onMessage(async (remoteMessage) => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      await addNewNotification(remoteMessage);
    });
  };

  useEffect(() => {
    dispatch(initApp({})).then(async () => {
      notificationListener(navigationRef);
      setLoading(false);
    });
  }, [dispatch]);

  if (loading) {
    return <LoadingIcon />;
  }

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer linking={linking} fallback={<LoadingIcon />} ref={navigationRef}>
        <Links />
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default AppWrapper;
