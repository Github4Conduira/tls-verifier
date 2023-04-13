import React from 'react';
import { SvgXml } from 'react-native-svg';
import { Notification } from '@app/redux/notifications/types';
import { FlexRow } from '@app/lib/styles/common';
import { newRequestIcon } from '@app/assets/svgs';
import { truncateAddress } from '@app/lib/utils/helpers';
import { H3 } from '@app/lib/styles/common';
import { NotificationText } from '../styles';

interface Props {
  notification: Notification;
}

const NewVerificationRequest: React.FC<Props> = ({ notification }) => {
  return (
    <FlexRow gap="10px">
      <SvgXml xml={newRequestIcon} />
      <NotificationText>
        <H3 color="black" weight="bold">
          {truncateAddress(notification.requestor || '')}
        </H3>{' '}
        requested to view{' '}
        <H3 color="black" weight="bold">
          {notification.verificationRequest.link?.name}.
        </H3>
      </NotificationText>
    </FlexRow>
  );
};

export default NewVerificationRequest;
