import { getGoogleSecretParams, getLoginParams } from '@app/providers/google/redux/selectors';
import { getYcSecretParams, getYcLoginParams } from '@app/providers/yc/redux/selectors';
import { getUserEmail } from '@app/providers/google/redux/userInfo/selectors';
import { RootState } from '@app/redux/config';
import { ProviderName, ProviderParams, ProviderSecretParams } from '@questbook/reclaim-node';
import { ImageSourcePropType } from 'react-native/types';
import { getUserIdString } from '@app/providers/yc/redux/userInfo/selectors';
import { getGithubClaimParams, getGithubSecretParams } from './github/redux/selectors'

export type ProviderType = 'google' | 'yc' | 'github'

export type PossibleClaimData<T extends ProviderName> = {
  providerName: T;
  /** description of the claim, such as: 'Owns email address,'  */
  description: string;
  /** a placeholder to take place of the parameter value */
  placeholder: string;
  /** whether the user should be redirect to the Form page to collect parameters */
  redirectToForm: boolean;
  /** a selector that gets the parameters needed to add the claim */
  getParams: (state: RootState) => ProviderParams<T>;
  /** a selector that gets the secret params like accessToken */
  getSecretParams: (state: RootState) => ProviderSecretParams<T>;
};

export type ProviderData = {
  provider: ProviderType;
  /** icon to show on the "CreateClaim" screen */
  iconPath: ImageSourcePropType;
  /** user friendly name */
  name: string;
  /** a selector that gets the identity of a user, such as an email address */
  getIdentity: (state: RootState) => string | undefined;
  /** a list of the claims possible to create using this provider */
  possibleClaims: { [T in ProviderName]?: PossibleClaimData<T> };
};

export const PROVIDERS: ProviderData[] = [
  {
    provider: 'google',
    iconPath: require('./google/assets/google.png'),
    name: 'Google',
    getIdentity: getUserEmail,
    possibleClaims: {
      'google-login': {
        providerName: 'google-login',
        description: 'Owns email address,',
        placeholder: 'emailAddress',
        redirectToForm: false,
        getParams: getLoginParams,
        getSecretParams: getGoogleSecretParams,
      },
    },
  },
  {
    provider: 'yc',
    iconPath: require('./yc/assets/yc.png'),
    name: 'Combinator',
    getIdentity: getUserIdString,
    possibleClaims: {
      'yc-login': {
        providerName: 'yc-login',
        description: 'Owns user id,',
        placeholder: 'userId',
        redirectToForm: false,
        getParams: getYcLoginParams,
        getSecretParams: getYcSecretParams,
      },
    },
  },
	{
		provider: 'github',
		iconPath: require('./github/assets/github.png'),
		name: 'Github Contributor',
		getIdentity: getUserIdString,
		possibleClaims: {
			'github-contributor': {
				providerName: 'github-contributor',
				description: 'Contributed to a github repo',
				placeholder: 'githubrepo',
				redirectToForm: false,
				getParams: getGithubClaimParams,
				getSecretParams: getGithubSecretParams
			}
		},
	},
];
