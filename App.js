import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Stack } from 'expo-router';

import LoginScreen from './screens/LoginScreen';
import MainTabs from './navigation/MainTabs';

const { width:SCREEN_WIDTH } = Dimensions.get("window");
const Stack = createNativeStackNavigator();

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);

    return (
        <NavigationContainer>
            <Stack.Navigator
            initialRouteName='LoginScreen'
            screenOptions={{ animationEnabled: false, headerShown: false }}>
                {!isLoggedIn ? (
                    <Stack.Screen name="LoginScreen">
                        {() => <LoginScreen onLogin={() => setIsLoggedIn(true)} />}
                    </Stack.Screen>
                ) : (
                    <Stack.Screen name="Main" component={MainTabs} />
                 )})
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;