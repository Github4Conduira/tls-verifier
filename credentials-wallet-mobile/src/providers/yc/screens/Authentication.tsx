import React from 'react';
import { ProvidersStackScreenProps } from '@app/providers/navigation';
import { useReduxDispatch } from '@app/redux/config';
import { fetchGoogleInfo } from '@app/providers/google/redux/userInfo/actions';
import WebView from 'react-native-webview';
import CookieManager from '@react-native-cookies/cookies';
import { setUserInfo } from '@app/providers/yc/redux/userInfo';

type Props = ProvidersStackScreenProps<'yc', 'Authentication'>;

const YC_URL = 'https://bookface.ycombinator.com/';

const LOGGED_IN_TXT = 'logged-in';

const injection = `
function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
      end = dc.length;
      }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
} 

	const cookieCheckInterval = setInterval(
		() => {
      var myCookie = getCookie("ajs_user_id")
      if(myCookie) {
        window.ReactNativeWebView.postMessage('${LOGGED_IN_TXT}')
				clearInterval(cookieCheckInterval)
      }
		}, 100
	)
    true; // note: this is required, or you'll sometimes get silent failures`;

const Authentication: React.FC<Props> = ({ navigation, route }) => {
  const { returnScreen } = route.params;
  const dispatch = useReduxDispatch();

  const onCookiesExtracted = async (cookieStr: string, userId: string) => {
    console.log('cookies extracted: ', cookieStr, userId);
    dispatch(setUserInfo({ cookieStr, userId: parseInt(userId) }));
    navigation.navigate(...returnScreen);
  };


  return (
    <>
      <WebView
        source={{ uri: YC_URL }}
        injectedJavaScript={injection}
        thirdPartyCookiesEnabled={true}
        onMessage={async (data) => {          
          try {
            const res = await CookieManager.getAll(true);

            const userId = res['ajs_user_id'].value;

            const cookieStr = Object.values(res)
              .map((c) => `${c.name}=${c.value}`)
              .join('; ');
            onCookiesExtracted(cookieStr, userId);
          } catch (error) {
            console.log('error getting cookies: ', error);
          }
        }}
      />
    </>
  );
};

export default Authentication;
