import { getUserInfo } from '@app/providers/google/redux/userInfo/selectors';
import { getProviders } from '@app/providers/selectors';
import { RootState } from '@app/redux/config';
import { PossibleClaimData } from '@app/providers';
import {
  ApplicationParams,
  ApplicationSecretParams,
} from '@questbook/reclaim-node/lib/applications';

export const getGoogle = (state: RootState) => getProviders(state).google;

export const getLoginParams: PossibleClaimData<'google-login'>['getParams'] = (
  state: RootState
) => {
  const email = getUserInfo(state).email ?? '';

  return {
    emailAddress: email,
  };
};

export const getGoogleSecretParams: PossibleClaimData<'google-login'>['getSecretParams'] = (
  state: RootState
) => {
  const token = getUserInfo(state).accessToken ?? '';

  return {
    token,
  };
};
