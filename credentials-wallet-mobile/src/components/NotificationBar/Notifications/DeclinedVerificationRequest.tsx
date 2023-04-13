import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Notification } from '@app/redux/notifications/types';
import { FlexRow } from '@app/lib/styles/common';
import { declinedRequestIcon } from '@app/assets/svgs';
import { H3 } from '@app/lib/styles/common';
import { NotificationText } from '../styles';

interface Props {
  notification: Notification;
}

const DeclinedVerificationRequest: React.FC<Props> = ({ notification }) => {
  return (
    <FlexRow gap="10px">
      <SvgXml xml={declinedRequestIcon} />
      <NotificationText>
        Your request to view{' '}
        <H3 color="black" weight="bold">
          {notification.verificationRequest.link?.name}
        </H3>{' '}
        was declined.
      </NotificationText>
    </FlexRow>
  );
};

export default DeclinedVerificationRequest;
