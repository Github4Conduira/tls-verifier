import React from 'react';
import WebView from 'react-native-webview';
import { ProvidersStackScreenProps } from '@app/providers/navigation';
import { useReduxDispatch } from '@app/redux/config';
import { CLIENT_ID } from '@env';
import { fetchGithubInfo } from '@app/providers/github/redux/userInfo/actions';
import { setUserInfo } from '../redux/userInfo';

type Props = ProvidersStackScreenProps<'github', 'Authentication'>;

const qs = `?client_id=${CLIENT_ID}&scope=user,repo`;

const GITHUB_AUTH_URL = 'https://github.com/login/oauth/authorize' + qs;

const Authentication: React.FC<Props> = ({ navigation, route }) => {
  const { returnScreen } = route.params;
  const dispatch = useReduxDispatch();

  const getSearchParamFromURL = (url: string, param: string) => {
    const params = url.split(/([&,?,=])/);
    const index = params.indexOf(param);
    const value = params[index + 2];
    return value;
  };

  const handleNavigate = () => {
    if (route.name === 'Authentication') {
      navigation.navigate(...returnScreen);
    }
  };

  const handleSetToken = async (code: string) => {
    try {
      const { username, accessToken } = await fetchGithubInfo(code);
      dispatch(setUserInfo({ accessToken, username }));
      handleNavigate();
    } catch (error) {
      console.log(error);
      handleNavigate();
    }
  };

  return (
    <>
      <WebView
        source={{ uri: GITHUB_AUTH_URL }}
        onNavigationStateChange={(e) => {
          e.loading === false &&
            e.url.includes('code') &&
            handleSetToken(getSearchParamFromURL(e.url, 'code'));
        }}
      />
    </>
  );
};

export default Authentication;
