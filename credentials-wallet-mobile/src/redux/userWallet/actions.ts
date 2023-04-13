import { generateWallet } from '@app/lib/utils/crypto';
import { AppThunk } from '@app/redux/config';
import { typedCreateAsyncThunk } from '@app/redux/extraConfig';
import {
  setEphemeralPrivateKey,
  setEphemeralPublicKey,
  setFcmToken,
  setPrivateKey,
  setPublicKey,
} from '@app/redux/userWallet';
import { getFcmToken } from '@app/redux/userWallet/selectors';
import messaging from '@react-native-firebase/messaging';

export const initWallet = typedCreateAsyncThunk<void, {}>(
  'app/initWalletStatus',
  async ({}, { dispatch, getState }) => {
    const state = getState();
    const { userWallet } = state;
    if (userWallet.publicKey && userWallet.privateKey) {
      return;
    }

    const { publicKey, privateKey } = await generateWallet();
    dispatch(setPublicKey(publicKey));
    dispatch(setPrivateKey(privateKey));
  }
);

export const initFcmToken = typedCreateAsyncThunk<void, {}>(
  'app/initFcmTokenStatus',
  async ({}, { dispatch, getState }) => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      return;
    }

    const fcmToken = getFcmToken(getState());
    if (fcmToken) {
      return;
    }

    dispatch(setFcmToken(await messaging().getToken()));
  }
);

export const generateEphemeralWallet =
  (refresh: boolean): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const { userWallet } = state;

    if (refresh || !userWallet.ephemeralPublicKey || !userWallet.ephemeralPrivateKey) {
      const { publicKey, privateKey } = await generateWallet();
      dispatch(setEphemeralPublicKey(publicKey));
      dispatch(setEphemeralPrivateKey(privateKey));
    }

    return;
  };
