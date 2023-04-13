import { getClient } from '@app/lib/client';
import { typedCreateAsyncThunk } from '@app/redux/extraConfig';
import { VerificationReqObject } from '@questbook/reclaim-client-sdk';
import { ClaimProofInterface } from '@questbook/reclaim-client-sdk';
import { Claim } from '../links/types';
import { updateStatus } from '../notifications';
import { getNotificationkById } from '../notifications/selectors';
import { getUserPrivateKey } from '../userWallet/selectors';
import { getEphemeralPrivateKey } from '../userWallet/selectors';

export const getVerificationRequestDetails = typedCreateAsyncThunk<
  VerificationReqObject,
  { verificationReqId: string }
>(
  'verificationRequests/getVerificationRequestDetails',
  async ({ verificationReqId }, { getState }) => {
    const state = getState();
    const notification = getNotificationkById(verificationReqId)(state);
    if (notification) {
      return notification.verificationRequest;
    }

    const privateKey = getUserPrivateKey(state);
    const client = getClient(privateKey);
    const verificationRequest = await client.getVerificationReq({
      id: verificationReqId,
      pagination: {
        page: 1,
        pageSize: 10,
      },
    });
    return verificationRequest.requestsList[0];
  }
);

export const rejectVerificationRequest = typedCreateAsyncThunk<
  boolean,
  { verificationReqId: string }
>(
  'verificationRequests/rejectVerificationRequest',
  async ({ verificationReqId }, { dispatch, getState }) => {
    const state = getState();
    const privateKey = getUserPrivateKey(state);
    const client = getClient(privateKey, true);
    try {
      await client.rejectVerificationRequest(verificationReqId);
      dispatch(updateStatus({ id: verificationReqId, status: 6 }));
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
);

export const acceptVerificationRequest = typedCreateAsyncThunk<
  boolean,
  { verificationReqId: string; claims: Claim[]; communicationPublicKey: string }
>(
  'verificationRequests/acceptVerificationRequest',
  async ({ verificationReqId, claims, communicationPublicKey }, { dispatch, getState }) => {
    const state = getState();
    const ephemeralPrivateKey = getEphemeralPrivateKey(state);
    const privateKey = getUserPrivateKey(state);
    const client = getClient(privateKey, true);

    const data: [ClaimProofInterface] = claims.map((claim) => {
      return {
        id: claim.id,
        parameters: JSON.stringify(claim.params),
        signatures: claim.signatures,
      };
    });

    try {
      await client.acceptVerificationRequest(
        verificationReqId,
        Buffer.from(communicationPublicKey, 'hex').toString('base64'),
        ephemeralPrivateKey,
        data
      );
      dispatch(updateStatus({ id: verificationReqId, status: 1 }));
      return true;
    } catch (e) {
      console.log('Error here is: ', e);
      return false;
    }
  }
);
