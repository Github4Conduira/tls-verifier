import React from 'react';
import { createNativeStackNavigator, NativeStackScreenProps } from '@react-navigation/native-stack';

import Authentication from './Authentication';
import { RootScreenWithParams } from '@app/providers/navigation';

export type YcStackParamList = {
  Authentication: {
    returnScreen: RootScreenWithParams;
  };
};

const Stack = createNativeStackNavigator<YcStackParamList>();

const YcStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Authentication" component={Authentication} />
    </Stack.Navigator>
  );
};

export default YcStackNavigator;
