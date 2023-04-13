import React, { useEffect } from 'react';
import BackButton from '@app/components/BackButton';
import ScreenContainer from '@app/components/ScreenContainer';
import { NotificationContainer, NotificationView } from '@app/lib/styles/common';
import { useReduxSelector } from '@app/redux/config';
import { useReduxDispatch } from '@app/redux/config';
import { readNotification } from '@app/redux/notifications';
import { getNotificationsList } from '@app/redux/notifications/selectors';
import { Notification, NotificationType } from '@app/redux/notifications/types';
import { RootStackParamList } from '@app/screens';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import NotificationBar from '@app/components/NotificationBar';

type Props = NativeStackScreenProps<RootStackParamList, 'NotificationHome'>;

const NotificationHome: React.FC<Props> = ({ navigation }) => {
  const dispatch = useReduxDispatch();
  const notifications = useReduxSelector(getNotificationsList);

  useEffect(() => {
    dispatch(readNotification());
  }, []);

  return (
    <ScreenContainer
      headerLeft={
        <BackButton
          onPress={() => {
            navigation.goBack();
          }}
        />
      }
      title="Notifications"
    >
      <NotificationView>
        {notifications.map((notification: Notification, index: number) => (
          <NotificationContainer
            onPress={() => {
              if (notification.type === NotificationType.NEWVRQ) {
                let linkId = '';
                if (notification.verificationRequest.link !== undefined) {
                  linkId = notification.verificationRequest.link.id;
                }
                navigation.navigate('NotificationInfo', {
                  id: notification.id,
                  linkId: linkId,
                });
              } else {
                navigation.navigate('VerifyClaims', {
                  id: notification.id,
                });
              }
            }}
            key={index}
          >
            <NotificationBar notification={notification} />
          </NotificationContainer>
        ))}
      </NotificationView>
    </ScreenContainer>
  );
};

export default NotificationHome;
