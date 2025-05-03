import 'react-native-gesture-handler';
import React, { useState } from 'react';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { Stack } from 'expo-router';

import LoginScreen from './screens/LoginScreen';
import PersonalCalendar from './screens/PersonalCalendar';
import GroupListScreen from './screens/GroupListScreen';
import GroupScreen from './screens/GroupScreen';
import SettingScreen from './screens/SettingScreen';

const { width:SCREEN_WIDTH } = Dimensions.get("window");

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
            initialRouteName='LoginScreen'
            screenOptions={{ animationEnabled: false, headerShown: false }}>
                <Stack.Screen name="LoginScreen" component={LoginScreen} options={{headerShown: false}}/>
                <Stack.Screen name="PersonalCalendar" component={PersonalCalendar} options={{headerShown: false}}/>
                <Stack.Screen name="GroupListScreen" component={GroupListScreen} options={{headerShown: false}}/>
                <Stack.Screen name="GroupScreen" component={GroupScreen} options={{headerShown: false}}/>
                <Stack.Screen name="SettingScreen" component={SettingScreen} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    )
};

export default App;