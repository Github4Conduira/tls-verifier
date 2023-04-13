import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import YourLinks from './YourLinks';
import {Claim, Link} from '@app/redux/links/types';
import {BaseTemplate, Template, TemplateClaim} from '@app/redux/templates/types';

import ShareLink from './ShareLink';
import CreateLink from './CreateLink';
import CreateClaim from './CreateClaim';
import PossibleClaims from './PossibleClaims';
import LinkScreen from './LinkScreen';
import TemplateScreen from './Template';
import NotificationHome from './NotificationHome';
import NotificationInfo from './NotificationInfo';
import VerifyClaims from './VerifyClaims';
import ProvidersStackNavigator, {
  ProvidersNavigatorScreenParamList,
} from '@app/providers/navigation';
import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  YourLinks: undefined;
  CreateLink: undefined;
  ShareLink: { link: Link } | undefined;
  CreateClaim: undefined;
  PossibleClaims: {provider: string};
  LinkScreen: {link: string};
  Template: {template: BaseTemplate | Template, claimToAdd?: TemplateClaim};
  LinkCreated: {link: Link} | undefined;
  NotificationHome: undefined;
  NotificationInfo: { id: string; linkId: string };
  VerifyClaims: { id: string };
  Providers: NavigatorScreenParams<ProvidersNavigatorScreenParamList>;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const Links = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="YourLinks" component={YourLinks} />
      <Stack.Screen name="CreateLink" component={CreateLink} />
      <Stack.Screen name="ShareLink" component={ShareLink} />
      <Stack.Screen name="CreateClaim" component={CreateClaim} />
      <Stack.Screen name="PossibleClaims" component={PossibleClaims} />
      <Stack.Screen name="LinkScreen" component={LinkScreen} />
      <Stack.Screen name="Template" component={TemplateScreen} />
      <Stack.Screen name="NotificationHome" component={NotificationHome} />
      <Stack.Screen name="NotificationInfo" component={NotificationInfo} />
      <Stack.Screen name="VerifyClaims" component={VerifyClaims} />
      <Stack.Screen name="Providers" component={ProvidersStackNavigator} />
    </Stack.Navigator>
  );
};

export default Links;
