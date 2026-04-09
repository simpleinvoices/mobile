import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SetupScreen from './src/screens/SetupScreen';
import WebViewScreen from './src/screens/WebViewScreen';

export type RootStackParamList = {
  Setup: undefined;
  WebView: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Setup"
        screenOptions={{headerShown: false}}>
        <Stack.Screen name="Setup" component={SetupScreen} />
        <Stack.Screen name="WebView" component={WebViewScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
