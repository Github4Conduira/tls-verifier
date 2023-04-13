import React from 'react'
import ProvidersStackNavigator, {
	ProvidersNavigatorScreenParamList,
} from '@app/providers/navigation'
import { Link } from '@app/redux/links/types'
import { BaseTemplate, Template, TemplateClaim } from '@app/redux/templates/types'
import { NavigatorScreenParams } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import CreateClaim from './CreateClaim'
import CreateLink from './CreateLink'
import LinkScreen from './LinkScreen'
import NotificationHome from './NotificationHome'
import NotificationInfo from './NotificationInfo'
import PossibleClaims from './PossibleClaims'
import ShareLink from './ShareLink'
import TemplateScreen from './Template'
import VerifyClaims from './VerifyClaims'
import YourLinks from './YourLinks'

export type RootStackParamList = {
  Home: undefined
  YourLinks: undefined
  CreateLink: undefined
  ShareLink: { link: Link } | undefined
  CreateClaim: undefined
  PossibleClaims: { provider: string }
  LinkScreen: { link: string }
  Template: { template: BaseTemplate | Template, claimToAdd?: TemplateClaim }
  LinkCreated: { link: Link } | undefined
  NotificationHome: undefined
  NotificationInfo: { id: string, linkId: string }
  VerifyClaims: { id: string }
  Providers: NavigatorScreenParams<ProvidersNavigatorScreenParamList>
};

const Stack = createNativeStackNavigator<RootStackParamList>()

const Links = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name='YourLinks'
				component={YourLinks} />
			<Stack.Screen
				name='CreateLink'
				component={CreateLink} />
			<Stack.Screen
				name='ShareLink'
				component={ShareLink} />
			<Stack.Screen
				name='CreateClaim'
				component={CreateClaim} />
			<Stack.Screen
				name='PossibleClaims'
				component={PossibleClaims} />
			<Stack.Screen
				name='LinkScreen'
				component={LinkScreen} />
			<Stack.Screen
				name='Template'
				component={TemplateScreen} />
			<Stack.Screen
				name='NotificationHome'
				component={NotificationHome} />
			<Stack.Screen
				name='NotificationInfo'
				component={NotificationInfo} />
			<Stack.Screen
				name='VerifyClaims'
				component={VerifyClaims} />
			<Stack.Screen
				name='Providers'
				component={ProvidersStackNavigator} />
		</Stack.Navigator>
	)
}

export default Links
