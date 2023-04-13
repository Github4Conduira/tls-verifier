import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Notification } from '@app/redux/notifications/types';
import { newRequestIcon, approvedRequestIcon, declinedRequestIcon } from '@app/assets/svgs';
import { NotificationType } from '@app/redux/notifications/types';
import NewVerificationRequest from './Notifications/NewVerificationRequest';
import ApprovedVerificationRequest from './Notifications/ApprovedVerificationRequest';
import DeclinedVerificationRequest from './Notifications/DeclinedVerificationRequest';

interface Props {
  notification: Notification;
}

const NotificationBar: React.FC<Props> = ({ notification }) => {
  return (
    <>
      {notification.type == NotificationType.NEWVRQ && (
        <NewVerificationRequest notification={notification} />
      )}
      {notification.type == NotificationType.APPROVEDVRQ && (
        <ApprovedVerificationRequest notification={notification} />
      )}
      {notification.type == NotificationType.DECLINEDVRQ && (
        <DeclinedVerificationRequest notification={notification} />
      )}
    </>
  );
};

export default NotificationBar;
