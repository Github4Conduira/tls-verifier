import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Notification } from '@app/redux/notifications/types';
import { FlexRow } from '@app/lib/styles/common';
import { approvedRequestIcon } from '@app/assets/svgs';
import { H3 } from '@app/lib/styles/common';
import { NotificationText } from '../styles';

interface Props {
  notification: Notification;
}

const ApprovedVerificationRequest: React.FC<Props> = ({ notification }) => {
  return (
    <FlexRow gap="10px">
      <SvgXml xml={approvedRequestIcon} />
      <NotificationText>
        Your request to view{' '}
        <H3 color="black" weight="bold">
          {notification.verificationRequest.link?.name}
        </H3>{' '}
        was approved.
      </NotificationText>
    </FlexRow>
  );
};

export default ApprovedVerificationRequest;
