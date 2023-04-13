import { getClient } from '@app/lib/client';
import { typedCreateAsyncThunk } from '@app/redux/extraConfig';
import { addNotification } from '@app/redux/notifications';
import { getUserPrivateKey } from '../userWallet/selectors';
import { NotificationType } from './types';

export const addNotificationAction = typedCreateAsyncThunk<
  void,
  {
    id: string;
    linkId?: string;
    requestorId?: string;
    title: string | undefined;
    body: string | undefined;
  }
>(
  'notifications/addnewNotification',
  async ({ id, linkId, requestorId, title, body }, { dispatch, getState }) => {
    const state = getState();
    const privateKey = getUserPrivateKey(state);
    const client = getClient(privateKey);
    const clientVerificationRequest = await client.getVerificationReq({
      id: id,
      pagination: {
        page: 1,
        pageSize: 10,
      },
    });
    const verificationRequest = clientVerificationRequest.requests[0];
    const claims = verificationRequest?.link?.claims.map((claim: any) => {
      return {
        ...claim,
        ownerPublicKey: Buffer.from(claim.ownerPublicKey).toString('hex'),
      };
    });
    const request = {
      ...verificationRequest,
      communicationPublicKey: Buffer.from(verificationRequest.communicationPublicKey).toString(
        'hex'
      ),
      communicationSignature: Buffer.from(verificationRequest.communicationSignature).toString(
        'hex'
      ),
      encryptedClaimProofs: [],
      link: { ...verificationRequest.link, claims: claims },
    };

    if (linkId && requestorId) {
      const notification = {
        id: id,
        title: title,
        body: body,
        type: NotificationType.NEWVRQ,
        requestor: requestorId,
        verificationRequest: request,
      };
      dispatch(addNotification(notification));
    } else if (request.status == 1) {
      const notification = {
        id: id,
        title: title,
        body: body,
        type: NotificationType.APPROVEDVRQ,
        verificationRequest: request,
      };
      dispatch(addNotification(notification));
    } else {
      const notification = {
        id: id,
        title: title,
        body: body,
        type: NotificationType.DECLINEDVRQ,
        verificationRequest: request,
      };
      dispatch(addNotification(notification));
    }
  }
);
