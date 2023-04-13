import React from 'react'
import { RootScreenWithParams } from '@app/providers/navigation'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Authentication from './Authentication'

export type GithubStackParamList = {
  Authentication: {
    returnScreen: RootScreenWithParams
  }
};

const Stack = createNativeStackNavigator<GithubStackParamList>()

const GithubStackNavigator: React.FC = () => {
	return (
		<Stack.Navigator screenOptions={{ headerShown: false }}>
			<Stack.Screen
				name='Authentication'
				component={Authentication} />
		</Stack.Navigator>
	)
}

export default GithubStackNavigator
