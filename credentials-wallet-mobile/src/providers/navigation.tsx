import React from 'react'
import { ProviderType } from '@app/providers'
import YcStackNavigator, { YcStackParamList } from '@app/providers/yc/screens'
import { RootStackParamList } from '@app/screens'
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack'
import GithubStackNavigator, { GithubStackParamList } from './github/screens'
import GoogleStackNavigator, { GoogleStackParamList } from './google/screens'


/**
 * @description This is the type of the param list for the providers navigator.
 * @instructions Add a new key to this type for each provider you add.
 */
export type ProvidersStackParamList = {
    google: GoogleStackParamList
    yc: YcStackParamList
    github: GithubStackParamList
}


export type RootScreenWithParams = {
  [K in keyof RootStackParamList]: [K, RootStackParamList[K]];
}[keyof RootStackParamList];
export type ProvidersNavigatorScreenParamList = {
  [K in keyof ProvidersStackParamList]: NavigatorScreenParams<ProvidersStackParamList[K]>;
};

export type ProvidersStackScreenProps<P extends ProviderType, S extends keyof ProvidersStackParamList[P]> =
    CompositeScreenProps<
        NativeStackScreenProps<ProvidersStackParamList[P], S>,
        NativeStackScreenProps<RootStackParamList>
    >;


const Stack = createNativeStackNavigator<ProvidersNavigatorScreenParamList>()

/**
 * @description This is the navigator for the providers.
 * @instructions Add a new screen for each provider you add.
 */
const ProvidersStackNavigator: React.FC = () => {
	return (
		<Stack.Navigator >
			<Stack.Screen
				name='google'
				component={GoogleStackNavigator} />
			<Stack.Screen
				name='yc'
				component={YcStackNavigator} />
			<Stack.Screen
				name='github'
				component={GithubStackNavigator} />
		</Stack.Navigator>
	)
}

export default ProvidersStackNavigator
